import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'goodsion',
  state: {
    // 购物车商品
    cartList: [],
    // 购物车数量
    cartTotalNum: ''
  },
  mutations: {
    mutateCartList (state, payload) {
      state.cartList = payload;
    },
    mutateCartTotalNum (state, payload) {
      state.cartTotalNum = payload;
    }
  },
  actions: {},
  modules: {}
});
