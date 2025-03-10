import InstanceBackup from '@Compute/views/instance-backup'
import DiskCreate from '@Compute/views/disk/create/index'
import VMInstance from '@Compute/views/vminstance'
import Baremetal from '@Compute/views/baremetal'
import WebApp from '@Compute/views/webapp'
import BaremetalCreate from '@Compute/views/baremetal/create/index'
import Image from '@Compute/views/image'
import ImageImport from '@Compute/views/image/image-import/index'
import HostImage from '@Compute/views/host-image'
import VMInstanceCreate from '@Compute/views/vminstance/create/index'
import VMInstanceAdjustConfig from '@Compute/views/vminstance/adjustConfig'
import Network from '@Network/views/network'
import NetworkCreate from '@Network/views/network/Create'
import EditAttributes from '@Network/views/network/EditAttributes'
import Eip from '@Network/views/eip'
import EipCreate from '@Network/views/eip/create'
import Host from '@Compute/views/host'
import Physicalmachine from '@Compute/views/physicalmachine'
import PhysicalmachineAdd from '@Compute/views/physicalmachine/add'
import ServerRecovery from '@Compute/views/server-recovery'
import DiskRecovery from '@Compute/views/disk-recovery'
import ImageRecovery from '@Compute/views/image-recovery'
import InstanceGroup from '@Compute/views/instance-group'
import SKU from '@Compute/views/sku'
import Keypair from '@Compute/views/keypair'
import Disk from '@Compute/views/disk'
import DiskBackup from '@Compute/views/disk-backup'
import GPU from '@Compute/views/gpu'
import Secgroup from '@Compute/views/secgroup'
import Servertemplate from '@Compute/views/servertemplate'
import ServertemplateCreateServer from '@Compute/views/servertemplate/CreateServer'
import DiskSnapshot from '@Compute/views/snapshot'
import InstanceSnapshot from '@Compute/views/snapshot-instance'
import SnapshotPolicy from '@Compute/views/snapshotpolicy'
// import AnsibleTemplate from '@Compute/views/ansible-template'
// import AnsibleTemplateCreate from '@Compute/views/ansible-template/create'
// import AnsiblePlaybook from '@Compute/views/ansible-playbook'
import ScalingGroup from '@Compute/views/scaling-group'
import ScalingGroupCreate from '@Compute/views/scaling-group/create'
import Schedtag from '@Cloudenv/views/schedtag'
import Schedpolicy from '@Cloudenv/views/schedpolicy'
import Dynamicschedtag from '@Cloudenv/views/dynamicschedtag'
import TapService from '@Compute/views/tap-service'
import TapServiceCreate from '@Compute/views/tap-service/create'

import store from '@/store'
import Layout from '@/layouts/RouterView'
import i18n from '@/locales'

import { hasSetupKey } from '@/utils/auth'
import { isScopedPolicyMenuHidden } from '@/utils/scopedPolicy'

