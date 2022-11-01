import Overview from '@Monitor/views/overview'
import CommonalertsIndex from '@Monitor/views/commonalert'
import commonalertsCreate from '@Monitor/views/commonalert/create'
import commonalertsUpdate from '@Monitor/views/commonalert/update'
import MonitorresourcesIndex from '@Monitor/views/monitorresource'
import AlertresourceIndex from '@Monitor/views/alertresource'
import AlertrecordIndex from '@Monitor/views/alertrecord'
import Explorer from '@Monitor/views/explorer'
import Dashboard from '@Monitor/views/dashboard'
import MonitorDashboardChartCreate from '@Monitor/views/dashboard/create'
import AlertRecordShieldsIndex from '@Monitor/views/alertrecordshields'
import Layout from '@/layouts/RouterView'
//import { setupKeys } from '@/utils/auth'
import i18n from '@/locales'
//import store from '@/store'
//import { isScopedPolicyMenuHidden } from '@/utils/scopedPolicy'

export default {
  index: 65,
  meta: {
    label: i18n.t('monitor.text_0'),
    icon: 'menu-monitor',
  },
  menus: [
    {
      path: '/monitoroverview',
      meta: {
        label: i18n.t('monitor.text_18'),
      },
      component: Overview,
    },
    {
      meta: {
        label: i18n.t('monitor.monitorresources'),
        t: 'dictionary.monitorresources',
      },
      submenus: [
        {
          path: '/monitorresources-guest',
          meta: {
            label: i18n.t('common.server'),
          },
          component: Layout,
          children: [
            {
              name: 'MonitorresourcesGuest',
              path: '',
              props: { res_type: 'guest' },
              component: MonitorresourcesIndex,
            },
          ],
        },
        {
          path: '/monitorresources-host',
          meta: {
            label: i18n.t('dictionary.host'),
          },
          component: Layout,
          children: [
            {
              name: 'MonitorresourcesHost',
              path: '',
              props: { res_type: 'host' },
              component: MonitorresourcesIndex,
            },
          ],
        },
      ],
    },
    {
      meta: {
        label: i18n.t('monitor.monitor_metric'),
        t: 'dictionary.monitor_metrics',
      },
      submenus: [
        {
          name: 'Query',
          meta: {
            label: i18n.t('monitor.dashboard.title'),
          },
          path: '/monitor-dashboard',
          component: Layout,
          children: [
            {
              name: 'MonitorDashboard',
              path: '',
              component: Dashboard,
            },
            {
              name: 'MonitorDashboardChartCreate',
              path: 'create',
              component: MonitorDashboardChartCreate,
            },
            {
              name: 'MonitorDashboardChartUpdate',
              path: ':id/update',
              component: MonitorDashboardChartCreate,
            },
          ],
        },
        {
          name: 'Query',
          meta: {
            label: i18n.t('monitor.text_119'),
          },
          path: '/explorer',
          component: Explorer,
        },
      ],
    },
    {
      meta: {
        label: i18n.t('monitor.text_1'),
        t: 'dictionary.monitor_commonalert',
      },
      submenus: [
        {
          path: '/commonalerts',
          meta: {
            label: i18n.t('monitor.text_2'),
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
            label: i18n.t('monitor.text_17'),

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
          path: '/monitorresourcealerts',
          meta: {
            label: i18n.t('monitor.text_2'),
            t: 'dictionary.monitorresourcealerts',
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
