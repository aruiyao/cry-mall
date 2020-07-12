import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'goodsion',
  state: {
    cartList: [] // 加入购物车商品
  },
  mutations: {
    mutateCartList (state, payload) {
      state.cartList = payload;
    }
  },
  actions: {},
  modules: {}
});
