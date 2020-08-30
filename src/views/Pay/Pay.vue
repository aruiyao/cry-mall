<template>
  <div>
    <cry-header>
      <template v-slot:nav>
        <div></div>
      </template>
    </cry-header>
    <div class="w">
      <div class="pay-title">支付订单</div>
      <div class="order-info-card">
        <div class="pay-info">
          <div class="pay-info-left">
            <i class="el-icon-circle-check"></i>
            <div>订单提交成功！去付款咯～</div>
          </div>
          <div class="order-info-title">
            <div class="amount-box">
              <label>应付总额：</label>
              <span class="amount">{{order.amount}}</span>
              <span>&nbsp;元</span>
            </div>
          </div>
        </div>

        <div class="order-info-box">
          <div>
            <label>订单号：</label>
            <span style="color:#ff6700;">{{order.orderNo}}</span>
          </div>
          <div>
            <label>收货信息：</label>
            <span>{{order.addr.name}} {{order.addr.tel}} {{order.addr.deliveryAddress}}</span>
          </div>
          <div class="goods-box">
            <label>商品名称：</label>
            <div>
              <div v-for="item in order.bls" :key="item.goods.id">{{item.goods.name}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="pay-btn">
        <el-button type="primary" @click="updateOrder">确认支付</el-button>
      </div>
    </div>

  </div>
</template>

<script>
import CryHeader from '@/components/CryHeader';

export default {
  name: 'Pay',
  data () {
    return {
      order: {}
    };
  },
  components: { CryHeader },
  created () {
    this.getOrderList();
  },
  methods: {
    async getOrderList () {
      const params = {
        orderId: this.$route.query.orderId
      };
      const [err, res] = await this.$http.asyncGet('api/v1.0/check/getOrderList', params);
      if (!err && res) {
        if (res.data.success) {
          this.order = res.data.data.orderList[0];
          this.totalNum = res.data.data.totalNum;
        } else {
          this.$vmessage.error(res.data.msg);
        }
      }
    },
    async updateOrder () {
      const params = {
        id: this.$route.query.orderId,
        status: 1
      };
      const [err, res] = await this.$http.asyncPost('api/v1.0/check/updateOrder', params);
      if (!err && res) {
        if (res.data.success) {
          this.$vmessage.success('支付成功');
          this.$router.push('/home');
        } else {
          this.$vmessage.error(res.data.msg);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/theme.scss";

  .pay-title {
    font-size: 24px;
    color: #000;
  }

  .order-info-card {
    box-shadow: $box-shadow;
    border-radius: 10px;
    padding: 40px 60px;
    margin-top: 20px;
  }

  .pay-info {
    display: flex;
    justify-content: space-between;
  }

  .pay-info-left {
    display: flex;
    align-items: center;
  }

  .pay-info-left div {
    font-size: 20px;
    color: #000;
    margin-left: 20px;
  }

  .el-icon-circle-check {
    font-size: 40px;
    color: #00a854;
  }

  .order-info-title {

    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .amount-box {
    font-size: 14px;
  }

  .amount-box span {
    color: #ff6700;
  }

  .amount {
    font-size: 20px;
    color: #ff6700;
  }

  .order-info-box {
    margin-top: 30px;
  }

  .order-info-box > div {
    font-size: 14px;
    margin: 15px 0;
    display: flex;
  }

  .order-info-box label{
    width: 100px;
  }

  .pay-btn{
    margin-top: 40px;
    display: flex;
    justify-content: flex-end;
  }
</style>
