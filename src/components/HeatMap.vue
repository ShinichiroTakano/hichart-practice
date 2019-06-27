<template>
  <div>
    <div id="quest-progress-heat-map" style="width:100%; height:400px;"></div>
  </div>
</template>
<script>
const Highcharts = require('highcharts')
const ALL_USERS = '全体(ユーザー上限)'
const INVITED_USERS = '招待済み'
const ACTIVE_USERS = 'アクティブ化'
const PROGRESSING_USERS = '進捗あり'
const FINISH_USERS = 'Questクリア'
const INACTIVE_USERS = '非アクティブ'

export default {
  name: 'users-status-chart',
  props: {
    allUsersCount: {
      type: Number,
      required: true
    },
    invitedUsersCount: {
      type: Number,
      required: true
    },
    activeUsersCount: {
      type: Number,
      required: true
    },
    progressingUsersCount: {
      type: Number,
      required: true
    },
    questFinishUsersCount: {
      type: Number,
      required: true
    },
    inactiveUsersCount: {
      type: Number,
      required: true
    }
  },
  mounted () {
    const invitedPercent = this.convertPercent(this.invitedUsersCount)
    const activePercent = this.convertPercent(this.activeUsersCount)
    const progressingPercent = this.convertPercent(this.progressingUsersCount)
    const questFinishPercent = this.convertPercent(this.questFinishUsersCount)
    const inactivePercent = this.convertPercent(this.inactiveUsersCount)
    var countMap = {
      [ALL_USERS]: this.allUsersCount,
      [INVITED_USERS]: this.invitedUsersCount,
      [ACTIVE_USERS]: this.activeUsersCount,
      [PROGRESSING_USERS]: this.progressingUsersCount,
      [FINISH_USERS]: this.questFinishUsersCount,
      [INACTIVE_USERS]: this.inactiveUsersCount
    }
    Highcharts.chart('quest-progress-heat-map', {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'ユーザーステータス',
        y: 23
      },
      xAxis: {
        categories: [ALL_USERS, INVITED_USERS, ACTIVE_USERS, PROGRESSING_USERS, FINISH_USERS],
        margin: 30
      },
      yAxis: {
        max: 100,
        title: ''
      },
      series: [{
        showInLegend: false,
        data: [100, invitedPercent, activePercent, progressingPercent, questFinishPercent]
      }],
      credits: {
        enabled: false
      },
      tooltip: {
        formatter () {
          return `${this.x}: ${countMap[this.x]}人`
        }
      }
    })
  },
  methods: {
    convertPercent (specifiedUserCount) {
      // 全ユーザに対する割合を%で算出する。
      return specifiedUserCount / this.allUsersCount * 100
    }
  }
}
</script>
