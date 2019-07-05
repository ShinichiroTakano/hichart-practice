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
    <div id="heat-map-card">
      <div id="progress-heat-map"></div>
    </div>
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
      },
      excludingList: [
        { min: 0, max: 0, isExcluded: false },
        { min: 1, max: 25, isExcluded: false },
        { min: 26, max: 50, isExcluded: false },
        { min: 51, max: 75, isExcluded: false },
        { min: 76, max: 100, isExcluded: false }
      ]
    } 
  },
  watch: {
    selectedStatuses() {
      // this.highChart.destroy()
      const heatMapElement = document.getElementById('progress-heat-map')
      // while (heatMapElement.firstChild) {
      //   heatMapElement.removeChild(heatMapElement.firstChild)
      // }
      const heatMapCard = document.getElementById('heat-map-card')
      heatMapCard.removeChild(heatMapElement);
      const div = document.createElement('div')
      div.setAttribute('id', 'progress-heat-map')
      heatMapCard.appendChild(div)
      this.highChart. redraw()
      this.highChart = this.createHeatMap()
    }
  },
  methods: {
    changeStatus(status) {
      /*
        ステータスが非選択になる
        ↓
        selectedStatusesからi番目の要素が削除される。
        ↓
        excludingList[i]のisExcludedをtrue
      */
      /*
        ステータスが選択される
        ↓
        selectedStatusesにi番目の要素が追加される。
        ↓
        excludingList[i]のisExcludedをfalse
      */
      const i = this.indexMap[status]
      if (this.selectedStatuses.includes(status)) {
        // ステータスが非選択になる
        this.selectedStatuses.splice(i, 1, 'notSelected')
        this.excludingList[i].isExcluded = true
      } else {
        // ステータスが選択される
        this.selectedStatuses[i] = status
        this.excludingList.isExcluded = false
      }
    },
    createHeatMap() {
      const [ heatMapCells, heatMapUsers ] = this.createHeatMapData()
      // hichartに渡すオブジェクトの中の関数ではthisの参照がvueインスタンスでなくchartインスタンスになるので、別変数に代入
      const quests = this.quests
      const users = heatMapUsers
      console.log('users', users)
      const userAccountQuestStatistics = this.userAccountQuestStatistics
      const cellLength = (window.innerWidth * 0.8 / 20)
      const minHeight = cellLength * users.length
      const minWidth = cellLength * quests.length
      return Highcharts.chart('progress-heat-map', {
        chart: {
          type: 'heatmap',
          scrollablePlotArea: {
            // minHeight,
            // minWidth
          },
          width: minWidth * 0.9,
          height: minHeight * 0.9
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
          data: heatMapCells
        }],
        tooltip: {
          formatter() {
            return `<b>進捗詳細</b> : ${this.point.value}%<br>
                    <b>最終更新日</b> : ${userAccountQuestStatistics[this.point.x][this.point.y].updated_at}`
          }
        },
        credits: {
          enabled: false
        }
      })
    },
    createHeatMapData() {
      const heatMapCells = []
      const heatMapUsers = JSON.parse(JSON.stringify(this.userAccounts))
      const heatMapUsersLength = heatMapUsers.length
      for (let i = heatMapUsersLength - 1; i >= 0; i--) {
        const user = heatMapUsers[i]
        console.log('i', i)
        console.log('user', user)
        questLoop: for (let j = 0; j < this.quests.length; j++) {
          const quest = this.quests[j]
          const progressRate = this.userAccountQuestStatistics[user.id][quest.id].progress_rate
          console.log('j', j)
          console.log('quest', quest)
          console.log('progressRate', progressRate)

          for (let judger of this.excludingList) {
            if (judger.isExcluded) {
              if (judger.min <= progressRate && progressRate <= judger.max) {
                heatMapUsers.splice(i, 1)
                while(j >= 0) {
                  heatMapCells.pop()
                  j--
                }
                break questLoop
              }
            }
          }
          const cell = [j, i, progressRate]
          heatMapCells.unshift(cell)
        }
      }
      for (let i = 0; i < heatMapUsers.length; i++) {
        const start = this.quests.length * i
        const end = this.quests.length * (i + 1)
        console.log('start', start)
        console.log('end', end)
        const row = heatMapCells.slice(start, end)
        console.log('row', row)
        for (const heatMapCell of row) {
          heatMapCell[1] = i
        }
      }
      console.log('heatMapUsers', "---------------")
      console.table(heatMapUsers)
      console.log("---------------")
      console.log('heatMapCells', "---------------")
      console.table(heatMapCells)
      console.log("---------------")
      return [heatMapCells, heatMapUsers]
    }
  },
  mounted () {
    this.highChart = this.createHeatMap('progress-heat-map')
  }
}
</script>
<style>
.status-legend {
  display: flex;
  align-items: center;

}


</style>

