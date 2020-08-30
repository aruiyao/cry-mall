<template>

  <div class="header-box" :class="{fixed:isHboxFixed}">
    <div class="f-box">
      <header class="w">
        <div class="w-box">
          <div class="nav-logo">
            <h1>
              <router-link to="/home" title="商城官网" class="to-home">CRY Mall</router-link>
            </h1>
          </div>
          <div class="right-box">
            <div class="nav-list">
              <el-input
                  placeholder="请输入商品信息"
                  prefix-icon="el-icon-search"
                  v-model="keyword"
                  minlength="1"
                  maxlength="100"
                  @keydown.enter.native="toGoodsList(keyword)"
              ></el-input>
              <a @click="toGoodsList('')">全部商品</a>
<!--              <a href="#">捐赠</a>-->
            </div>

            <div class="nav-aside" :class="{fixed:isFixed}">
              <!-- 用户 -->
              <div class="user pr">
                <el-button icon="el-icon-user-solid" type="primary" class="icon-btn" id="userIcon"
                           @click="$router.push('/usercenter/myorder')"></el-button>
                <div class="nav-popup pa el-icon-if" v-if="isLogin">
                  <div class="nav-user-list">
                    <ul>
                      <!-- 头像 -->
                      <li class="nav-user-avatar">
                        <div>
                          <!--  <span class="avatar" :style="{backgroundImage:'url('+userInfo.file+')'}"></span>-->
                        </div>
                        <p class="name">121212</p>
                      </li>
                      <li>
                        <router-link to="/usercenter/myorder">我的订单</router-link>
                      </li>
                      <li>
                        <router-link to="/usercenter/information">账号资料</router-link>
                      </li>
                      <li>
                        <router-link to="/usercenter/addressmanage">收货地址</router-link>
                      </li>
                      <li>
                        <router-link to="/usercenter/support">售后服务</router-link>
                      </li>
                      <li>
                        <router-link to="/usercenter/coupon">我的优惠</router-link>
                      </li>
                      <li>
                        <a @click="logout">退出</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- 购物车 -->
              <div class="shop pr">
                <el-badge :value="totalNum" class="item" :hidden="!isLogin">
                  <el-button icon="el-icon-if icon-Cart" type="primary" class="icon-btn"
                             @click="$router.push('/cart')"></el-button>
                </el-badge>

                <!-- 购物车显示 -->
                <div class="nav-popup pa el-icon-if" v-if="isLogin">
                  <div class="nav-user-list">
                    <div class="full">
                      <div class="nav-cart-items" id="nav-cart-items">
                        <ul>
                          <li class="clearfix" v-for="(cart,index) in cartList" :key="index" @click="toDetail(cart.goodsId)">
                            <div class="cart-item">
                              <div class="cart-item-inner">
                                <div class="item-thumb">
                                  <img :src="cart.goods.mainImage">
                                </div>
                                <div class="item-desc">
                                  <div class="cart-cell">
                                    <h4>{{cart.goods.name}}</h4>
                                    <h6>
                                      <span class="price-icon">¥</span>
                                      <span class="price-num">{{cart.goods.price}}</span>
                                      <span class="item-num">x {{cart.num}}</span>
                                    </h6>
                                  </div>
                                </div>
                                <div class="del">
                                  <el-button icon="el-icon el-icon-close" @click.stop="deleteCart(cart.id)"></el-button>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <!-- 总件数 -->
                      <div class="nav-cart-total" @mouseenter="hiddenScroll" @mouseleave="showScroll">
                        <p>
                          共
                          <strong>{{totalNum}}</strong> 件商品
                        </p>
                        <h6>
                          <el-button class="popup-cart" @click="$router.push('/cart')">
                            <i class="el-icon-if icon-Cart"></i>
                            <span>去购物车</span>
                          </el-button>
                        </h6>
                      </div>
                    </div>
                    <div style="text-align: center" class="cart-con" v-if='!totalNum'>
                      <div class="el-icon-if icon-kong"></div>
                      <p>您的购物车竟然是空的!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
    <slot name="nav">
      <div class="nav-sub" :class="{fixed:isFixed}">
        <div class="nav-sub-wrapper">
          <div class="w">
            <ul class="clearfix">
              <li @click="$router.push('/home')">首页</li>
              <li @click="toGoodsList('')">全部商品</li>
              <li @click="toGithub">Github</li>
            </ul>
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getStore } from '@/utils/storage';

