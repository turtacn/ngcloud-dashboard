<template>
  <div>
    <page-header :title="$t('helm.text_87')" />
    <page-body needMarginBottom>
      <div>
        <template v-if="!chartDetail.metadata">
          <loading-block :layout="loadingLayout" />
        </template>
        <template v-else>
          <page-card-detail
            class="mt-3 mb-4"
            :img="chartDetail.metadata.icon"
            :page-title="chartDetail.metadata.name || ''"
            :description="chartDetail.metadata.description" />
          <a-form
            v-bind="formItemLayout"
            :form="form.fc">
            <a-form-item :label="$t('helm.text_16')">
              <a-input v-decorator="decorators.release_name" :placeholder="$t('helm.text_28')" disabled />
            </a-form-item>
            <a-form-item :label="$t('helm.text_29')">
              <a-select v-decorator="decorators.version" :placeholder="$t('helm.text_30')" @change="versionChange">
                <a-select-option
                  v-for="item in versions"
                  :key="item.key"
                  :value="item.key">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :label="$t('helm.text_88')">
              <code-mirror v-decorator="decorators.yaml" :options="cmOptions" />
            </a-form-item>
          </a-form>
          <template-preview :previewFiles="previewFiles" />
        </template>
      </div>
    </page-body>
    <page-footer>
      <div slot="right">
        <a-button class="mr-3" type="primary" @click="confirm" :loading="loading">{{$t('helm.text_35')}}</a-button>
        <a-button @click="cancel">{{$t('helm.text_36')}}</a-button>
      </div>
    </page-footer>
  </div>
</template>

<script>
import * as R from 'ramda'
import marked from 'marked'
import { Base64 } from 'js-base64'
import jsYaml from 'js-yaml'
import TemplatePreview from '@K8S/sections/TemplatePreview'
import { validateYaml } from '@/utils/validate'

export default {
  name: 'K8SChartCreate',
  components: {
    TemplatePreview,
  },
  data () {
    const validator = (rule, value, _callback) => {
      validateYaml(value)
        .then(() => {
          return _callback()
        })
        .catch(() => {
          return _callback(this.$t('helm.text_37'))
        })
    }
    return {
      versions: [],
      previewFiles: [],
      currentVersion: {},
      loading: false,
      chartDetail: {
        readme: '',
        chart: {},
        metadata: {},
      },
      releaseDetail: {},
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      },
      cmOptions: {
        tabSize: 2,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        mode: 'text/x-yaml',
        theme: 'material',
      },
      loadingLayout: [
        [10],
        [8, 9],
        [2, 4, 7, 5],
        [13, 9],
        [4, 3, 8],
        [8, 6, 8],
        [13, 9],
      ],
      form: {
        fc: this.$form.createForm(this),
      },
      decorators: {
        release_name: [
          'release_name',
          {
            validateFirst: true,
            rules: [
              { required: true, message: this.$t('helm.text_28') },
              { min: 2, max: 24, message: this.$t('helm.text_38'), trigger: 'blur' },
              { validator: this.$validate('k8sName') },
            ],
          },
        ],
        version: [
          'version',
          {
            rules: [
              { required: true, message: this.$t('helm.text_30'), trigger: 'blur' },
            ],
          },
        ],
        yaml: [
          'yaml',
          {
            validateFirst: true,
            rules: [
              { required: true, message: this.$t('helm.text_43') },
              { validator },
            ],
          },
        ],
      },
    }
  },
  computed: {
    compiledMarkdown () {
      const markdownDoc = Base64.decode(this.chartDetail.readme)
      return marked(markdownDoc, { sanitize: true })
    },
  },
  created () {
    this.chartsM = new this.$Manager('charts', 'v1')
    this.releaseM = new this.$Manager('releases', 'v1')
    this.getRelease()
  },
  methods: {
    versionChange (key) {
      this.currentVersion = this.versions.find(val => val.key === key)
      this.getChart()
    },
    async getChart () {
      const repo = this.currentVersion.repo
      const name = this.currentVersion.chart.name
      const { data } = await this.chartsM.get({
        id: name,
        params: {
          repo,
        },
      })
      if (data) {
        this.previewFiles = data.files
      }
    },
    async getRelease () {
      const { name } = this.$route.params
      const { data } = await this.releaseM.get({
        id: `${name}`,
        params: {
          cluster: this.$route.query.cluster,
          namespace: this.$route.query.namespace,
        },
      })
      if (!R.isNil(data) && !R.isEmpty(data)) {
        this.releaseDetail = data
        this.chartDetail = this.releaseDetail.chart
        this.form.fc.setFieldsValue({
          [this.decorators.release_name[0]]: this.releaseDetail.name,
          [this.decorators.yaml[0]]: jsYaml.safeDump(this.releaseDetail.config || {}, { lineWidth: Infinity }),
        })
        this.getChartVersion()
      }
    },
    async getChartVersion () {
      this.versionLoading = true
      const { data: { data = [] } } = await this.chartsM.list({
        params: {
          name: this.chartDetail.metadata.name,
          all_version: true,
          limit: 0,
          version: `^${this.chartDetail.metadata.version}`,
        },
      })
      if (data.length === 0) {
        this.$message.error(this.$t('helm.text_44'))
        return
      }
      this.versions = data.map(v => {
        return {
          ...v,
          label: `${v.repo}-${v.version}`,
          key: `${v.repo}-${v.version}`,
        }
      })
      if (this.versions && this.versions.length) {
        let defaultVersion = this.versions[0].key
        const findVersion = this.versions.find(val => val.version === this.chartDetail.metadata.version)
        if (findVersion) {
          defaultVersion = findVersion.key
        }
        this.form.fc.setFieldsValue({
          [this.decorators.version[0]]: defaultVersion,
        })
        this.versionChange(defaultVersion)
      }
    },
    async doUpdate (values) {
      const data = {
        chart_name: this.chartDetail.metadata.name,
        release_name: values.release_name,
        cluster: this.$route.query.cluster,
        namespace: this.$route.query.namespace,
        values: values.yaml,
      }
      if (!R.isNil(values.version) && !R.isEmpty(values.version)) {
        const [repo, v] = values.version.split('-')
        data.repo = repo
        data.version = v
      }
      await this.releaseM.update({
        id: values.release_name,
        data,
      })
    },
    async confirm () {
      try {
        this.loading = true
        const values = await this.form.fc.validateFields()
        await this.doUpdate(values)
        this.$message.success(this.$t('helm.text_45'))
        this.loading = false
        this.cancel()
      } catch (error) {
        this.loading = false
        throw error
      }
    },
    cancel () {
      this.$router.push('/k8s-release')
    },
  },
}
</script>
