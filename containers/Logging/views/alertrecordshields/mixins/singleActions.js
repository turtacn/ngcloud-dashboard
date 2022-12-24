export default {
  created () {
    this.singleActions = [
      {
        label: this.$t('logging.alerts.shield.dismiss'),
        permission: 'loggingresourcealerts_delete',
        action: (obj) => {
          this.createDialog('DeleteResDialog', {
            vm: this,
            data: [obj],
            columns: this.columns,
            title: this.$t('logging.alerts.shield.dismiss'),
            name: this.$t('dictionary.loggingresourcealerts'),
            onManager: this.onManager,
            success: () => {
              if (this.params && this.params.options && this.params.options.sourceList) {
                this.params.options.sourceList.refresh()
              }
            },
          })
        },
      },
    ]
  },
}
