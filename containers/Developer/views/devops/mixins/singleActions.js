import { disableDeleteAction } from '@/utils/common/tableActions'
import i18n from '@/locales'

export default {
  created () {
    this.singleActions = [
      {
        label: i18n.t('developer.syncstatus'),
        permission: 'elastic_searchs_perform_syncstatus',
        action: obj => {
          this.onManager('performAction', {
            steadyStatus: ['available'],
            id: obj.id,
            managerArgs: {
              action: 'syncstatus',
            },
          })
        },
        meta: () => ({
          validate: true,
        }),
      },
      {
        label: i18n.t('developer.more'),
        actions: (obj) => {
          return [
            disableDeleteAction(Object.assign(this, {
              permission: 'elastic_searchs_update',
            }), {
              name: this.$t('dictionary.devops'),
            }),
            {
              label: i18n.t('developer.delete'),
              permission: 'elastic_searchs_delete',
              action: () => {
                this.createDialog('DeleteResDialog', {
                  vm: this,
                  title: i18n.t('developer.delete'),
                  name: this.$t('dictionary.devops'),
                  data: [obj],
                  columns: this.columns,
                  onManager: this.onManager,
                  refresh: this.refresh,
                })
              },
              meta: () => this.$getDeleteResult(obj),
            },
          ]
        },
      },
    ]
  },
}
