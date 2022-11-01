import ProjectMapping from '@Cloudenv/views/projectmapping'
import Cloudgroup from '@Cloudenv/views/cloudgroup'
import Cloudaccount from '@Cloudenv/views/cloudaccount'
import CloudaccountCreate from '@Cloudenv/views/cloudaccount/create'
import CloudaccountUpdateBill from '@Cloudenv/views/cloudaccount/create/BillFileIndex'
import Proxysetting from '@Cloudenv/views/proxysetting'
import Layout from '@/layouts/RouterView'


import i18n from '@/locales'

export default {
  index: 90,
  meta: {
    label: i18n.t('cloudenv.text_8'),
    icon: 'menu-multicloud',
  },
  menus: [
    {
      meta: {
        label: i18n.t('cloudenv.text_12'),
      },
      submenus: [
        {
          path: '/cloudaccount',
          meta: {
            label: i18n.t('cloudenv.text_12'),
          },
          component: Layout,
          children: [
            {
              name: 'Cloudaccount',
              path: '',
              component: Cloudaccount,
            },
            {
              name: 'CloudaccountCreate',
              path: 'create',
              component: CloudaccountCreate,
            },
            {
              name: 'CloudaccountUpdateBill',
              path: 'updatebill',
              component: CloudaccountUpdateBill,
            },
          ],
        },
        {
          path: '/cloudgroup',
          meta: {
            label: i18n.t('cloudenv.text_491'),
            t: 'cloudenv.text_491',
          },
          component: Layout,
          children: [
            {
              name: 'Cloudgroup',
              path: '',
              component: Cloudgroup,
            },
          ],
        },
        {
          path: '/proxysetting',
          meta: {
            label: i18n.t('cloudenv.text_14'),
          },
          component: Layout,
          children: [
            {
              name: 'Proxysetting',
              path: '',
              component: Proxysetting,
            },
          ],
        },
        {
          path: '/projectmapping',
          meta: {
            label: i18n.t('cloudenv.text_580'),
          },
          component: Layout,
          children: [
            {
              name: 'ProjectMapping',
              path: '',
              component: ProjectMapping,
            },
          ],
        },
      ],
    },
    // {
    //   meta: {
    //     label: i18n.t('cloudenv.price_comparison'),
    //     hidden: () => {
    //       return !hasSetupKey(['onestack', 'private', 'public', 'vmware'])
    //     },
    //   },
    //   submenus: [
    //     {
    //       path: '/servercomparator',
    //       meta: {
    //         label: i18n.t('compute.text_91'),
    //       },
    //       component: Layout,
    //       children: [
    //         {
    //           name: 'ServerPriceComparatorCreate',
    //           path: '',
    //           component: ServerPriceComparatorCreate,
    //         },
    //       ],
    //     },
    //     {
    //       path: '/pricecomparator',
    //       meta: {
    //         label: i18n.t('cloudenv.price_list'),
    //       },
    //       component: Layout,
    //       children: [
    //         {
    //           name: 'PriceComparatorList',
    //           path: '',
    //           component: PriceComparatorList,
    //         },
    //       ],
    //     },
    //   ],
    // },
    /* {
      meta: {
        label: i18n.t('cloudenv.text_499'),
        hidden: () => !hasSetupKey(['onestack', 'private', 'public', 'vmware']),
      },
      submenus: [
        {
          path: '/strategyallocation',
          meta: {
            label: i18n.t('cloudenv.text_500'),
            permission: 'scopedpolicies_list',
          },
          component: Layout,
          children: [
            {
              name: 'Strategyallocation',
              path: '',
              component: Strategyallocation,
            },
          ],
        },
        {
          path: '/strategydefinition',
          meta: {
            label: i18n.t('cloudenv.text_501'),
            permission: 'scopedpolicies_list',
          },
          component: Layout,
          children: [
            {
              name: 'Strategydefinition',
              path: '',
              component: Strategydefinition,
            },
            {
              name: 'StrategydefinitionCreate',
              path: 'create',
              component: StrategydefinitionCreate,
            },
          ],
        },
      ],
    }, */
    /* {
      meta: {
        label: i18n.t('cloudenv.text_21'),
        hidden: true,
      },
      submenus: [
        {
          path: '/policydefinition',
          meta: {
            label: i18n.t('cloudenv.text_21'),
            permission: 'policydefinitions_list',
            hidden: () => !hasSetupKey(['onestack', 'openstack', 'dstack', 'zstack', 'vmware']),
          },
          component: Layout,
          children: [
            {
              name: 'Policydefinition',
              path: '',
              component: Policydefinition,
            },
          ],
        },
      ],
    }, */
  ],
}
