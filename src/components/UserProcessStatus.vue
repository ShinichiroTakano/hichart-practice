<template>
  <div>
    <select id="status-change">
      <option v-for="s in series"
        :value="s.key"
        :key="s.name">{{s.name}}
      </option>
    </select>
    <div id="user-progress-status-bar" style="width:100%; height:400px;"></div>
  </div>
</template>
<script>
const Highcharts = require('highcharts')
const series = [
  {
    name: 'Questクリア',
    key: 'clear'
  },
  {
    name: 'LastMission中',
    key: 'lastMission'
  },
  {
    name: '76~100%',
    key: 'fourthQuarter'
  },
  {
    name: '51~75%',
    key: 'thirdQuarter'
  },
  {
    name: '26~50%',
    key: 'secondQuarter'
  },
  {
    name: '1~25%',
    key: 'firstQuarter'
  },
  {
    name: '進捗なし',
    key: 'notStarted'
  }
]
export default {
  name: 'user-process-status',
  props: {
    users: {
      type: Array,
      required: true
    },
    questCounts: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      series,
      newPoints: []
    }
  },
  mounted() {
    let questTotalCount = 0;
    // クエストの数を計算
    for(const userStatus of Object.keys(this.questCounts)){
      questTotalCount += this.questCounts[userStatus][0]
    }
    let categories = this.users.map(e => e.name)

    Highcharts.chart('user-progress-status-bar', {
      chart: {
        type: 'bar',
        events: {
          load() {
            var chart = this
            var pointsList = []
            for (const s of chart.series) {
              pointsList.push(s.points)
            }
            var newPointsList = []

              console.log('this', this)
            for (let i = 0; i < pointsList.length; i++) {
              const points = pointsList[i]
              let newPoints = newPointsList[i]
              newPoints = []
              Highcharts.each(points, (point, j) => {
                point.update({
                  name: categories[j]
                }, false)
                newPoints.push({
                  x: point.x,
                  y: point.y,
                  name: point.name
                })
              })
              newPointsList.push(newPoints)
            }
            console.log('newPointsList', newPointsList)
            chart.redraw();

            const userStatusSelect = document.getElementById('status-change')
            userStatusSelect.addEventListener('change', event => {
              console.log('event', event)
              const selectedKey = event.target.value
              console.log('selectedKey', selectedKey)
              const i = series.findIndex(s => s.key === selectedKey)
              console.log('i', i)
              const selectedNewPoints = newPointsList[i]
              selectedNewPoints.sort((a, b) => {
                return a.y - b.y
              })
              const indexMap = {}
              Highcharts.each(selectedNewPoints, (el, i) => {
                indexMap[el.x] = i
              })
              for (let i = 0; i < newPointsList.length; i++) {
                const newPoints = newPointsList[i]
                Highcharts.each(newPoints, el => {
                  el.x = indexMap[el.x]
                })
                chart.series[i].setData(newPoints, true, false, false)
              }
              categories = categories.reduce((accumulator, currentValue, i) => {
                  console.log('indexMap', indexMap)
                  console.log('i', i)
                  accumulator[indexMap[i]] = currentValue
                  return accumulator
                }, [])
              chart.xAxis[0].update({
                categories
              })
            })
          }
        }
      },
      title: {
        text: ''
      },
      colors: ['#A9A9A9', '#4682B4', '#48D1CC', '#8FBC8F', '#FFFACD', '#FF0000', '#3CB371'].reverse(),
      xAxis: {
        categories
      },
      yAxis: {
        max: questTotalCount,
        title: {
          text: '',
        }, 
        opposite: true
      },
      legend: {
        reversed: true,
        verticalAlign: 'top'
      },
      plotOptions: {
        series: {
          stacking: 'normal'
        }
      },
      series: series.map(e => {
        return { name: e.name, data: this.questCounts[e.key] }
      }),
      credits: {
        enabled: false
      },
      tooltip: {
        formatter () {
          return `${this.series.name} : ${this.y}個`
        }
      }
    });
  }
}
</script>
