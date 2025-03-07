<template>
  <base-dialog @cancel="cancelDialog">
    <div slot="header">{{ params.title }}</div>
    <div slot="body">
      <a-form :form="form.fc" hideRequiredMark>
        <a-form-item :label="$t('common.text00097')">
          <a-radio-group v-decorator="decorators.type" @change="handleExportTypeChange">
            <a-radio-button
              v-for="item of exportType"
              :key="item.key"
              :value="item.key">{{ item.label }}</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item :label="$t('common.text00098')">
          <a-checkbox
            :indeterminate="indeterminate"
            @change="handleCheckAllChange"
            :checked="checkAll">{{$t('common.checkAll')}}</a-checkbox>
          <a-divider />
          <a-checkbox-group v-decorator="decorators.selected" @change="handleSelectedChange" class="w-100">
            <a-row>
              <a-col
                v-for="item of exportOptionItems"
                :span="6"
                :key="item.key"
                class="mb-2 checkbox-item">
                <a-checkbox :value="item.key"><span :title="item.label">{{ item.label }}</span></a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-item>
      </a-form>
    </div>
    <div slot="footer">
      <a-button type="primary" @click="handleConfirm" :loading="loading">{{ $t("dialog.ok") }}</a-button>
      <a-button @click="cancelDialog">{{ $t('dialog.cancel') }}</a-button>
    </div>
  </base-dialog>
</template>

<script>
import * as R from 'ramda'
import XLSX from 'xlsx'
import { download, getRequestT } from '@/utils/utils'
import DialogMixin from '@/mixins/dialog'
import WindowsMixin from '@/mixins/windows'
import { getTagTitle } from '@/utils/common/tag'

