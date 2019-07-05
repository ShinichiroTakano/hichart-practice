<template>
  <div id="app">
    <!-- <BusinessTypesSelect
      :businessTypes="[{ id: 1, name: 'aaaa' }, { id: 2, name: 'bbbb' }, { id: 3, name: 'cccc' }]"
      :selectedBusinessTypes="[{ id: 1, name: 'aaaa' }]"/> -->
    <HeatMap
      :user-account-quest-statistics="userAccountQuestStatistics"
      :user-accounts="userAccount()"
      :quests="quests()" />

    <user-account-quest-heat-map
      :user-account-quest-statistics="userAccountQuestStatistics"
      :users="userAccount()"
      :quests="quests()" />

    <UserProcessStatus 
      :users="[
        {
          id: 1,
          name: 'aaa'
        },
        {
          id: 2,
          name: 'bbb'
        },
        {
          id: 3,
          name: 'cccc'
        }
      ]"
      :questCounts="{
        notStarted: [0, 1, 13],
        firstQuarter: [3, 3, 2],
        secondQuarter: [2, 3, 2],
        thirdQuarter: [2, 1, 2],
        fourthQuarter: [1, 1, 0],
        lastMission: [7, 8, 1],
        clear: [5, 3, 0]
      }"
    />
    </user-account-quest-heat-map>
  </div>
</template>

<script>
import BusinessTypesSelect from './components/BusinessTypesSelect.vue'
import HeatMap from './components/HeatMap.vue'
import UserProcessStatus from './components/UserProcessStatus.vue'
import UserAccountQuestHeatMap from './components/UserAccountQuestHeatMap.vue'

export default {
  name: 'app',
  components: {
    BusinessTypesSelect,
    HeatMap,
    UserProcessStatus,
    UserAccountQuestHeatMap
  },
  computed: {
    userAccountQuestStatistics() {
      return [...Array(20).keys()].reduce((accumulater, userId) => {
        accumulater[userId] = {}
        for (let questId of [...Array(10).keys()]) {
          accumulater[userId][questId] = {}
          accumulater[userId][questId].progress_rate = Math.floor( Math.random() * 101 )
          accumulater[userId][questId].updated_at = '2019-07-01'
        }
        return accumulater
      }, {})
    },
  },
  methods: {
    userAccount() {
      return [...Array(10).keys()].map(e => ({ id: e, name: `user${e}`}))
    },
    quests() {
      return [...Array(10).keys()].map(e => ({ id: e, name: `Q${e}`}))
    }
  }
}
</script>

