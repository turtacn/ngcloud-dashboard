<template>
  <page-list
    :list="list"
    :columns="columns"
    :show-tag-columns="true"
    :show-tag-filter="true"
    :export-data-options="exportDataOptions"
    :group-actions="groupActions"
    :showSearchbox="showSearchbox"
    :showGroupActions="showGroupActions"
    :single-actions="singleActions" />
</template>

<script>
import * as R from 'ramda'
import GlobalSearchMixin from '@/mixins/globalSearch'
import expectStatus from '@/constants/expectStatus'
import WindowsMixin from '@/mixins/windows'
import { getStatusFilter, getNameFilter, getDescriptionFilter, getTenantFilter, getCloudProviderFilter, getAccountFilter } from '@/utils/common/tableFilter'
import { disableDeleteAction } from '@/utils/common/tableActions'
import ListMixin from '@/mixins/list'
import ColumnsMixin from '../mixins/columns'
import SingleActionsMixin from '../mixins/singleActions'

export default {
  name: 'ElasticSearchList',
  mixins: [WindowsMixin, ListMixin, GlobalSearchMixin, ColumnsMixin, SingleActionsMixin],
  props: {
    id: String,
    getParams: {
      type: [Function, Object],
    },
    data: {
      type: Object,
    },
    hiddenActions: {
      type: Array,
      default: () => ([]),
    },
  },
  data () {
    return {
      list: this.$list.createList(this, {
        id: this.id,
        resource: 'elastic_searchs',
        getParams: this.getParam,
        steadyStatus: Object.values(expectStatus.elasticSearch).flat(),
        filterOptions: {
          id: {
            label: this.$t('table.title.id'),
          },
          external_id: {
            label: this.$t('table.title.external_id'),
          },
          name: getNameFilter(),
          description: getDescriptionFilter(),
          status: getStatusFilter('elasticSearch'),
          account: getAccountFilter(),
          manager: getCloudProviderFilter(),
          projects: getTenantFilter(),
          region: {
            label: this.$t('developer.cloudregion'),
          },
        },
        responseData: this.responseData,
      }),
      exportDataOptions: {
        items: [
          { label: 'ID', key: 'id' },
          { label: this.$t('table.title.external_id'), key: 'external_id' },
          { label: this.$t('developer.name'), key: 'name' },
          { label: this.$t('developer.version'), key: 'version' },
          { label: this.$t('developer.category'), key: 'category' },
          { label: this.$t('developer.storage'), key: 'storage_type' },
          { label: this.$t('developer.disk_size_gb'), key: 'disk_size_gb' },
          { label: this.$t('dictionary.project'), key: 'tenant' },
          { label: this.$t('developer.status'), key: 'status' },
          { label: this.$t('developer.cloudaccount'), key: 'account' },
          { label: this.$t('developer.billing_type'), key: 'billing_type' },
          { label: this.$t('developer.provider'), key: 'provider' },
          { label: this.$t('developer.cloudregion'), key: 'region' },
        ],
      },
      groupActions: [
        {
          label: this.$t('developer.syncstatus'),
          permission: 'elastic_searchs_perform_syncstatus',
          action: () => {
            this.onManager('batchPerformAction', {
              steadyStatus: ['available', 'unknown'],
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
          label: this.$t('common.batchAction'),
          actions: (obj) => {
            return [
              {
                label: this.$t('compute.text_283'),
                permission: 'elastic_searchs_perform_set_user_metadata',
                action: () => {
                  this.createDialog('SetTagDialog', {
                    data: this.list.selectedItems,
                    columns: this.columns,
                    onManager: this.onManager,
                    params: {
                      resources: 'elastic_searchs',
                    },
                    mode: 'add',
                  })
                },
              },
              disableDeleteAction(Object.assign(this, {
                permission: 'elastic_searchs_update',
              }), {
                name: this.$t('dictionary.devops'),
              }),
              {
                label: this.$t('developer.delete'),
                permission: 'elastic_searchs_delete',
                action: () => {
                  this.createDialog('DeleteResDialog', {
                    vm: this,
                    title: this.$t('developer.delete'),
                    data: this.list.selectedItems,
                    columns: this.columns,
                    onManager: this.onManager,
                    refresh: this.refresh,
                    name: this.$t('dictionary.devops'),
                  })
                },
                meta: () => this.$getDeleteResult(this.list.selectedItems),
              },
            ]
          },
          meta: () => {
            const selectedLength = this.list.selectedItems.length
            return {
              validate: selectedLength,
              tooltip: '',
            }
          },
        },
      ],
    }
  },
  created () {
    this.initSidePageTab('elastic-search-detail')
    this.list.fetchData()
  },
  methods: {
    getParam () {
      const ret = {
        ...(R.is(Function, this.getParams) ? this.getParams() : this.getParams),
        detail: true,
      }
      return ret
    },
    handleOpenSidepage (row) {
      this.sidePageTriggerHandle(this, 'ElasticSearchSidePage', {
        id: row.id,
        resource: 'elastic_searchs',
        getParams: this.getParam,
      }, {
        list: this.list,
      })
    },
  },
}
</script>
