<template>
  <div>
    <page-header :title="$t('developer.runtime')" />
    <page-body>
      <runtime-list :id="listId" />
    </page-body>
  </div>
</template>

<script>
import RuntimeList from './components/List'

export default {
  name: 'Runtime',
  components: {
    RuntimeList,
  },
  data () {
    return {
      listId: 'RuntimeList',
    }
  },
}
</script>
