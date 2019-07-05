<template>
  <div>
    <div class="status-legend">
      <heat-map-status-label statusId="not-started" statusName="進捗なし" @change-status="changeStatus" :selectedStatuses ="selectedStatuses" />
      <heat-map-status-label statusId="first-quarter" statusName="1~25%" @change-status="changeStatus" :selectedStatuses ="selectedStatuses" />
      <heat-map-status-label statusId="second-quarter" statusName="26~50%" @change-status="changeStatus" :selectedStatuses ="selectedStatuses" />
      <heat-map-status-label statusId="third-quarter" statusName="51~75%" @change-status="changeStatus" :selectedStatuses ="selectedStatuses" />
      <heat-map-status-label statusId="fourth-quarter" statusName="76~100%" @change-status="changeStatus" :selectedStatuses ="selectedStatuses" />
      <!-- <span id="last-mission"><span class="status-circle"></span><span class="status-string">LastMission中</span></span>
      <span id="clear"><span class="status-circle"></span><span class="status-string">Questクリア</span></span> -->
    </div>
    <div id="progress-heat-map"></div>
  </div>
</template>
<script>
import Highcharts from 'highcharts';
import addHeatmapModule from 'highcharts/modules/heatmap';
import addTreemapModule from 'highcharts/modules/treemap';
import HeatMapStatusLabel from './HeatMapStatusLabel.vue'
function createHeatMapData(quests, users, userAccountQuestStatistics) {
  const heatMapData = []
  for (let i = 0; i < quests.length; i++) {
    const quest = quests[i]
    for (let j = 0; j < users.length; j++) {
      const user = users[j]
      const progressRate = userAccountQuestStatistics[user.id][quest.id].progress_rate
      const cell = [i, j, progressRate]
      heatMapData.push(cell)
    }
  }
  return heatMapData
}

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
      selectedStatuses: ['not-started', 'first-quarter', 'second-quarter', 'third-quarter', 'fourth-quarter'],
      /*
        selectedStatusesはindexに入る文字列が固定されています(indexMap)。
        選択されていない時は'notSelected'を入れるようにしています。
        上記のようにした理由は、index * 25で進捗率を出せるようにするためです。
      */
      indexMap: {
        'not-started': 0,
        'first-quarter': 1,
        'second-quarter': 2,
        'third-quarter': 3,
        'fourth-quarter': 4
      }
    } 
  },
  watch: {
    selectedStatuses() {
      console.log('this.highChart', this.highChart)
      this.highChart.destroy()
    }
  },
  computed: {
    notSelectedLabel() {
      
    }
  },
  methods: {
    changeStatus(status) {
      // ない時は足して、ある時は引く
      if (this.selectedStatuses.includes(status)) {
        const i = this.selectedStatuses.indexOf(status)
        this.selectedStatuses.splice(i, 1, 'notSelected')
      } else {
        this.selectedStatuses[this.indexMap[status]] = status
      }
    }
  },
  mounted () {
    const quests = this.quests
    const users = this.userAccounts.reverse()
    const userAccountQuestStatistics = this.userAccountQuestStatistics
    const heatMapData = createHeatMapData(quests, users, userAccountQuestStatistics)
    const cellLength = (window.innerWidth * 0.8 / 20)
    const minHeight = cellLength * users.length
    const minWidth = cellLength * quests.length
    this.highChart = Highcharts.chart('progress-heat-map', {
      chart: {
        type: 'heatmap',
        scrollablePlotArea: {
          // minHeight,
          // minWidth
        },
        width: minWidth * 0.9,
        height: minHeight * 0.9,
        events: {
          load() {
            var chart = this
            const firstQuarter = document.getElementById('first-quarter')
            firstQuarter.addEventListener('click', event => {
              console.log('event', event)
              const selectedKey = event.target.textContent
              const targetedUsers = []
              for (let i = 0; i < users.length; i++) {
                const user = users[i]
                const userAccountQuests = userAccountQuestStatistics[user.id]
                for(let questId of Object.keys(userAccountQuests)) {
                  const questData = userAccountQuests[questId]
                  console.log('questData', questData)
                  if (23 <= questData.progress_rate && questData.progress_rate <= 25) {
                    console.log('user.name', user.name)
                    targetedUsers.push(user)
                    break;
                  }
                }
              }
              console.log('targetedUsers', targetedUsers)
              const newHeatMapData = createHeatMapData(quests, targetedUsers, userAccountQuestStatistics)
              console.log('newHeatMapData', newHeatMapData)
              chart.series[0].remove();
              chart.addSeries({
                  borderWidth: 1,
                  data: newHeatMapData
              });
              // chart.series[0].setData(newHeatMapData, true, true, false)
              // chart.yAxis.update({
              //   categories: targetedUsers.map(e => e.name)
              // })
              chart.yAxis[0].update({categories: targetedUsers.map(e => e.name) }, true, true, false)
              // chart.redraw()
              // chart.setSize(cellLength * quests.length, cellLength * targetedUsers.length)
              // chart.setSize(null.null)
              console.log('cellLength * quests.length', cellLength * quests.length)
              console.log('cellLength * targetedUsers.length', cellLength * targetedUsers.length)
              chart.setSize(cellLength * quests.length, cellLength * targetedUsers.length, false)
            })
          }
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
        data: heatMapData
      }],
      tooltip: {
        formatter() {
          return `<b>進捗詳細</b> : ${this.point.value}%<br>
                  <b>最終更新日</b> : ${userAccountQuestStatistics[this.point.x][this.point.y].updated_at}
                 `
        }
      },
      credits: {
        enabled: false
      }
    })
  }
}
</script>
<style>
.status-legend {
  display: flex;
  align-items: center;

}


</style>

