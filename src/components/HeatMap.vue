<template>
  <div>
    <div class="status-legend">
      <heat-map-status-label
        v-for="status of statusMaster"
        :key="status.id"
        :statusId="status.id"
        :statusName="status.name"
        @change-status="changeStatus"
        :selectedStatuses ="selectedStatuses" />
    </div>
    <div id="progress-heat-map"></div>
  </div>
</template>
<script>
import Highcharts from 'highcharts';
import addHeatmapModule from 'highcharts/modules/heatmap';
import addTreemapModule from 'highcharts/modules/treemap';
import HeatMapStatusLabel from './HeatMapStatusLabel.vue';

addHeatmapModule(Highcharts);
addTreemapModule(Highcharts);

export default {
  name: 'progress-heat-map',
  components: {
    HeatMapStatusLabel
  },
  props: {
    userAccountQuestStatistics: {
      type: Object,
      required: true
    },
    userAccounts: {
      type: Array,
      required: true
    },
    quests: {
      type: Array,
      required: true
    }    
  },
  data() {
    return {
      highChart: null,
      statusMaster: [
        {id: 'not-started', name: '進捗なし', min: 0, max: 0 },
        {id: 'first-quarter', name: '1~25%', min: 1, max: 25 },
        {id: 'second-quarter', name: '26~50%', min: 26, max: 50 },
        {id: 'third-quarter', name: '51~75%', min: 51, max: 75 },
        {id: 'fourth-quarter', name: '76~100%', min: 76, max: 100 }
      ],
      selectedStatuses: [],
      excludingRangeList: []
    } 
  },
  watch: {
    selectedStatuses() {
      this.highChart.destroy()
      this.highChart = this.createHeatMap(this.selectUsers())
    }
  },
  methods: {
    changeStatus(statusId) {
     const clickedStatus = this.statusMaster.find(status => status.id === statusId)
      if (this.selectedStatuses.some(status => statusId === status.id)) {
        // ステータスが非選択になる
        this.selectedStatuses = this.selectedStatuses.filter(status => status.id !== statusId)
        this.excludingRangeList.push(clickedStatus)
      } else {
        // ステータスが選択される
        this.selectedStatuses.push(clickedStatus)
        this.excludingRangeList = this.excludingRangeList.filter(e => e.id !== statusId)
      }
    },
    selectUsers() {
      const excludedUserIds = []
      for(const excludingRange of this.excludingRangeList) {
        for(const user of this.userAccounts) {
          for(const quest of this.quests) {
            const progressRate = this.userAccountQuestStatistics[user.id][quest.id].progress_rate
            if (excludingRange.min <= progressRate && progressRate <= excludingRange.max) {
              excludedUserIds.push(user.id)
              break
            }
          }
        }
      }
      const selectedUsers = this.userAccounts.filter(user => !excludedUserIds.includes(user.id))
      console.log('selectedUsers', selectedUsers);
      return selectedUsers
    },
    createHeatMap(users) {
      const cells = this.createCells(users)
      // hichartに渡すオブジェクトの中の関数ではthisの参照がvueインスタンスでなくchartインスタンスになるので、別変数に代入
      const quests = this.quests
      const userAccountQuestStatistics = this.userAccountQuestStatistics
      const cellLength = (window.innerWidth * 0.8 / 20)
      console.log('cellLength', cellLength);
      const minHeight = cellLength * users.length + 50
      const minWidth = cellLength * quests.length + 50
      return Highcharts.chart('progress-heat-map', {
        chart: {
          type: 'heatmap',
          scrollablePlotArea: {
            minHeight,
            minWidth
          },
          width: minWidth * 0.99999,
          height: minHeight * 0.99999
        },
        title: {
          text: ''
        },
        xAxis: {
          categories: quests.map(e => e.name),
          title: '',
          opposite: true,
          labels: {
            formatter() {
              return `<a href="categoryLinks[this.value]">${this.value}</a>`;
            },
            useHTML: true
          }
        },
        yAxis: {
          categories: users.map(e => e.name),
          title: '',
          labels: {
            formatter() {
              const pos = this.pos
              return `<a href="categoryLinks[this.value]">${this.value}</a>`;
            },
            useHTML: true
          }
        },
        colorAxis: {
          minColor: '#FFFFFF',
          maxColor: Highcharts.getOptions().colors[0],
          gridLineWidth: 0
        },
        series: [{
          data: cells
        }],
        tooltip: {
          formatter() {
            return `<b>進捗詳細</b> : ${this.point.value}%<br>
                    <b>最終更新日</b> : ${userAccountQuestStatistics[this.point.x][this.point.y].updated_at}`
          }
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        }
      })
    },
    createCells(users) {
      const cells = []
      const usersLength = users.length
      const questLength = this.quests.length
      for (let i = 0; i < usersLength; i++) {
        const user = users[i]
        for (let j = 0; j < questLength; j++) {
          const quest = this.quests[j]
          const progressRate = this.userAccountQuestStatistics[user.id][quest.id].progress_rate
          const cell = [j, i, progressRate]
          cells.push(cell)
        }
      }
      // console.log('users', "---------------")
      // console.table(users)
      // console.log("---------------")
      // console.log('cells', "---------------")
      // console.table(cells)
      // console.log("---------------")
      return cells
    }
  },
  created () {
    this.selectedStatuses = JSON.parse(JSON.stringify(this.statusMaster))
  },
  mounted () {
    this.highChart = this.createHeatMap(this.userAccounts)
  }
}
</script>
<style>
.status-legend {
  display: flex;
  align-items: center;
}


</style>

