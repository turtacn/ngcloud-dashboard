<template>
  <div class="h-100 position-relative" v-if="hasMeterService">
    <div class="dashboard-card-wrap">
      <div class="dashboard-card-header">
        <div class="dashboard-card-header-left">
          {{ fd.name }}
          <a-icon class="ml-2" type="loading" v-if="loading" />
          <a-tooltip><template slot="title">{{ $t('dashboard.suggestsysalert_tips') }}</template><icon type="help" /></a-tooltip>
        </div>
        <div class="dashboard-card-header-right">
          <slot name="actions" :handle-edit="() => visible = true" />
          <router-link v-if="!edit" to="/suggestsysalert" class="ml-2">
            <icon type="arrow-right" style="font-size:18px" />
          </router-link>
        </div>
      </div>
      <div class="dashboard-card-body align-items-center justify-content-center">
        <e-chart :options="chartOptions" style="height: 100%; width: 100%;" autoresize />
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
        <a-form-model-item :label="$t('scope.text_453')" prop="currency">
          <a-select v-model="fd.currency">
            <a-select-option v-for="obj in newCurrencys" :key="obj.item_id" :value="obj.item_id">
              {{ obj.item_name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </base-drawer>
  </div>
</template>

<script>
import * as R from 'ramda'
import { mapGetters, mapState } from 'vuex'
import BaseDrawer from '@Dashboard/components/BaseDrawer'
import { load } from '@Dashboard/utils/cache'
import { getRequestT } from '@/utils/utils'
import { chartColors, CURRENCYS } from '@/constants'
import { numerify } from '@/filters'
import { getCurrency } from '@/utils/common/cookie'
import { currencyUnitMap } from '@/constants/currency'

export default {
  name: 'SuggestsysAlertsDetail',
  components: {
    BaseDrawer,
  },
  props: {
    options: {
      type: Object,
      required: true,
    },
    params: Object,
    edit: Boolean,
  },
  data () {
    const initNameValue = (this.params && this.params.name) || this.$t('dashboard.text_47')
    const initCurrencyValue = (this.params && this.params.currency) || getCurrency()
    return {
      CURRENCYS,
      data: [],
      visible: false,
      loading: false,
      fd: {
        name: initNameValue,
        currency: initCurrencyValue,
      },
      rules: {
        name: [
          { required: true, message: this.$t('dashboard.text_8') },
        ],
      },
    }
  },
  computed: {
    ...mapState('common', {
      currency: state => state.bill.currency,
      currencyOpts: state => state.bill.currencyOpts,
    }),
    ...mapGetters(['scope', 'userInfo']),
    allData () {
      const arr = this.data.filter(item => item.cost_type === 'all')
      return arr[0] || {}
    },
    currencySign () {
      return currencyUnitMap[this.fd.currency]?.sign || '¥'
    },
    currencyParams () {
      const { currency } = this.fd
      if (currency) {
        const params = {
          exchanged_currency: currency.replace('_', '').replace('*', ''),
          filter: [`currency.equals("${currency}")`],
        }
        if (currency.indexOf('_') !== -1) {
          params.filter = ''
        } else {
          params.exchanged_currency = ''
        }
        params.disable_cost_conversion = currency.indexOf('*') !== -1
        return params
      }
      return {}
    },
    outherData () {
      return this.data.filter(item => item.cost_type !== 'all').map(item => {
        const ret = {
          ...item,
          formatted_amount: numerify(item.amount, '0,0.00'),
          percent: this.getPercent(item.amount, this.allData.amount),
          value: item.amount,
        }
        ret.name = this.$te(`suggestsyRuleTypes.${ret.cost_type}`) ? this.$t(`suggestsyRuleTypes.${ret.cost_type}`) : ret.cost_type
        return ret
      })
    },
    chartOptions () {
      return {
        title: [
          {
            text: this.$t('dashboard.text_48'),
            subtext: `${this.currencySign}${numerify(this.allData.amount, '0,0.00')}`,
            textStyle: {
              fontSize: 12,
              color: '#ccc',
            },
            subtextStyle: {
              fontSize: 18,
              color: 'rgb(100, 100, 100)',
            },
            top: '42%',
            left: '24.5%',
            textAlign: 'center',
          },
        ],
        color: chartColors,
        legend: {
          type: 'scroll',
          pageIconSize: 8,
          icon: 'circle',
          orient: 'vertical',
          left: '50%',
          align: 'left',
          top: 'middle',
          itemHeight: 8,
          itemWidth: 8,
          textStyle: {
            rich: {
              name: {
                verticalAlign: 'right',
                align: 'left',
                fontSize: 12,
                color: 'rgb(100, 100, 100)',
                height: 20,
              },
              percent: {
                align: 'left',
                color: '#ADD1F3',
                borderWidth: 1,
                borderColor: '#ADD1F3',
                padding: [3, 5, 3, 5],
              },
              formatted_amount: {
                align: 'left',
                fontSize: 12,
                color: 'rgb(150, 150, 150)',
                padidng: 0,
              },
            },
          },
          height: '90%',
          formatter: name => {
            const item = R.find(R.propEq('name', name))(this.outherData)
            if (item) {
              return `{name|${name}}\n{formatted_amount|${this.currencySign}${item.formatted_amount}}  {percent|${item.percent}%}`
            }
            return name
          },
        },
        series: [
          {
            name: this.$t('dashboard.text_49'),
            type: 'pie',
            center: ['25%', '50%'],
            radius: ['50%', '65%'],
            hoverAnimation: false,
            label: {
              normal: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: this.outherData,
          },
        ],
      }
    },
    newCurrencys () {
      return this.currencyOpts.map(val => {
        const localItem = currencyUnitMap[val.item_id]
        const text = localItem ? localItem.label : val.item_name
        const currencyItem = { ...val }
        if (val.item_id.indexOf('*_') !== -1) {
          currencyItem.item_name = this.$t('bill.show_origin_2', [val.item_name.replace('*_', '')])
        } else if (val.item_id.indexOf('_') !== -1) {
          currencyItem.item_name = this.$t('bill.text_287', [val.item_name.replace('_', '')])
        } else if (val.item_id.indexOf('*') !== -1) {
          currencyItem.item_name = this.$t('bill.show_origin_1', [val.item_name.replace('*', '')])
        } else {
          currencyItem.item_name = this.$t('bill.text_39', [text])
        }
        return currencyItem
      })
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
  watch: {
    'fd.currency' (val) {
      this.fetchData()
    },
  },
  created () {
    if (this.params && !this.params.currency) {
      this.fd.currency = this.currency
    }
    this.fetchData()
    this.$emit('update', this.options.i, {
      ...this.fd,
    })
  },
  methods: {
    refresh () {
      return this.fetchData()
    },
    async fetchData () {
      if (!this.hasMeterService) {
        return
      }
      this.loading = true
      try {
        const data = await load({
          res: 'quotas',
          actionArgs: {
            url: '/v1/suggestsysalerts/cost',
            method: 'GET',
            params: {
              $t: getRequestT(),
              details: true,
              scope: this.scope,
              ...this.currencyParams,
            },
          },
          useManager: false,
          resPath: 'data.suggest_cost',
        })
        this.data = data || []
        this.data.sort(this.compareData)
      } finally {
        this.loading = false
      }
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
    getPercent (num, den) {
      const percent = (num / den) * 100
      if (percent && percent < 10) {
        return percent.toFixed(1)
      }
      return `${numerify(percent, 'percent')}`
    },
    compareData (a, b) {
      if (a.amount > b.amount) {
        return -1
      } else if (a.amount < b.amount) {
        return 1
      } else {
        return 0
      }
    },
  },
}
</script>
