import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCheckSquare, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { faSquare } from '@fortawesome/free-regular-svg-icons'
import quest from './quest.js'
import VueApexCharts from 'vue-apexcharts'
Vue.component('apexchart', VueApexCharts)

Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(faCheckSquare, faCaretDown, faSquare)

Vue.use(Vuex)
Vue.use(Vuetify, {
  iconfont: 'faSvg'
})

Vue.config.productionTip = false

const store = new Vuex.Store({
  modules: {
    quest
  }
})

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
