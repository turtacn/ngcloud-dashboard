<template>
  <div>
    <a-tabs v-if="resType === 'guest'" default-active-key="basic" @change="handleTabChange">
      <a-tab-pane key="basic" :tab="$t('compute.logging.basic')">
        <base-logging :data="data" :constants="loggingConstants" :resId="serverId" />
      </a-tab-pane>
      <a-tab-pane key="agent" :tab="$t('compute.logging.agent')">
        <div>
          <install-agent-form-visible
            :data="installData"
            :serverColumns="serverColumns"
            :isPageDestroyed="isPageDestroyed" />
          <agent-logging
            :data="data"
            key="logging-agent"
            :constants="agentLogging"
            :resId="serverId" />
        </div>
      </a-tab-pane>
    </a-tabs>
    <div v-else>
      <!-- <install-agent-form-visible
        :data="data"
        :serverColumns="serverColumns" /> -->
      <agent-logging
        :data="data"
        key="logging-agent"
        :constants="agentLogging"
        :resId="serverId"
        idKey="host_id" />
    </div>
  </div>
</template>

<script>
import * as R from 'ramda'
import BaseLogging from '@Compute/sections/monitor/BaseMonitor'
import AgentLogging from '@Compute/sections/monitor/AgentMonitor.vue'
import InstallAgentFormVisible from '@Compute/views/vminstance/components/InstallAgentFormVisible'
import { ONECLOUD_MONITOR, VMWARE_MONITOR, OTHER_MONITOR, AGENT_MONITOR, HOST_AGENT_MONITOR } from '../constants'
import { HYPERVISORS_MAP } from '@/constants'
import WindowsMixin from '@/mixins/windows'

export default {
  name: 'VminstanceLoggingSidepage',
  components: {
    BaseLogging,
    AgentLogging,
    InstallAgentFormVisible,
  },
  mixins: [WindowsMixin],
  props: {
    data: { // listItemData
      type: Object,
      required: true,
    },
    serverColumns: {
      type: Array,
      required: true,
    },
    resType: {
      type: String,
      required: true,
    },
    isPageDestroyed: Boolean,
  },
  data () {
    return {
      alertType: 'warning',
      time: '1h',
      timeGroup: '1m',
      loggingList: [],
    }
  },
  computed: {
    hypervisor () {
      return this.data.hypervisor
    },
    loggingConstants () {
      if (this.hypervisor === HYPERVISORS_MAP.esxi.key) {
        return VMWARE_MONITOR
      } else if (this.hypervisor === HYPERVISORS_MAP.kvm.key) {
        return ONECLOUD_MONITOR
      } else {
        return OTHER_MONITOR
      }
    },
    serverId () {
      return this.data.res_id
    },
    agentLogging () {
      if (this.resType === 'guest') {
        return AGENT_MONITOR
      }
      return HOST_AGENT_MONITOR
    },
    installData () {
      return Object.assign({}, R.clone(this.data), { id: this.data.res_id })
    },
  },
  methods: {
    handleTabChange (tab) {
    },
  },
}
</script>
