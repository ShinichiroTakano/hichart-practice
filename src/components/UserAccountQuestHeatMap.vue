<template>
  <div style="overflow: scroll">
    <apexchart
      :width="heatMapWidth"
      :height="heatMapHight"
      type="heatmap"
      :options="options"
      :series="series">
    </apexchart>
  </div>
</template>
,<script>
export default {
  name: 'user-account-quest-heat-map',
  props: {
    userAccountQuestStatistics: {
      type: Object,
      required: true
    },
    users: {
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
      cellLength: 50,
      options: {
        chart: {
          id: 'user-account-quest-heat-map',
          type: 'heatmap',
          toolbar: {
            show: false
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          tooltip: {
            enabled: false
          },
          labels: {
            style: {
              fontSize: '12px'
            }
          }
        },
        noData: {
          text: 'No Data',
          align: 'center',
          verticalAlign: 'middle',
          offsetX: 0,
          offsetY: 0,
          style: {
            color: undefined,
            fontSize: '14px',
            fontFamily: undefined
          }
        },
        plotOptions: {
          heatmap: {
            shadeIntensity: 1,
            colorScale: {
              ranges: [{
                  from: 0,
                  to: 0.1,
                  name: '進捗なし',
                  color: '#ACACAC'
                },
                {
                  from: 1,
                  to: 25,
                  name: '1~25%',
                  color: '#1A3665'
                },
                {
                  from: 26,
                  to: 50,
                  name: '26~50%',
                  color: '#567CBB'
                },
                {
                  from: 51,
                  to: 75,
                  name: '51~75%',
                  color: '#8DA7D0'
                },
                {
                  from: 76,
                  to: 100,
                  name: '76~100%',
                  color: '#279DC9'
                }
              ]
            }
          }
        },
      },
      series: []
    }
  },
  computed: {
    heatMapWidth() {
      const cellLength = (window.innerWidth * 0.8 / 20)
      return cellLength * this.quests.length
    },
    heatMapHight() {
      const cellLength = (window.innerWidth * 0.8 / 20)
      return cellLength * this.users.length
    }
  },
  mounted() {
    this.createHeatMap()
  },
  methods: {
    createHeatMap() {
      const series = []
      const userCount = this.users.length
      for (let i = userCount - 1; i >= 0; i--) {
        const user = this.users[i]
        const userCells = {
          name: user.name,
          data: this.createUserData(i, user.id)
        }
        series.unshift(userCells)
      }
      this.series = series
    },
    createUserData(userId) {
      const userCells = []
      const questCount = this.quests.length
      for (let i = questCount - 1; i >= 0; i--) {
        const quest = this.quests[i]
        const x = quest.name
        const y = this.adjustProgressRate(this.userAccountQuestStatistics[userId][quest.id].progress_rate)
        userCells.unshift({ x, y })
      }
      return userCells
    },
    adjustProgressRate(rawRate) {
      if (rawRate === 0) {
        return 0.1
      } else if (0 < rawRate && rawRate <= 25) {
        return 25
      }else if ( 25 < rawRate && rawRate <= 50) {
        return 50
      }else if (50 < rawRate && rawRate <= 75) {
        return 75
      }else if (75 < rawRate && rawRate <= 100) {
        return 100
      }
    }
  }
}
</script>

<style>
</style>