import * as R from 'ramda'
import storage from '@/utils/storage'
import { getLanguage } from '@/utils/common/cookie'

const _l2MenuVisible = storage.get('__oc_l2_menu_visible__')

export default {
  language: getLanguage(),
  themeColor: storage.get('__oc_theme_color__') || process.env.THEME_COLOR || '#1890FF',
  theme: storage.get('__oc_theme__') || process.env.THEME || 'dark',
  brand: process.env.BRAND || { 'zh-CN': '下一代超融合云', en: 'YunionCloud' },
  l2MenuVisible: !R.isNil(_l2MenuVisible) && !R.isNil(_l2MenuVisible) ? _l2MenuVisible : true,
  monitorAlertNotifyTriggerTime: process.env.VUE_APP_MONITOR_ALERT_NOTIFY_TRIGGER_TIME || 1000 * 60 * 60, // 默认值1小时
  oemVersion: process.env.OEM_VERSION || process.env.VUE_APP_OEM_VERSION || '',
}
