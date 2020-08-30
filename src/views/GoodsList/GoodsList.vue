<template>
  <div>
    <div class="w">
      <div v-if="goodsList.length===0" class="nodata">
        <i class="el-icon-search"></i>
        <div>抱歉，没有找到商品，换个词搜搜吧</div>
      </div>
      <div v-if="goodsList.length>0" class="goods-box">
        <cry-goods v-for="item in goodsList" :key="item.id" :goods="item"></cry-goods>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CryGoods from '@/components/CryGoods';

export default {
  name: 'GoodsList',
  data () {
    return {
      goodsList: []
    };
  },
  created () {
    this.getGoodsList();
  },
  computed: {
    ...mapState({
      keyword: state => state.keyword
    })
  },
  watch: {
    keyword () {
      this.getGoodsList();
    }
  },
  methods: {
    async getGoodsList () {
      const params = {
        name: this.keyword
      };
      const [err, res] = await this.$http.asyncGet('api/v1.0/getGoodsList', params);
      if (!err && res) {
        if (res.data.success) {
          this.goodsList = res.data.data.goodsList;
        } else {
          this.$vmessage.error(res.data.msg);
        }
      }
    }
  },
  components: { CryGoods }
};
</script>

<style lang="scss" scoped>
  .goods-box {
    display: flex;
  }
  .nodata{
    text-align: center;
    display: flex;
    height: 70vh;
    flex-direction: column;
    justify-content: center;
    i{
      font-size: 100px;
      margin-bottom: 20px;
    }
  }
</style>
