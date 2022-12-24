<template>
  <div>
    <page-header :title="$t('dictionary.explorer')" />
    <page-body>
      <logging-index />
    </page-body>
    <!-- <page-footer>
      <div slot="right">
        <a-button class="mr-3" type="primary" :loading="loading" @click="handleConfirm">{{ $t('common.save') }}</a-button>
        <a-button @click="reset">{{ $t('common.reset') }}</a-button>
      </div>
    </page-footer> -->
  </div>
</template>

<script>
import LoggingIndex from './components/index'

export default {
  name: 'Logging',
  components: {
    LoggingIndex,
  },
  data () {
    return {
      loading: false,
    }
  },
  methods: {
    handleConfirm () {},
    reset () {},
  },
}
</script>
