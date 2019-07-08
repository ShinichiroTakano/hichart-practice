<template>
  <div>
    <div class="status-legend">
      <heat-map-status-label
        v-for="status of statusMaster"
        :key="status.id"
        :statusId="status.id"
        :statusName="status.name"
        :statusColor="status.color"
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
  name: 'quest-progress-heat-map',
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
    const statusMaster = [
      {id: 'not-started', name: '進捗なし', min: 0, max: 0, color: 'white' },
      {id: 'first-quarter', name: '1~25%', min: 1, max: 25, color: 'rgb(222,237,250)' },
      {id: 'second-quarter', name: '26~50%', min: 26, max: 50, color: 'rgb(190,218,246)' },
      {id: 'third-quarter', name: '51~75%', min: 51, max: 75, color: 'rgb(142,191,239)' },
      {id: 'fourth-quarter', name: '76~99%', min: 76, max: 99, color: 'rgb(125,182,236)' },
      {id: 'quest-clear', name: 'Questクリア', min: 100, max: 100, color: 'rgb(46,13,239)' }
    ]
    return {
      highChart: null,
      statusMaster: [...statusMaster],
      selectedStatuses: [...statusMaster]
    } 
  },
  watch: {
    selectedStatuses(newValue, oldValue) {
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
      } else {
        // ステータスが選択される
        this.selectedStatuses.push(clickedStatus)
      }
    },
    selectUsers() {
      const selectedUsers = []
      const checkedUsers = JSON.parse(JSON.stringify(this.userAccounts))
      for(const status of this.selectedStatuses) {
        const checkedUsersLen = checkedUsers.length
        userLoop: for(let i = checkedUsersLen - 1; i >= 0; i--) {
          const user = checkedUsers[i]
          for(const quest of this.quests) {
            const progressRate = this.userAccountQuestStatistics[user.id][quest.id].progress_rate
            if (status.min <= progressRate && progressRate <= status.max) {
              selectedUsers.unshift(user)
              checkedUsers.splice(i, 1)
              break;
            }
          }
        }
      }
      console.log('selectedUsers', selectedUsers)
      return selectedUsers.sort((a, b) => {
        if (a.id > b.id) {
          return 1
        } else if (a.id < b.id) {
          return -1
        }
        return 0
      })
    },
    createHeatMap(users) {
      const cells = this.createCells(users)
      // hichartに渡すオブジェクトの中の関数ではthisの参照がvueインスタンスでなくchartインスタンスになるので、別変数に代入
      const quests = this.quests
      const userAccountQuestStatistics = this.userAccountQuestStatistics
      const screenQuestCount = quests.length > 10 ? 20 : 10
      const cellLength = (window.innerWidth * 0.7 / screenQuestCount)
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
        plotOptions: {
          heatmap: {
            turboThreshold: 2000
          }
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
          borderWidth: 1,
          data: cells
        }],
        tooltip: {
          formatter() {
            return `<b>進捗詳細</b> : ${this.point.z}%<br>
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
          // const cell = [j, i, progressRate]
          let color;
          for (let status of this.statusMaster) {
            if (status.min <= progressRate && progressRate <= status.max) {
              color = status.color
              break
            }
          }
          const cell = { x: j, y: i, z: progressRate, color }
          cells.push(cell)
        }
      }
      console.table(cells)
      return cells
    }
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

