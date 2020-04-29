import * as R from 'ramda'

// 平台的配置
export const HYPERVISORS_MAP = {
  // IDC
  kvm: { key: 'kvm', label: 'OneCloud', provider: 'OneCloud', brand: 'OneCloud', host_type: 'kvm', hypervisor: 'kvm', env: 'idc', cloud_env: 'onpremise' },
  esxi: { key: 'esxi', label: 'VMware', provider: 'VMware', brand: 'VMware', host_type: 'esxi', hypervisor: 'esxi', env: 'idc', cloud_env: 'onpremise' },
  baremetal: { key: 'baremetal', label: '裸金属服务器', provider: 'OneCloud-baremetal', brand: 'OneCloud-baremetal', host_type: 'baremetal', hypervisor: 'baremetal', env: 'baremetal' },
  // Private
  openstack: { key: 'openstack', label: 'OpenStack', provider: 'OpenStack', brand: 'OpenStack', host_type: 'openstack', hypervisor: 'openstack', env: 'private', cloud_env: 'private' },
  dstack: { key: 'dstack', label: 'DStack', provider: 'ZStack', brand: 'DStack', host_type: 'dstack', hypervisor: 'dstack', env: 'private', cloud_env: 'private' },
  zstack: { key: 'zstack', label: 'ZStack', provider: 'ZStack', brand: 'ZStack', host_type: 'zstack', hypervisor: 'zstack', env: 'private', cloud_env: 'private' },
  // Public
  aliyun: { key: 'aliyun', label: '阿里云', provider: 'Aliyun', brand: 'Aliyun', host_type: 'aliyun', hypervisor: 'aliyun', env: 'public', cloud_env: 'public' },
  azure: { key: 'azure', label: 'Azure', provider: 'Azure', brand: 'Azure', host_type: 'azure', hypervisor: 'azure', env: 'public', cloud_env: 'public' },
  aws: { key: 'aws', label: 'AWS', provider: 'Aws', brand: 'Aws', host_type: 'aws', hypervisor: 'aws', env: 'public', cloud_env: 'public' },
  qcloud: { key: 'qcloud', label: '腾讯云', provider: 'Qcloud', brand: 'Qcloud', host_type: 'qcloud', hypervisor: 'qcloud', env: 'public', cloud_env: 'public' },
  huawei: { key: 'huawei', label: '华为云', provider: 'Huawei', brand: 'Huawei', host_type: 'huawei', hypervisor: 'huawei', env: 'public', cloud_env: 'public' },
  ucloud: { key: 'ucloud', label: 'UCloud', provider: 'Ucloud', brand: 'Ucloud', host_type: 'ucloud', hypervisor: 'ucloud', env: 'public', cloud_env: 'public' },
  google: { key: 'google', label: 'Google', provider: 'Google', brand: 'Google', host_type: 'google', hypervisor: 'google', env: 'public', cloud_env: 'public' },
  ctyun: { key: 'ctyun', label: '天翼云', provider: 'Ctyun', brand: 'Ctyun', host_type: 'ctyun', hypervisor: 'ctyun', env: 'public', cloud_env: 'public' },
}

export const EXTRA_HYPERVISORS = {
  s3: { key: 's3', label: 'S3', provider: 'S3', brand: 'S3', host_type: 's3', hypervisor: 's3', env: 'idc', cloud_env: 'onpremise' },
  ceph: { key: 'ceph', label: 'Ceph', provider: 'Ceph', brand: 'Ceph', host_type: 'ceph', hypervisor: 'ceph', env: 'idc', cloud_env: 'onpremise' },
  xsky: { key: 'xsky', label: 'XSKY', provider: 'Xsky', brand: 'Xsky', host_type: 'xsky', hypervisor: 'xsky', env: 'idc', cloud_env: 'onpremise' },
}

export const BRAND_MAP = {}
export const PROVIDER_MAP = {}
export const HOST_TYPE_MAP = {}

// 支持 hypervisor、brand、provider、host_type
R.forEachObjIndexed((obj, key) => {
  BRAND_MAP[obj.brand] = {
    ...obj,
    key: obj.brand,
  }
  PROVIDER_MAP[obj.provider] = {
    ...obj,
    key: obj.provider,
  }
  HOST_TYPE_MAP[obj.host_type] = {
    ...obj,
    key: obj.host_type,
  }
}, HYPERVISORS_MAP)

export const HYPERVISORS_GROUP = {
  idc: {
    kvm: HYPERVISORS_MAP.kvm,
    esxi: HYPERVISORS_MAP.esxi,
    baremetal: HYPERVISORS_MAP.baremetal,
  },
  private: {
    openstack: HYPERVISORS_MAP.openstack,
    zstack: HYPERVISORS_MAP.zstack,
  },
  public: {
    aliyun: HYPERVISORS_MAP.aliyun,
    azure: HYPERVISORS_MAP.azure,
    aws: HYPERVISORS_MAP.aws,
    qcloud: HYPERVISORS_MAP.qcloud,
    huawei: HYPERVISORS_MAP.huawei,
    ucloud: HYPERVISORS_MAP.ucloud,
    google: HYPERVISORS_MAP.google,
  },
}

// 用户、项目、权限的 scope 类型
export const SCOPES_MAP = {
  system: {
    key: 'system',
  },
  domain: {
    key: 'domain',
  },
  project: {
    key: 'project',
  },
}

// 调度策略
export const SCHEDTAG_POLICY_OPTIONS = [
  { key: 'prefer', label: '尽量使用' },
  { key: 'require', label: '必须使用' },
  { key: 'avoid', label: '避免使用' },
  { key: 'exclude', label: '禁止使用' },
]

export const ENABLED_OPTS = [
  { key: true, label: '启用' },
  { key: false, label: '禁用' },
]

// 自定义字典存储配置的name
export const GLOBAL_SETTINGS = 'global-settings'

// 标识字典允许用户自定义的key
export const ENABLE_USER_CUSTOM_DICTIONARY = [
  'identity_provider',
  'domain',
  'group',
  'user',
  'project',
  'role',
  'policy',
]

export const chartColors = ['#4DA1FF', '#FFC760', '#F76F89', '#5ED28A', '#ff5f2e', '#A593E0', '#7f9eb2', '#f6ea8c', '#a5dff9', '#77AAAD', '#E71D36', '#4ea1d3']

// 登录相关的路由名称
export const authRoutesName = [
  'Auth',
  'Login',
  'Register',
  'RegisterResult',
  'SecretVerify',
  'BindSecret',
  'SetSecretQuestion',
  'ResetSecretQuestion',
]
// 白名单路由名称，不需要登录认证
export const whiteRoutesName = authRoutesName.concat([
  '404',
  'NotFound',
  'EmailVerification',
  'Agreement',
])