export default {
  index: 20,
  meta: {
    label: i18n.t('compute.text_90'),
    icon: 'menu-compute',
  },
  menus: [
    {
      meta: {
        label: i18n.t('compute.text_90'),
      },
      submenus: [
        {
          path: '/vminstance',
          meta: {
            label: i18n.t('compute.text_91'),
          },
          component: Layout,
          children: [
            {
              name: 'VMInstance',
              path: '',
              component: VMInstance,
            },
            {
              name: 'VMInstanceCreate',
              path: 'create',
              component: VMInstanceCreate,
            },
            {
              name: 'VMInstanceAdjustConfig',
              path: 'adjust-config',
              component: VMInstanceAdjustConfig,
            },
          ],
        },
        {
          path: '/baremetal',
          meta: {
            label: i18n.t('compute.text_92'),

          },
          component: Layout,
          children: [
            {
              name: 'Baremetal',
              path: '',
              component: Baremetal,
            },
            {
              name: 'BaremetalCreate',
              path: 'create',
              component: BaremetalCreate,
            },
          ],
        },
        {
          path: '/instancegroup',
          meta: {
            label: i18n.t('compute.text_93'),
            t: 'dictionary.instancegroup',
          },
          component: Layout,
          children: [
            {
              name: 'InstanceGroup',
              path: '',
              meta: {},
              component: InstanceGroup,
            },
          ],
        },
        {
          path: '/servertemplate',
          meta: {
            label: i18n.t('compute.text_94'),

          },
          component: Layout,
          children: [
            {
              name: 'Servertemplate',
              path: '',
              meta: {},
              component: Servertemplate,
            },
            {
              name: 'ServertemplateCreate',
              path: 'create',
              meta: {},
              component: VMInstanceCreate,
            },
            {
              name: 'ServertemplateCreateServer',
              path: 'create-server',
              meta: {},
              component: ServertemplateCreateServer,
            },
          ],
        },
        {
          path: '/scalinggroup',
          meta: {
            label: i18n.t('compute.text_95'),

          },
          component: Layout,
          children: [
            {
              name: 'ScalingGroup',
              path: '',
              meta: {},
              component: ScalingGroup,
            },
            {
              name: 'ScalingGroupCreate',
              path: 'create',
              meta: {},
              component: ScalingGroupCreate,
            },
          ],
        },
        // {
        //   path: '/webapp',
        //   meta: {
        //     label: i18n.t('compute.webapp'),
        //
        //   },
        //   component: Layout,
        //   children: [
        //     {
        //       name: 'WebApp',
        //       path: '',
        //       component: WebApp,
        //     },
        //   ],
        // },
      ],
    },
    {
      meta: {
        label: i18n.t('compute.text_96'),
      },
      submenus: [
        {
          path: '/image',
          meta: {
            label: i18n.t('compute.text_97'),

          },
          component: Layout,
          children: [
            {
              name: 'Image',
              path: '',
              component: Image,
            },
            {
              name: 'ImageImport',
              path: 'import',
              component: ImageImport,
            },
          ],
        },
        {
          path: '/host_image',
          meta: {
            label: i18n.t('compute.text_98'),

          },
          component: Layout,
          children: [
            {
              name: 'HostImage',
              path: '',
              component: HostImage,
            },
          ],
        },
      ],
    },
    {
      meta: {
        label: i18n.t('compute.text_99'),
      },
      submenus: [
        {
          path: '/disk',
          meta: {
            label: i18n.t('compute.text_100'),
          },
          component: Layout,
          children: [
            {
              name: 'Disk',
              path: '',
              component: Disk,
            },
            {
              name: 'DiskCreate',
              path: 'create',
              component: DiskCreate,
            },
          ],
        },
        {
          path: '/disk-snapshot',
          meta: {
            label: i18n.t('compute.text_101'),

          },
          component: Layout,
          children: [
            {
              name: 'DiskSnapshot',
              path: '',
              component: DiskSnapshot,
            },
          ],
        },
        {
          path: '/instance-snapshot',
          meta: {
            label: i18n.t('compute.text_102'),

          },
          component: Layout,
          children: [
            {
              name: 'InstanceSnapshot',
              path: '',
              component: InstanceSnapshot,
            },
          ],
        },
        {
          path: '/snapshotpolicy',
          meta: {
            label: i18n.t('compute.text_103'),

          },
          component: Layout,
          children: [
            {
              name: 'SnapshotPolicy',
              path: '',
              component: SnapshotPolicy,
            },
          ],
        },
      ],
    },
    {
      meta: {
        label: i18n.t('common.backup'),
      },
      submenus: [
        {
          path: '/disk-backup',
          meta: {
            label: i18n.t('compute.disk_backup'),

          },
          component: Layout,
          children: [
            {
              name: 'DiskBackup',
              path: '',
              component: DiskBackup,
            },
          ],
        },
        {
          path: '/instance-backup',
          meta: {
            label: i18n.t('compute.instance_backup'),

          },
          component: Layout,
          children: [
            {
              name: 'InstanceBackup',
              path: '',
              component: InstanceBackup,
            },
          ],
        },
      ],
    },
    {
      meta: {
        label: i18n.t('compute.text_104'),
      },
      submenus: [
        {
          path: '/secgroup',
          meta: {
            label: i18n.t('compute.text_105'),

          },
          component: Layout,
          children: [
            {
              name: 'Secgroup',
              path: '',
              component: Secgroup,
            },
          ],
        },
        {
          path: '/network2',
          meta: {
            label: i18n.t('compute.text_106'),

          },
          component: Layout,
          children: [
            {
              name: 'Network2',
              path: '',
              component: Network,
            },
            {
              name: 'NetworkCreate2',
              path: 'create',
              component: NetworkCreate,
            },
            {
              name: 'NetworkUpdate2',
              path: 'edit',
              component: EditAttributes,
            },
          ],
        },
        {
          path: '/eip2',
          meta: {
            label: i18n.t('compute.text_107'),

          },
          component: Layout,
          children: [
            {
              name: 'Eip2',
              path: '',
              component: Eip,
            },
            {
              name: 'EipCreate2',
              path: 'create',
              component: EipCreate,
            },
          ],
        },

        {
          path: '/tap-service',
          meta: {
            label: i18n.t('dictionary.tap_service'),
          },
          component: Layout,
          children: [
            {
              name: 'TapService',
              path: '',
              component: TapService,
            },
            {
              name: 'TapServiceCreate',
              path: 'create',
              component: TapServiceCreate,
            },
          ],
        },
      ],
    },
    {
      meta: {
        label: i18n.t('compute.text_108'),
      },
      submenus: [
        {
          path: '/keypair',
          meta: {
            label: i18n.t('compute.text_108'),
          },
          component: Layout,
          children: [
            {
              name: 'Keypair',
              path: '',
              meta: {},
              component: Keypair,
            },
          ],
        },
      ],
    },
    {
      meta: {
        label: i18n.t('compute.text_109'),
      },
      submenus: [
        {
          path: '/sku',
          meta: {
            label: i18n.t('compute.text_109'),

          },
          component: Layout,
          children: [
            {
              name: 'Sku',
              path: '',
              meta: {},
              component: SKU,
            },
          ],
        },
      ],
    },
    {
      meta: {
        label: i18n.t('compute.text_110'),
      },
      submenus: [
        {
          path: '/host',
          meta: {
            label: i18n.t('compute.text_111'),
          },
          component: Layout,
          children: [
            {
              name: 'Host',
              path: '',
              component: Host,
            },
          ],
        },
        {
          path: '/physicalmachine',
          meta: {
            label: i18n.t('compute.text_112'),
          },
          component: Layout,
          children: [
            {
              name: 'Physicalmachine',
              path: '',
              component: Physicalmachine,
            },
            {
              name: 'PhysicalmachineAdd',
              path: 'add',
              component: PhysicalmachineAdd,
            },
          ],
        },
        {
          path: '/gpu',
          meta: {
            label: i18n.t('compute.text_113'),
          },
          component: Layout,
          children: [
            {
              name: 'GPU',
              path: '',
              component: GPU,
            },
          ],
        },
      ],
    },
    // {
    //   meta: {
    //     label: '运维工具',
    //   },
    //   submenus: [
    //     {
    //       path: '/ansibletemplate',
    //       meta: {
    //         label: '模板',
    //         permission: 'ansible_devtool_templates_list',
    //       },
    //       component: Layout,
    //       children: [
    //         {
    //           name: 'AnsibleTemplate',
    //           path: '',
    //           component: AnsibleTemplate,
    //         },
    //         {
    //           name: 'AnsibleTemplateCreate',
    //           path: 'create',
    //           component: AnsibleTemplateCreate,
    //         },
    //       ],
    //     },
    //     {
    //       path: '/ansibleplaybook',
    //       meta: {
    //         label: '任务',
    //         permission: 'ansible_ansibleplaybooks_list',
    //       },
    //       component: Layout,
    //       children: [
    //         {
    //           name: 'AnsiblePlaybook',
    //           path: '',
    //           component: AnsiblePlaybook,
    //         },
    //       ],
    //     },
    //   ],
    // },
    {
      meta: {
        label: i18n.t('cloudenv.text_17'),
      },
      submenus: [
        {
          path: '/schedtag',
          meta: {
            label: i18n.t('dictionary.schedtag'),

          },
          component: Layout,
          children: [
            {
              name: 'Schedtag',
              path: '',
              component: Schedtag,
            },
          ],
        },
        {
          path: '/schedpolicy',
          meta: {
            label: i18n.t('cloudenv.text_19'),
          },
          component: Layout,
          children: [
            {
              name: 'Schedpolicy',
              path: '',
              component: Schedpolicy,
            },
          ],
        },
        {
          path: '/dynamicschedtag',
          meta: {
            label: i18n.t('cloudenv.text_20'),

          },
          component: Layout,
          children: [
            {
              name: 'Dynamicschedtag',
              path: '',
              component: Dynamicschedtag,
            },
          ],
        },
      ],
    },
    {
      meta: {
        label: i18n.t('compute.text_114'),
        permission: 'recyclebins_list',
      },
      submenus: [
        {
          path: '/serverrecovery',
          meta: {
            label: i18n.t('compute.text_91'),

          },
          component: Layout,
          children: [
            {
              name: 'ServerRecovery',
              path: '',
              component: ServerRecovery,
            },
          ],
        },
        {
          path: '/diskrecovery',
          meta: {
            label: i18n.t('compute.text_100'),
          },
          component: Layout,
          children: [
            {
              name: 'DiskRecovery',
              path: '',
              component: DiskRecovery,
            },
          ],
        },
        {
          path: '/imagerecovery',
          meta: {
            label: i18n.t('compute.text_96'),
          },
          component: Layout,
          children: [
            {
              name: 'ImageRecovery',
              path: '',
              component: ImageRecovery,
            },
          ],
        },
      ],
    },
  ],
}
