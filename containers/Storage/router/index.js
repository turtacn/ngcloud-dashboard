import FileSystemCreate from '@Storage/views/file-system/create/index'
import BucketSetStaticWebsit from '@Storage/views/bucket/components/SetStaticWebsit'
import BucketCreate from '@Storage/views/bucket/create'
import BlockStorage from '@Storage/views/blockstorage'
import Bucket from '@Storage/views/bucket'
import FileSystem from '@Storage/views/file-system'
import AccessGroup from '@Storage/views/access-group'
import Tablestore from '@Storage/views/tablestore'
import Layout from '@/layouts/RouterView'
import { hasSetupKey } from '@/utils/auth'
import i18n from '@/locales'
import store from '@/store'
import { isScopedPolicyMenuHidden } from '@/utils/scopedPolicy'
import BackupStorage from '@Storage/views/backup-storage'

export default {
  index: 50,
  meta: {
    label: i18n.t('storage.text_16'),
    icon: 'menu-storage',
  },
  menus: [
    /**
     * 块存储
     */
    {
      meta: {
        label: i18n.t('dictionary.blockstorage'),
        t: 'dictionary.blockstorage',
      },
      submenus: [
        {
          path: '/blockstorage',
          meta: {
            label: i18n.t('dictionary.blockstorage'),
            t: 'dictionary.blockstorage',
          },
          component: Layout,
          children: [
            {
              name: 'BlockStorage',
              path: '',
              component: BlockStorage,
            },
          ],
        },
      ],
    },
    /**
     * 存储桶
     */
    {
      meta: {
        label: i18n.t('storage.text_17'),
      },
      submenus: [
        {
          path: '/bucket',
          meta: {
            label: i18n.t('storage.text_18'),

          },
          component: Layout,
          children: [
            {
              name: 'Bucket',
              path: '',
              component: Bucket,
            },
            {
              name: 'BucketCreate',
              path: 'create',
              component: BucketCreate,
            },
            {
              name: 'BucketSetStaticWebsit',
              path: 'setstaticwebsit',
              component: BucketSetStaticWebsit,
            },
          ],
        },
      ],
    },

    /**
     * 表格存储
     */
    {
      meta: {
        label: i18n.t('dictionary.tablestore'),
      },
      submenus: [
        {
          path: '/table-storage',
          meta: {
            label: i18n.t('dictionary.tablestore'),

          },
          component: Layout,
          children: [
            {
              name: 'TableStorage',
              path: '',
              component: Tablestore,
            },
          ],
        },
      ],
    },
    /**
     * 文件存储
     */
    {
      meta: {
        label: i18n.t('storage.nas'),
      },
      submenus: [
        {
          path: '/nas',
          meta: {
            label: i18n.t('dictionary.filesystem'),

          },
          component: Layout,
          children: [
            {
              name: 'FileSystem',
              path: '',
              component: FileSystem,
            },
            {
              name: 'FileSystemCreate',
              path: 'create',
              component: FileSystemCreate,
            },
          ],
        },
        {
          path: '/access-group',
          meta: {
            label: i18n.t('dictionary.access_group'),

          },
          component: Layout,
          children: [
            {
              name: 'AccessGroup',
              path: '',
              component: AccessGroup,
            },
          ],
        },
      ],
    },
    /**
     * 备份存储
     */
    {
      meta: {
        label: i18n.t('dictionary.backup_storage'),
      },
      submenus: [
        {
          path: '/backup-storage',
          meta: {
            label: i18n.t('dictionary.backup_storage'),

          },
          component: Layout,
          children: [
            {
              name: 'BackupStorage',
              path: '',
              component: BackupStorage,
            },
          ],
        },
      ],
    },
  ],
}
