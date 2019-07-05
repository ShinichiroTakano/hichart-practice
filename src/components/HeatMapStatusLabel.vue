<template>
  <span>
    <span
      :id="statusId"
      class="status-label"
      @click="emitChangeStatus(statusId)"
      :style="notSelectedLabel">
      <span class="status-circle"></span>
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
    }
  },
  data() {
    return {

    }
  },
  computed: {
    notSelectedLabel() {
      if (this.selectedStatuses.includes(this.statusId)) {
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
    cursor: pointer;
  }
  .status-circle {
    margin-left: 8px;
    border-radius: 50%;
    width: 10px;
    height: 10px;
    display: inline-block
  }
  .status-string {
    margin-left: 8px;
    font-size: 12px;
    font-weight: bold;
  }

  #not-started > .status-circle {
      background-color: white;
      border: 1px solid black;
  }
  #first-quarter > .status-circle {
    background-color: rgb(222,237,250);
  }
  #second-quarter > .status-circle {
    background-color: rgb(163,203,242);
  }
  #third-quarter > .status-circle {
    background-color: rgb(154,198,240);
  }
  #fourth-quarter > .status-circle {
    background-color: rgb(124,181,236);
  }
  #last-mission > .status-circle {
    background-color: ;
  }
</style>