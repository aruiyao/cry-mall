<template>
  <div>
    <div class="info">
      <div class="w">
        <div class="info-left">
          <div class="img-list">
            <template v-for="(img,index) in imageList">
              <img :src="img.url" alt="" :key="img.id" @mouseenter="smallIndex=index">
            </template>
          </div>
          <div class="img-big">
            <template v-for="(img,index) in imageList">
              <img :src="img.url" alt="" :key="img.id" v-show="smallIndex===index">
            </template>
          </div>
        </div>
        <div class="info-rigth">
          <h3>{{goods.name}}</h3>
          <p class="parameters">{{goods.parameterDesc}}</p>
          <div class="price">
            <div class="price-num">{{goods.price}}</div>
            <div class="price-unit">元</div>
          </div>
          <div class="promotion-box">
            <p class="title">促销活动</p>
            <p class="promotion">精选配件&nbsp;&nbsp;&nbsp;&nbsp;限时直降</p>
          </div>
          <div>
            <p class="title">颜色选择</p>
            <div class="choose-btn">
              <el-button v-for="(item,index) in colorList" :key="item.color" @click="selectedIndex=index"
                         :class="{'selected':selectedIndex===index}"
                         :icon="selectdeIcon(index)">
                {{item.color}}
              </el-button>
            </div>
          </div>
          <div class="num">
            <p class="title">数量选择</p>
            <el-input-number v-model="num" :min="1" :max="10"></el-input-number>
          </div>
          <div class="after-sale-info">
            <div>
              <i class="el-icon-if icon-wanchenggouxuan"></i>
              <span>商品只用于展示</span>
            </div>
            <div>
              <i class="el-icon-if icon-wanchenggouxuan"></i>
              <span>商品只用于展示</span>
            </div>
          </div>
        </div>
      </div>
      <div class="detail-img"></div>
    </div>
    <footer>
      <div class="w">
        <div class="choose-info-box">
          <p class="box-text">您已选择</p>
          <div class="choose-info">
            <p><strong>{{goods.name}} × {{num}}</strong></p>
            <p>{{colorList[selectedIndex].color}}</p>
          </div>
        </div>
        <div class="btn-box">
          <span class="total-price">
            <strong>
            <i>￥</i>{{totalPrice}}
            </strong>
          </span>
          <el-button class="buy" icon="el-icon-if icon-buy-icon" @click="buyNow">立即购买</el-button>
          <el-button class="cart" icon="el-icon-if icon-Cart" @click="addCart">加入购物车</el-button>
        </div>
      </div>
    </footer>

  </div>
</template>

<script>
import { getStore } from '@/utils/storage';
import { accMul } from '@/utils/CommonUtil';

