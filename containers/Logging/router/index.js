import Overview from '@Logging/views/overview'
import CommonalertsIndex from '@Logging/views/commonalert'
import commonalertsCreate from '@Logging/views/commonalert/create'
import commonalertsUpdate from '@Logging/views/commonalert/update'
import LoggingresourcesIndex from '@Logging/views/loggingresource'
import AlertresourceIndex from '@Logging/views/alertresource'
import AlertrecordIndex from '@Logging/views/alertrecord'
import Explorer from '@Logging/views/explorer'
import Dashboard from '@Logging/views/dashboard'
import LoggingDashboardChartCreate from '@Logging/views/dashboard/create'
import AlertRecordShieldsIndex from '@Logging/views/alertrecordshields'
import Layout from '@/layouts/RouterView'
//import { setupKeys } from '@/utils/auth'
import i18n from '@/locales'
//import store from '@/store'
//import { isScopedPolicyMenuHidden } from '@/utils/scopedPolicy'

export default {
  index: 66,
  meta: {
    label: i18n.t('logging.text_0'),
    icon: 'menu-monitor',
  },
  menus: [
    {
      path: '/loggingoverview',
      meta: {
        label: i18n.t('logging.text_18'),
      },
      component: Overview,
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
          children: [
            {
              name: 'LoggingresourcesGuest',
              path: '',
              props: { res_type: 'guest' },
              component: LoggingresourcesIndex,
            },
          ],
        },
        {
          path: '/loggingresources-host',
          meta: {
            label: i18n.t('dictionary.host'),
          },
          component: Layout,
          children: [
            {
              name: 'LoggingresourcesHost',
              path: '',
              props: { res_type: 'host' },
              component: LoggingresourcesIndex,
            },
          ],
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
          children: [
            {
              name: 'LoggingDashboard',
              path: '',
              component: Dashboard,
            },
            {
              name: 'LoggingDashboardChartCreate',
              path: 'create',
              component: LoggingDashboardChartCreate,
            },
            {
              name: 'LoggingDashboardChartUpdate',
              path: ':id/update',
              component: LoggingDashboardChartCreate,
            },
          ],
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
          children: [
            {
              name: 'CommonalertsIndex',
              path: '',
              component: CommonalertsIndex,
            },
            {
              name: 'CommonalertCreate',
              path: 'create',
              component: commonalertsCreate,
            },
            {
              name: 'CommonalertUpdate',
              path: ':id/update',
              component: commonalertsUpdate,
            },
          ],
        },
        {
          path: '/alertrecord',
          meta: {
            label: i18n.t('dictionary.alertrecord'),
          },
          component: Layout,
          children: [
            {
              name: 'AlertrecordIndex',
              path: '',
              component: AlertrecordIndex,
            },
          ],
        },
        {
          path: '/alertresource',
          meta: {
            label: i18n.t('logging.text_17'),

          },
          component: Layout,
          children: [
            {
              name: 'alertresourceIndex',
              path: '',
              component: AlertresourceIndex,
            },
          ],
        },
        {
          path: '/loggingresourcealerts',
          meta: {
            label: i18n.t('logging.text_2'),
            t: 'dictionary.loggingresourcealerts',
          },
          component: Layout,
          children: [
            {
              name: 'AlertRecordShieldsIndex',
              path: '',
              component: AlertRecordShieldsIndex,
            },
          ],
        },
      ],
    },
  ],
}
