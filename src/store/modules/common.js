import Vue from 'vue'
import * as R from 'ramda'
import storage from '@/utils/storage'
import { getCurrency, setCookieVal, getExchangeRateAvailable, getCostConversionOrigin } from '@/utils/common/cookie'
import { Manager } from '@/utils/manager'

export default {
  state: {
    recentMenus: storage.get('__oc_recent_menus__') || [],
    topAlert: {},
    bill: {
      currency: getCurrency() || '',
      currencyOpts: [],
      exchangeRateAvailable: getExchangeRateAvailable() || true,
      costConversionOrigin: getCostConversionOrigin() || true,
      globalConfig: {},
    },
    k8s: {
      cluster: undefined,
      namespace: undefined,
    },
    lbRedirected: {},
    // 菜单栏
    sidebar: {},
    jsonschema: {
      sku: {},
    },
    globalConfig: {},
    openCloudShell: false,
    globalServices: [],
  },
  mutations: {
    UPDATE_OBJECT (state, { name, data }) {
      if (!state[name]) Vue.set(state, name, {})
      Vue.set(state, name, { ...state[name], ...data })
    },
    DELETE_OBJECT (state, { name, key }) {
      Vue.delete(state[name], key)
    },
    SET_BILL_CURRENCY (state, payload) {
      setCookieVal('currency', payload)
      state.bill.currency = payload
    },
    SET_BILL_CURRENCYOPTS (state, payload) {
      let currencyOpts = []
      if (!state.bill.exchangeRateAvailable) {
        currencyOpts = R.clone(payload)
      } else {
        // 添加以汇率为单位的某个账单
        currencyOpts = payload.map(item => {
          return {
            item_id: '_' + item.item_id,
            item_name: '_' + item.item_name,
          }
        })
      }
      if (state.bill.costConversionOrigin) {
        payload.map(item => {
          if ((process.env.BRAND?.en || '').toLowerCase() === 'multicloud') {
            if (item.item_id.indexOf('BRL') === -1) {
              currencyOpts.push({
                item_id: '*' + (state.bill.exchangeRateAvailable ? '_' : '') + item.item_id,
                item_name: '*' + (state.bill.exchangeRateAvailable ? '_' : '') + item.item_name,
              })
            }
          } else {
            currencyOpts.push({
              item_id: '*' + (state.bill.exchangeRateAvailable ? '_' : '') + item.item_id,
              item_name: '*' + (state.bill.exchangeRateAvailable ? '_' : '') + item.item_name,
            })
          }
        })
      }
      state.bill.currencyOpts = currencyOpts
    },
    SET_BILL_EXCHANGE_RATE_AVAILABLE (state, payload) {
      setCookieVal('exchangeRateAvailable', payload)
      state.bill.exchangeRateAvailable = payload
    },
    SET_BILL_COST_CONVERSION_ORIGIN (state, payload) {
      setCookieVal('costConversionOrigin', payload)
      state.bill.costConversionOrigin = payload
    },
    SET_K8S_CLUSTER (state, payload) {
      state.k8s.cluster = payload
    },
    SET_K8S_NAMESPACE (state, payload) {
      state.k8s.namespace = payload
    },
    REST_BILL_CURRENCY (state) {
      state.bill.currencyOpts = []
    },
    SET_GLOBAL_CONFIG (state, payload) {
      state.globalConfig = payload
    },
    SET_GLOBAL_BILL_CONFIG (state, payload) {
      state.bill.globalConfig = payload
    },
    SET_OPEN_CLOUDSHELL (state, payload) {
      state.openCloudShell = payload
    },
    SET_GLOBAL_SERVICE (state, payload) {
      state.globalServices = payload
    },
  },
  actions: {
    updateObject ({ commit }, payload) {
      commit('UPDATE_OBJECT', payload)
    },
    deleteObject ({ commit }, payload) {
      commit('DELETE_OBJECT', payload)
    },
    async fetchCurrency ({ commit, state, ...ret }, payload = {}) {
      try {
        const params = {
          query_type: 'currency',
          ...payload,
        }
        const { data: { data = [] } } = await new Manager('bill_conditions', 'v1').list({ params })
        commit('SET_BILL_EXCHANGE_RATE_AVAILABLE', data && data[0] ? data[0].exchange_rate_available || false : true)
        commit('SET_BILL_COST_CONVERSION_ORIGIN', data && data[0] ? data[0].cost_conversion_origin || false : true)
        commit('SET_BILL_CURRENCYOPTS', data)
        // 整理当前可展示类型列表，设置选中类型
        if (data && data.length > 0) {
          let currencyList = []
          if (data[0].exchange_rate_available) {
            data.map(item => {
              currencyList.push({
                item_id: '_' + item.item_id,
                item_name: '_' + item.item_name,
              })
            })
          } else {
            currencyList = data
          }
          if (data[0].cost_conversion_origin) {
            data.map(item => {
              if ((process.env.BRAND?.en || '').toLowerCase() === 'multicloud') {
                if (item.item_id.indexOf('BRL') === -1) {
                  currencyList.push({
                    item_id: '*' + (data[0].exchange_rate_available ? '_' : '') + item.item_id,
                    item_name: '*' + (data[0].exchange_rate_available ? '_' : '') + item.item_name,
                  })
                }
              } else {
                currencyList.push({
                  item_id: '*' + (data[0].exchange_rate_available ? '_' : '') + item.item_id,
                  item_name: '*' + (data[0].exchange_rate_available ? '_' : '') + item.item_name,
                })
              }
            })
          }
          const isExsit = currencyList.find(v => v.item_id === state.bill.currency)
          commit('SET_BILL_CURRENCY', isExsit ? state.bill.currency : currencyList[0].item_id)
        }
      } catch (error) {
        throw error
      }
    },
    async fetchGlobalConfig ({ commit }) {
      let manager = new Manager('services', 'v1')
      try {
        const response = await manager.list({
          params: {
            type: ['common', 'yunionapi', 'meter', 'identity'],
          },
        })
        const resData = response?.data?.data
        const commonId = resData.find(v => v.type === 'common')?.id || ''
        if (commonId) {
          const configResponse = await manager.getSpecific({
            id: commonId,
            spec: 'config',
          })
          const config = (configResponse.data.config && configResponse.data.config.default) || {}
          commit('SET_GLOBAL_CONFIG', config)
        }
        const yunionapiId = resData.find(v => v.type === 'yunionapi')?.id || ''
        if (yunionapiId) {
          const configResponse = await manager.getSpecific({
            id: yunionapiId,
            spec: 'config',
          })
          const config = (configResponse.data.config && configResponse.data.config.default) || {}
          commit('projectTags/SET_DATA', { name: 'enableOrganization', data: config.enable_organization }, { root: true })
        }
        const mneterId = resData.find(v => v.type === 'meter')?.id || ''
        if (mneterId) {
          const configResponse = await manager.getSpecific({
            id: mneterId,
            spec: 'config',
          })
          const config = (configResponse.data.config && configResponse.data.config.default) || {}
          commit('SET_GLOBAL_BILL_CONFIG', config)
        }
        const identityId = resData.find(v => v.type === 'identity')?.id || ''
        if (identityId) {
          const configResponse = await manager.getSpecific({
            id: identityId,
            spec: 'config',
          })
          const config = (configResponse.data.config && configResponse.data.config.default) || {}
          commit('auth/SET_NO_ACTION_LOGOUT_SECONDS', config.no_action_logout_seconds, { root: true })
        }
      } catch (error) {
        throw error
      } finally {
        manager = null
      }
    },
    async fetchGlobalServices ({ commit }, paramObj) {
      try {
        const response = await new Manager('services', 'v1').list({
          params: {
            type: ['common'],
            ...paramObj,
          },
        })
        const data = (response.data.data && response.data.data) || []
        commit('SET_GLOBAL_SERVICE', data)
      } catch (error) {
        throw error
      }
    },
  },
}
