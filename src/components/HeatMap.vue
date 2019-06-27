<template>
  <div>
    <div id="progress-heat-map" style="height: 800px;min-width: 310px; max-width: 800px; margin: 0 auto"></div>
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
    const users = this.userAccounts
    const userAccountQuestStatistics = this.userAccountQuestStatistics
    const heatMapContent = []
    for (let i = 0; i < quests.length; i++) {
      const quest = quests[i]
      for (let j = 0; j < users.length; j++) {
        const user = users[j]
        const cell = []
        cell[0] = i
        cell[1] = j
        cell[2] = userAccountQuestStatistics[user.id][quest.id].progress_rate
        heatMapContent.push(cell)
      }
    }
    
    Highcharts.chart('progress-heat-map', {
      chart: {
        type: 'heatmap'
      },
      title: {
        text: 'Quests'
      },
      xAxis: {
        categories: quests.map(e => e.name),
        title: 'Quests',
        margin: 30
      },
      yAxis: {
        categories: users.map(e => e.name),
        title: 'Users'
      },
      colorAxis: {
          min: 0,
          minColor: '#FFFFFF',
          maxColor: Highcharts.getOptions().colors[0]
      },
      legend: {
        align: 'right',
        layout: 'vertical',
        margin: 20,
        verticalAlign: 'top',
        y: 50,
        symbolHeight: 700
      },
      series: [{
        name: 'Sales per employee',
        borderWidth: 1,
        data: heatMapContent
      }],
      credits: {
        enabled: false
      }
    })
  },
  methods: {
  }
}
</script>
