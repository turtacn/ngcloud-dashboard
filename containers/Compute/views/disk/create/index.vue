<template>
  <div>
    <page-header :title="$t('compute.perform_create')" :tabs="cloudEnvOptions" :current-tab.sync="cloudEnv" />
    <a-form
      class="mt-3"
      :form="form.fc">
      <a-form-item :label="$t('compute.text_297', [$t('dictionary.project')])" class="mb-0" v-bind="formItemLayout">
        <domain-project :fc="form.fc" :decorators="{ project: decorators.project, domain: decorators.domain }" />
      </a-form-item>
      <area-selects
        class="mb-0"
        ref="areaSelects"
        :wrapperCol="formItemLayout.wrapperCol"
        :labelCol="formItemLayout.labelCol"
        :names="areaselectsName"
        :cloudregionParams="param.region"
        :zoneParams="param.zone"
        :providerParams="param.provider"
        :isRequired="true"
        :region.sync="regionList"
        filterBrandResource="compute_engine"
        :zone.sync="zoneList" />
      <a-form-item :label="$t('compute.text_228')" v-bind="formItemLayout">
        <a-input v-decorator="decorators.name" :placeholder="$t('validator.resourceCreateName')" />
      </a-form-item>
      <a-form-item :label="$t('common.description')" v-bind="formItemLayout">
        <a-textarea :auto-size="{ minRows: 1, maxRows: 3 }" v-decorator="decorators.description" :placeholder="$t('common_367')" />
      </a-form-item>
      <a-form-item :label="$t('compute.text_100')" required v-bind="formItemLayout" :extra="extra">
        <a-row>
          <a-col :span="6" class="mr-2">
            <a-select v-decorator="decorators.backend" @change="__newStorageChange">
              <a-select-option v-for="item in storageOpts" :key="item.value">
                <div class="d-flex">
                  <span class="text-truncate flex-fill mr-2" :title="item.label">{{ item.label }}</span>
                  <span v-if="item.multiple" style="width: 90px; color: rgb(132, 146, 166); font-size: 13px;">介质: {{ item.medium }}</span>
                </div>
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="5">
            <a-tooltip :title="tooltip" placement="top">
              <a-input-number :min="minDiskData" :max="maxDiskData" :step="step" v-decorator="decorators.size" /> GB
            </a-tooltip>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item :label="$t('common.choose.server.label')" v-bind="formItemLayout" v-if="isIDC">
        <host-server v-decorator="decorators.server" />
      </a-form-item>
      <a-form-item v-if="enableEncryption" v-bind="formItemLayout" :label="$t('compute.disk.encryption')" :extra="$t('compute.disk.encryption.extra')">
        <encrypt-keys :decorators="decorators.encrypt_keys" />
      </a-form-item>
      <a-form-item :label="$t('compute.text_1154')" class="mb-0" v-bind="formItemLayout">
        <tag
          v-decorator="decorators.__meta__" />
      </a-form-item>
      <a-collapse :bordered="false" v-if="cloudEnv === 'public' || isHCSO">
        <a-collapse-panel :header="$t('compute.text_309')" key="1">
          <a-form-item :label="$t('compute.text_15')" v-bind="formItemLayout">
            <base-select
              class="w-50"
              v-decorator="decorators.manager_id"
              resource="cloudproviders"
              :params="cloudproviderParams"
              :isDefaultSelect="true"
              :showSync="true"
              :select-props="{ placeholder: $t('compute.text_149') }"
              :resList.sync="cloudproviderData" />
          </a-form-item>
        </a-collapse-panel>
      </a-collapse>
    </a-form>
    <bottom-bar
      :current-cloudregion="currentCloudregion"
      :current-cloudzone="currentCloudzone"
      :current-storage="storageItem"
      :storage-types="storageTypes"
      :provider="provider"
      :size="form.fd.size" />
  </div>
</template>

<script>
import * as R from 'ramda'
import { mapGetters } from 'vuex'
import AreaSelects from '@/sections/AreaSelects'
import DialogMixin from '@/mixins/dialog'
import WindowsMixin from '@/mixins/windows'
import validateForm, { isRequired } from '@/utils/validate'
import i18n from '@/locales'
import DomainProject from '@/sections/DomainProject'
import { getCloudEnvOptions } from '@/utils/common/hypervisor'
import { MEDIUM_MAP } from '@Compute/constants'
import Tag from '@/sections/Tag'
import BottomBar from './components/BottomBar'
import { HYPERVISORS_MAP } from '../../../../../src/constants'
import * as CommonConstants from '../../../constants'
import EncryptKeys from '@Compute/sections/encryptkeys'
import HostServer from './components/HostServer'

