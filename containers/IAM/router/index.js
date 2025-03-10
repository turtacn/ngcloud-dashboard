import IDP from '@IAM/views/idp'
import IDPEdit from '@IAM/views/idp/edit'
import Domain from '@IAM/views/domains'
import DomainCreate from '@IAM/views/domains/create'
import Projects from '@IAM/views/projects'
import SecurityAlerts from '@IAM/views/security-alerts'
import ProjectCreate from '@IAM/views/projects/create'
import Group from '@IAM/views/group'
import User from '@IAM/views/user'
import UserCreate from '@IAM/views/user/create'
import Role from '@IAM/views/role'
import Policy from '@IAM/views/policy'
import PolicyCreate from '@IAM/views/policy/Create'
import PolicyUpdate from '@IAM/views/policy/Update'
import Notification from '@IAM/views/notification'
import NotifyTopic from '@IAM/views/notify-topic'
import Robots from '@IAM/views/robots'
import NotifyConfigs from '@IAM/views/notifyconfig'
import NotifyConfigCreate from '@IAM/views/notifyconfig/create'
import Contact from '@IAM/views/contact'
import Layout from '@/layouts/RouterView'
import i18n from '@/locales'
//import { isScopedPolicyMenuHidden } from '@/utils/scopedPolicy'
//import { hasServices, setupKeys } from '@/utils/auth'
//import store from '@/store'

function menuPath (path) {
  return '/iam' + path
}

export default {
  index: 100,
  meta: {
    label: i18n.t('scope.text_959'),
    icon: 'menu-iam',
  },
  menus: [
    {
      meta: {
        label: i18n.t('common_21'),
      },
      submenus: [
        {
          path: '/idp',
          meta: {
            label: i18n.t('system.text_4'),
            t: 'dictionary.identity_provider',
          },
          component: Layout,
          children: [
            {
              name: 'IdpList',
              path: '',
              meta: {},
              component: IDP,
            },
            {
              name: 'IdpCreate',
              path: 'create',
              meta: {},
              component: IDPEdit,
            },
            {
              name: 'IdpUpdate',
              path: 'update/:id',
              meta: {},
              component: IDPEdit,
            },
          ],
        },
        {
          path: '/domain',
          meta: {
            label: i18n.t('system.text_5'),
            t: 'dictionary.domain',
          },
          component: Layout,
          children: [
            {
              name: 'Domain',
              path: '',
              component: Domain,
            },
            {
              name: 'DomainCreate',
              path: 'create',
              component: DomainCreate,
            },
          ],
        },
        {
          path: '/project',
          meta: {
            label: i18n.t('system.text_9'),
            t: 'dictionary.project',
          },
          component: Layout,
          children: [
            {
              name: 'Projects',
              path: '',
              component: Projects,
            },
            {
              name: 'ProjectCreate',
              path: 'create',
              component: ProjectCreate,
            },
          ],
        },
        {
          path: '/group',
          meta: {
            label: i18n.t('system.text_7'),
            t: 'dictionary.group',
          },
          component: Layout,
          children: [
            {
              name: 'GroupList',
              path: '',
              component: Group,
            },
          ],
        },
        {
          path: '/systemuser',
          meta: {
            label: i18n.t('system.text_6'),
            t: 'dictionary.user',
          },
          component: Layout,
          children: [
            {
              name: 'User',
              path: '',
              meta: {},
              component: User,
            },
            {
              name: 'UserCreate',
              path: 'create',
              meta: {},
              component: UserCreate,
            },
          ],
        },
        {
          path: '/role',
          meta: {
            label: i18n.t('system.text_10'),
            t: 'dictionary.role',
          },
          component: Layout,
          children: [
            {
              name: 'RoleList',
              path: '',
              component: Role,
            },
          ],
        },
        {
          path: '/policy',
          meta: {
            label: i18n.t('system.text_11'),
            t: 'dictionary.policy',
          },
          component: Layout,
          children: [
            {
              name: 'Policy',
              path: '',
              component: Policy,
            },
            {
              name: 'PolicyCreate',
              path: 'create',
              component: PolicyCreate,
            },
            {
              name: 'PolicyUpdate',
              path: 'update',
              component: PolicyUpdate,
            },
          ],
        },
      ],
    },
    {
      meta: {
        label: i18n.t('scope.text_961'),
      },
      submenus: [
        {
          path: menuPath('/securityalerts'),
          meta: {
            label: i18n.t('scope.text_961'),
          },
          component: Layout,
          children: [
            {
              name: 'SecurityAlerts',
              path: '',
              component: SecurityAlerts,
            },
          ],
        },
      ],
    },
    {
      meta: {
        label: i18n.t('system.text_564'),
      },
      submenus: [
        {
          path: '/notification',
          meta: {
            label: i18n.t('system.text_16'),
            t: 'dictionary.webconsole',
          },
          component: Layout,
          children: [
            {
              name: 'Notification',
              path: '',
              component: Notification,
            },
          ],
        },
        {
          path: '/notify-topic',
          meta: {
            label: i18n.t('dictionary.notify-topic'),
            t: 'dictionary.notify-topic',
          },
          component: Layout,
          children: [
            {
              name: 'NotifyTopic',
              path: '',
              component: NotifyTopic,
            },
          ],
        },
        {
          path: '/notifyconfig',
          meta: {
            label: i18n.t('system.text_19'),

          },
          component: Layout,
          children: [
            {
              name: 'NotifyConfig',
              path: '',
              component: NotifyConfigs,
            },
            {
              name: 'NotifyConfigCreate',
              path: 'create',
              component: NotifyConfigCreate,
            },
          ],
        },
        {
          path: '/contact',
          meta: {
            label: i18n.t('common_27'),
          },
          component: Layout,
          children: [
            {
              name: 'Contact',
              path: '',
              component: Contact,
            },
          ],
        },
        {
          path: '/robot',
          meta: {
            label: i18n.t('system.robot_manage'),

          },
          component: Layout,
          children: [
            {
              name: 'Robots',
              path: '',
              component: Robots,
            },
          ],
        },
      ],
    },
  ],
}
