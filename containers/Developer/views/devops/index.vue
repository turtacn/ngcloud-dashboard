<template>
  <div>
    <page-header :title="$t('developer.devops')" />
    <page-body>
      <elastic-search-list :id="listId" />
    </page-body>
  </div>
</template>

<script>
import ElasticSearchList from './components/List'

export default {
  name: 'Runtime',
  components: {
    ElasticSearchList,
  },
  data () {
    return {
      listId: 'ElasticSearchList',
    }
  },
}
</script>
