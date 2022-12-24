export default {
  created () {
    this.singleActions = [
      {
        label: this.$t('logging.loggingresources.management'),
        action: (obj) => {
          this.handleOpenSidepage(obj, 'CommonalertList')
        },
      },
    ]
  },
}
