<template>
  <div>
    <page-header :title="$t('logging.dashboard.title')" />
    <page-body>
      <dashboard-index />
    </page-body>
  </div>
</template>

<script>
import DashboardIndex from './components'

export default {
  name: 'LoggingDashboardIndex',
  components: {
    DashboardIndex,
  },
}
</script>

<style scoped>

</style>
