import Kafka from '@Middleware/views/kafka'
import Elasticsearch from '@Middleware/views/elasticsearch'
import Layout from '@/layouts/RouterView'
//import { hasSetupKey } from '@/utils/auth'
import i18n from '@/locales'
//import { isScopedPolicyMenuHidden } from '@/utils/scopedPolicy'

export default {
  index: 60,
  meta: {
    label: i18n.t('middleware'),
    icon: 'menu-middleware',
  },
  menus: [
    /**
     * 消息队列
     */
    {
      meta: {
        label: i18n.t('dictionary.message_queue'),
        t: 'dictionary.message_queue',
      },
      submenus: [
        {
          path: '/kafka',
          meta: {
            label: i18n.t('middleware.kafka'),
            t: 'middleware.kafka',
          },
          component: Layout,
          children: [
            {
              name: 'Kafka',
              path: '',
              component: Kafka,
            },
          ],
        },
      ],
    },
    {
      meta: {
        label: i18n.t('dictionary.data_analysis'),
        t: 'dictionary.data_analysis',
      },
      submenus: [
        {
          path: '/elasticsearch',
          meta: {
            label: i18n.t('middleware.elasticsearch'),
            t: 'middleware.elasticsearch',
          },
          component: Layout,
          children: [
            {
              name: 'Elasticsearch',
              path: '',
              component: Elasticsearch,
            },
          ],
        },
      ],
    },
  ],
}
