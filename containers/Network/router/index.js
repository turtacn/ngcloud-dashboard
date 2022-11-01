// import FlexNetwork from '@Network/views/flex-network'
import Ipv6Gateway from '@Network/views/ipv6-gateway'
import DnsZone from '@Network/views/dns-zone'
import DnsZoneCreate from '@Network/views/dns-zone/create'
import EipCreate from '@Network/views/eip/create'
import Wire from '@Network/views/wire'
import Network from '@Network/views/network'
import NetworkCreate from '@Network/views/network/Create'
import EditAttributes from '@Network/views/network/EditAttributes'
import BatchEditAttributes from '@Network/views/network/BatchEditAttributes'
import Eip from '@Network/views/eip'
import Waf from '@Network/views/waf'
import GlobalVpc from '@Network/views/global-vpc'
import GlobalVpcCreate from '@Network/views/global-vpc/create'
import RouteTableList from '@Network/views/route-table'
import NatList from '@Network/views/nats'
import NatCreate from '@Network/views/nats/create/index'
// import ReservedIpList from '@Network/views/reserved-ip'
// import DNS from '@Network/views/dns'
import VPC from '@Network/views/vpc'
import VpcNetwork from '@Network/views/vpc-network'
import VpcPeerConnect from '@Network/views/vpc-peer-connect'
import VPCCreate from '@Network/views/vpc/create'
import LbList from '@Network/views/lb'
import LBCreate from '@Network/views/lb/create/index'
import LbListenerCreate from '@Network/views/loadbalancerlistener/create'
import LbaclsList from '@Network/views/lbacls'
import LbcertsList from '@Network/views/lbcerts'
import LoadbalancerclusterList from '@Network/views/loadbalancercluster'
import SshProxyList from '@Network/views/ssh-proxy'
import SshProxyCreate from '@Network/views/ssh-proxy/form'
import SshAgentList from '@Network/views/ssh-agent'
// import LoadbalancerclusterList from '@Network/views/ssh-service'
import AgentList from '@Network/views/agent'
import AgentForm from '@Network/views/agent/form'
import Layout from '@/layouts/RouterView'
import Cloudregion from '@Cloudenv/views/cloudregion'
import Zone from '@Cloudenv/views/zone'
import DomainList from '@Network/views/cdn'

//import { hasSetupKey } from '@/utils/auth'
import i18n from '@/locales'
//import store from '@/store'
//import { isScopedPolicyMenuHidden } from '@/utils/scopedPolicy'

