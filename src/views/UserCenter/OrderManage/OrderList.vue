<template>
  <div>
    <div class="order-title">我的订单</div>
    <div class="order-item-box" v-for="order in orderLsit" :key="order.orderNo">
      <div class="order-status">{{order.status|statusFilter}}</div>
      <div class="order-info">
        <div>
          <span>{{order.createTime|timeFilter}}</span>
          <span class="vertical-line">|</span>
          <span>{{order.addr.name}}</span>
          <span class="vertical-line">|</span>
          <span>订单号：{{order.orderNo}}</span></div>
        <div>订单金额：
          <span class="order-amount">{{order.amount}}</span>
          元
        </div>
      </div>
      <el-divider></el-divider>
      <div class="box-outer">
        <div>
          <div class="goods-box" v-for="bl in order.bls" :key="bl.goodsId">
            <img :src="bl.goods.mainImage">
            <div class="goods-info">
              <div>{{bl.goods.name}}</div>
              <div class="unit-price">{{bl.goods.price}}元 × {{bl.num}}</div>
            </div>
          </div>
        </div>
        <div class="order-btn-box">
          <el-button size="mini">订单详情</el-button>
          <el-button @click="deleteOrder(order.id)" :id="'delete'+order.id">删除订单</el-button>
        </div>
      </div>
    </div>
    <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        :total="totalNum"
        @current-change="currentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getStore } from '@/utils/storage';

export default {
  name: 'OrderList',
  data () {
    return {
      userId: getStore('userId'),
      orderLsit: [],
      currentPage: 1,
      totalNum: 0,
      pageSize: 5
    };
  },
  created () {
    this.getOrderList();
  },
  methods: {
    async getOrderList () {
      const params = {
        userId: this.userId,
        pageSize: this.pageSize,
        currentPage: this.currentPage
      };
      const [err, res] = await this.$http.asyncGet('api/v1.0/check/getOrderList', params);
      if (!err && res) {
        if (res.data.success) {
          this.orderLsit = res.data.data.orderList;
          this.totalNum = res.data.data.totalNum;
        } else {
          this.$vmessage.error(res.data.msg);
        }
      }
    },
    currentChange (val) {
      this.currentPage = val;
      this.getOrderList();
    },
    deleteOrder (id) {
      document.getElementById(`delete${id}`).blur();
      this.$confirm('您将永久删除该订单, 是否继续?', '提示', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const [err, res] = await this.$http.asyncPost('api/v1.0/check/deleteOrder', { orderIdList: [id] });
        if (!err && res) {
          if (res.data.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            // 最后一页只有一条数据并将其删除后，查询前一页
            if (this.currentPage > 1 && this.orderLsit.length === 1) {
              this.currentPage -= 1;
            }
            this.getOrderList();
          } else {
            this.$vmessage.error(res.data.msg);
          }
        }
      }).catch(() => {});
    }
  },
  filters: {
    timeFilter (val) {
      const year = val.substr(0, 4);
      const month = val.substr(4, 2);
      const day = val.substr(6, 2);
      const hours = val.substr(8, 2);
      const minutes = val.substr(10, 2);
      return `${year}年${month}月${day}日 ${hours}:${minutes}`;
    },
    statusFilter (val) {
      let returnVal = '';
      switch (val) {
        case 0:
          returnVal = '待支付';
          break;
        case 1:
          returnVal = '待收货';
          break;
        case 2:
          returnVal = '关闭交易';
          break;
      }
      return returnVal;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/theme.scss";

  .order-title {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .order-item-box {
    width: 100%;
    box-shadow: -3px -3px 5px #FFF, 3px 3px 5px #BABECC;
    border-radius: 10px;
    padding: 30px;
  }

  .order-status {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .order-info {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .order-amount {
    font-size: 26px;
    color: #ff6700;
  }

  .box-outer {
    display: flex;
    justify-content: space-between;
  }

  .goods-box {
    display: flex;
    align-items: center;

    img {
      width: 80px;
      height: 80px;
    }

    + .goods-box {
      margin-top: 20px;
    }

  }

  .goods-info {
    width: 430px;
    margin-left: 20px;
  }

  .unit-price {
    margin-top: 10px;
  }

  .order-btn-box {
    margin-top: 20px;

    .el-button {
      width: 100px;
      font-size: 12px;
      height: 40px;
    }
  }

  .order-item-box + .order-item-box {
    margin-top: 40px;
  }

  .el-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .vertical-line {
    color: #c8c8c8;
    margin: 0 10px;
  }
</style>
