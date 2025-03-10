<template>
  <a-card :title="title" size="small" class="logging-form" :class="{ 'hideBody': !panelShow }">
    <div slot="extra">
      <a-icon type="delete" v-if="showDelete" @click="remove" class="mr-2 remove-icon" />
      <a-icon :type="panelShow ? 'up' : 'down'" @click="toggle" />
    </div>
    <a-form
      v-show="panelShow"
      v-bind="formItemLayout"
      :form="form.fc">
      <a-form-item :label="$t('logging.logging_metric')" class="mb-0">
        <metric
          :form="form"
          :decorators="decorators"
          :res_type_measurements="res_type_measurements"
          :res_types="res_types"
          :loading="metricLoading"
          @metricChange="getMetricInfo"
          @metricClear="resetChart" />
      </a-form-item>
      <a-form-item :label="$t('logging.logging_filters')">
        <filters
          :form="form"
          ref="filtersRef"
          :decorators="decorators.filters"
          :init-filters="initFilters"
          @remove="$nextTick(toParams)"
          :loading="metricInfoLoading"
          :metricInfo="metricInfo" />
      </a-form-item>
      <a-form-item :label="$t('logging.logging_group')">
        <base-select
          v-decorator="decorators.group_by"
          :options="groupbyOpts"
          @change="groupbyChange"
          class="w-100"
          :select-props="{ placeholder: $t('logging.text_114'), allowClear: true }" />
      </a-form-item>
      <a-form-item :label="$t('logging.logging_function')">
        <base-select
          v-decorator="decorators.function"
          :options="functionOpts"
          class="w-100"
          :select-props="{ placeholder: $t('logging.text_115'), allowClear: true }" />
      </a-form-item>
      <a-form-item :label="$t('common.name')" v-if="!queryOnly">
        <a-input v-decorator="decorators.name" :placeholder="$t('common.placeholder')" />
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import _ from 'lodash'
import * as R from 'ramda'
import Metric from '@Logging/sections/Metric'
import Filters from '@Logging/sections/Filters'
import { metric_zh } from '@Logging/constants'
import { resolveValueChangeField } from '@/utils/common/ant'
import { uuid, getRequestT } from '@/utils/utils'

