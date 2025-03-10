<template>
  <page-list
    show-tag-columns
    show-tag-filter
    :list="list"
    :columns="columns"
    :single-actions="singleActions"
    :group-actions="groupActions"
    :defaultSearchKey="defaultSearchKey"
    :export-data-options="exportDataOptions" />
</template>

<script>
import * as R from 'ramda'
import { mapGetters } from 'vuex'
import ColumnsMixin from '../mixins/columns'
import SingleActionsMixin from '../mixins/singleActions'
import ListMixin from '@/mixins/list'
import WindowsMixin from '@/mixins/windows'
import regexp from '@/utils/regexp'
import { getDescriptionFilter, getCreatedAtFilter } from '@/utils/common/tableFilter'

export default {
  name: 'AgentList',
  mixins: [WindowsMixin, ListMixin, ColumnsMixin, SingleActionsMixin],
  props: {
    id: String,
    getParams: {
      type: [Function, Object],
    },
  },
  data () {
    const filterOptions = {
      id: {
        label: this.$t('table.title.id'),
      },
      name: {
        label: this.$t('network.text_21'),
        filter: true,
        formatter: val => {
          return `name.contains(${val})`
        },
      },
      description: getDescriptionFilter(),
      ip: {
        label: 'IP',
      },
      cluster: {
        label: this.$t('network.text_19'),
        dropdown: true,
        distinctField: {
          type: 'extra_field',
          key: 'cluster',
        },
      },
      region: {
        label: this.$t('dashboard.text_101'),
      },
      zone: {
        label: this.$t('compute.text_270'),
      },
      created_at: getCreatedAtFilter(),
    }
    const { path } = this.$route
    if (path.includes('/cluster')) {
      delete filterOptions.cluster
    }
    return {
      list: this.$list.createList(this, {
        id: this.id,
        resource: 'loadbalanceragents',
        getParams: this.getParam,
        filterOptions,
        hiddenColumns: ['metadata', 'version', 'created_at'],
      }),
      exportDataOptions: {
        items: [
          { label: 'ID', key: 'id' },
          { label: this.$t('network.text_21'), key: 'name' },
          { label: this.$t('network.text_19'), key: 'cluster' },
          { label: this.$t('network.text_22'), key: 'ha_state' },
          { label: 'IP', key: 'ip' },
          { label: this.$t('network.text_23'), key: 'hb_last_seen' },
          { label: this.$t('network.text_24'), key: 'zone' },
          { label: this.$t('network.text_25'), key: 'version' },
          { label: this.$t('common_715'), key: 'user_tags' },
          { label: this.$t('common.createdAt'), key: 'created_at' },
        ],
      },
      groupActions: [
        {
          label: this.$t('network.text_26'),
          permission: 'lb_loadbalanceragents_create',
          action: () => {
            this.$router.push({
              name: 'AgentForm',
            })
          },
          meta: () => {
            return {
              buttonType: 'primary',
            }
          },
        },
        {
          label: this.$t('table.action.set_tag'),
          permission: 'lb_loadbalanceragents_perform_set_user_metadata',
          action: () => {
            this.createDialog('SetTagDialog', {
              data: this.list.selectedItems,
              columns: this.columns,
              onManager: this.onManager,
              mode: 'add',
              params: {
                resources: 'loadbalanceragent',
              },
              tipName: this.$t('network.text_20'),
            })
          },
          meta: () => {
            return {
              validate: this.list.selectedItems.length > 0,
            }
          },
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['isAdminMode']),
  },
  created () {
    this.initSidePageTab('agent-detail')
    this.list.fetchData()
  },
  methods: {
    getParam () {
      const ret = {
        ...(R.is(Function, this.getParams) ? this.getParams() : this.getParams),
      }
      return ret
    },
    handleOpenSidepage (row) {
      this.sidePageTriggerHandle(this, 'AgentSidePage', {
        id: row.id,
        resource: 'loadbalanceragents',
        getParams: this.getParam,
      }, {
        list: this.list,
      })
    },
    defaultSearchKey (search) {
      if (regexp.isIPv4(search)) {
        return 'ip'
      }
    },
  },
}
</script>
