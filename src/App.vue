<template>
  <div id="app">
    <!-- <BusinessTypesSelect
      :businessTypes="[{ id: 1, name: 'aaaa' }, { id: 2, name: 'bbbb' }, { id: 3, name: 'cccc' }]"
      :selectedBusinessTypes="[{ id: 1, name: 'aaaa' }]"/> -->
    <!-- <heat-maps /> -->

    <slider
      :width="300"
      format="push"
      direction="left"
      :opacity="0"
      :links="[
        {'id': 1, 'text': 'Link 1', 'url': 'https://github.com'},
        {'id': 2, 'text': 'Link 2', 'url': 'https://github.com'},
        {'id': 3, 'text': 'Link 3', 'url': 'https://github.com'}
      ]"
    />
    <p style="font-size:30px;color:red;">&#8942;</p>
    <!-- <user-account-quest-heat-map
      :user-account-quest-statistics="userAccountQuestStatistics"
      :users="userAccount()"
      :quests="quests()" /> -->
    <!-- <UserProcessStatus 
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
    /> -->
  </div>
</template>

<script>
import BusinessTypesSelect from './components/BusinessTypesSelect.vue'
import UserProcessStatus from './components/UserProcessStatus.vue'
import UserAccountQuestHeatMap from './components/UserAccountQuestHeatMap.vue'
import HeatMaps from './components/HeatMaps.vue'
import Slider from './components/Slider.vue'

export default {
  name: 'app',
  components: {
    BusinessTypesSelect,
    HeatMaps,
    UserProcessStatus,
    UserAccountQuestHeatMap,
    Slider
  }
}
</script>

