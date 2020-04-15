export default {
  created () {
    this.singleActions = [
      {
        label: '查看/编辑',
        permission: 'k8s_secrets_update',
        action: async obj => {
          const manager = new this.$Manager('secrets', 'v1')
          async function fetchData () {
            const { cluster, namespace } = obj
            const { data } = await manager.getSpecific({ id: obj.name, spec: 'rawdata', params: { cluster, namespace } })
            return data
          }
          const configText = await fetchData()
          this.createDialog('K8SEditYamlDialog', {
            data: [obj],
            manager,
            refresh: this.refresh,
            configText,
            success: () => {
              if (this.getResponseData) this.getResponseData()
            },
          })
        },
      },
      {
        label: '删除',
        permission: 'k8s_secrets_delete',
        action: (obj) => {
          const requestParams = {
            cluster: obj.clusterID,
          }
          if (obj.namespace) {
            requestParams.namespace = obj.namespace
          }
          this.createDialog('DeleteResDialog', {
            vm: this,
            data: [obj],
            columns: this.columns,
            title: '删除',
            name: '保密字典',
            onManager: this.onManager,
            idKey: 'name',
            requestParams,
            success: () => {
              if (this.getResponseData) this.getResponseData()
            },
          })
        },
      },
    ]
  },
}
