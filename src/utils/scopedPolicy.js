import get from 'lodash/get'
import store from '@/store'

export const isScopedPolicyMenuHidden = (path) => {
  get(store.getters.scopedPolicy, path, false)
}

export const getScopedPolicyMenuHook = (path) => {
  return get(store.getters.scopedPolicy, path)
}

export const openNewWindowForMenuHook = (path, cb) => {
  const link = getScopedPolicyMenuHook(path)
  if (link) {
    return window.open(link, '_blank')
  }
  cb && cb()
}
