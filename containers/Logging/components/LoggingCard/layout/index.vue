<template>
  <a-row :class="card_style">
    <a-col style="padding-left: 6px; padding-right: 6px;" :class="card_style" :span="24">
      <div :class="['logging-overview-card', 'mb-2', card_style]">
        <div>
          <slot name="header" />
        </div>
        <div :class="card_style">
          <slot>{{ '' }}</slot>
        </div>
        <div>
          <slot name="footer" />
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script>
export default {
  name: 'LoggingCardLayout',
  props: {
    card_style: {
      type: String,
    },
  },
}
</script>

<style lang="less" scoped>
.logging-overview-card {
  border: 1px solid #F1F1F1;
  padding: 12px 24px;
  .header {
    font-weight: 500;
    .title-wrapper {
      .subtitle {
        font-size: 12px;
        color: #ccc;
      }
    }
  }
}
</style>
