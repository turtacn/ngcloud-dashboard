<template>
  <div>
    <a-alert type="info" :showIcon="false" banner class="mb-4">
      <div slot="message">{{$t('network.text_747')}}</div>
    </a-alert>
    <a-form
      class="mt-3"
      :form="form.fc"
      @submit.prevent="handleSubmit"
      v-bind="formItemLayout">
      <area-selects
        class="mb-0"
        ref="areaSelects"
        :wrapperCol="formItemLayout.wrapperCol"
        :labelCol="formItemLayout.labelCol"
        :names="areaselectsName"
        :providerParams="providerParams"
        :cloudregionParams="cloudregionParams"
        :isRequired="true"
        filterBrandResource="network_manage"
        @change="handleRegionChange" />
      <a-form-item label="VPC" v-bind="formItemLayout">
        <base-select
          v-decorator="decorators.vpc"
          resource="vpcs"
          :params="vpcParams"
          :isDefaultSelect="true"
          :needParams="true"
          :labelFormat="vpcLabelFormat"
          :select-props="{ placeholder: $t('common_226') }" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AreaSelects from '@/sections/AreaSelects'

export default {
  name: 'AssociateVpc',
  components: {
    AreaSelects,
  },
  props: {
    params: Object,
  },
  provide () {
    return {
      form: this.form,
    }
  },
  data () {
    return {
      loading: false,
      form: {
        fc: this.$form.createForm(this),
      },
      decorators: {
        vpc: [
          'vpc',
          {
            rules: [
              { required: true, message: this.$t('network.text_274') },
            ],
          },
        ],
      },
      areaselectsName: ['provider', 'cloudregion'],
      regionProvider: '',
      regionId: '',
      associateVpcIds: [],
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
    }
  },
  computed: {
    ...mapGetters(['isAdminMode', 'scope']),
    vpcParams () {
      const params = {
        limit: 0,
        usable_vpc: true,
        scope: this.scope,
        cloudregion_id: this.regionId,
        filter: 'provider.in(Aws, Aliyun, OneCloud)',
      }
      if (this.isAdminMode) {
        params.project_domain = this.params.data[0].project_domain
        delete params.scope
      }
      if (!this.regionId) return {}
      return params
    },
    providerParams () {
      return {
        filter: 'provider.in(Aws, Aliyun, OneCloud)',
        scope: this.scope,
        public_cloud: true,
      }
    },
    cloudregionParams () {
      return {
        scope: this.scope,
        limit: 0,
        usable_vpc: true,
        show_emulated: true,
      }
    },
  },
  methods: {
    doSubmit (values) {
      const ids = this.params.data.map(item => item.id)
      return new this.$Manager('dns_zones').batchPerformAction({
        ids: ids,
        action: 'add-vpcs',
        data: {
          vpc_ids: [values.vpc],
        },
      })
    },
    handleRegionChange (data) {
      const { cloudregion } = data
      if (cloudregion) {
        const { provider } = cloudregion.value
        this.regionProvider = provider
        this.regionId = cloudregion.id
      }
    },
    vpcLabelFormat (item) {
      if (item.manager) {
        if (item.cidr_block) {
          return <div><span class="text-color-secondary">VPC:</span> { item.name }<span>（{ item.cidr_block }）</span><span class="ml-2 text-color-secondary">{this.$t('common_711')}: { item.manager }</span></div>
        }
        return <div><span class="text-color-secondary">VPC:</span> { item.name }<span class="ml-2 text-color-secondary">{this.$t('common_711')}: { item.manager }</span></div>
      }
      return <div>{ item.name }</div>
    },
  },
}
</script>
