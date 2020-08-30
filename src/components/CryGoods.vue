<template>
  <el-card :body-style="{padding: 0}" class="good-item" @click.native="goodsDetail(goods.id)">
    <div class="good-img">
      <a>
        <img v-lazy="goods.mainImage" alt>
      </a>
    </div>
    <h6 class="good-title">{{goods.name}}</h6>
    <h3 class="ellipsis">{{goods.featureDesc}}</h3>
    <div class="good-price pr">
<!--      <div class="ds pa">-->
<!--        <el-button @click="goodsDetail(goods.id)">查看详情</el-button>-->
<!--        <el-button class="addcart" @click="addCart(goods.id,goods.price,goods.name,goods.mainImage)">-->
<!--          加入购物车-->
<!--        </el-button>-->
<!--      </div>-->
      <p>
        <span style="font-size:14px">¥</span>
        {{Number(goods.price).toFixed(2)}}
      </p>
    </div>
  </el-card>
</template>
<script>
import { getStore } from '@/utils/storage';

export default {
  props: ['goods'],
  computed: {
  },
  methods: {
    goodsDetail (id) {
      const { href } = this.$router.resolve({
        name: 'goodsdetail',
        query: { id: id }
      });
      window.open(href, '_blank');
    },
    addCart (id, price, name, img) {
      if (this.login) {
        // 用户已登录
        this.$http.post('/api/addCart', {
          userId: getStore('id'),
          goodsId: id,
          goodsNum: 1
        });
        // 已经存储到后端中， 将当前的商品存储到store的cartList
        this.ADDCART({
          goodsId: id,
          salePrice: price,
          goodsName: name,
          goodsImageBig: img
        });
      } else {
        // 如果用户未登录 也要将商品存储到store的cartList
        this.ADDCART({
          goodsId: id,
          salePrice: price,
          goodsName: name,
          goodsImageBig: img
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/theme.scss";
  .good-img {
    display: flex;
    justify-content: center;

    a {
      display: block;

      img {
        margin: 50px auto 10px;
        width: 206px;
        height: 206px;
        display: block;
      }
    }
  }

  .good-price {
    margin: 15px 0;
    text-align: center;
    color: #ff6700;
    font-size: 18px;
    font-weight: 700;
    display: flex;
    justify-content: space-around;

    a {
      margin-right: 5px;
    }

    .ds {
      display: flex;
      visibility: hidden;
      opacity: 0;
    }
  }

  .good-price:hover .ds {
    display: block;
  }

  .good-title {
    line-height: 1.2;
    font-size: 16px;
    color: #424242;
    margin: 0 auto;
    padding: 0 14px;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .ellipsis {
    text-align: center;
    font-size: 12px;
    color: #909090;
    height: 30px;
    line-height: 30px;
  }

  .good-item {
    width: 25%;
    transition: all 0.5s;
    height: 400px;
    cursor: pointer;

    &:hover {
      box-shadow: $box-shadow;
      transition: all 0.15s ease-out;

      .ds {
        visibility: visible;
        opacity: 1;
        transition: all 0.5s linear;
      }
    }
  }

  .el-card {
    border: none;
    background-color: transparent;
  }

  .addcart {
    margin-left: 20px;
    color: $color-red;
  }
</style>
