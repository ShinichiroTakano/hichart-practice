<template>
  <div id="app">
    <!-- <BusinessTypesSelect
      :businessTypes="[{ id: 1, name: 'aaaa' }, { id: 2, name: 'bbbb' }, { id: 3, name: 'cccc' }]"
      :selectedBusinessTypes="[{ id: 1, name: 'aaaa' }]"/> -->
    <HeatMap
      :progress-list="{
        userId: {
          questId: 100,
          questId: 100,
          questId: 76,
          questId: 56,
          questId: 23,
          questId: 0,
          questId: 0,
          questId: 0,
          questId: 0,
          questId: 0
        }
      }"
      :user-accounts="[
        {
          id: 1,
          name: 'User1'
        }
      ]"
      :quests="[
        {
          id: 1,
          name: 'Q1'
        },
        {
          id: 2,
          name: 'Q2'
        },
        {
          id: 2,
          name: 'Q2'
        },
        {
          id: 2,
          name: 'Q2'
        },
        {
          id: 2,
          name: 'Q2'
        },
        {
          id: 2,
          name: 'Q2'
        },
        {
          id: 2,
          name: 'Q2'
        }
      ]"/>
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
    
  </div>
</template>

<script>
import BusinessTypesSelect from './components/BusinessTypesSelect.vue'
import HeatMap from './components/HeatMap.vue'
import UserProcessStatus from './components/UserProcessStatus.vue'

export default {
  name: 'app',
  components: {
    BusinessTypesSelect,
    HeatMap,
    UserProcessStatus
  }
}
</script>

