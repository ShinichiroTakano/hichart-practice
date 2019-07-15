<template>
  <span style="margin-top: 40px;">
    <span
      :id="statusId"
      class="status-label"
      @click="emitChangeStatus(statusId)"
      :style="notSelected">
      <span class="status-circle" :style="circleColor"></span>
      <span class="status-string">{{statusName}}</span>
    </span>
  </span>
</template>
<script>
export default {
  name: 'heta-map-status-label',
  props: {
    selectedStatuses: {
      type: Array,
      required: true
    },
    statusId: {
      type: String,
      required: true
    },
    statusName: {
      name: String,
      required: true
    },
    statusColor: {
      name: String,
      required: true
    }
  },
  data() {
    return {

    }
  },
  computed: {
    circleColor() {
      return { 'background-color': this.statusColor }
    },
    notSelected() {
      if (this.selectedStatuses.some(status => this.statusId === status.id)) {
        return {}
      } else {
        return { color: '#cccccc' }
      }
    }
  },
  methods: {
    emitChangeStatus(status) {
      // 親のコンポーネントに変更を伝える。
      this.$emit('change-status', status)
    }
  }
}
</script>
<style>
  .status-label {
    margin-top: 30px;
    cursor: pointer;
  }
  #not-started > .status-circle {
    background-color: white;
    border: 1px solid black;
  }
  .status-circle {
    margin-left: 12px;
    margin-right: 5px;
    border-radius: 50%;
    width: 15px;
    height: 15px;
    display: inline-block
  }
  .status-string {
    margin-left: 8px;
    font-size: 15px;
    font-weight: bold;
  }
</style>
