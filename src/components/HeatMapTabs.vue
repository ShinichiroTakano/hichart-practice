<template>
  <div>
    <div class="heat-map-tabs">
      <span v-for="tab in tabs"
            :key="tab.id"
            :class="[selectedTab === tab.id ? 'selected-tab' : 'not-selected-tab',
                    'heat-map-tab']"
            @click="switchTab(tab.id)">{{ tab.name }}</span>
    </div>
    <div class="tabs-bottom-border"></div>
  </div>
</template>
<script>
export default {
  name: 'heat-maps-tabs',
  props: {
    selectedTab: {
      type: String,
      required: true
    },
    tabs: {
      type: Array,
      required: true
    }
  },
  methods: {
    switchTab(tabId) {
      this.$emit('swithch-tab', tabId)
    }
  }
}
</script>
<style>
.heat-map-tab {
  display: inline-block;
  width: 150px;
  height: 50px;
  font-size: 15px;
  text-align: center;
  line-height: 50px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.selected-tab{
  background-color: #4169E1;
  color: white;
  font-weight: bold;
}
.not-selected-tab {
  background-color: white;
  color: black;
  border: solid 1px #4169E1;
  border-bottom: none;
}
.heat-map-tab + .heat-map-tab {
  margin-left: 20px;
}
.tabs-bottom-border {
  width: 70%;
  height: 1px;
  background-color: #4169E1;
  position: relative;
  top: -1px;
}
</style>