export default {
  name: 'ExplorerForm',
  components: {
    Metric,
    Filters,
  },
  props: {
    panel: {
      type: Object,
      default: () => ({}),
    },
    queryOnly: {
      type: Boolean,
      default: true,
    },
    formItemLayout: {
      type: Object,
      default: () => ({
        wrapperCol: {
          span: 21,
        },
        labelCol: {
          span: 3,
        },
      }),
    },
    showDelete: {
      type: Boolean,
      default: false,
    },
    defaultPanelShow: {
      type: Boolean,
    },
    timeRangeParams: {
      type: Object,
      default: () => ({}),
    },
    extraParams: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    const initialValue = {}
    const initFilters = []
    if (this.panel && this.panel.common_alert_metric_details && this.panel.common_alert_metric_details.length > 0) {
      const f = this.panel.common_alert_metric_details[0]
      const q = _.get(this.panel, 'settings.conditions[0].query.model')
      initialValue.name = this.panel.name || this.panel.panel_name || ''
      initialValue.res_type = f.res_type
      initialValue.metric_key = f.measurement
      initialValue.metric_value = f.field
      initialValue.tags = {}
      if (q) {
        if (q.group_by) {
          const _g = q.group_by.filter((g) => { return g.type === 'tag' })
          if (_g) initialValue.group_by = _g[0] && _g[0].params && _g[0].params[0] ? _g[0].params[0] : ''
        }
        if (q.tags) {
          q.tags.map((tag) => {
            const key = uuid()
            initialValue.tags[key] = tag
            initFilters.push({ key: key, tagValueOpts: [] })
          })
        }
        initialValue.function = ''
        if (q.select && q.select.length > 0 && q.select[0].length > 1) {
          const s = q.select[0]
          const _t = s[s.length - 1].type
          if (_t) initialValue.function = _t.toUpperCase()
        }
      }
    }
    const getkey = (index, key, defaultValue) => {
      if (initialValue.tags && initialValue.tags[index] && initialValue.tags[index][key]) {
        return initialValue.tags[index][key]
      } else {
        return defaultValue
      }
    }

    const decorators = {
      metric_res_type: [
        'metric_res_type',
        {
          initialValue: initialValue.res_type,
          rules: [
            { required: true, message: this.$t('common.select') },
          ],
        },
      ],
      metric_key: [
        'metric_key',
        {
          initialValue: initialValue.metric_key,
          rules: [
            { required: true, message: this.$t('common.select') },
          ],
        },
      ],
      metric_value: [
        'metric_value',
        {
          initialValue: initialValue.metric_value,
          rules: [
            { required: true, message: this.$t('common.select') },
          ],
        },
      ],
      filters: {
        tagCondition: i => [
          `tagConditions[${i}]`,
          {
            initialValue: getkey(i, 'condition', 'AND'),
            rules: [
              { required: true, message: this.$t('common.select') },
            ],
          },
        ],
        tagKey: i => [
          `tagKeys[${i}]`,
          {
            initialValue: getkey(i, 'key', ''),
            rules: [
              // { required: true, message: this.$t('common.select') },
            ],
          },
        ],
        tagOperator: i => [
          `tagOperators[${i}]`,
          {
            initialValue: getkey(i, 'operator', '='),
            rules: [
              { required: true, message: this.$t('common.select') },
            ],
          },
        ],
        tagValue: i => [
          `tagValues[${i}]`,
          {
            initialValue: getkey(i, 'value', ''),
            rules: [
              // { required: true, message: this.$t('common.select') },
            ],
          },
        ],
      },
      group_by: [
        'group_by',
        {
          initialValue: initialValue.group_by,
        },
      ],
      function: [
        'function',
        {
          initialValue: initialValue.function,
        },
      ],
    }

    if (!this.queryOnly) {
      decorators.name = [
        'name',
        {
          initialValue: initialValue.name || '',
          rules: [
            { required: true, message: `${this.$t('common.placeholder')}${this.$t('common.name')}` },
          ],
        },
      ]
    }

    return {
      prevName: initialValue.name,
      form: {
        fc: this.$form.createForm(this, {
          onValuesChange: this.onValuesChange,
        }),
        fd: {},
      },
      decorators: decorators,
      initFilters: initFilters,
      groupbyOpts: [],
      functionOpts: [],
      metricKeyOpts: [],
      metricInfo: {},
      metricKeyItem: {},
      mertricItem: {},
      panelShow: this.defaultPanelShow,
      oldParams: {},
      metricLoading: false,
      metricInfoLoading: false,
      res_type_measurements: {},
      res_types: [],
    }
  },
  computed: {
    title () {
      if (!this.panelShow && this.form.fd.metric_key) {
        return this.getTitle()
      }
      return this.$t('logging.logging_fill_filters')
    },
  },
  watch: {
    defaultPanelShow (val) {
      this.panelShow = val
    },
    timeRangeParams () {
      this.getMeasurement()
    },
  },
  created () {
    this.getMeasurement()
  },
  methods: {
    getTitle () {
      let padding = ' '
      if (this.$store.getters.setting.language === 'zh-CN') {
        padding = ''
      }
      let label = this.metricKeyItem && this.metricKeyItem.metric_res_type ? this.$t(`dictionary.${this.metricKeyItem.metric_res_type}`) + padding : ''
      label += this.metricKeyItem && this.metricKeyItem.label ? this.metricKeyItem.label : '-'
      const metricLabel = _.get(this.mertricItem, 'description.display_name')
      if (metricLabel) {
        label += `(${metric_zh[metricLabel] ? metric_zh[metricLabel] : metricLabel})`
      }
      return label
    },
    resetChart () {
      this.$emit('resetChart')
      this.$refs.filtersRef.reset()
    },
    remove () {
      this.$emit('remove')
    },
    groupbyChange (a) {
      if (this.functionOpts && this.functionOpts.length) {
        const mean = this.functionOpts.find(val => val.key.toLowerCase() === 'mean')
        this.form.fc.setFieldsValue({
          [this.decorators.function[0]]: mean.key,
        })
      }
    },
    onValuesChange (props, values) {
      const newField = resolveValueChangeField(values)
      R.forEachObjIndexed((item, key) => {
        if (R.is(Object, this.form.fd[key]) && R.is(Object, item)) {
          this.$set(this.form.fd, key, { ...this.form.fd[key], ...item })
        } else {
          this.$set(this.form.fd, key, item)
        }
      }, newField)
      this.$nextTick(this.toParams)
      if ((values.hasOwnProperty('metric_key') && !values.metric_key) || (values.hasOwnProperty('metric_value') && !values.metric_value)) {
        this.resetChart()
      }
    },
    async getMeasurement () {
      try {
        this.metricLoading = true
        const params = { scope: this.$store.getters.scope, ...this.timeRangeParams, ...this.extraParams }
        const { data: { res_type_measurements, res_types } } = await new this.$Manager('unifiedloggings', 'v1').get({ id: 'measurements', params })
        this.res_type_measurements = res_type_measurements
        this.res_types = res_types
        this.metricLoading = false
      } catch (error) {
        this.metricLoading = false
        throw error
      }
    },
    async getMetricInfo ({ metricKey, mertric, mertricItem, metricKeyItem }) {
      try {
        this.metricKeyItem = metricKeyItem || {}
        this.mertricItem = mertricItem || {}
        const title = this.getTitle()
        if (this.prevName === '' || this.form.fd.name === this.prevName) {
          this.form.fc.setFieldsValue({ name: title })
          this.prevName = title
        }
        this.$emit('mertricItemChange', { ...mertricItem, title: title, metricKeyItem })
        const params = {
          $t: getRequestT(),
          database: metricKeyItem && metricKeyItem.database ? metricKeyItem.database : 'telegraf',
          measurement: metricKey,
          field: mertric,
          scope: this.$store.getters.scope,
          ...this.timeRangeParams,
          ...this.extraParams,
        }
        this.metricInfoLoading = true
        const { data } = await new this.$Manager('unifiedloggings', 'v1').get({ id: 'metric-measurement', params })
        this.metricInfo = data
        if (R.is(Array, this.metricInfo.tag_key)) {
          this.groupbyOpts = this.metricInfo.tag_key.map(v => ({ key: v, label: v }))
        }
        const Aggregations = _.get(this.metricInfo, 'func.field_opt_value.Aggregations')
        if (R.is(Array, Aggregations)) {
          this.functionOpts = Aggregations.map(v => ({ key: v, label: v }))
        }
        const { group_by: groupBy, function: func } = this.form.fc.getFieldsValue([this.decorators.group_by[0], this.decorators.function[0]])
        const resetFields = {}
        if (!~this.metricInfo.tag_key.indexOf(groupBy)) {
          resetFields[this.decorators.group_by[0]] = undefined
        }
        if (!~Aggregations.indexOf(func)) {
          resetFields[this.decorators.function[0]] = undefined
        }
        this.form.fc.setFieldsValue(resetFields)
        this.metricInfoLoading = false
      } catch (error) {
        this.metricInfo.tag_key = []
        this.metricInfo.func = {}
        this.metricInfoLoading = false
        throw error
      }
    },
    toggle () {
      this.panelShow = !this.panelShow
    },
    toParams () {
      const fd = this.form.fc.getFieldsValue()
      const params = {
        database: this.metricKeyItem && this.metricKeyItem.database ? this.metricKeyItem.database : 'telegraf',
      }
      const tags = []
      if (!this.queryOnly) {
        let formErr
        this.form.fc.validateFieldsAndScroll({ scroll: { alignWithTop: true, offsetTop: 100 } }, (err, values) => { if (err) { formErr = err } })
        if (formErr) return
        params.name = fd.name
      }
      if (fd.metric_key) params.measurement = fd.metric_key
      if (fd.metric_value) params.select = [[{ type: 'field', params: [fd.metric_value] }]]
      if (R.is(Object, fd.tagValues)) {
        R.forEachObjIndexed((value, key) => {
          if (value) {
            const tag = {
              key: fd.tagKeys[key],
              value,
              operator: fd.tagOperators[key],
            }
            if (fd.tagConditions && fd.tagConditions[key]) {
              tag.condition = fd.tagConditions[key]
            }
            tags.push(tag)
          }
        }, fd.tagValues)
      }
      if (tags.length) {
        params.tags = tags
      }
      if (fd.group_by) {
        // eslint-disable-next-line no-template-curly-in-string
        params.group_by = [{ type: 'tag', params: [fd.group_by] }]
      }
      if (!fd.metric_key || !fd.metric_value) {
        this.oldParams = params
        return params
      }
      if (R.is(String, fd.function)) {
        params.select[0].push({ type: fd.function.toLowerCase(), params: [] })
      }
      if (R.equals(this.oldParams, params)) return params
      this.$emit('paramsChange', params)
      this.oldParams = params // 记录为上一次 params
    },
  },
}
</script>

<style lang="less" scoped>
@import '../../../../src/styles/less/theme';

.logging-form {
  &.hideBody ::v-deep .ant-card-body {
    padding: 0 !important;
  }
  .remove-icon {
    transition: color 0.1s ease-in;
    &:hover {
      color: @error-color;
    }
  }
}

</style>
