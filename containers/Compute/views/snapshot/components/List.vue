<template>
  <page-list
    show-tag-columns
    show-tag-filter
    :list="list"
    :columns="columns"
    :group-actions="groupActions"
    :single-actions="singleActions"
    :export-data-options="exportDataOptions"
    :showSearchbox="showSearchbox"
    :showGroupActions="showGroupActions" />
</template>

<script>
import WindowsMixin from '@/mixins/windows'
import GlobalSearchMixin from '@/mixins/globalSearch'
import ListMixin from '@/mixins/list'
import {
  getNameFilter,
  getTenantFilter,
  getStatusFilter,
  getBrandFilter,
  getDomainFilter,
  getAccountFilter,
  getOsArchFilter,
  getRegionFilter,
  getDescriptionFilter,
} from '@/utils/common/tableFilter'
import SingleActionsMixin from '../mixins/singleActions'
import ColumnsMixin from '../mixins/columns'
import { steadyStatus } from '../constants'
import ResStatusFilterMixin from '@/mixins/resStatusFilterMixin'

export default {
  name: 'SnapshotList',
  mixins: [WindowsMixin, ListMixin, GlobalSearchMixin, ColumnsMixin, SingleActionsMixin, ResStatusFilterMixin],
  props: {
    id: String,
    getParams: {
      type: [Function, Object],
    },
    cloudEnv: String,
  },
  data () {
    return {
      list: this.$list.createList(this, {
        id: this.id,
        resource: 'snapshots',
        getParams: this.getParam,
        steadyStatus,
        filterOptions: {
          id: {
            label: this.$t('table.title.id'),
          },
          name: getNameFilter(),
          description: getDescriptionFilter(),
          status: getStatusFilter('snapshot'),
          server_id: {
            label: this.$t('res.server'),
          },
          brand: getBrandFilter(),
          projects: getTenantFilter(),
          project_domains: getDomainFilter(),
          account: getAccountFilter(),
          disk_name: {
            label: this.$t('res.disk'),
            filter: true,
            jointFilter: true,
            formatter: val => {
              return `disks.id(disk_id).name.in(${val})`
            },
          },
          disk_type: {
            label: this.$t('table.title.disk_type'),
            dropdown: true,
            multiple: true,
            items: [
              { label: this.$t('compute.text_50'), key: 'data' },
              { label: this.$t('compute.text_49'), key: 'sys' },
            ],
          },
          region: getRegionFilter(),
          os_arch: getOsArchFilter(),
        },
        responseData: this.responseData,
        hiddenColumns: ['storage_type', 'created_at', 'os_arch'],
      }),
      exportDataOptions: {
        items: [
          { label: 'ID', key: 'id' },
          { label: this.$t('table.title.name'), key: 'name' },
          { label: this.$t('res.disk'), key: 'disk_name' },
          { label: this.$t('table.title.disk_type'), key: 'disk_type' },
          { label: this.$t('table.title.snapshot_size'), key: 'size' },
          { label: this.$t('common.status'), key: 'status' },
          { label: this.$t('res.project'), key: 'tenant' },
          { label: this.$t('table.title.brand'), key: 'provider' },
          { label: this.$t('res.server'), key: 'guest' },
          { label: this.$t('table.title.create_time'), key: 'create_at' },
          { label: this.$t('res.region'), key: 'region' },
          { label: this.$t('res.zone'), key: 'zone' },
          { label: this.$t('table.title.storage_type'), key: 'storage_type' },
          { label: this.$t('table.title.user_tag'), key: 'user_tags' },
          { label: this.$t('table.title.os_arch'), key: 'os_arch' },
        ],
      },
      groupActions: [
        {
          label: this.$t('compute.perform_sync_status'),
          permission: 'snapshots_perform_syncstatus',
          action: () => {
            this.onManager('batchPerformAction', {
              steadyStatus: ['running', 'ready'],
              managerArgs: {
                action: 'syncstatus',
              },
            })
          },
          meta: () => ({
            validate: this.list.selected.length,
          }),
        },
        {
          label: this.$t('table.action.set_tag'),
          permission: 'snapshots_perform_set_user_metadata',
          action: () => {
            this.createDialog('SetTagDialog', {
              data: this.list.selectedItems,
              columns: this.columns,
              onManager: this.onManager,
              mode: 'add',
              params: {
                resources: 'snapshot',
              },
              tipName: this.$t('compute.text_462'),
            })
          },
          meta: () => {
            return {
              validate: this.list.selected.length,
              tooltip: null,
            }
          },
        },
        {
          label: this.$t('compute.perform_delete'),
          permission: 'snapshots_delete',
          action: () => {
            this.createDialog('DeleteResDialog', {
              vm: this,
              data: this.list.selectedItems,
              columns: this.columns,
              onManager: this.onManager,
              title: this.$t('compute.perform_delete'),
              name: this.$t('compute.text_462'),
            })
          },
          meta: () => {
            const ret = {
              validate: this.list.selected.length,
              tooltip: null,
            }
            if (this.list.selectedItems.some(item => !item.can_delete)) {
              ret.validate = false
              return ret
            }
            if (this.list.selectedItems.some(item => item.is_sub_snapshot)) {
              ret.validate = false
              ret.tooltip = this.$t('compute.text_1062')
              return ret
            }
            return ret
          },
        },
      ],
    }
  },
  watch: {
    cloudEnv (val) {
      this.$nextTick(() => {
        this.list.fetchData(0)
      })
    },
  },
  created () {
    this.initSidePageTab('snapshot-detail')
    this.list.fetchData()
  },
  methods: {
    getParam () {
      const ret = {
        details: true,
        with_meta: true,
        is_instance_snapshot: false,
        ...this.getParams,
      }
      if (this.cloudEnv) ret.cloud_env = this.cloudEnv
      return ret
    },
    handleOpenSidepage (row) {
      this.sidePageTriggerHandle(this, 'SnapshotSidePage', {
        id: row.id,
        resource: 'snapshots',
        getParams: this.getParam,
        steadyStatus: this.list.steadyStatus,
      }, {
        list: this.list,
        type: 'disk',
      })
    },
  },
}
</script>
