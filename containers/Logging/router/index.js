import Layout from '@/layouts/RouterView'
//import { setupKeys } from '@/utils/auth'
import i18n from '@/locales'
//import store from '@/store'
//import { isScopedPolicyMenuHidden } from '@/utils/scopedPolicy'

export default {
  index: 65,
  meta: {
    label: i18n.t('logging.text_0'),
    icon: 'menu-logging',
  },
  menus: [
    {
      path: '/loggingoverview',
      meta: {
        label: i18n.t('logging.text_18'),
      },
      component: Layout,
    },
    {
      meta: {
        label: i18n.t('logging.loggingresources'),
        t: 'dictionary.loggingresources',
      },
      submenus: [
        {
          path: '/loggingresources-guest',
          meta: {
            label: i18n.t('common.server'),
          },
          component: Layout,
          ],
        },
        {
          path: '/loggingresources-host',
          meta: {
            label: i18n.t('dictionary.host'),
          },
          component: Layout,
        },
      ],
    },
    {
      meta: {
        label: i18n.t('logging.logging_metric'),
        t: 'dictionary.logging_metrics',
      },
      submenus: [
        {
          name: 'Query',
          meta: {
            label: i18n.t('logging.dashboard.title'),
          },
          path: '/logging-dashboard',
          component: Layout,
        },
        {
          name: 'Query',
          meta: {
            label: i18n.t('logging.text_119'),
          },
          path: '/explorer',
          component: Explorer,
        },
      ],
    },
    {
      meta: {
        label: i18n.t('logging.text_1'),
        t: 'dictionary.logging_commonalert',
      },
      submenus: [
        {
          path: '/commonalerts',
          meta: {
            label: i18n.t('logging.text_2'),
            t: 'dictionary.commonalert',
          },
          component: Layout,
        },
        {
          path: '/alertrecord',
          meta: {
            label: i18n.t('dictionary.alertrecord'),
          },
          component: Layout,
        },
        {
          path: '/alertresource',
          meta: {
            label: i18n.t('logging.text_17'),

          },
          component: Layout,
        },
        {
          path: '/loggingresourcealerts',
          meta: {
            label: i18n.t('logging.text_2'),
            t: 'dictionary.loggingresourcealerts',
          },
          component: Layout,
        },
      ],
    },
  ],
}
