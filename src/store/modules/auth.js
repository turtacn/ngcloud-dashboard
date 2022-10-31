import * as R from 'ramda'
import _ from 'lodash'
import http from '@/utils/http'
import { PERMISSION, ALL_RESOURCES } from '@/constants/permission'
import {
  getTokenFromCookie,
  decodeToken,
  getRegionFromCookie,
  setRegionInCookie,
  setHistoryUsersInStorage,
  getScopeFromCookie,
  getTenantFromCookie,
  setTenantInCookie,
  setScopeInCookie,
  removeTenantInCookie,
  removeScopeInCookie,
  getHistoryUsersFromStorage,
  getLoggedUsersFromStorage,
  setLoggedUsersInStorage,
  getSsoIdpIdFromCookie,
  setLoginModeInStorage,
} from '@/utils/auth'
import { SCOPES_MAP } from '@/constants'
import router from '@/router'
import { removeKeyIgnoreCase, getKeyIgnoreCase } from '@/utils/utils'

const initialState = {
  scope: getScopeFromCookie() || 'project',
  tenant: getTenantFromCookie(),
  region: getRegionFromCookie(),
  token: getTokenFromCookie(),
  auth: decodeToken(getTokenFromCookie()) || {},
  info: {
    projectId: '',
    projects: [],
    domain: {},
  },
  permission: null,
  scopeResource: null,
  capability: {},
  stats: {},
  regions: {
    captcha: false,
    domains: [],
    idps: [],
    regions: [],
    api_server: '',
  },
  registersStatus: true,
  // loggedUsers记录的key为username + domain，是获取用户信息之后记录的
  // historyUsers记录的key为username，是登录成功之前记录的
  historyUsers: getHistoryUsersFromStorage() || {},
  loggedUsers: getLoggedUsersFromStorage() || {},
  // 提交的登录表单数据
  loginFormData: {},
  canRenderDefaultLayout: false,
  noActionLogoutSeconds: 0,
}

