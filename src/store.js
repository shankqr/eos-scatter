import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loggedIn: false
  },
  mutations: {
    loginStatus(state, status) {
      state.loggedIn = status;
    }
  },
  getters: {
    loggedIn: state => state.loggedIn
  },
  actions: {}
});
