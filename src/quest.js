const state = {
  questContents: [],
  removedChildList: [], // 元々クエストテーブルに表示されていた(=questのchild)が、ユーザー操作(最右欄のボタン)で削除されたもの
  isTypeSelectMode: false,
  searchedType: null,
  isSearchMode: false,
  selectedBusinessTypes: []
}

const getters = {
  estimationTimeSum: state => {
    const reducer = (sum, current) => sum + current.estimationtime
    return state.questContents.reduce(reducer, 0)
  },
  expSum: state => {
    const reducer = (sum, current) => sum + current.exp
    return state.questContents.reduce(reducer, 0)
  }
}

const actions = {
  adjustRemovedChildList ({ commit, state }, uuid) {
    // 元々テーブルにあったコンテントがテーブルから削除された後にもう一度追加された時に走るアクション
    const adjusted = state.removedChildList.filter(e => e.uuid !== uuid)
    commit('setRemovedChildList', adjusted)
  }
}

const mutations = {
  setQuestContents (state, questContents) {
    state.questContents = questContents
  },
  toggleTypeSelectMode (state) {
    state.isTypeSelectMode = !state.isTypeSelectMode
  },
  setSearchType (state, selectedType) {
    state.searchedType = selectedType
  },
  toggleSearchMode (state) {
    state.isSearchMode = !state.isSearchMode
  },
  addSelectedContent (state, selectedContent) {
    state.questContents.push(selectedContent)
  },
  addRemovedChildList (state, removedChild) {
    state.removedChildList.push(removedChild)
  },
  setRemovedChildList (state, removedChildList) {
    state.removedChildList = removedChildList
  },
  setSelectedBusinessTypes (state, selectedBusinessTypes) {
    state.selectedBusinessTypes = selectedBusinessTypes
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
