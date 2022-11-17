import Redis from '@DB/views/redis'
import RedisCreate from '@DB/views/redis/create'
import RDS from '@DB/views/rds'
import RDSCreate from '@DB/views/rds/create'
//import RDSBackup from '@DB/views/rds-backup'
import Layout from '@/layouts/RouterView'
import i18n from '@/locales'
import MongoDB from '@DB/views/mongodb'

export default {
  index: 58,
  meta: {
    label: i18n.t('db.text_28'),
    icon: 'menu-db',
  },
  menus: [
    /**
     * RDS
     */
    {
      meta: {
        label: 'RDS',
      },
      submenus: [
        {
          path: '/rds',
          component: Layout,
          meta: {
            label: i18n.t('dictionary.dbinstance'),
            t: 'dictionary.dbinstance',
          },
          children: [
            {
              name: 'RDSIndex',
              path: '',
              component: RDS,
            },
            {
              name: 'RDSCreate',
              path: 'create',
              meta: {
                label: '新建实例',
              },
              component: RDSCreate,
            },
          ],
        },
        /* {
          path: '/rdsbackup',
          component: Layout,
          meta: {
            label: i18n.t('dictionary.dbinstancebackups'),
            permission: 'rds_dbinstancebackups_list',
            hidden: () => false,
          },
          children: [
            {
              name: 'RDSBackupIndex',
              path: '',
              meta: {},
              component: RDSBackup,
            },
          ],
        }, */
      ],
    },
    /**
     * redis
     */
    {
      meta: {
        label: 'Redis',
      },
      submenus: [
        {
          path: '/redis',
          meta: {
            label: i18n.t('dictionary.elasticcache'),
          },
          component: Layout,
          children: [
            {
              name: 'Redis',
              path: '',
              component: Redis,
            },
            {
              name: 'RedisCreate',
              path: 'create',
              component: RedisCreate,
            },
          ],
        },
      ],
    },
    {
      meta: {
        label: 'OpenGauss',
      },
      submenus: [
        {
          path: '/opengauss',
          meta: {
            label: i18n.t('db.text_29_1'),
          },
          component: Layout,
        },
      ],
    },
    /**
     * MongoDB
     */
    {
      meta: {
        label: 'MongoDB',
      },
      submenus: [
        {
          path: '/mongodb',
          meta: {
            label: i18n.t('dictionary.mongodb'),
          },
          component: Layout,
          children: [
            {
              name: 'MongoDB',
              path: '',
              component: MongoDB,
            },
          ],
        },
      ],
    },
  ],
}
