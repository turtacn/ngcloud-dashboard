<template>
  <div>
    <page-header :title="$t('logging.text_18')" />
    <page-body>
      <overview-index />
    </page-body>
  </div>
</template>

<script>
import OverviewIndex from './components'

export default {
  name: 'LoggingOverview',
  components: {
    OverviewIndex,
  },
}
</script>
