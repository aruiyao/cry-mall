export default {
  state: {
    // 购物车商品
    cartList: [],
    // 购物车商品种类数目
    cartTotalNum: ''
  },
  mutations: {
    mutateCartList (state, payload) {
      state.cartList = payload;
    },
    mutateCartTotalNum (state, payload) {
      state.cartTotalNum = payload;
    },
    /**
     * 改变购物车某个商品数量
     */
    mutateCartItemNum (state, payload) {
      const results = state.cartList.findIndex((item) => item.id === payload.id);
      if (results >= 0) {
        state.cartList[results].num = payload.num;
      }
    },
    mutateCartCheckedStatus (state, payload) {
      const results = state.cartList.findIndex((item) => item.id === payload.id);
      if (results >= 0) {
        state.cartList[results].isChecked = payload.isChecked;
      }
    },
    mutateAllCartCheckedStatus (state, payload) {
      for (const item of state.cartList) {
        item.isChecked = payload.isChecked;
      }
    },
    removeCartItem (state, payload) {
      const index = state.cartList.findIndex((item) => item.id === payload.id);
      state.cartList.splice(index, 1);
    }
  },
  actions: {}
};
