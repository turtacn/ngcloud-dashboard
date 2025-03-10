<template>
  <detail
    :on-manager="onManager"
    :data="data"
    :base-info="baseInfo"
    :extra-info="extraInfo"
    resource="elasticcaches"
    statusModule="redis" />
</template>

<script>
import * as R from 'ramda'
import { categoryMap } from '../constants'
// import { NODE_TYPE, PERFORMANCE_TYPE } from '@DB/views/redis/constants'

import {
  getUserTagColumn,
} from '@/utils/common/detailColumn'

import {
  getBrandTableColumn,
  getSwitchTableColumn,
  getBillingTypeTableColumn,
} from '@/utils/common/tableColumn'
import { sizestr } from '@/utils/utils'
import WindowsMixin from '@/mixins/windows'

export default {
  name: 'MongodbDetail',
  mixins: [WindowsMixin],
  props: {
    onManager: {
      type: Function,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    columns: Array,
  },
  data () {
    return {
      baseInfo: [
        getUserTagColumn({ onManager: this.onManager, resource: 'mongodb', columns: () => this.columns, tipName: this.$t('dictionary.mongodb') }),
        getBrandTableColumn(),
        getBillingTypeTableColumn(),
        {
          field: 'zone',
          title: this.$t('db.text_133'),
          slots: {
            default: ({ row }) => {
              if (!R.isNil(row.slave_zone_infos)) {
                const sl = row.slave_zone_infos.map(v => {
                  return <div>{v.name}({this.$t('db.text_164')})</div>
                })
                return [<div>{row.zone ? row.zone + '(' + this.$t('db.text_165') + ')' : '-'}</div>, ...sl]
              }
              return row.zone || '-'
            },
          },
        },
      ],
      extraInfo: [
        {
          title: this.$t('db.text_166'),
          items: [
            {
              title: this.$t('db.text_377'),
              slots: {
                default: ({ row }) => {
                  return `${row.engine || ''} ${row.engine_version || ''}`
                },
              },
            },
            {
              title: this.$t('db.text_119'),
              slots: {
                default: ({ row }) => {
                  const { category } = row
                  if (categoryMap[category]) {
                    if (category === 'sharding') { // 分片
                      return (categoryMap[row.category] + `(${this.$t('db.text_383', [row.replication_num || 0])})`)
                    } else if (category === 'replicate') { // 集群
                      return (categoryMap[row.category] + `(${this.$t('db.text_382', [row.replication_num || 0])})`)
                    }
                  }
                  return '-'
                },
              },
            },
            {
              field: 'vcpu_count',
              title: 'CPU',
              slots: {
                default: ({ row }) => {
                  return this.$t('db.text_125', [row.vcpu_count || 0])
                },
              },
            },
            {
              field: 'vmem_size_mb',
              title: this.$t('db.text_132'),
              slots: {
                default: ({ row }) => {
                  return sizestr(row.vmem_size_mb, 'M', 1024)
                },
              },
            },
            {
              title: this.$t('cloudenv.text_6'),
              slots: {
                default: ({ row }) => {
                  return sizestr(row.disk_size_mb, 'M', 1024)
                },
              },
            },
            {
              field: 'connections',
              title: this.$t('db.max_connections'),
              slots: {
                default: ({ row }) => {
                  return row.connections || '-'
                },
              },
            },
            {
              field: 'iops',
              title: 'IOPS',
              slots: {
                default: ({ row }) => {
                  return row.iops || '-'
                },
              },
            },
          ],
        },
        {
          title: this.$t('db.text_171'),
          items: [
            {
              field: 'ip_addr',
              title: this.$t('db.text_152'),
              slots: {
                default: ({ row }) => {
                  if (!row.ip_addr) return '-'
                  const ret = row.ip_addr.split(';').map(ip => {
                    return <list-body-cell-wrap hide-field copy row={{ ip: `${ip}:${row.port}` }} field="ip">{`${ip}:${row.port}`}</list-body-cell-wrap>
                  })
                  return ret
                },
              },
            },
            {
              field: 'vpc',
              title: 'VPC',
              slots: {
                default: ({ row }) => {
                  return row.vpc || '-'
                },
              },
            },
            {
              field: 'network',
              title: this.$t('db.text_176'),
              slots: {
                default: ({ row }) => {
                  return row.network || '-'
                },
              },
            },
          ],
        },
        {
          title: this.$t('db.text_179'),
          items: [
            getSwitchTableColumn({
              field: 'disable_delete',
              title: this.$t('common.text00076'),
              change: val => {
                this.onManager('update', {
                  id: this.data.id,
                  managerArgs: {
                    data: { disable_delete: val },
                  },
                })
              },
            }),
          ],
        },
      ],
    }
  },
  methods: {
    async fetchSwitchPublic (bool) {
      if (bool) {
        return this.onManager('performAction', {
          steadyStatus: 'running',
          id: this.data.id,
          managerArgs: {
            action: 'allocate-public-connection',
          },
        })
      } else {
        return this.onManager('performAction', {
          steadyStatus: 'running',
          id: this.data.id,
          managerArgs: {
            action: 'release-public-connection',
          },
        })
      }
    },
    handleSwitchPublicAddress (bool) {
      const txts = {
        true: {
          title: this.$t('db.text_180'),
          content: this.$t('db.text_326'),
        },
        false: {
          title: this.$t('db.text_181'),
          content: this.$t('db.text_182'),
        },
      }
      this.createDialog('ConfirmDialog', {
        ...txts[`${bool}`],
        onOk: () => {
          return this.fetchSwitchPublic(bool)
        },
      })
    },
  },
}
</script>
