import Runtime from '@Developer/views/runtime'
import Devops from '@Developer/views/devops'
import Layout from '@/layouts/RouterView'
//import { hasSetupKey } from '@/utils/auth'
import i18n from '@/locales'
//import { isScopedPolicyMenuHidden } from '@/utils/scopedPolicy'

export default {
  index: 95,
  meta: {
    label: i18n.t('developer'),
    icon: 'menu-middleware',
  },
  menus: [
    /**
     * 消息队列
     */
    {
      meta: {
        label: i18n.t('dictionary.run_time'),
        t: 'dictionary.run_time',
      },
      submenus: [
        {
          path: 'external-link',
          meta: {
            label: i18n.t('developer.runtime'),
            t: 'developer.runtime',
          },
          component: Layout,
          children: [
            {
              name: 'Runtime',
              path: 'http://192.168.198.140:8082/api/v1/namespaces/default/services/fabric8/proxy/workspaces/default/namespace/default/apps?q=',
              component: Runtime,
            },
          ],
        },
      ],
    },
    {
      meta: {
        label: i18n.t('dictionary.dev_ops'),
        t: 'dictionary.dev_ops',
      },
      submenus: [
        {
          path: 'external-link',
          meta: {
            label: i18n.t('developer.devops'),
            t: 'developer.devops',
          },
          component: Layout,
          children: [
            {
              name: 'Devops',
              path: 'http://192.168.198.140:8082/api/v1/namespaces/default/services/fabric8/proxy/workspaces/default?q=',
              component: Devops,
            },
          ],
        },
      ],
    },
  ],
}
