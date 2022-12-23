import { disableDeleteAction } from '@/utils/common/tableActions'
import i18n from '@/locales'

export default {
  created () {
    this.singleActions = [
      {
        label: i18n.t('developer.syncstatus'),
        permission: 'runtimes_perform_syncstatus',
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
              permission: 'runtimes_update',
            }), {
              name: this.$t('dictionary.runtime'),
            }),
            {
              label: i18n.t('developer.delete'),
              permission: 'runtimes_delete',
              action: () => {
                this.createDialog('DeleteResDialog', {
                  vm: this,
                  title: i18n.t('developer.delete'),
                  name: this.$t('dictionary.runtime'),
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