export default {
  name: 'GoodsDetail',
  data () {
    return {
      num: 1,
      selectedIndex: 0,
      colorList: [],
      imageList: [],
      goods: {},
      smallIndex: 0,
      userId: getStore('userId')
    };
  },
  created () {
    this.colorList = [
      // { color: '绿色' },
      // { color: '黑色' },
      // { color: '蓝色' },
      { color: '石墨黑' }
    ];
    this.getGoodsInfo();
  },
  methods: {
    buyNow () {
      this.$router.push({
        name: 'submitorder',
        query: {
          goodsId: this.goods.id,
          num: this.num
        }
      });
    },
    async getGoodsInfo () {
      const [err, res] = await this.$http.asyncGet('api/v1.0/getGoodsInfoById', { id: this.$route.query.id });
      if (!err && res) {
        if (res.data.success) {
          this.goods = res.data.data.goods;
          this.imageList = this.goods.imageList;
        } else {
          this.$vmessage.error(res.data.msg);
        }
      }
    },
    // 添加购物车
    async addCart () {
      const params = {
        userId: this.userId,
        goodsId: this.$route.query.id,
        num: this.num
      };
      const [err, res] = await this.$http.asyncPost('api/v1.0/check/addCart', params);
      if (!err && res) {
        if (res.data.success) {
          this.$notify({
            message: '成功添加购物车',
            type: 'success',
            offset: 130,
            customClass: 'cry-notify',
            duration: 1500
          });
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
    }
  },
  computed: {
    selectdeIcon () {
      return function (index) {
        return this.selectedIndex === index ? 'el-icon-if icon-duigou' : '';
      };
    },
    totalPrice () {
      if (this.goods.price !== '' && this.goods.price !== null) {
        return accMul(this.num, this.goods.price);
      } else {
        return '';
      }
    }
  }
};
</script>
<style lang="scss" scoped>
  @import "~@/assets/style/theme.scss";

  .info {
    padding-bottom: 100px;

    .w {
      display: flex;
      justify-content: space-between;
    }
  }

  .info-left {
    display: flex;
    width: 600px;
  }

  .img-list {
    width: 100px;

    img {
      width: 70px;
      height: 70px;
      cursor: pointer;
      display: block;
      margin: 20px auto 0;
      box-shadow: $box-shadow;

      &:hover {
        box-shadow: -2px -2px 5px $color-white, 2px 2px 5px $color-shadow;
      }

      &:first-child {
        margin-top: 0;
      }
    }
  }

  .img-big {
    width: 500px;

    img {
      width: 500px;
      height: 500px;
    }
  }

  .info-rigth {
    width: 600px;

    h3 {
      font-size: 24px;
      color: #000;
    }
  }

  .parameters {
    font-size: 14px;
    color: #b0b0b0;
    padding-top: 8px;
    line-height: 1.5;
  }

  .title {
    font-size: 18px;
    color: #000;
    padding: 10px 0;
  }

  .promotion-box {
    border-bottom: 1px solid #d6d6d6;

    .promotion {
      margin-left: 10px;
      padding-bottom: 10px;
    }
  }

  .choose-btn {
    display: flex;
    flex-wrap: wrap;

    .el-button {
      border-radius: 5px;
      width: 250px;
      height: 50px;
      margin: 10px;
      padding: 0;

      ::v-deep .icon-duigou {
        font-size: 20px;
        color: #00a854;
      }
    }

    .selected {
      box-shadow: inset 2px 2px 2px #BABECC, inset -2px -2px 5px #FFF;
      &:hover{
        color: #777777;
      }
      &:focus {
        color: #777777;
      }
      &:active{
        color: #777777;
      }
    }
  }

  .btn-inner {
    display: flex;
    justify-content: center;
  }

  .price {
    display: flex;
    font-size: 18px;
    line-height: 1;
    color: #ff6700;
    padding: 12px 0 10px;
    border-bottom: 1px solid #d6d6d6;

    .price-unit {
      margin-left: 5px;
    }
  }

  .after-sale-info {
    display: flex;
    margin-top: 40px;

    div {
      display: flex;
      align-items: center;
      cursor: pointer;
      margin-left: 10px;
    }

    i {
      font-size: 20px;
    }

    span {
      margin-left: 5px;
    }
  }

  footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 20;
    height: 80px;
    background-color: $color-bg;
    box-shadow: 0 -1px 5px $color-shadow;
    border-bottom: 1px solid #d6d6d6;

    .w {
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .choose-info-box {
    width: 400px;
    display: flex;

    .box-text {
      width: 70px;
    }
  }

  .btn-box {
    .el-button {
      width: 150px;
      height: 40px;
    }

    ::v-deep i {
      font-size: 20px;
    }

    .buy {
      color: #ff6347;
    }

    .cart {
      color: #8500ff;
      margin-left: 30px;
    }
  }

  .total-price {
    color: #ff6700;
    margin-right: 40px;
    font-size: 20px;

    i {
      font-size: 14px;
      margin-right: 5px;
    }
  }

  // 计数器
  .el-input-number {
    margin-left: 60px;
    width: 100px;

    ::v-deep .el-input__inner {
      padding: 0;
      border-radius: 5px;
    }

    ::v-deep .el-input-number__decrease, ::v-deep .el-input-number__increase {
      border: 0;
      border-radius: 3px;
      box-shadow: 9px 9px 9px rgba(0, 0, 0, 0.06), -9px -9px 9px rgba(255, 255, 255, 0.6),
      inset 5px 5px 5px rgba(0, 0, 0, 0.07), inset -5px -5px 5px rgba(255, 255, 255, 0.7);

      &.is-disabled {
        color: #606266;

        i:before {
          box-shadow: inset 3px 3px 3px rgba(255, 255, 255, 0.5), inset -3px -3px 3px rgba(0, 0, 0, 0.05);
        }
      }
    }

    ::v-deep .el-input-number__decrease {
      left: -55px;
    }

    ::v-deep .el-input-number__increase {
      right: -55px;
    }

    ::v-deep i {
      line-height: 40px;
      font-weight: bolder;

      &:active {
        &:before {
          box-shadow: inset 3px 3px 3px rgba(0, 0, 0, 0.05), inset -3px -3px 3px rgba(255, 255, 255, 0.5)
        }
      }

      &:before {
        padding: 10px;
        border-radius: 3px;
        background-color: rgba(255, 153, 0, 0.6);
        box-shadow: inset 3px 3px 3px rgba(255, 255, 255, 0.5), inset -3px -3px 3px rgba(0, 0, 0, 0.05);
      }
    }
  }
</style>
<style>
  .header-box + div {
    padding-bottom: 0;
  }
</style>