export default {
  name: 'DiskCreate',
  components: {
    AreaSelects,
    DomainProject,
    BottomBar,
    Tag,
    EncryptKeys,
    HostServer,
  },
  mixins: [DialogMixin, WindowsMixin],
  data () {
    const cloudEnvOptions = getCloudEnvOptions('compute_engine_brands', true)
    const queryType = this.$route.query.type
    let cloudEnv = queryType === 'idc' ? 'onpremise' : this.$route.query.type
    let routerQuery = this.$route.query.type
    if (!cloudEnvOptions.find(val => val.key === cloudEnv)) {
      cloudEnv = cloudEnvOptions[0].key
      routerQuery = cloudEnv === 'onpremise' ? 'idc' : cloudEnv
    }
    return {
      loading: false,
      cloudEnvOptions,
      cloudEnv,
      routerQuery,
      form: {
        fc: this.$form.createForm(this, {
          onValuesChange: (props, values) => {
            if (values.domain && values.domain.key) {
              this.form.fd.domain = values.domain.key
            }
            if (values.project && values.project.key) {
              this.form.fd.project = values.project.key
            }
            if (values.hasOwnProperty('zone')) {
              if (values.zone) {
                this.fetchStorageList(values.zone)
                this.form.fd.zone = values.zone
              } else {
                this.storageOpts = []
                this.form.fc.resetFields(['backend'])
              }
            }
            if (values.cloudregion) {
              this.form.fd.cloudregion = values.cloudregion
            }
            if (values.size) {
              this.form.fd.size = values.size
            }
          },
        }),
        fd: {
          domain: '',
          project: '',
          cloudregion: '',
          zone: '',
        },
      },
      decorators: {
        domain: [
          'domain',
          {
            rules: [
              { validator: isRequired(), message: i18n.t('rules.domain'), trigger: 'change' },
            ],
          },
        ],
        project: [
          'project',
          {
            rules: [
              { validator: isRequired(), message: i18n.t('rules.project'), trigger: 'change' },
            ],
          },
        ],
        name: [
          'name',
          {
            validateFirst: true,
            rules: [
              { required: true, message: this.$t('compute.text_210') },
              { validator: this.$validate('resourceCreateName') },
            ],
          },
        ],
        description: ['description'],
        backend: [
          'backend',
          {
            rules: [
              { required: true, message: this.$t('compute.text_411') },
            ],
          },
        ],
        storage_id: [
          'storage_id',
          {
            rules: [
              { required: true, message: this.$t('compute.text_411') },
            ],
          },
        ],
        size: [
          'size',
          {
            initialValue: 10,
            rules: [
              { required: true },
            ],
          },
        ],
        manager_id: [
          'manager_id',
        ],
        __meta__: [
          '__meta__',
          {
            rules: [
              { validator: validateForm('tagName') },
            ],
          },
        ],
        encrypt_keys: {
          encryptEnable: [
            'encryptEnable',
            {
              initialValue: '',
            },
          ],
          encrypt_key_alg: [
            'encrypt_key_alg',
            {
              initialValue: '',
            },
          ],
          encrypt_key_id: [
            'encrypt_key_id',
          ],
        },
        server: ['server'],
      },
      formItemLayout: {
        wrapperCol: {
          md: { span: 18 },
          xl: { span: 20 },
          xxl: { span: 22 },
        },
        labelCol: {
          md: { span: 6 },
          xl: { span: 4 },
          xxl: { span: 2 },
        },
      },
      storageOpts: [],
      storageItem: {},
      storageTypes: [],
      maxDiskData: 2048,
      minDiskData: 1,
      step: 10,
      cloudproviderData: [],
      regionList: {},
      zoneList: {},
      instance_capabilities: [],
    }
  },
  computed: {
    enableEncryption () {
      return this.$appConfig.isPrivate
    },
    tooltip () {
      return this.$t('compute.text_137', [this.minDiskData, this.maxDiskData])
    },
    ...mapGetters(['isAdminMode', 'scope', 'userInfo']),
    currentCloudregion () {
      return this.regionList[this.form.fd.cloudregion]
    },
    currentCloudzone () {
      return this.zoneList[this.form.fd.zone]
    },
    isHCSO () {
      if (this.currentCloudregion) {
        return this.currentCloudregion.provider === HYPERVISORS_MAP.hcso.provider
      }
      return false
    },
    isKVM () {
      return true
    },
    provider () { // 向外提供的，通过 refs 获取
      if (this.currentCloudregion && this.currentCloudregion.provider) {
        return this.currentCloudregion.provider.toLowerCase()
      }
      return ['kvm', 'esxi'] // 没有 provider 肯定是 kvm 或者 esxi 的cloudregion
    },
    diskType () {
      return this.cloudEnv
    },
    storageLabel () {
      if (['idc', 'private'].includes(this.diskType)) {
        return this.$t('compute.text_380')
      }
      return this.$t('compute.text_396')
    },
    param () {
      const project_domain = { project_domain: this.form.fd.domain || this.userInfo.projectDomainId || this.userInfo.domain.id }
      if (this.diskType === 'private') {
        const params = {
          zone: {
            usable: true,
            show_emulated: true,
            order_by: 'created_at',
            order: 'asc',
            ...project_domain,
          },
          region: {
            usable: true,
            cloud_env: 'private',
            show_emulated: true,
            filter: `provider.notin(${HYPERVISORS_MAP.nutanix.provider})`,
            ...project_domain,
          },
          provider: {},
        }
        return params
      } else if (this.diskType === 'public') {
        return {
          zone: {
            usable: true,
            show_emulated: true,
            order_by: 'created_at',
            order: 'asc',
            ...project_domain,
          },
          region: {
            usable: true,
            cloud_env: 'public',
            ...project_domain,
          },
          provider: {
            cloud_env: 'public',
            ...project_domain,
          },
        }
      }
      if (this.isAdminMode) {
        return {
          zone: {
            ...project_domain,
          },
          region: {
            usable: true,
            cloud_env: 'onpremise',
            ...project_domain,
          },
        }
      }
      return {
        zone: {
          ...project_domain,
        },
        region: {
          usable: true,
          cloud_env: 'onpremise',
          scope: this.scope,
        },
      }
    },
    areaselectsName () {
      if (this.diskType === 'private' || this.diskType === 'onpremise') {
        return ['cloudregion', 'zone']
      }
      return ['provider', 'cloudregion', 'zone']
    },
    cloudproviderParams () {
      const { cloudregion, domain: project_domain, zone } = this.form.fd
      const params = {
        limit: 0,
        enabled: true,
        'filter.0': 'status.equals("connected")',
        'filter.1': 'health_status.equals("normal")',
        cloudregion,
        project_domain,
        zone,
      }
      return params
    },
    project_domain () {
      return this.form.fd.domain ? this.form.fd.domain : this.userInfo.projectDomainId
    },
    extra () {
      return this.cloudEnv === 'onpremise' ? this.$t('compute.text_1353') : ''
    },
    instanceCapabilitieStorage () {
      if (R.isEmpty(this.instance_capabilities)) return {}
      return this.instance_capabilities[0].storages
    },
    instanceCapabilitieDataDisk () {
      if (R.isEmpty(this.instanceCapabilitieStorage)) return []
      return this.instanceCapabilitieStorage.data_disk
    },
    isIDC () {
      return this.cloudEnv === 'onpremise'
    },
  },
  watch: {
    cloudEnv (val) {
      this.$refs.areaSelects.fetchs(['provider', 'cloudregion', 'zone'])
      this.storageItem = {}
    },
    'form.fd.domain' (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.$refs.areaSelects.fetchs(this.areaselectsName)
      }
    },
  },
  provide () {
    return {
      form: this.form,
    }
  },
  methods: {
    fetchStorageList (zoneId) {
      const params = { show_emulated: true }
      if (this.isAdminMode) {
        params.project_domain = this.project_domain
      } else {
        params.scope = this.scope
      }
      this.storageOpts = []
      new this.$Manager('capability').list({ ctx: [['zones', zoneId]], params })
        .then(({ data }) => {
          try {
            const provider = Array.isArray(this.provider) ? this.provider[0] : this.provider
            this.instance_capabilities = data.instance_capabilities
            this.storageOpts = data.data_storage_types.map((item) => {
              const types = item.split('/')
              const backend = types[0]
              const medium = types[1]
              const storageType = CommonConstants.STORAGE_TYPES[provider][backend]
              const getLabel = (backend) => { return backend.includes('rbd') ? 'Ceph' : backend }
              const backends = data.data_storage_types.filter(v => v.includes(backend))
              return {
                value: `${backend}__${medium}`,
                label: storageType ? storageType.label : getLabel(backend),
                medium: MEDIUM_MAP[medium] || medium,
                multiple: backends.length > 1,
              }
            })
            if (this.diskType === 'onpremise') {
              // this.storageOpts = this.storageOpts.filter((item) => {
              //   return !item.value.includes('local')
              // })
            } else if (this.diskType === 'private') {
              this.storageOpts = this.storageOpts.filter((item) => {
                return !item.value.includes('nova')
              })
            } else {
              // 公有云隐藏带local关键字的硬盘类型
              this.storageOpts = this.storageOpts.filter(({ value }) => {
                if (value.includes('local')) return false
                return true
              })
            }
            if (provider === 'qcloud' || provider === 'ucloud') {
              this.storageOpts = this.storageOpts.filter((item) => {
                return !(item.value && item.value.toLowerCase().startsWith('local_'))
              })
            }
            this.form.fc.setFieldsValue({ backend: '' })
            if (this.storageOpts.length > 0) {
              // if (this.cloudEnv === 'onpremise') {
              //   this.storageOpts = this.storageOpts.filter(item => { return !item.value.includes('local') })
              // }
              this.form.fc.setFieldsValue({ backend: this.storageOpts[0].value })
              this.__newStorageChange(this.storageOpts[0].value)
            }
          } catch (error) {
            throw new Error(this.$t('common_589') + error)
          }
        })
    },
    _translateStorageOps (data) {
      const findStorageProvider = optItem => {
        const storageName = optItem.name ? `(${optItem.name})` : ''
        let storageType = optItem.storage_type
        let storageProvider = {}
        if (R.is(Array, this.provider)) {
          this.provider.forEach(hypervisor => { // 将 kvm 和 esxi 的存储类型合一
            Object.assign(storageProvider, CommonConstants.STORAGE_TYPES[hypervisor])
          })
        } else {
          storageProvider = CommonConstants.STORAGE_TYPES[this.provider]
        }
        if (storageProvider[storageType.toLowerCase()]) {
          storageType = storageType.toLowerCase()
        } else if (storageProvider[storageType.toUpperCase()]) {
          storageType = storageType.toUpperCase()
        }
        return {
          storageName,
          storageType,
          storageProvider,
        }
      }
      // 过滤掉不支持创建的云硬盘的存储类型
      const conCreateCloud = data.filter(v => {
        const { storageProvider, storageType } = findStorageProvider(v)
        if (storageType === 'nova') return false
        if (storageType && storageProvider && !R.isEmpty(storageProvider) && storageProvider[storageType]) {
          return !storageProvider[storageType].unCreateCloud
        }
        // 说明支持自定义
        if (CommonConstants.CUSTOM_STORAGE_TYPES.includes(this.provider)) {
          return true
        }
        return false
      })
      return conCreateCloud.map(v => {
        const { storageName, storageType, storageProvider } = findStorageProvider(v)
        let label = v.name
        try {
          if (storageProvider[storageType]) {
            label = storageProvider[storageType].label
          } else {
            label = storageProvider[storageType.toLowerCase()].label
          }
        } catch (error) {
          console.warn(this.$t('compute.text_413', [this.provider, storageType]))
        }
        return {
          label: `${label}${storageName}`,
          value: v.id,
          ...v,
        }
      })
    },
    __newStorageChange (val) {
      const item = this.storageOpts.find(v => v.value === val)
      this.storageItem = item
      try {
        this.minDiskData = this.getDataDiskMin(val)
        this.maxDiskData = this.getDataDiskMax(val)
        this.step = this.getDataDiskStep(val)
      } catch (error) {
        console.warn(this.$t('compute.text_413', [CommonConstants.STORAGE_TYPES[this.provider], item.storage_type]))
      }
      this.form.fc.setFieldsValue({ size: 10 })
      const size = this.form.fc.getFieldValue('size')
      if (size > this.maxDiskData) { // 如果当前容量大于当前集群的最大值，那么取最大值
        this.form.fc.setFieldsValue({ size: this.maxDiskData })
      } else if (size < this.minDiskData) { // 如果当前容量小于当前集群的最大值，那么取最小值
        this.form.fc.setFieldsValue({ size: this.minDiskData })
      }
    },
    getDataDiskMin (val) {
      const curDisk = this.instanceCapabilitieDataDisk.find(v => val.startsWith(v.storage_type))
      if (curDisk) {
        return curDisk.min_size_gb
      }
      return CommonConstants.STORAGE_TYPES[this.provider][val].min
    },
    getDataDiskMax (val) {
      const curDisk = this.instanceCapabilitieDataDisk.find(v => val.startsWith(v.storage_type))
      if (curDisk) {
        return curDisk.max_size_gb
      }
      return CommonConstants.STORAGE_TYPES[this.provider][val].max
    },
    getDataDiskStep (val) {
      const curDisk = this.instanceCapabilitieDataDisk.find(v => val.startsWith(v.storage_type))
      if (curDisk) {
        return curDisk.step_size_gb
      }
      return 10
    },
  },
}
</script>
