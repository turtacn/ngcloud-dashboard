<template>
  <base-dialog @cancel="cancelDialog">
    <div slot="header">{{$t('logging.dashboard.dialog.delete')}}</div>
    <div slot="body">
      <dialog-selected-tips :name="$t('logging.dashboard.title')" :count="params.data.length" :action="$t('compute.perform_delete')" />
      <dialog-table :data="params.data" :columns="params.columns" />
    </div>
    <div slot="footer">
      <a-button type="primary" @click="handleConfirm" :loading="loading">{{ $t('dialog.ok') }}</a-button>
      <a-button @click="cancelDialog">{{ $t('dialog.cancel') }}</a-button>
    </div>
  </base-dialog>
</template>

<script>
import DialogMixin from '@/mixins/dialog'
import WindowsMixin from '@/mixins/windows'

export default {
  name: 'DeleteLoggingDashboard',
  mixins: [DialogMixin, WindowsMixin],
  data () {
    return {
      loading: false,
    }
  },
  methods: {
    async handleConfirm () {
      this.loading = true
      try {
        this.loading = true
        await new this.$Manager('alertdashboards', 'v1').delete({ id: this.params.data[0].id })
        this.loading = false
        this.cancelDialog()
        this.params.refresh()
      } catch (error) {
        this.loading = false
        throw error
      }
    },
  },
}
</script>

<style scoped>

</style>