export default {
  name: 'CryHeader',
  data () {
    return {
      keyword: this.$route.query.keyword,
      isFixed: false,
      isHboxFixed: false,
      scrollLeft: '',
      userId: getStore('userId'),
      isShow: false
    };
  },
  computed: {
    ...mapState({
      cartList: state => state.cart.cartList,
      totalNum: state => state.cart.cartTotalNum,
      isLogin: state => state.isLogin
    })
  },
  created () {
    this.$store.commit('keyword', this.keyword);
    if (this.userId) {
      this.getCart();
    }
  },
  async mounted () {
    const ns = document.getElementsByClassName('nav-sub').length;
    if (ns > 0) {
      this.navFixed();
      window.addEventListener('scroll', this.navFixed);
      window.addEventListener('resize', this.navFixed);
    } else {
      this.isHboxFixed = true;
    }
    // const w1 = document.documentElement.clientWidth;
    // const h = document.getElementsByTagName('html')[0];
    // h.classList.add('fancybox-lock-test');
    // const w2 = document.documentElement.clientWidth;
    // h.classList.remove('fancybox-lock-test');
    // const ele = document.createElement('style');
    // ele.innerHTML = `.fancybox-margin{margin-right:${w2 - w1}px}`;
    // const head = document.getElementsByTagName('head')[0];
    // head.appendChild(ele);
  },
  methods: {
    toGithub () {
      window.open('https://github.com/aruiyao/cry-mall', '_blank');
    },
    navFixed () {
      const st = document.documentElement.scrollTop || document.body.scrollTop;
      this.scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
      this.isFixed = st >= 60;
    },
    logout () {
      localStorage.clear();
      this.$router.push('/login');
    },
    whellFn (e) {
      e.preventDefault();
    },
    hiddenScroll () {
      window.addEventListener('wheel', this.whellFn, { passive: false });
      // const h = document.getElementsByTagName('html')[0];
      // h.classList.add('fancybox-lock-test');
      // document.getElementById('main-frame').classList.add('fancybox-margin');
      // document.getElementById('router-outer').classList.add('fancybox-margin');
    },
    showScroll () {
      window.removeEventListener('wheel', this.whellFn);
      // const h = document.getElementsByTagName('html')[0];
      // h.classList.remove('fancybox-lock-test');
      // document.getElementById('main-frame').classList.remove('fancybox-margin');
      // document.getElementById('router-outer').classList.add('fancybox-margin');
    },
    toDetail (id) {
      const { href } = this.$router.resolve({
        name: 'goodsdetail',
        query: {
          id: id
        }
      });
      window.open(href, '_blank');
    },
    // 删除购物车
    async deleteCart (id) {
      const params = {
        userId: this.userId,
        cartIdList: [id]
      };
      const [err, res] = await this.$http.asyncPost('api/v1.0/check/deleteCart', params);
      if (!err && res) {
        if (res.data.success) {
          this.getCart();
        } else {
          this.$vmessage.error(res.data.msg);
        }
      }
    },
    // 查询购物车
    async getCart () {
      const [err, res] = await this.$http.asyncGet('api/v1.0/check/getCartList', { userId: this.userId });
      if (!err && res) {
        if (res.data.success) {
          const cartList = res.data.data.cartList;
          const totalNum = res.data.data.totalNum;
          this.$store.commit('mutateCartList', cartList);
          this.$store.commit('mutateCartTotalNum', totalNum);
        } else {
          this.$vmessage.error(res.data.msg);
        }
      }
    },
    toGoodsList (keyword) {
      this.$store.commit('keyword', keyword);
      this.keyword = keyword
      this.$router.push({
        name: 'goodslist',
        query: { keyword: this.keyword }
      });
    }
  }

};
</script>
<style lang="scss" scoped>
  @import "~@/assets/style/theme";
  @import "~@/assets/style/mixin";

  .to-home {
    font-size: 30px;
    font-weight: bolder;
    color: $mall-name;
    text-shadow: $text-shadow;

    &:hover {
      color: #FFC107;
    }
  }

  .f-box {
    width: 100%;
    top: 0;
    z-index: 1000;
    background: #EBECF0;
  }

  .header-box {
    width: 100%;
    min-width: 1220px;
    box-shadow: 1px 1px 6px $color-shadow;

    &.fixed {
      position: fixed;
      top: 0;
      z-index: 10;
    }
  }

  header {
    height: 60px;
    z-index: 30;
    position: relative;
  }

  .w-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;

    h1 {
      height: 100%;
      display: flex;
      align-items: center;
    }

    .right-box {
      display: flex;
    }
  }

  .nav-aside {
    display: flex;
    align-items: center;
    position: relative;
    padding-right: 30px;

    &.fixed {
      position: fixed;
      top: -40px;
      margin-left: 259px;
      transform: translateY(50px);
      transition: transform .3s cubic-bezier(.165, .84, .44, 1);

      &:before {
        content: unset;
      }
    }

    &:before {
      background: #333;
      background: rgba(0, 0, 0, 0.3);
      content: " ";
      @include wh(1px, 13px);
      overflow: hidden;
      display: flex;
      align-items: center;
      left: 0;
    }
  }

  .nav-list {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 22px;

    .el-input {
      width: 305px;
    }

    a {
      width: 100px;
      text-align: center;
      color: #8e8e8e;
      display: block;
      font-size: 14px;
      font-weight: bold;
      position: relative;
      overflow: hidden;
      margin-left: 25px;

      &:before {
        content: '';
        position: absolute;
        display: block;
        width: 10px;
        height: 20px;
        background: #fff;
        top: 0;
        left: -20px;
        transform: skewX(-60deg);
        background: linear-gradient(0deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0));
      }

      &:hover {
        color: #696969;
        text-shadow: 3px 3px 1px rgba(0, 0, 0, 0.1);

        &:before {
          left: 120px;
          transition: all 0.7s ease;
        }
      }

      &:active {
        font-size: 14px;
        color: #8e8e8e;
        text-shadow: $text-shadow;
      }

      &:nth-of-type(1) {
        width: 65px;
      }

      &:nth-of-type(2) {
        width: 30px;
      }
    }
  }

  // 用户信息和购物车弹出
  .nav-popup {
    position: absolute;
    z-index: 30;
    width: 168px;
    transform: translate(-50%);
    left: 50%;
    top: 28px;
    visibility: hidden;
    padding-top: 24px;

    .nav-user-list {
      position: relative;
      padding-top: 20px;
      background: $color-bg;
      border-radius: 8px;
      z-index: 10;
    }

    &:before {
      position: absolute;
      font-size: 40px;
      content: "\e6b4";
      top: -3px;
      left: 62px;
      color: $color-bg;
      z-index: 11;
      text-shadow: -1px -1px 1px white, 1px -1px 1px rgb(0, 0, 0, 0.1);
    }
  }

  // 用户
  .user {
    margin-left: 41px;
    width: 36px;

    .el-button {
      border-radius: 5px;
      @include wh(30px);
      padding: 0;
    }

    li + li {
      text-align: center;
      position: relative;
      line-height: 44px;
      height: 44px;
      color: #616161;
      font-size: 12px;
      transition: font-size 0.2s linear;
      letter-spacing: 2px;

      &:last-child {
        border-radius: 0 0 8px 8px;
      }

      &:hover {
        box-shadow: -2px -2px 5px $color-white, 2px 2px 5px $color-shadow;
        font-size: 13px;
      }

      &:active {
        box-shadow: inset -1px -1px 2px $color-white, inset 1px 1px 2px $color-shadow;
      }

      a {
        display: block;
        color: #616161;
      }
    }

    .nav-user-avatar {
      > div {
        position: relative;
        margin: 0 auto 8px;
        @include wh(46px);
        text-align: center;

        &:before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          border-radius: 50%;
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
        }

        .avatar {
          border-radius: 50%;
          display: block;
          @include wh(100%);
          background-repeat: no-repeat;
          background-size: contain;
        }
      }

      .name {
        margin-bottom: 16px;
        font-size: 12px;
        line-height: 1.5;
        text-align: center;
        color: #757575;
      }
    }

    .nav-user-list {
      width: 165px;

      &:before {
        left: 50%;
      }
    }

    &:hover {
      .nav-popup {
        visibility: visible;
        transition: all 0.2s ease-out;

        &:before {
          text-shadow: -1px -1px 1px white, 1px -1px 1px rgb(0, 0, 0, 0.1);
        }
      }

      .nav-user-list {
        width: 168px;
        box-shadow: -1px -1px 1px white, 1px 1px 2px rgb(0, 0, 0, 0.1);
        transition: all 0.2s ease-out;
      }
    }

    .nav-popup:active {
      visibility: visible;
    }
  }

  .shop {
    position: relative;
    float: left;
    margin-left: 21px;
    z-index: 99;

    &:hover {
      .nav-popup {
        visibility: visible;
        transition: all 0.2s ease-out;

        &:before {
          text-shadow: -1px -1px 1px white, 1px -1px 1px rgb(0, 0, 0, 0.1);
        }
      }

      .nav-user-list {
        box-shadow: -1px -1px 1px white, 1px 1px 2px rgb(0, 0, 0, 0.1);
      }
    }

    .nav-popup {
      left: unset;
      transform: unset;
      right: -25px;
      width: 340px;

      &:before {
        left: unset;
        right: 20px;
      }

      .nav-user-list {
        padding: 0;

        &:before {
          right: 34px;
        }
      }
    }

    .nav-user-list {
      padding: 0;
      width: 100%;

      .full {
        border-radius: 8px;
        overflow: hidden;
      }

      li:first-child .cart-item:first-child {
        border-top: none;
        border-radius: 8px 8px 0 0;
        overflow: hidden;
      }

      .cart-item-inner {
        padding: 20px;
        position: relative;
      }

      .item-thumb {
        position: relative;
        float: left;
        width: 60px;
        height: 60px;
        border-radius: 3px;

        img {
          display: block;
          width: 60px;
          height: 60px;
          border-radius: 3px;
          overflow: hidden;
        }
      }

      .item-desc {
        margin-left: 80px;
        display: table;
        width: 205px;
        height: 60px;

        h4 {
          color: #000;
          overflow: hidden;
          word-break: keep-all;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 14px;
          line-height: 16px;
          margin-bottom: 10px;
        }

        .attrs span {
          position: relative;
          display: inline-block;
          margin-right: 20px;
          font-size: 14px;
          line-height: 14px;
          color: #999;
        }

        .attrs span:last-child {
          margin-right: 0;
        }

        h6 {
          color: #cacaca;
          font-size: 12px;
          line-height: 14px;
          margin-top: 20px;

          span {
            display: inline-block;
            font-weight: 700;
            color: #787878;
          }

          .price-icon, .price-num {
            color: #ff8c3e;
          }

          .price-num {
            margin-left: 5px;
            font-size: 14px;
          }

          .item-num {
            margin-left: 10px;
          }
        }
      }

      .cart-cell {
        display: table-cell;
        vertical-align: middle;
      }

      .del {
        position: absolute;
        right: 20px;
        top: 50%;
        width: 20px;
        height: 20px;
        border-radius: 10px;
        transform: translateY(-50%);

        .el-button {
          width: 20px;
          height: 20px;
          background: $color-bg;
          transition: none;

          &:hover {
            box-shadow: -3px -3px 5px #88c0ff, 3px 3px 5px #648ed9;
          }

          &:active {
            box-shadow: inset 1px 1px 2px #BABECC, inset -1px -1px 2px #FFF;
          }
        }
      }
    }

    .nav-cart-total {
      box-sizing: content-box;
      position: relative;
      padding: 20px;
      height: 30px;
      border-top: 1px solid #f0f0f0;
      border-radius: 0 0 8px 8px;
      box-shadow: inset 0 -1px 0 hsla(0, 0%, 100%, 0.5),
      0 -3px 8px rgba(0, 0, 0, 0.04);

      p {
        margin-bottom: 4px;
        line-height: 30px;
        font-size: 12px;
        color: #656565;
      }

      h5 {
        line-height: 20px;
        font-size: 14px;
        color: #6f6f6f;

        span {
          font-size: 18px;
          color: #ff6700;
          display: inline-block;
          font-weight: 700;
        }

        span:first-child {
          font-size: 12px;
          margin-right: 5px;
        }
      }

      h6 {
        position: absolute;
        right: 35px;
        top: 17px;
        width: 108px;
      }
    }
  }

  .nav-cart-items {
    max-height: 50vh;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .cart-item {
    cursor: pointer;
    height: 100px;
    width: 100%;
    overflow: hidden;
    border-top: 1px solid #f0f0f0;

    &:hover {
      background-color: #76a7ff;

      .del .el-button {
        box-shadow: none;
      }
    }
  }

  .popup-cart {
    font-size: 12px;
    width: 120px;
    height: 35px;
    transition: unset;
    color: #8500ff;
  }

  .nav-sub {
    position: relative;
    z-index: 20;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $color-bg;
    border-top: 1px solid #d8d8d8;

    &.fixed {
      position: fixed;
      z-index: 21;
      top: 0;
      left: 0;
      right: 0;
      box-shadow: 1px 1px 6px #BABECC;
      border: 0;
    }

    .nav-sub-wrapper {
      position: relative;

      &.fixed {
        padding: 0;
        height: 100%;
        display: flex;
        align-items: center;
      }

      &:after {
        content: " ";
        position: absolute;
        top: 89px;
        left: 50%;
        margin-left: -610px;
        width: 1220px;
        background: #000;
        height: 1px;
        display: none;
        opacity: 0;
        transition: opacity 0.3s ease-in;
      }
    }

    .nav-sub-wrapper li {
      float: left;
      height: 20px;
      line-height: 20px;
      margin-left: 20px;
      cursor: pointer;
    }

  }

  @media (min-width: 1px) {
    .nav-sub .nav-sub-wrapper:after {
      display: block;
    }
  }

  .cart-con {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 150px;

    div {
      font-size: 40px;
    }

    p {
      color: #5a5a5a;
      font-size: 16px;
      margin-left: 10px;
      text-shadow: $text-shadow;
    }
  }

</style>