export default {
  name: 'ExportListDataDialog',
  mixins: [DialogMixin, WindowsMixin],
  data () {
    let exportOptionItems = [...this.params.options.items].filter(item => {
      const { hidden } = item
      if (hidden && R.type(hidden) === 'Function') {
        return !hidden()
      }
      return !hidden
    }).map(item => {
      return {
        key: item.key || item.field,
        label: item.label || item.title,
        ...item,
      }
    })
    let allExportKeys = exportOptionItems.map(item => item.key)
    const exportTags = (this.params.showTagColumns && this.params.config.showTagKeys) || []
    if (exportTags && exportTags.length) {
      allExportKeys = R.insertAll(0, exportTags.map(item => {
        return `tag:${item}`
      }), allExportKeys)
      exportOptionItems = R.insertAll(0, exportTags.map(item => {
        return {
          label: getTagTitle(item),
          key: `tag:${item}`,
        }
      }), exportOptionItems)
    }
    return {
      loading: false,
      exportOptionItems,
      form: {
        fc: this.$form.createForm(this),
      },
      decorators: {
        type: [
          'type',
          {
            initialValue: this.params.options.type || 'custom',
          },
        ],
        selected: [
          'selected',
          {
            initialValue: allExportKeys,
            rules: [
              { required: true, message: this.$t('common_94') },
            ],
          },
        ],
      },
      allExportKeys,
      exportType: this.params.options.exportType || {
        all: { label: this.$t('common_95'), key: 'all' },
        custom: { label: this.$t('common_96'), key: 'custom' },
      },
      currentExportType: 'custom',
      indeterminate: false,
      checkAll: true,
      selectedExportKeys: allExportKeys,
    }
  },
  computed: {
    resource () {
      if (R.is(String, this.params.resource)) {
        return this.params.resource
      }
      return this.params.resource.resource.substr(0, this.params.resource.resource.length - 1)
    },
    downloadType () {
      return this.params.options.downloadType === 'local' ? 'local' : 'remote'
    },
  },
  methods: {
    genParams (formValues, total) {
      const keys = []
      const texts = []
      for (let i = 0, len = formValues.selected.length; i < len; i++) {
        const item = R.find(R.propEq('key', formValues.selected[i]))(this.exportOptionItems)
        keys.push(item.key)
        texts.push(item.label)
      }
      let params = {
        export: this.params.options.fileType || 'xls',
        export_keys: keys.join(','),
        export_texts: texts.join(','),
        export_limit: total || this.params.total,
        ...(R.is(Function, this.params.extraParams) ? this.params.extraParams({ currentExportType: this.currentExportType }) : this.params.extraParams),
      }
      if (this.params.options.limit) {
        params.export_limit = R.is(Function, this.params.options.limit) ? this.params.options.limit() : this.params.options.limit
      }
      if (this.params.options.getParams) {
        if (R.is(Function, this.params.options.getParams)) {
          params = {
            ...params,
            ...this.params.options.getParams({
              selected: formValues.selected,
              exportType: formValues.type,
              options: this.params.options,
            }),
          }
        } else {
          params = { ...params, ...this.params.options.getParams }
        }
      }
      // 如果是自定义导出范围配置，则不进行默认的导出范围参数计算
      if (!this.params.options.notCombineListParams) {
        const listParams = this.params.listParams
        if (this.exportType.custom && formValues.type === this.exportType.custom.key) { // 导出范围选择根据筛选条件时
          params = {
            ...params,
            ...listParams,
          }
          if (this.params.selected.length) {
            if (params.filter && params.filter.length) {
              params.filter = [...params.filter, `id.in(${this.params.selected.join(',')})`]
            } else {
              params.filter = [`id.in(${this.params.selected.join(',')})`]
            }
          }
        } else if (this.exportType.all && formValues.type === this.exportType.all.key) { // 导出范围选择全部时
          if (listParams.scope) params.scope = listParams.scope
          // 如果没有自定义limit，导出全部直接把limt重置为0
          if (R.isNil(this.params.options.limit) || R.isEmpty(this.params.options.limit)) {
            params.export_limit = 0
          }
        }
      }
      if (this.downloadType === 'local') {
        params.limit = params.export_limit
        params.details = true
        delete params.export
        delete params.export_keys
        delete params.export_texts
        delete params.export_limit
      } else {
        if (params.limit) delete params.limit
      }
      if (params.offset) delete params.offset
      delete params.paging_marker
      if (this.params.options.transformParams) {
        params = this.params.options.transformParams(params)
      }
      return params
    },
    validateForm () {
      return new Promise((resolve, reject) => {
        this.form.fc.validateFields((errors, values) => {
          if (errors) {
            reject(errors)
          } else {
            resolve(values)
          }
        })
      })
    },
    async handleConfirm () {
      try {
        const values = await this.validateForm()
        this.loading = true
        const resource = this.params.options.resource || this.params.resource
        const total = this.params.options.resource && await this.getResourceTotal(resource)
        const params = this.genParams(values, total)
        if (this.downloadType === 'remote') {
          const response = await this.$http({
            methods: 'GET',
            url: `/${this.params.apiVersion}/${resource}`,
            params,
            responseType: 'blob',
            headers: {
              'X-Export-Keys': true,
            },
          })
          const contentDisposition = response.headers['content-disposition']
          let fileName = 'unknown'
          if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="(.+)"/)
            if (fileNameMatch.length === 2) fileName = fileNameMatch[1]
          }
          download(response.data, fileName, response.headers['content-type'])
        } else {
          const { data: res = {} } = await new this.$Manager(resource, this.params.apiVersion).list({
            params,
          })
          const data = res.data || []
          // 生成数据
          this.localExport(this.exportOptionItems, data)
        }
        this.cancelDialog()
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },
    handleExportTypeChange (e) {
      this.currentExportType = e.target.value
    },
    async handleSelectedChange (val) {
      this.indeterminate = !!val.length && val.length < this.allExportKeys.length
      this.checkAll = val.length === this.allExportKeys.length
      await this.$nextTick()
      this.selectedExportKeys = this.form.fc.getFieldValue('selected')
    },
    handleCheckAllChange (e) {
      this.form.fc.setFieldsValue({
        selected: e.target.checked ? this.allExportKeys : [],
      })
      this.checkAll = e.target.checked
      this.indeterminate = false
    },
    getResourceTotal (resource) {
      let listParams = this.params.listParams
      if (this.params.options.transformParams) {
        listParams = this.params.options.transformParams(listParams)
      }
      return new Promise((resolve, reject) => {
        this.$http({
          methods: 'GET',
          url: `/${this.params.apiVersion}/${resource}`,
          params: {
            $t: getRequestT(),
            ...listParams,
            limit: 1,
          },
        }).then((res) => {
          resolve(res.data.total)
        }).catch(() => {
          resolve(0)
        })
      })
    },
    localExport (cols, list) {
      const columns = cols.filter(item => this.selectedExportKeys.includes(item.key))
      // 标题行
      const titles = columns.map(item => item.label)
      // 每列宽度
      const colWidthList = columns.map(item => {
        return { wch: item.width }
      })
      const filename = `${this.params.options.exportTitle || this.params.title}.xlsx`
      const wb = XLSX.utils.book_new()
      const allLength = list.length
      const sheetMaxLen = 60000 // 每个sheet最多多少条
      let sheetIdx = 1
      let sheetDatas = []
      // 生成sheet
      for (let i = 1; i < allLength + 1; i++) {
        const idx = Math.ceil(i / sheetMaxLen)
        if (idx !== sheetIdx) {
          // 保存旧表
          const ws_name = 'sheet' + sheetIdx
          const ws = XLSX.utils.aoa_to_sheet([titles, ...sheetDatas])
          XLSX.utils.book_append_sheet(wb, ws, ws_name)
          // 插入新表
          sheetIdx = idx
          sheetDatas = []
        } else if (i === allLength) { // 尾表
          const row = []
          columns.map(column => {
            let colData = ''
            if (column.formatter) {
              colData = column.formatter({ row: list[i - 1] })
            } else {
              colData = list[i - 1][column.key] || ''
            }
            row.push(colData)
          })
          sheetDatas.push(row)
          const ws_name = 'sheet' + sheetIdx
          const ws = XLSX.utils.aoa_to_sheet([titles, ...sheetDatas])
          ws['!cols'] = colWidthList
          XLSX.utils.book_append_sheet(wb, ws, ws_name)
        }
        // 生成单行数据
        const row = []
        columns.map(column => {
          let colData = ''
          if (column.formatter) {
            colData = column.formatter({ row: list[i - 1] })
          } else {
            colData = list[i - 1][column.key] || ''
          }
          row.push(colData)
        })
        sheetDatas.push(row)
      }
      XLSX.writeFile(wb, filename)
    },
  },
}
</script>

<style lang="less" scoped>
.checkbox-item {
  ::v-deep {
    .ant-checkbox-wrapper {
      display: flex;
      align-items: center;
      .ant-checkbox {
        margin-top: 3px;
        & + span {
          flex: 1;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
