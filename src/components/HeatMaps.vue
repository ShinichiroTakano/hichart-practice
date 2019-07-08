<template>
  <div class="heat-maps-card">
    <heat-map-tabs
      :selectedTab="selectedTab"
      :tabs="tabs"
      @swithch-tab="switchTab" />
    <quest-progress-heat-map
      :user-account-quest-statistics="userAccountQuestStatistics"
      :user-accounts="userAccounts"
      :quests="quests"
      v-if="selectedTab === 'QUEST_PROGRESS'" />
    <last-mission-heat-map
      :user-account-quest-statistics="userAccountQuestStatistics"
      :user-accounts="userAccounts"
      :quests="quests"
      v-if="selectedTab === 'LAST_MISSION'" />
  </div>
</template>
<script>
import HeatMapTabs from './HeatMapTabs.vue'
import QuestProgressHeatMap from './QuestProgressHeatMap.vue'
import LastMissionHeatMap from './LastMissionHeatMap.vue'
export default {
  name: 'heat-maps',
  data() {
    return {
      selectedTab: 'QUEST_PROGRESS',
      tabs: [
        {id: 'QUEST_PROGRESS', name: 'Quest進捗率'},
        {id: 'LAST_MISSION', name: 'LastMission状況'}
      ]
    }
  },
  components: {
    HeatMapTabs,
    QuestProgressHeatMap,
    LastMissionHeatMap
  },
  computed: {
    userAccounts() {
      return [...Array(5).keys()].map(e => ({ id: e, name: `user${e}`}))
    },
    quests() {
      return [...Array(5).keys()].map(e => ({ id: e, name: `Q${e}`}))
    },
    userAccountQuestStatistics() {
      return this.userAccounts.reduce((accumulater, user) => {
        const userId = user.id
        accumulater[userId] = {}
        for (const quest of this.quests) {
          const questId = quest.id
          accumulater[userId][questId] = {}
          accumulater[userId][questId].progress_rate = Math.floor( Math.random() * 101 )
          accumulater[userId][questId].updated_at = '2019-07-01'
        }
        return accumulater
      }, {})
    }
  },
  methods: {
    switchTab(tabId) {
      this.selectedTab = tabId
    }
  }
}
</script>
<style>
.heat-maps-card {
  padding: 20px;
}
</style>