export default {
  index: 40,
  meta: {
    label: i18n.t('network.text_16'),
    icon: 'menu-network',
  },
  menus: [
    {
      meta: {
        label: i18n.t('cloudenv.text_9'),
      },
      submenus: [
        {
          path: '/cloudregion',
          meta: {
            label: i18n.t('cloudenv.text_10'),
          },
          component: Layout,
          children: [
            {
              name: 'Cloudregion',
              path: '',
              component: Cloudregion,
            },
          ],
        },
        {
          path: '/zone',
          meta: {
            label: i18n.t('cloudenv.text_11'),
          },
          component: Layout,
          children: [
            {
              name: 'Zone',
              path: '',
              component: Zone,
            },
          ],
        },
      ],
    },
    /**
     * 基础网络
     */
    {
      meta: {
        label: i18n.t('network.text_711'),
      },
      submenus: [
        {
          path: '/vpc-network',
          meta: {
            label: i18n.t('dictionary.vpc_network'),
            t: 'dictionary.vpc_network',
          },
          component: Layout,
          children: [
            {
              name: 'VpcNetwork',
              path: '',
              component: VpcNetwork,
            },
          ],
        },
        {
          path: '/vpc-peerconnect',
          meta: {
            label: i18n.t('dictionary.vpc_peer_connect'),
            t: 'dictionary.vpc_peer_connect',
          },
          component: Layout,
          children: [
            {
              name: 'VpcPeerConnect',
              path: '',
              component: VpcPeerConnect,
            },
          ],
        },
        {
          path: '/globalvpc',
          meta: {
            label: i18n.t('dictionary.globalvpc'),
            t: 'dictionary.globalvpc',
          },
          component: Layout,
          children: [
            {
              name: 'GlobalVPC',
              path: '',
              component: GlobalVpc,
            },
            {
              name: 'GlobalVpcCreate',
              path: 'create',
              component: GlobalVpcCreate,
            },
          ],
        },
        {
          path: '/vpc',
          meta: {
            label: i18n.t('dictionary.vpc'),
            t: 'dictionary.vpc',
          },
          component: Layout,
          children: [
            {
              name: 'VPC',
              path: '',
              component: VPC,
            },
            {
              name: 'VPCCreate',
              path: 'create',
              component: VPCCreate,
            },
          ],
        },
        {
          path: '/routetable',
          meta: {
            label: i18n.t('dictionary.route_table'),
          },
          component: Layout,
          children: [
            {
              name: 'RouteTable',
              path: '',
              component: RouteTableList,
            },
          ],
        },
        {
          path: '/wire',
          meta: {
            label: i18n.t('dictionary.wire'),
            t: 'dictionary.wire',
          },
          component: Layout,
          children: [
            {
              name: 'WireList',
              path: '',
              component: Wire,
            },
          ],
        },
        // {
        //   path: '/flexnetwork',
        //   meta: {
        //     label: '弹性网卡',
        //     permission: 'networkcard_list',
        //   },
        //   component: Layout,
        //   children: [
        //     {
        //       name: 'NetworkcardList',
        //       path: '',
        //       component: FlexNetwork,
        //     },
        //   ],
        // },
        {
          path: '/network',
          meta: {
            label: i18n.t('dictionary.network'),
            t: 'dictionary.network',
          },
          component: Layout,
          children: [
            {
              name: 'NetworkList',
              path: '',
              component: Network,
            },
            {
              name: 'NetworkCreate',
              path: 'create',
              component: NetworkCreate,
            },
            {
              name: 'NetworkUpdate',
              path: 'edit',
              component: EditAttributes,
            },
            {
              name: 'NetworkBatchUpdate',
              path: 'batch-edit',
              component: BatchEditAttributes,
            },
          ],
        },
        // {
        //   path: '/reservedip',
        //   meta: {
        //     label: '预留IP',
        //     permission: 'reservedips_list',
        //   },
        //   component: Layout,
        //   children: [
        //     {
        //       name: 'ReservedIP',
        //       path: '',
        //       component: ReservedIpList,
        //     },
        //   ],
        // },
      ],
    },
    /**
     * 网络服务
     */
    {
      meta: {
        label: i18n.t('network.text_712'),
      },
      submenus: [
        {
          path: '/eip',
          meta: {
            label: i18n.t('dictionary.eip'),
            t: 'dictionary.eip',
          },
          component: Layout,
          children: [
            {
              name: 'EipList',
              path: '',
              component: Eip,
            },
            {
              name: 'EipCreate',
              path: 'create',
              component: EipCreate,
            },
          ],
        },
        {
          path: '/nat',
          meta: {
            label: i18n.t('dictionary.nat'),
            t: 'dictionary.nat',
          },
          component: Layout,
          children: [
            {
              name: 'Nat',
              path: '',
              component: NatList,
            },
            {
              name: 'NatCreate',
              path: 'create',
              component: NatCreate,
            },
          ],
        },
        // {
        //   path: '/dns',
        //   meta: {
        //     label: i18n.t('dictionary.dns'),
        //     permission: 'dnsrecords_list',
        //     t: 'dictionary.dns',
        //     // hidden: () => true,
        //   },
        //   component: Layout,
        //   children: [
        //     {
        //       name: 'DNS',
        //       path: '',
        //       component: DNS,
        //     },
        //   ],
        // },
        {
          path: '/dns-zone',
          meta: {
            label: i18n.t('dictionary.dns_zone'),
          },
          component: Layout,
          children: [
            {
              name: 'DnsZone',
              path: '',
              component: DnsZone,
            },
            {
              name: 'DnsZoneCreate',
              path: 'create',
              component: DnsZoneCreate,
            },
          ],
        },
        {
          path: '/ipv6-gateway',
          meta: {
            label: i18n.t('dictionary.ipv6_gateway'),
          },
          component: Layout,
          children: [
            {
              name: 'IPv6Gateway',
              path: '',
              component: Ipv6Gateway,
            },
          ],
        },
      ],
    },
    /**
     * 网络安全
     */
    {
      meta: {
        label: i18n.t('network.text_756'),
      },
      submenus: [
        {
          path: '/waf',
          meta: {
            label: i18n.t('dictionary.waf_instance'),
            t: 'dictionary.waf_instance',
          },
          component: Layout,
          children: [
            {
              name: 'WafList',
              path: '',
              component: Waf,
            },
          ],
        },
      ],
    },
    /**
     * SSH代理
     */
    {
      meta: {
        label: i18n.t('network.ssh-proxy.title'),
      },
      submenus: [
        {
          path: '/ssh-proxy',
          meta: {
            label: i18n.t('network.ssh-proxy.endpoints'),
          },
          component: Layout,
          children: [
            {
              name: 'SshProxyList',
              path: '',
              component: SshProxyList,
            },
            {
              name: 'SshProxyCreate',
              path: 'create',
              component: SshProxyCreate,
            },
          ],
        },
        {
          path: '/ssh-agent',
          meta: {
            label: i18n.t('network.ssh-proxy.proxyservice'),

          },
          component: Layout,
          children: [
            {
              name: 'SshAgentList',
              path: '',
              component: SshAgentList,
            },
          ],
        },
      ],
    },
    /**
     * 负载均衡
     */
    {
      meta: {
        label: i18n.t('network.text_713'),
        labelAlias: '网络负载均衡',
        // hidden: () => !hasServices('lbagent') && !hasHypervisors(['aliyun', 'qcloud', 'huawei', 'aws']),
      },
      submenus: [
        {
          path: '/lb',
          meta: {
            label: i18n.t('network.text_714'),

          },
          component: Layout,
          children: [
            {
              name: 'LBList',
              path: '',
              component: LbList,
            },
            {
              name: 'LBCreate',
              path: 'create',
              component: LBCreate,
            },
            {
              name: 'LBSDetailListenerCreate',
              path: ':id/listener-create',
              component: LbListenerCreate,
            },
            {
              name: 'LBSDetailListenerUpdate',
              path: ':id/listener-update',
              component: LbListenerCreate,
            },
          ],
        },
        {
          path: '/lbacl',
          meta: {
            label: i18n.t('network.text_715'),

          },
          component: Layout,
          children: [
            {
              name: 'LbaclList',
              path: '',
              component: LbaclsList,
            },
          ],
        },
        {
          path: '/lbcert',
          meta: {
            label: i18n.t('network.text_716'),

          },
          component: Layout,
          children: [
            {
              name: 'LbcertList',
              path: '',
              component: LbcertsList,
            },
          ],
        },
      ],
    },
    /**
     * 负载均衡集群
     */
    {
      meta: {
        label: i18n.t('network.text_17'),
        labelAlias: i18n.t('network.text_18'),
      },
      submenus: [
        {
          path: '/cluster',
          meta: {
            label: i18n.t('network.text_19'),

          },
          component: Layout,
          children: [
            {
              name: 'LoadbalancerclusterList',
              path: '',
              component: LoadbalancerclusterList,
            },
          ],
        },
        {
          path: '/lbagent',
          meta: {
            label: i18n.t('network.text_20'),

          },
          component: Layout,
          children: [
            {
              name: 'AgentList',
              path: '',
              component: AgentList,
            },
            {
              name: 'AgentForm',
              path: 'form',
              component: AgentForm,
            },
          ],
        },
      ],
    },
    {
      meta: {
        label: i18n.t('dictionary.cdn'),
      },
      submenus: [
        {
          path: '/cdn',
          meta: {
            label: i18n.t('dictionary.cdn_domain'),
            t: 'dictionary.cdn_domain',

          },
          component: Layout,
          children: [
            {
              name: 'DomainList',
              path: '',
              component: DomainList,
            },
          ],
        },
      ],
    },
  ],
}
