import * as R from 'ramda'
// import moment from 'moment'
import Cookies from 'js-cookie'
import { Base64 } from 'js-base64'
import store from '@/store'
import { typeClouds } from '@/utils/common/hypervisor'
import storage from '@/utils/storage'

const ONECLOUD_AUTH_KEY = 'yunionauth'
const HISTORY_USERS_STORAGE_KEY = '__oc_history_users__'
const LOGGED_USERS_STORAGE_KEY = '__oc_logged_users__'
const ENABLE_SETUP_STORAGE_KEY = '__oc_enable_setup__'

export function getTokenFromCookie () {
  return Cookies.get(ONECLOUD_AUTH_KEY)
}

export function setTokenInCookie (token) {
  return Cookies.set(ONECLOUD_AUTH_KEY, token)
}

export function getScopeFromCookie () {
  return Cookies.get('scope')
}

export function setScopeInCookie (scope) {
  return Cookies.set('scope', scope, { expires: 7 })
}

export function removeScopeInCookie () {
  return Cookies.remove('scope')
}

export function getTenantFromCookie () {
  return Cookies.get('tenant')
}

export function setTenantInCookie (tenant) {
  return Cookies.set('tenant', tenant, { expires: 7 })
}

export function removeTenantInCookie () {
  return Cookies.remove('tenant')
}

export function getRegionFromCookie () {
  return Cookies.get('region')
}

export function setRegionInCookie (region) {
  return Cookies.set('region', region, { expires: 7 })
}

export function removeRegionInCookie () {
  return Cookies.remove('region')
}

export function getHistoryUsersFromStorage () {
  return storage.get(HISTORY_USERS_STORAGE_KEY)
}

export function setHistoryUsersInStorage (users) {
  return storage.set(HISTORY_USERS_STORAGE_KEY, users)
}

export function setSetupInStorage (val) {
  return storage.set(ENABLE_SETUP_STORAGE_KEY, val)
}

export function removeSetupInStorage () {
  return storage.remove(ENABLE_SETUP_STORAGE_KEY)
}

export function getSetupInStorage () {
  return storage.get(ENABLE_SETUP_STORAGE_KEY)
}

export function getLoggedUsersFromStorage () {
  return storage.get(LOGGED_USERS_STORAGE_KEY)
}

export function setLoggedUsersInStorage (users) {
  return storage.set(LOGGED_USERS_STORAGE_KEY, users)
}

export function decodeToken (token) {
  if (token) {
    const auth = Base64.decode(token)
    if (auth) {
      try {
        return JSON.parse(auth)
      } catch (error) {
        console.warn('Parse auth failed, please re login')
      }
    }
  }
  return null
}

// export function isLogged () {
//   let token = getTokenFromCookie()
//   if (token) {
//     const auth = Base64.decode(token)
//     if (auth) {
//       try {
//         const obj = JSON.parse(auth)
//         const diff = moment(obj.exp).diff(moment(), 'seconds')
//         if (diff > 0) {
//           return true
//         }
//       } catch (error) {
//         return false
//       }
//     }
//   }
//   return false
// }

export function hasPermission ({
  key,
  // 资源数据
  resourceData,
}) {
  // 没有声明定义的权限key，默认认为有权限
  if (!key) return true
  // 支持检验一组定义的权限key，如 'server_list,server_create'
  const keys = key.split(',')
  const has = keys.every(item => {
    // 这里只判断无权限的情况
    // 获取当前的key对应的权限结果
    const pArr = store.getters.permission && store.getters.permission[item]
    if (pArr && pArr.length > 0) {
      // 如果当前的权限的资源不包含此资源直接不显示
      if (!store.getters.currentScopeResource.includes(pArr[1])) return false
      // 权限值 allow, guest, user, deny
      const val = pArr[pArr.length - 1]
      if (val === 'deny') {
        return false
      }
      if (resourceData && !store.getters.isAdminMode && !store.getters.isDomainMode) {
        if (val === 'allow') {
          const action = pArr[2]
          if (resourceData.fingerprint && resourceData.public_key && resourceData.scheme) {
            return true
          }
          if (
            (resourceData.tenant_id && resourceData.tenant_id === store.getters.userInfo.projectId) ||
            (resourceData.is_public && resourceData.is_public === true && action === 'get')
          ) {
            return true
          } else {
            return false
          }
        }
      }
      if (val === 'guest' || val === 'user' || val === 'allow') {
        const isSystemResource = store.getters.scopeResource && store.getters.scopeResource.system.includes(pArr[1])
        const isDomainResource = store.getters.scopeResource && store.getters.scopeResource.domain.includes(pArr[1])
        if (isSystemResource) {
          if (!store.getters.isAdminMode) {
            return false
          }
        }
        if (isDomainResource) {
          if (!store.getters.isDomainMode && !store.getters.isAdminMode) {
            return false
          }
        }
      }
    }
    // 默认有权限
    return true
  })
  return has
}

export function hasServices (services) {
  const s = R.is(String, services) ? [services] : services
  return s.some(item => {
    const r = (store.getters.userInfo.services || []).find(v => v.type === item && v.status === true)
    return !!r
  })
}

export function hasHypervisors (hypervisors) {
  const h = R.is(String, hypervisors) ? [hypervisors] : hypervisors
  return h.some(item => (store.getters.capability.hypervisors || []).includes(item))
}

export function hasBrands (brands) {
  const b = R.is(String, brands) ? [brands] : brands
  return b.some(item => (store.getters.capability.brands || []).includes(item))
}

export function hasHypervisorsByEnv (envs) {
  const envsMap = {
    idc: [],
    private: [],
    public: [],
    baremetal: ['baremetal'],
  }
  R.forEachObjIndexed((val, key) => {
    envsMap[val.env].push(key)
  }, typeClouds.getHypervisor())
  if (R.is(String, envs)) {
    return hasHypervisors(envsMap[envs])
  }
  if (R.is(Array, envs)) {
    return envs.some(t => hasHypervisors(envsMap[t]))
  }
}

export function hasBrandsByEnv (envs) {
  const envsMap = {
    idc: [],
    private: [],
    public: [],
  }
  R.forEachObjIndexed((val, key) => {
    envsMap[val.env].push(key)
  }, typeClouds.getBrand())
  if (R.is(String, envs)) {
    return hasBrands(envsMap[envs])
  }
  if (R.is(Array, envs)) {
    return envs.some(t => hasBrands(envsMap[t]))
  }
}

export function hasSetupKey (envs) {
  const { globalSetting = {} } = store.state
  if (!globalSetting || !globalSetting.value || !globalSetting.value.setupKeys || globalSetting.value.setupKeys.length === 0) return true
  const _envs = R.type(envs) === 'String' ? [envs] : envs
  if (!_envs.length) return true
  const { setupKeys } = globalSetting.value
  let f = false
  for (let i = 0; i < _envs.length; i++) {
    const env = _envs[i]
    if (setupKeys.indexOf(env) > -1) {
      f = true
      break
    }
  }
  return f
}
