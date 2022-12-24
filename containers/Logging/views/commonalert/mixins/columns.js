import { levelColumn, strategyColumn, projectTableColumn, getResTypeColumn } from '../utils'
import { getNameDescriptionTableColumn, getStatusTableColumn, getEnabledTableColumn, getTimeTableColumn } from '@/utils/common/tableColumn'

export default {
  created () {
    this.columns = [
      getNameDescriptionTableColumn({
        onManager: this.onManager,
        hideField: true,
        edit: row => row.alert_type !== 'system',
        formRules: [{ required: true, message: `${this.$t('common.placeholder')}${this.$t('common.name')}` }],
        slotCallback: row => {
          return (
            <side-page-trigger onTrigger={() => this.handleOpenSidepage(row)}>{ row.name }</side-page-trigger>
          )
        },
      }),
      getStatusTableColumn({ statusModule: 'commonalert', minWidth: 50 }),
      getEnabledTableColumn({ minWidth: 50 }),
      getResTypeColumn(),
      strategyColumn(),
      levelColumn,
      projectTableColumn,
      getTimeTableColumn(),
    ]
  },
}
