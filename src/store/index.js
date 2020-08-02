import Vue from 'vue';
import Vuex from 'vuex';
import cart from './cart';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'goodsion',
  modules: {
    cart
  },
  state: {
  },
  mutations: {
  },
  actions: {}
});
