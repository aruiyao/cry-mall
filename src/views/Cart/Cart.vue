<template>
  <div>
    <cry-header>
      <template v-slot:nav>
        <div></div>
      </template>
    </cry-header>
    <div class="w">
      <el-table
          ref="cartTable"
          :data="copyCartList"
          tooltip-effect="dark"
          style="width: 100%"
          @select="handleSelectionChange"
          @select-all="handleSelectAll"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column class-name="goods-image" width="130">
          <template slot-scope="scope">
            <img :src="scope.row.goods.mainImage">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" width="380">
          <template slot-scope="scope">
            <span class="goods-name">{{ scope.row.goods.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单价" width="100">
          <template slot-scope="scope">
            <span style="font-size: 16px;">{{ scope.row.goods.price }}元</span>
          </template>
        </el-table-column>
        <el-table-column label="数量" header-align="center" width="240" class-name="goods-num">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.num" :min="1" :max="10" @change="changNum(scope.row)"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="小计">
          <template slot-scope="scope">
            <span style="color: #ff6700;font-size: 16px;">{{ selfMul(scope.row.goods.price, scope.row.num) }}元</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" class-name="operation">
          <template slot-scope="scope">
            <el-button icon="el-icon el-icon-close" @click="deleteCart(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="settle-box">
        <div>共
          <span style="color: rgb(255, 103, 0);font-weight: bolder;">{{cartList.length}}</span>
          件商品，已选择
          <span style="color: rgb(255, 103, 0);font-weight: bolder">{{checkedNum}}</span>
          件
        </div>
        <div>
          <span>合 计：</span>
          <span class="cart-total">{{totalPrice}}</span> 元
          <el-button id="submit" @click="toSubmit">去结算</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CryHeader from '@/components/CryHeader';
import { getStore } from '@/utils/storage';
import { accAdd, accMul } from '@/utils/CommonUtil';

export default {
  name: 'Cart',
  components: {
    CryHeader
  },
  data () {
    return {
      userId: getStore('userId'),
      multipleSelection: []
    };
  },
  computed: {
    ...mapState({
      cartList: state => state.cart.cartList,
      totalNum: state => state.cart.cartTotalNum
    }),
    copyCartList () {
      return JSON.parse(JSON.stringify(this.cartList));
    },
    totalPrice () {
      if (this.cartList.length > 0) {
        return this.cartList.reduce((pre, cur) => {
          let curPrice = 0;
          if (cur.isChecked === 1) {
            // 只有选中的才计入总价
            curPrice = accMul(cur.goods.price, cur.num);
          }
          return accAdd(pre, curPrice);
        }, 0);
      } else {
        return 0;
      }
    },
    checkedNum () {
      let checkedList = [];
      checkedList = this.cartList.filter(item => item.isChecked);
      return checkedList.length;
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    selfMul () {
      return accMul(...arguments);
    },
    // 全选/全不选
    handleSelectAll (selection) {
      if (selection.length === 0) {
        this.batchUpdateCart(0);
      } else {
        this.batchUpdateCart(1);
      }
    },
    // 改变一条购物车的选中状态
    async handleSelectionChange (selection, row) {
      row.isChecked = row.isChecked === 0 ? 1 : 0;
      const [err, res] = await this.$http.asyncPost('api/v1.0/check/updateCart', row);
      if (!err && res) {
        if (res.data.success) {
          this.$store.commit('mutateCartCheckedStatus', { id: row.id, isChecked: row.isChecked });
        } else {
          this.$vmessage.error(res.data.msg);
        }
      }
    },
    // 改变所有购物车的选中状态
    async batchUpdateCart (isChecked) {
      const [err, res] = await this.$http.asyncPost('api/v1.0/check/updateCart', { userId: this.userId, isChecked });
      if (!err && res) {
        if (res.data.success) {
          this.$store.commit('mutateAllCartCheckedStatus', { isChecked: isChecked });
        } else {
          this.$vmessage.error(res.data.msg);
        }
      }
    },
    // 变更购买数量
    async changNum (row) {
      const [err, res] = await this.$http.asyncPost('api/v1.0/check/updateCart', row);
      if (!err && res) {
        if (res.data.success) {
          this.$store.commit('mutateCartItemNum', { id: row.id, num: row.num });
        } else {
          this.$vmessage.error(res.data.msg);
        }
      }
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
          this.$store.commit('removeCartItem', { id });
          this.$store.commit('mutateCartTotalNum', this.totalNum - 1);
        } else {
          this.$vmessage.error(res.data.msg);
        }
      }
    },
    toSubmit () {
      this.$router.push('/submitorder');
    }
  },
  watch: {
    copyCartList () {
      // dom渲染完成后执行
      this.$nextTick(() => {
        for (const item of this.copyCartList) {
          if (item.isChecked === 1) {
            // 初始化购物车默认的勾选状态
            this.$refs.cartTable.toggleRowSelection(item);
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/theme.scss";

  .goods-name {
    font-size: 18px;
  }

  .goods-image img {
    width: 80px;
    height: 80px;
  }

  ::v-deep .goods-num .cell {
    overflow: unset;
  }

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

  .settle-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    border-radius: 10px;
    padding: 0 40px;
    margin-top: 20px;
    box-shadow: $box-shadow;
    letter-spacing: 1px;
  }

  .settle-box .el-button {
    width: 150px;
    height: 40px;
    margin-left: 40px;
  }

  ::v-deep .operation {
    .cell {
      overflow: unset;
    }

    .el-button {
      width: 20px;
      height: 20px;
    }
  }

  .cart-total {
    color: rgb(255, 103, 0);
    font-size: 30px;
  }
</style>