export default {
  state: {
    ...initialState,
  },
  mutations: {
    SET_SCOPE (state, payload) {
      setScopeInCookie(payload)
      state.scope = payload
    },
    SET_TENANT (state, payload) {
      setTenantInCookie(payload)
      state.tenant = payload
    },
    SET_REGION (state, payload) {
      setRegionInCookie(payload)
      state.region = payload
    },
    RESET_COOKIE (state, payload) {
      state.scope = 'project'
      state.tenant = ''
      removeTenantInCookie()
      removeScopeInCookie()
    },
    UPDATE_AUTH (state) {
      const token = getTokenFromCookie()
      const auth = decodeToken(token)
      state.token = token
      state.auth = auth
    },
    SET_INFO (state, payload) {
      state.info = payload
    },
    SET_CAPABILITY (state, payload) {
      state.capability = payload
    },
    SET_STATS (state, payload) {
      state.stats = payload
    },
    SET_PERMISSION (state, payload) {
      state.permission = payload
    },
    SET_SCOPERESOURCE (state, payload) {
      state.scopeResource = payload
    },
    SET_REGIONS (state, payload) {
      state.regions = payload
    },
    SET_REGISTERS_STATUS (state, payload) {
      state.registersStatus = payload
    },
    SET_LOGIN_FORM_DATA (state, payload) {
      state.loginFormData = payload
    },
    UPDATE_HISTORY_USERS (state, payload) {
      const newVal = { ...state.historyUsers }
      if (payload.action === 'delete') {
        removeKeyIgnoreCase(newVal, payload.key)
      } else {
        const key = payload.key || (state.info.name.toLowerCase() + '@' + state.info.domain.name.toLowerCase())
        const oldVal = getKeyIgnoreCase(newVal, key)
        removeKeyIgnoreCase(newVal, key)
        const data = {
          ...oldVal,
          ...payload.value,
        }
        // 设置创建时间
        const timestamp = +new Date()
        if (!_.get(data, 'create_time')) {
          _.set(data, 'create_time', timestamp)
        }
        // 设置更新时间
        _.set(data, 'update_time', timestamp)
        // 最多存储5条纪录，超过5则移除掉创建时间最早的
        if (Object.keys(newVal).length > 5) {
          const newValArr = Object.entries(newVal)
          const oldestUser = _.minBy(newValArr, o => o[1].create_time)
          oldestUser[0] && delete newVal[oldestUser[0]]
        }
        if (payload.action === 'unset') {
          _.unset(data, payload.path)
        }
        newVal[key] = data
      }
      setHistoryUsersInStorage(newVal)
      state.historyUsers = newVal
    },
    UPDATE_LOGGED_USERS (state, payload) {
      // 如果是sso登录则不保存信息
      // if (state.auth && state.auth.is_sso) return
      const newVal = { ...state.loggedUsers }
      if (payload.action === 'delete') {
        removeKeyIgnoreCase(newVal, payload.key)
      } else {
        const key = payload.key || (state.info.name.toLowerCase() + '@' + state.info.domain.name.toLowerCase())
        const oldVal = getKeyIgnoreCase(newVal, key)
        removeKeyIgnoreCase(newVal, key)
        const data = {
          ...oldVal,
          ...payload.value,
        }
        // 设置创建时间
        const timestamp = +new Date()
        if (!_.get(data, 'create_time')) {
          _.set(data, 'create_time', timestamp)
        }
        // 设置更新时间
        _.set(data, 'update_time', timestamp)
        // 最多存储5条纪录，超过5则移除掉创建时间最早的
        if (Object.keys(newVal).length > 5) {
          const newValArr = Object.entries(newVal)
          const oldestUser = _.minBy(newValArr, o => o[1].create_time)
          oldestUser[0] && delete newVal[oldestUser[0]]
        }
        if (payload.action === 'unset') {
          _.unset(data, payload.path)
        }
        newVal[key] = data
      }
      setLoggedUsersInStorage(newVal)
      state.loggedUsers = newVal
    },
    SET_CAN_RENDER_DEFAULT_LAYOUT (state, payload) {
      state.canRenderDefaultLayout = payload
    },
    LOGOUT (state) {
      state.token = null
      state.auth = {}
      state.loginFormData = {}
      state.info = { ...initialState.info }
      state.permission = null
      state.scopeResource = null
      state.capability = {}
      state.stats = {}
      state.canRenderDefaultLayout = false
    },
    SET_NO_ACTION_LOGOUT_SECONDS (state, payload) {
      state.noActionLogoutSeconds = payload
    },
    CLEAR_LOGGED_USERS (state) {
      setLoggedUsersInStorage({})
      state.loggedUsers = {}
    },
  },
  getters: {
    // 是否切换到管理后台
    isAdmin (state) {
      return state.scope === SCOPES_MAP.system.key
    },
    // 是否切换到域管理后台
    isDomain (state) {
      return state.scope === SCOPES_MAP.domain.key
    },
    // 当前用户是否有含有 system 权限 项目
    isSystemAdmin (state) {
      return state.info.projects.some(item => item.id === state.info.projectId && item.system_capable)
    },
    // 当前用户是否有含有 domain 权限 项目
    isDomainAdmin (state) {
      return state.info.projects.some(item => item.id === state.info.projectId && item.domain_capable)
    },
    // 是否在管理后台视图下
    isAdminMode (state, getters) {
      return getters.isAdmin && getters.isSystemAdmin
    },
    // 是否在域管理后台视图下
    isDomainMode (state, getters) {
      return getters.isDomain && getters.isDomainAdmin
    },
    // 是否在项目视图下
    isProjectMode (state, getters) {
      return !getters.isAdminMode && !getters.isDomainMode
    },
    l3PermissionEnable (state) {
      return state.info.non_default_domain_projects
    },
    currentScopeResource (state, getters) {
      const ret = [...ALL_RESOURCES]
      const systemResource = state.scopeResource && state.scopeResource.system
      const domainResource = state.scopeResource && state.scopeResource.domain
      // 如果为管理后台返回所有的资源
      if (getters.isAdminMode) {
        return ret
      }
      // 如果为域管理后台返回所有资源减去管理的资源
      if (getters.isDomainMode) {
        _.remove(ret, resource => {
          return systemResource && systemResource.includes(resource)
        })
        return ret
      }
      // 如果为普通后台减去管理资源和域资源
      _.remove(ret, resource => {
        return (
          (systemResource && systemResource.includes(resource)) ||
          (domainResource && domainResource.includes(resource))
        )
      })
      return ret
    },
    currentLoggedUserKey (state) {
      return `${state.info.name.toLowerCase()}@${state.info.domain.name.toLowerCase()}`
    },
    currentHistoryUserKey (state) {
      return state.auth.user || state.loginFormData.username
    },
  },
  actions: {
    async login ({ commit, state, dispatch }, data) {
      try {
        const _data = { ...data }
        let matchedUser
        if (_data.username) {
          if (_data.domain) {
            matchedUser = _.get(state.loggedUsers, `${_data.username}@${_data.domain}`) || _.get(state.historyUsers, _data.username)
          } else {
            matchedUser = _.get(state.historyUsers, _data.username)
          }
        }
        if (matchedUser) {
          _data.username = `${matchedUser.tenant}/${_data.username}`
          if (matchedUser.tenant) {
            await commit('SET_TENANT', matchedUser.tenant)
          }
          if (matchedUser.scope) {
            await commit('SET_SCOPE', matchedUser.scope)
          }
        } else {
          await commit('RESET_COOKIE')
        }
        const response = await http.post('/v1/auth/login', _data)
        await commit('UPDATE_AUTH')
        const newCurrentHistoryUserStorageValue = {
          scope: getScopeFromCookie(),
          tenant: getTenantFromCookie(),
        }
        await commit('SET_SCOPE', newCurrentHistoryUserStorageValue.scope)
        await commit('SET_TENANT', newCurrentHistoryUserStorageValue.tenant)
        if (data.username) {
          await commit('UPDATE_HISTORY_USERS', {
            key: data.username,
            value: newCurrentHistoryUserStorageValue,
          })
        }
        await commit('scopedPolicy/DEL_DATA', {
          name: 'sub_hidden_menus',
        })
        // 本地存储记录登录方式信息，下次登录默认使用该方式登录 {mode: 'account|mobile', content: 'username|phone number'}
        const { mobile, username } = data
        setLoginModeInStorage({ mode: mobile ? 'mobile' : 'account', content: mobile || username })
        return response.data
      } catch (error) {
        throw error
      }
    },
    async logout ({ commit, state }, data) {
      try {
        const response = await http.post('/v1/auth/logout', data)
        await commit('LOGOUT')
        await commit('RESET_COOKIE')
        await commit('profile/REST_ID', null, { root: true })
        await commit('common/REST_BILL_CURRENCY', null, { root: true })
        await commit('scopedPolicy/DEL_DATA', { name: 'sub_hidden_menus' }, { root: true })
        await commit('monitor/setMonitorResourceAlerts', [], { root: true })
        const { regions = {} } = state
        const { is_forget_login_user } = regions
        if (is_forget_login_user) {
          await commit('CLEAR_LOGGED_USERS')
        }
        return response.data
      } catch (error) {
        throw error
      }
    },
    /**
     * @description Get user info
     */
    async getInfo ({ commit, state, getters }) {
      try {
        const response = await http.get('/v1/auth/user')
        if (!response.data) {
          throw new Error('Verification failed, please Login again.')
        }
        await commit('SET_INFO', response.data.data)
        await commit('UPDATE_LOGGED_USERS', {
          key: getters.currentLoggedUserKey,
          value: {
            displayname: state.info.displayname,
            projectName: state.info.projectName,
            projectDomain: state.info.projectDomain,
            domain: state.info.domain || {},
            scope: getScopeFromCookie(),
            tenant: getTenantFromCookie(),
            name: state.info.name,
            isSSO: state.auth.is_sso,
            idpId: state.auth.is_sso ? getSsoIdpIdFromCookie() : null,
          },
        })
        return response.data.data
      } catch (error) {
        throw error
      }
    },
    async getCapabilities ({ commit, state }) {
      try {
        const response = await http.get('/v2/capabilities', {
          params: {
            scope: state.scope,
          },
        })
        const data = (response.data.data && response.data.data[0]) || {}
        await commit('SET_CAPABILITY', data)
        return response.data
      } catch (error) {
        throw error
      }
    },
    async getStats ({ commit, state }) {
      try {
        const response = await http.get('/v1/auth/stats', {
          params: {
            scope: state.scope,
          },
        })
        const data = response.data.data || {}
        await commit('SET_STATS', data)
        return response.data.data
      } catch (error) {
        throw error
      }
    },
    async getPermission ({ commit, state }) {
      try {
        const data = R.map(item => [state.scope, ...item], PERMISSION)
        const response = await http.post('/v1/auth/permissions', data)
        await commit('SET_PERMISSION', response.data)
        return response.data
      } catch (error) {
        throw error
      }
    },
    async getScopeResource ({ commit }) {
      try {
        const response = await http.get('/v1/auth/scoped_resources')
        const data = R.map(item => {
          return R.flatten(R.values(item))
        }, response.data)
        await commit('SET_SCOPERESOURCE', data)
        return response.data
      } catch (error) {
        throw error
      }
    },
    async getRegions ({ commit, state }, params) {
      try {
        const response = await http.get('/v1/auth/regions', {
          params: params,
        })
        // 如果当前region不在regions列表中，则重新设置region
        const regions = response.data.regions
        if (
          (state.region && !regions.includes(state.region)) ||
          !state.region
        ) {
          commit('SET_REGION', regions[0])
        }
        await commit('SET_REGIONS', response.data)
        return response.data
      } catch (error) {
        throw error
      }
    },
    async getRegistersStatus ({ commit }) {
      try {
        const response = await http.get('/v1/registers/status')
        await commit('SET_REGISTERS_STATUS', response.data.status === 'true')
        return response.data
      } catch (error) {
        throw error
      }
    },
    // 登录后所做的后续处理
    async onAfterLogin ({ commit, state, dispatch, getters }, payload) {
      const totp_on = state.auth.totp_on
      const system_totp_on = state.auth.system_totp_on
      const totp_verified = state.auth.totp_verified
      const totp_init = state.auth.totp_init
      // 如果获取到有效的二维码且开启了totp则进入首次初始化页面
      if (
        totp_on &&
        system_totp_on &&
        !totp_verified &&
        !totp_init
      ) {
        // 获取密码问题，如果设置过则直接进入绑定秘钥页面，没有跳转至设置密码问题页面
        try {
          const recovery = await dispatch('getRecovery')
          if (recovery) {
            router.replace({
              path: '/auth/bindsecret',
              query: {
                rf: router.currentRoute.query.rf,
              },
            })
          }
        } catch (error) {
          if (error.response.status === 404) {
            router.replace({
              path: '/auth/setsecretquestion',
              query: {
                rf: router.currentRoute.query.rf,
              },
            })
          }
          throw error
        }
      } else if (
        !_.get(state.historyUsers, [getters.currentHistoryUserKey, 'secret']) &&
        totp_on &&
        system_totp_on &&
        !totp_verified &&
        totp_init
      ) {
        router.replace({
          path: '/auth/secretverify',
          query: {
            rf: router.currentRoute.query.rf,
          },
        })
      } else if (
        _.get(state.historyUsers, [getters.currentHistoryUserKey, 'secret']) &&
        totp_on &&
        system_totp_on &&
        !totp_verified &&
        totp_init
      ) {
        router.replace({
          path: '/auth/bindsecret',
          query: {
            rf: router.currentRoute.query.rf,
          },
        })
      } else {
        const { rf, pathAuthPage, pathAuth, path, pathQuery } = router.currentRoute.query
        if (rf) {
          document.location.href = rf
          return
        }
        if (!pathAuthPage && pathAuth && path) {
          router.replace({
            path,
            query: pathQuery && JSON.parse(pathQuery),
          })
        } else {
          router.replace('/')
        }
      }
    },
    async validPasscode ({ commit }, data) {
      try {
        const response = await http.post('/v1/auth/passcode', data)
        return response.data
      } catch (error) {
        throw error
      }
    },
    async getRecovery ({ commit }, params) {
      try {
        const response = await http.get('/v1/auth/recovery', { params })
        return response.data
      } catch (error) {
        throw error
      }
    },
    async setRecovery ({ commit }, data) {
      try {
        const response = await http.post('/v1/auth/recovery', data)
        return response.data
      } catch (error) {
        throw error
      }
    },
    async credential ({ commit }, data) {
      try {
        const response = await http.post('/v1/auth/credential', data)
        return response.data
      } catch (error) {
        throw error
      }
    },
    async initcredential ({ commit, getters }, data) {
      try {
        const response = await http.post('/v1/auth/initcredential', data)
        await await commit('UPDATE_HISTORY_USERS', {
          key: getters.currentHistoryUserKey,
          value: {
            secret: response.data.qrcode,
          },
        })
        return response.data
      } catch (error) {
        throw error
      }
    },
  },
}
