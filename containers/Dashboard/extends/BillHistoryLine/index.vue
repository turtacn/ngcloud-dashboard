<template>
  <div class="h-100 w-100 position-relative" v-if="hasMeterService">
    <div class="dashboard-card-wrap">
      <div class="dashboard-card-header">
        <div class="dashboard-card-header-left">{{ fd.name }}<a-icon class="ml-2" type="loading" v-if="loading" /></div>
        <div class="dashboard-card-header-right">
          <slot name="actions" :handle-edit="handleEdit" />
        </div>
      </div>
      <div class="dashboard-card-body align-items-center justify-content-center">
        <line-chart :columns="lineChartColumns" :rows="lineChartRows" width="100%" height="100%" />
      </div>
    </div>
    <base-drawer :visible.sync="visible" :title="$t('dashboard.text_5')" @ok="handleSubmit">
      <a-form-model
        ref="form"
        hideRequiredMark
        :model="fd"
        :rules="rules">
        <a-form-model-item :label="$t('dashboard.text_6')" prop="name">
          <a-input v-model="fd.name" />
        </a-form-model-item>
      </a-form-model>
    </base-drawer>
  </div>
</template>

<script>
import * as R from 'ramda'
import { mapGetters } from 'vuex'
import { load } from '@Dashboard/utils/cache'
import BaseDrawer from '@Dashboard/components/BaseDrawer'
import { getRequestT } from '@/utils/utils'
import LineChart from '@/sections/Charts/Line'
import { getSignature } from '@/utils/crypto'
import i18n from '@/locales'

export default {
  name: 'BillHistoryLine',
  components: {
    LineChart,
    BaseDrawer,
  },
  props: {
    options: {
      type: Object,
      required: true,
    },
    params: Object,
  },
  data () {
    const initNameValue = (this.params && this.params.name) || this.$t('dashboard.text_7')
    return {
      data: [],
      visible: false,
      loading: false,
      fd: {
        name: initNameValue,
      },
      rules: {
        name: [
          { required: true, message: this.$t('dashboard.text_8') },
        ],
      },
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'isAdminMode']),
    lineChartColumns () {
      return ['time', this.$t('dashboard.text_9'), this.$t('dashboard.text_10'), this.$t('dashboard.text_11')]
    },
    lineChartRows () {
      const rows = []
      R.forEach(item => {
        const data = {}
        data.time = this.$moment(item[item.length - 1]).format(this.$t('dashboard.text_12'))
        data[i18n.t('dashboard.text_9')] = (+item[0] || 0).toFixed(2)
        data[i18n.t('dashboard.text_10')] = (+item[1] || 0).toFixed(2)
        data[i18n.t('dashboard.text_11')] = (+item[2] || 0).toFixed(2)
        rows.push(data)
      }, (this.data && this.data.points) || [])
      return rows
    },
    hasMeterService () { // 是否有计量的服务
      const { services } = this.userInfo
      const meterService = services.find(val => val.type === 'meter')
      if (meterService && meterService.status === true) {
        return true
      }
      return false
    },
  },
  created () {
    this.fetchData()
    this.$emit('update', this.options.i, {
      ...this.fd,
    })
  },
  methods: {
    refresh () {
      return this.fetchData()
    },
    handleEdit () {
      this.visible = true
    },
    async fetchData () {
      if (!this.hasMeterService) {
        return
      }
      this.loading = true
      try {
        const requestData = this.genQueryData()
        requestData.signature = getSignature(requestData)
        const data = await load({
          res: 'unifiedmonitors',
          actionArgs: {
            url: '/v1/unifiedmonitors/query',
            method: 'POST',
            params: {
              $t: getRequestT(),
            },
            data: requestData,
          },
          useManager: false,
          resPath: 'data.series[0]',
        })
        this.data = data || []
      } finally {
        this.loading = false
      }
    },
    genQueryData () {
      const ret = {
        metric_query: [
          {
            model: {
              database: 'meter_db',
              measurement: 'meter_res_fee',
              select: [
                [
                  {
                    type: 'field',
                    params: ['baremetalFee'],
                  },
                  {
                    type: 'sum',
                    params: [],
                  },
                ],
                [
                  {
                    type: 'field',
                    params: ['gpuFee'],
                  },
                  {
                    type: 'sum',
                    params: [],
                  },
                ],
                [
                  {
                    type: 'field',
                    params: ['serverFee'],
                  },
                  {
                    type: 'sum',
                    params: [],
                  },
                ],
              ],
              // tags: [
              //   {
              //     key: 'res_type',
              //     value: 'host',
              //     operator: '=',
              //   },
              // ],
              group_by: [
                {
                  type: 'time',
                  params: ['24h', '-8h'],
                },
                {
                  type: 'fill',
                  params: ['none'],
                },
              ],
            },
          },
        ],
        scope: this.scope,
        from: `${30 * 24}h`,
        now: 'now - 24h',
        unit: true,
      }
      if (this.isAdminMode) {
        // q = `SELECT sum(baremetalFee) AS "baremetalFee", sum(gpuFee) AS "gpuFee", sum(serverFee) AS "serverFee" FROM meter_res_fee where time > now() - ${30 * 24}h and time <= now() - 24h GROUP BY time(24h,-8h)`
        return ret
      }
      // q = `SELECT sum(baremetalFee) AS "baremetalFee", sum(gpuFee) AS "gpuFee", sum(serverFee) AS "serverFee" FROM meter_res_fee where time > now() - ${30 * 24}h and time <= now() - 24h AND projectId='${this.userInfo.projectId}' GROUP BY time(24h,-8h)`
      ret.metric_query[0].model.tags = [
        {
          key: 'projectId',
          value: this.userInfo.projectId,
          operator: '=',
        },
      ]
      return ret
    },
    async handleSubmit () {
      try {
        await this.$refs.form.validate()
        this.$emit('update', this.options.i, this.fd)
        this.visible = false
      } catch (error) {
        throw error
      }
    },
  },
}
</script>
