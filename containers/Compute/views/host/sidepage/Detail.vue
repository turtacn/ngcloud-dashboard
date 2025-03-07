<template>
  <detail
    :on-manager="onManager"
    :data="data"
    :base-info="baseInfo"
    :extra-info="extraInfo"
    :name-rules="[{ required: true, message: $t('compute.text_210') }]"
    resource="hosts"
    status-module="host" />
</template>

<script>
import {
  getUserTagColumn,
  getExtTagColumn,
} from '@/utils/common/detailColumn'
import WindowsMixin from '@/mixins/windows'
import { getEnabledTableColumn, getBrandTableColumn, getCopyWithContentTableColumn, getStatusTableColumn, getPublicScopeTableColumn, getOsArch } from '@/utils/common/tableColumn'
import { sizestr } from '@/utils/utils'
import i18n from '@/locales'

const storageType = {
  rotate: i18n.t('compute.text_577'),
  ssd: i18n.t('compute.text_48'),
  hybrid: i18n.t('compute.text_578'),
}

export default {
  name: 'HostDetail',
  mixins: [WindowsMixin],
  props: {
    data: {
      type: Object,
      required: true,
    },
    onManager: {
      type: Function,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    refresh: {
      type: Function,
      required: true,
    },
  },
  data () {
    return {
      // itemData: {
      //   status: 'ready',
      //   host_status: 'ready',
      //   enabled: true,
      // },
      storageColumns: [
        {
          field: 'adapter',
          title: this.$t('compute.text_579'),
        },
        {
          field: 'driver',
          title: this.$t('compute.text_378'),
          width: 80,
        },
        {
          field: 'model',
          title: this.$t('compute.text_580'),
          showOverflow: 'ellipsis',
          minWidth: 100,
        },
        {
          field: 'rotate',
          title: this.$t('compute.text_175'),
          width: 80,
          formatter: ({ cellValue, row }) => {
            if (cellValue === true) return this.$t('compute.text_581')
            return 'SSD'
          },
        },
        {
          field: 'size',
          title: this.$t('compute.text_397'),
          formatter: ({ cellValue, row }) => {
            return sizestr(cellValue, 'M', 1024)
          },
        },
        {
          field: 'slot',
          title: this.$t('compute.text_582'),
        },
      ],
      hostColumns: [
        {
          field: 'ip_addr',
          title: 'IP',
          width: 100,
        },
        {
          field: 'mac',
          title: this.$t('compute.text_385'),
          showOverflow: 'ellipsis',
          minWidth: 100,
        },
        {
          field: 'masklen',
          title: this.$t('compute.text_583'),
        },
        {
          field: 'nic_type',
          title: this.$t('compute.text_175'),
        },
        {
          field: 'rate',
          title: this.$t('compute.text_584'),
        },
      ],
      baseInfo: [
        {
          field: 'hostname',
          title: this.$t('common_388'),
        },
        getUserTagColumn({
          onManager: this.onManager,
          resource: 'host',
          columns: () => this.columns,
          tipName: this.$t('dictionary.host'),
          editCheck: (row) => (row.provider || '').toLowerCase() !== 'bingocloud',
        }),
        getExtTagColumn({
          onManager: this.onManager,
          resource: 'host',
          columns: () => this.columns,
          tipName: this.$t('dictionary.host'),
          editCheck: (row) => (row.provider || '').toLowerCase() !== 'bingocloud',
        }),
        getPublicScopeTableColumn({ vm: this, resource: 'hosts' }),
        getBrandTableColumn(),
        getEnabledTableColumn(),
        {
          field: 'access_ip',
          title: 'IP',
        },
        {
          field: 'access_mac',
          title: this.$t('compute.text_385'),
        },
        getStatusTableColumn({ field: 'host_status', statusModule: 'host_status', title: this.$t('compute.text_502') }),
        {
          field: 'nonsystem_guests',
          title: '#VM',
          width: 60,
          slots: {
            default: ({ row }, h) => {
              if (row.nonsystem_guests <= 0) return row.nonsystem_guests
              const ret = [
                <a onClick={ () => this.$emit('tab-change', 'vminstance-list') }>{row.nonsystem_guests}</a>,
              ]
              return ret
            },
          },
        },
        {
          field: 'access_mac',
          title: this.$t('compute.text_385'),
        },
        {
          field: 'schedtags',
          title: this.$t('compute.text_541'),
          formatter: ({ cellValue, row }) => {
            if (row.schedtags && row.schedtags.length > 0) {
              const schedtags = row.schedtags.map(v => v.name)
              return schedtags.join('，')
            }
            return '-'
          },
        },
        {
          field: 'version',
          title: this.$t('compute.text_585'),
          slots: {
            default: ({ row, cellValue }) => {
              // if (row.brand && row.brand.toLowerCase() === 'onecloud') {
              //   const data = row.version.split('/')[1].split('^')[0]
              //   return [
              //     <div class='text-truncate'>
              //       { data }
              //     </div>,
              //   ]
              // }
              return [
                <div class='text-truncate'>
                  <list-body-cell-wrap copy row={ row } field="version" title={ cellValue } />
                </div>,
              ]
            },
          },
        },
        {
          field: 'kvm_module',
          title: this.$t('compute.text_586'),
          formatter: ({ cellData, row }) => {
            const kvmModuleMap = {
              'kvm-intel': 'Intel',
              'kvm-amd': 'AMD',
              unsupport: this.$t('compute.text_587'),
            }
            if (!row.sys_info) return '-'
            return kvmModuleMap[row.sys_info.kvm_module] || '-'
          },
        },
        {
          field: 'cdrom_boot',
          title: this.$t('compute.text_588'),
          formatter: ({ cellData, row }) => {
            let ret = '-'
            if (row.ipmi_info && row.ipmi_info.cdrom_boot === 'true') {
              ret = this.$t('compute.text_589')
            } else {
              ret = this.$t('compute.text_587')
            }
            return ret
          },
        },
        {
          field: 'isolated_device_count',
          title: this.$t('compute.passthrough_device_count'),
          slots: {
            default: ({ row }, h) => {
              return [
                <a onClick={ () => this.$emit('tab-change', 'gpu-list') }>{row.isolated_device_count || 0}</a>,
              ]
            },
          },
        },
      ],
      extraInfo: [
        {
          title: this.$t('compute.text_590'),
          items: [
            {
              field: 'manufacture',
              title: this.$t('compute.text_228'),
              formatter: ({ cellValue, row }) => {
                return ((row.sys_info || {}).manufacture) || '-'
              },
            },
            {
              field: 'model',
              title: this.$t('compute.text_580'),
              formatter: ({ cellValue, row }) => {
                return ((row.sys_info || {}).model) || '-'
              },
            },
            getCopyWithContentTableColumn({
              field: 'sn',
              title: this.$t('compute.text_591'),
            }),
          ],
        },
        {
          title: 'CPU',
          items: [
            {
              field: 'cpu_count',
              title: this.$t('compute.text_563'),
              formatter: ({ cellValue }) => {
                return cellValue + this.$t('compute.text_167')
              },
            },
            {
              field: 'node_count',
              title: this.$t('compute.text_593'),
              formatter: ({ cellValue }) => {
                return cellValue + this.$t('compute.text_200')
              },
            },
            {
              field: 'cpu_commit_bound',
              title: this.$t('compute.text_594'),
              slots: {
                default: ({ row }, h) => {
                  if (row.cpu_commit_bound) {
                    return [
                      <a class="mem-edit-item" onClick={this.openHostAdjustOversoldRatioDialog}>{row.cpu_commit_bound} <a class="edit-icon"><a-icon type='edit' /></a></a>,
                    ]
                  }
                  return '-'
                },
              },
            },
            {
              field: 'cpu_virtual',
              title: this.$t('compute.text_1326'),
              formatter: ({ row }) => {
                if (!row.cpu_count || !row.cpu_commit_bound) {
                  return '-'
                }
                return row.cpu_count * row.cpu_commit_bound + this.$t('compute.text_167')
              },
            },
            {
              field: 'cpu_commit_rate',
              title: this.$t('compute.text_595'),
            },
            {
              field: 'cpu_desc',
              title: this.$t('compute.text_596'),
            },
            getOsArch({ field: 'cpu_architecture' }),
            {
              field: 'reserved_cpu',
              title: this.$t('compute.passthrough_reserved'),
              slots: {
                default: ({ row }, h) => {
                  const cpu = row.reserved_resource_for_gpu && row.reserved_resource_for_gpu.reserved_cpu
                  if (cpu) {
                    return [
                      <a onClick={ () => this.$emit('tab-change', 'gpu-list') }>{this.$t('compute.text_120', [cpu])}</a>,
                    ]
                  }
                  return '-'
                },
              },
            },
          ],
        },
        {
          title: this.$t('compute.text_369'),
          items: [
            {
              field: 'mem_size',
              title: this.$t('compute.text_1327'),
              formatter: ({ cellValue, row }) => {
                const allowedBrands = ['OneCloud', 'VMware']
                if (!allowedBrands.includes(row.brand)) return sizestr(cellValue, 'M', 1024)
                return this.$t('compute.text_1330') + sizestr(row.mem_commit, 'M', 1024) + this.$t('compute.text_1331') + sizestr(cellValue, 'M', 1024)
              },
            },
            {
              field: 'mem_commit_bound',
              title: this.$t('compute.text_594'),
              slots: {
                default: ({ row }, h) => {
                  if (row.mem_commit_bound) return [<a class="mem-edit-item" onClick={this.openHostAdjustOversoldRatioDialog}>{row.mem_commit_bound}<a class="edit-icon"><a-icon type='edit' /></a></a>]
                  return '-'
                },
              },
            },
            {
              field: 'mem_commit_rate',
              title: this.$t('compute.text_595'),
            },
            {
              field: 'mem_reserved',
              title: this.$t('compute.text_598'),
              formatter: ({ cellValue, row }) => {
                return sizestr(cellValue, 'M', 1024)
              },
            },
            {
              field: 'reserved_memory',
              title: this.$t('compute.passthrough_reserved'),
              slots: {
                default: ({ row }, h) => {
                  const memory = row.reserved_resource_for_gpu && row.reserved_resource_for_gpu.reserved_memory
                  if (memory) {
                    return [
                      <a onClick={ () => this.$emit('tab-change', 'gpu-list') }>{ sizestr(memory, 'M', 1024) }</a>,
                    ]
                  }
                  return '-'
                },
              },
            },
          ],
        },
        {
          title: this.$t('compute.text_99'),
          items: [
            {
              field: 'metadata',
              title: this.$t('compute.text_1329'),
              formatter: ({ cellValue, row }) => {
                if (row.brand.toLowerCase() !== 'onecloud') return '-'
                const total = sizestr(row.metadata.root_partition_total_capacity_mb, 'M', 1024)
                const used = sizestr(row.metadata.root_partition_used_capacity_mb, 'M', 1024)
                return this.$t('compute.text_1330') + used + this.$t('compute.text_1331') + total
              },
            },
            {
              field: 'storage',
              title: this.$t('compute.text_1332'),
              formatter: ({ cellValue, row }) => {
                const total = sizestr(row.storage, 'M', 1024)
                const used = sizestr(row.actual_storage_used, 'M', 1024)
                const allowedBrands = ['OneCloud', 'VMware']
                if (!allowedBrands.includes(row.brand)) return sizestr(cellValue, 'M', 1024)
                return this.$t('compute.text_1330') + used + this.$t('compute.text_1331') + total
              },
            },
            {
              field: 'storage_type',
              title: this.$t('compute.text_175'),
              formatter: ({ cellValue, row }) => {
                return storageType[cellValue]
              },
            },
            {
              field: 'storage_commit_rate',
              title: this.$t('compute.text_595'),
            },
            {
              field: 'storage_waste',
              title: h => {
                return [
                  <span class="mr-1">{this.$t('compute.text_599')}</span>,
                  <a-tooltip title={ this.$t('compute.text_1376') }>
                    <a-icon type="question-circle-o" />
                  </a-tooltip>,
                ]
              },
              formatter: ({ cellValue, row }) => {
                return sizestr(cellValue || 0, 'M', 1024)
              },
            },
            {
              field: 'reserved_storage',
              title: this.$t('compute.passthrough_reserved'),
              slots: {
                default: ({ row }, h) => {
                  const storage = row.reserved_resource_for_gpu && row.reserved_resource_for_gpu.reserved_storage
                  if (storage) {
                    return [
                      <a onClick={ () => this.$emit('tab-change', 'gpu-list') }>{ sizestr(storage, 'M', 1024) }</a>,
                    ]
                  }
                  return '-'
                },
              },
            },
            {
              title: '',
              field: 'storage_info',
              slots: {
                default: ({ row }, h) => {
                  return [
                    <vxe-grid class="mb-2" data={ row.storage_info } columns={ this.storageColumns } />,
                  ]
                },
              },
            },
          ],
        },
        {
          title: this.$t('compute.text_600'),
          field: 'nic_info',
          slots: {
            default: ({ row }, h) => {
              return [
                <vxe-grid class="mb-2" data={ row.nic_info } columns={ this.hostColumns } />,
              ]
            },
          },
        },
      ],
    }
  },
  // created () {
  //   this.updateDetailData()
  // },
  methods: {
    // updateDetailData () {
    //   const hostManager = new this.$Manager('hosts')
    //   hostManager.get({ id: this.data.id })
    //     .then((res) => {
    //       this.itemData = res.data
    //     })
    // },
    openHostAdjustOversoldRatioDialog () {
      this.createDialog('HostAdjustOversoldRatioDialog', {
        data: [this.data],
        columns: this.columns,
        onManager: this.onManager,
        name: this.$t('dictionary.host'),
        refresh: this.refresh,
      })
    },
  },
}
</script>
<style lang="less">
  .mem-edit-item {
    .edit-icon {
      display: none;
    }
    &:hover .edit-icon {
      display: inline;
    }
  }
</style>
