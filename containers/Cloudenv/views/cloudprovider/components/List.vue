<template>
  <page-list
    :list="list"
    :columns="columns"
    :group-actions="groupActions"
    :single-actions="singleActions" />
</template>

<script>
import expectStatus from '@/constants/expectStatus'
import WindowsMixin from '@/mixins/windows'
import ListMixin from '@/mixins/list'
import { getEnabledSwitchActions } from '@/utils/common/tableActions'
import { getStatusFilter, getEnabledFilter, getTenantFilter, getDescriptionFilter } from '@/utils/common/tableFilter'
import SingleActionsMixin from '../mixins/singleActions'
import ColumnsMixin from '../mixins/columns'

export default {
  name: 'CloudproviderList',
  mixins: [WindowsMixin, ListMixin, ColumnsMixin, SingleActionsMixin],
  props: {
    getParams: {
      type: [Function, Object],
    },
    data: {
      type: Object,
    },
    cloudaccountListRefresh: {
      type: Function,
    },
    id: String,
  },
  data () {
    const ownerDomain = list => this.$store.getters.isAdminMode || list.selectedItems.every(obj => obj.domain_id === this.$store.getters.userInfo.projectDomainId)
    const isAccountDomain = data => data.share_mode === 'account_domain'
    return {
      list: this.$list.createList(this, {
        id: this.id,
        resource: 'cloudproviders',
        getParams: this.getParams,
        steadyStatus: Object.values(expectStatus.cloudaccount).flat(),
        filterOptions: {
          name: {
            label: this.$t('cloudenv.text_95'),
            filter: true,
            formatter: val => {
              return `name.contains("${val}")`
            },
          },
          description: getDescriptionFilter(),
          status: getStatusFilter('cloudaccount'),
          enabled: getEnabledFilter(),
          account: {
            label: this.$t('cloudenv.text_353'),
            filter: true,
            formatter: val => {
              return `account.contains("${val}")`
            },
          },
          tenant: getTenantFilter(),
        },
      }),
      groupActions: [
        {
          label: this.$t('cloudenv.text_104'),
          permission: 'cloudproviders_create',
          action: () => {
            this.createDialog('cloudproviderCreateDialog', {
              data: this.data,
              onManager: this.onManager,
              refresh: this.refresh,
            })
          },
          meta: () => {
            return {
              buttonType: 'primary',
              validate: this.data.brand === 'Azure' && this.data.access_url === 'AzurePublicCloud',
              tooltip: !(this.data.brand === 'Azure' && this.data.access_url === 'AzurePublicCloud') && this.$t('cloudenv.text_333_1'),
            }
          },
        },
        {
          label: this.$t('common.batchAction'),
          actions: obj => {
            return [
              ...getEnabledSwitchActions(this, undefined, ['cloudproviders_perform_enable', 'cloudproviders_perform_disable'], {
                actions: [
                  async (obj) => {
                    const ids = this.list.selectedItems.map(item => item.id)
                    await this.onManager('batchPerformAction', {
                      id: ids,
                      managerArgs: {
                        action: 'enable',
                      },
                    })
                    this.$bus.$emit('CloudAccountListSingleRefresh', [this.data.id])
                  },
                  async (obj) => {
                    const ids = this.list.selectedItems.map(item => item.id)
                    await this.onManager('batchPerformAction', {
                      id: ids,
                      managerArgs: {
                        action: 'disable',
                      },
                    })
                    this.$bus.$emit('CloudAccountListSingleRefresh', [this.data.id])
                  },
                ],
                metas: [
                  () => {
                    const isDisable = !!this.list.selectedItems.find(item => !item.enabled)
                    return {
                      validate: this.list.selectedItems.length && ownerDomain && isDisable,
                    }
                  },
                  () => {
                    const isEnable = !!this.list.selectedItems.find(item => item.enabled)
                    return {
                      validate: this.list.selectedItems.length && ownerDomain && isEnable,
                    }
                  },
                ],
              }),
              {
                label: this.$t('cloudenv.text_294', [this.$t('dictionary.project')]),
                permission: 'cloudproviders_perform_change_project',
                action: () => {
                  if (isAccountDomain(this.data)) {
                    this.createDialog('ChangeProjectDialog', {
                      name: this.$t('dictionary.cloudprovider'),
                      data: this.list.selectedItems,
                      columns: this.columns,
                      onManager: this.onManager,
                      alertMessage: this.$t('cloudenv.text_336', [this.$t('dictionary.project'), this.$t('dictionary.domain'), this.$t('dictionary.domain')]),
                    })
                  } else {
                    this.createDialog('ChangeOwenrDialog', {
                      name: this.$t('dictionary.cloudprovider'),
                      data: this.list.selectedItems,
                      columns: this.columns,
                      onManager: this.onManager,
                      action: 'change-project',
                      resource: 'cloudproviders',
                      alertMessage: this.$t('cloudenv.text_336', [this.$t('dictionary.project'), this.$t('dictionary.domain'), this.$t('dictionary.domain')]),
                    })
                  }
                },
                meta: () => {
                  return {
                    validate: this.list.selectedItems.length && this.list.selectedItems.every(val => val.enabled) && ownerDomain(this.list),
                  }
                },
              },
              {
                label: this.$t('cloudenv.text_108'),
                permission: 'cloudproviders_delete',
                action: () => {
                  this.createDialog('DeleteResDialog', {
                    vm: this,
                    data: this.list.selectedItems,
                    columns: this.columns,
                    title: this.$t('cloudenv.text_108'),
                    onManager: this.onManager,
                    name: this.$t('cloudenv.text_318'),
                    alert: this.$t('cloudenv.cloudprovider.delete_tip'),
                  })
                },
                meta: () => {
                  let tooltip
                  let validate
                  const isEnabled = this.list.selectedItems.some(val => val.enabled)
                  const isSyncing = this.list.selectedItems.some(val => val.sync_status === 'syncing')
                  if (isSyncing) {
                    tooltip = this.$t('cloudenv.cloudprovider.sync_delete')
                    validate = false
                  }
                  if (isEnabled) {
                    tooltip = this.$t('network.text_310')
                    validate = false
                  }
                  if (this.data.brand !== 'Azure') {
                    tooltip = this.$t('cloudenv.text_333')
                    validate = false
                  }
                  if (!this.list.selectedItems.length || !ownerDomain(this.list)) {
                    tooltip = ''
                    validate = false
                  }
                  return {
                    tooltip,
                    validate,
                  }
                },
              },
            ]
          },
          meta: () => {
            return {
              validate: this.list.selectedItems.length,
            }
          },
        },
      ],
    }
  },
  created () {
    this.initSidePageTab('cloudaccount-detail')
    this.list.fetchData()
  },
  methods: {
    handleOpenSidepage (row) {
      this.sidePageTriggerHandle(this, 'CloudproviderSidePage', {
        id: row.id,
        resource: 'cloudproviders',
        getParams: this.getParams,
      }, {
        list: this.list,
      })
    },
  },
}
</script>
