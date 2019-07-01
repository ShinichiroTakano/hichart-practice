<template>
  <div>
    <div id="progress-heat-map">
    </div>
  </div>
</template>
<script>
import Highcharts from 'highcharts';
import addHeatmapModule from 'highcharts/modules/heatmap';
import addTreemapModule from 'highcharts/modules/treemap';

addHeatmapModule(Highcharts);
addTreemapModule(Highcharts);

export default {
  name: 'progress-heat-map',
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
  mounted () {
    const quests = this.quests
    const users = this.userAccounts.reverse()
    const userAccountQuestStatistics = this.userAccountQuestStatistics
    const heatMapContent = []
    for (let i = 0; i < quests.length; i++) {
      const quest = quests[i]
      for (let j = 0; j < users.length; j++) {
        const user = users[j]
        const progressRate = userAccountQuestStatistics[user.id][quest.id].progress_rate
        const cell = [i, j, progressRate]
        heatMapContent.push(cell)
      }
    }
    const cellLength = (window.innerWidth * 0.8 / 20)
    const minHeight = cellLength * users.length
    const minWidth = cellLength * quests.length
    Highcharts.chart('progress-heat-map', {
      chart: {
        type: 'heatmap',
        scrollablePlotArea: {
          minHeight,
          minWidth
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
        opposite: true
      },
      yAxis: {
        categories: users.map(e => e.name),
        title: ''
      },
      colorAxis: {
        minColor: '#FFFFFF',
        maxColor: Highcharts.getOptions().colors[0],
        gridLineWidth: 0
      },
      legend: {
        align: 'left',
        layout: 'vertical',
        verticalAlign: 'middle',
        symbolHeight: minHeight * 0.8
      },
      series: [{
        borderWidth: 1,
        data: heatMapContent
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
