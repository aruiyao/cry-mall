<template>
  <div>
    <el-drawer
        title="添加地址"
        :visible.sync="addDrawer"
        :direction="direction"
        :wrapperClosable="false"
        :destroy-on-close="true"
    >
      <div class="">
        <el-form :model="addAddressForm" class="address-form" ref="addAddressForm" :rules="addressFormRules">
          <el-form-item prop="name">
            <el-input v-model="addAddressForm.name" placeholder="收货人姓名"></el-input>
          </el-form-item>
          <el-form-item prop="tel">
            <el-input v-model="addAddressForm.tel" placeholder="手机号码"></el-input>
          </el-form-item>
          <el-form-item prop="deliveryAddress">
            <el-input type="textarea" v-model="addAddressForm.deliveryAddress" placeholder="收货地址" rows="4"></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 25px;margin-bottom: 15px;">
            <el-button id="add" class="text-primary" @click="addDeliveryAddress">确认</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="closeAddAddr">关闭</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
    <el-drawer
        title="修改地址"
        :visible.sync="modifyDrawer"
        :direction="direction"
        :wrapperClosable="false"
        :destroy-on-close="true"
    >
      <div class="">
        <el-form :model="modifyAddressForm" class="address-form" ref="modifyAddressForm" :rules="addressFormRules">
          <el-form-item prop="name">
            <el-input v-model="modifyAddressForm.name" placeholder="收货人姓名"></el-input>
          </el-form-item>
          <el-form-item prop="tel">
            <el-input v-model="modifyAddressForm.tel" placeholder="手机号码"></el-input>
          </el-form-item>
          <el-form-item prop="deliveryAddress">
            <el-input type="textarea" v-model="modifyAddressForm.deliveryAddress" placeholder="收货地址"
                      rows="4"></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 25px;margin-bottom: 15px;">
            <el-button id="modify" class="text-primary" @click="updateDeliveryAddress">确认</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="closeModifyAddr">关闭</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
    <cry-header>
      <template v-slot:nav>
        <div></div>
      </template>
    </cry-header>
    <div class="w">
      <div class="address-box">
        <p class="title">收货地址</p>
        <div class="address-content">
          <el-card v-for="(address,index) in addressList" :key="address.id" @click.native="chooseAddress(index)"
                   :class="{'selected':selectedAddress===index}">
            <p class="consignee">{{address.name}}</p>
            <p class="phone">{{address.tel}}</p>
            <p class="address">{{address.deliveryAddress}}</p>
            <div class="options">
              <a @click.stop="handelModify(address)">修改</a>
              <a @click.stop="deleteDeliveryAddress(address)">删除</a>
              <a @click.stop="setDefault(address)">设为默认</a>
            </div>
          </el-card>
          <el-card class="add-box" @click.native="addDrawer=true">
            <div class="add-inner">
              <i class="el-icon el-icon-plus"></i>
              <p>添加新地址</p>
            </div>
          </el-card>
        </div>
      </div>
      <div class="buy-list-box">
        <p class="title">购物清单</p>
      </div>

      <el-table
          :data="buyList"
          tooltip-effect="dark"
          style="width: 100%"
      >
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
        <el-table-column label="单价">
          <template slot-scope="scope">
            <span style="font-size: 16px;">{{ scope.row.goods.price }}元</span>
          </template>
        </el-table-column>
        <el-table-column label="数量">
          <template slot-scope="scope">
            {{ scope.row.num }}
          </template>
        </el-table-column>
        <el-table-column label="小计">
          <template slot-scope="scope">
            <span
                style="color: #ff6700;font-size: 16px;">{{ selfMul(scope.row.goods.price, scope.row.num) }}元</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="settle-box">
        <div>
        </div>
        <div>
          <span>合 计：</span>
          <span class="cart-total">{{totalPrice}}</span> 元
          <el-button id="submit">立即下单</el-button>
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
  name: 'SubmitOrder',
  components: {
    CryHeader
  },
  data () {
    return {
      goodsId: this.$route.query.goodsId,
      num: this.$route.query.num,
      selectedAddress: 0,
      userId: getStore('userId'),
      addDrawer: false,
      modifyDrawer: false,
      direction: 'rtl',
      addAddressForm: {
        name: '',
        tel: '',
        deliveryAddress: ''
      },
      modifyAddressForm: {
        id: '',
        name: '',
        tel: '',
        deliveryAddress: ''
      },
      addressFormRules: {
        name: { required: true, message: '请输入收货人姓名', trigger: 'blur' },
        tel: { required: true, message: '请输入手机号码', trigger: 'blur' },
        deliveryAddress: { required: true, message: '请输入收货地址', trigger: 'blur' }
      },
      addressList: [],
      buyList: []
    };
  },
  created () {
    this.getDeliveryAddressList();
    if (this.goodsId !== undefined && this.num !== undefined) {
      this.getGoodsInfo();
    } else {
      this.buyList = this.cartList.filter(item => item.isChecked === 1);
    }
  },
  computed: {
    ...mapState({
      cartList: state => state.cart.cartList
    }),
    totalPrice () {
      if (this.buyList.length > 0) {
        return this.buyList.reduce((pre, cur) => {
          const curPrice = accMul(cur.goods.price, cur.num);
          return accAdd(pre, curPrice);
        }, 0);
      } else {
        return 0;
      }
    }
  },
  methods: {
    selfMul () {
      return accMul(...arguments);
    },
    async getGoodsInfo () {
      const [err, res] = await this.$http.asyncGet('api/v1.0/getGoodsInfoById', { id: this.goodsId });
      if (!err && res) {
        if (res.data.success) {
          const buyListItem = {
            goods: res.data.data.goods,
            num: this.num
          };
          this.buyList = [buyListItem];
        } else {
          this.$vmessage.error(res.data.msg);
        }
      }
    },
    chooseAddress (index) {
      this.selectedAddress = index;
    },
    resetFields (formName) {
      this.$refs[formName].resetFields();
    },
    clearValidate (formName) {
      this.$refs[formName].clearValidate();
    },
    // 查询收货地址
    async getDeliveryAddressList () {
      const [err, res] = await this.$http.asyncGet('api/v1.0/check/getDeliveryAddressList', { userId: this.userId });
      if (!err && res) {
        if (res.data.success) {
          this.addressList = res.data.data.deliveryAddressList;
        } else {
          this.$vmessage.error(res.data.msg);
        }
      }
    },
    // 添加收货地址
    async addDeliveryAddress () {
      document.getElementById('add').blur();
      this.$refs.addAddressForm.validate(async (valid) => {
        if (valid) {
          const params = {
            ...this.addAddressForm,
            userId: this.userId,
            page: { pageSize: 1 }
          };
          const [err, res] = await this.$http.asyncPost('api/v1.0/check/addDeliveryAddress', params);
          if (!err && res) {
            if (res.data.success) {
              this.$vmessage.success('添加成功');
              this.getDeliveryAddressList();
              this.addDrawer = false;
              this.resetFields('addAddressForm');
            } else {
              this.$vmessage.error(res.data.msg);
            }
          }
        }
      });
    },
    closeAddAddr () {
      this.addDrawer = false;
      this.clearValidate('addAddressForm');
    },
    handelModify (address) {
      this.modifyDrawer = true;
      const { id, name, tel, deliveryAddress } = address;
      this.modifyAddressForm = { id, name, tel, deliveryAddress };
    },
    // 修改收货地址
    async updateDeliveryAddress () {
      document.getElementById('modify').blur();
      this.$refs.modifyAddressForm.validate(async (valid) => {
        if (valid) {
          const [err, res] = await this.$http.asyncPost('api/v1.0/check/updateDeliveryAddress', this.modifyAddressForm);
          if (!err && res) {
            if (res.data.success) {
              this.$vmessage.success('修改成功');
              this.getDeliveryAddressList();
              this.modifyDrawer = false;
              this.resetFields('modifyAddressForm');
            } else {
              this.$vmessage.error(res.data.msg);
            }
          }
        }
      });
    },
    closeModifyAddr () {
      this.modifyDrawer = false;
      this.clearValidate('modifyAddressForm');
    },
    async setDefault (address) {
      const params = {
        id: address.id,
        isDefault: 1
      };
      const [err, res] = await this.$http.asyncPost('api/v1.0/check/updateDeliveryAddress', params);
      if (!err && res) {
        if (res.data.success) {
          this.getDeliveryAddressList();
        } else {
          this.$vmessage.error(res.data.msg);
        }
      }
    },
    // 删除收货地址
    async deleteDeliveryAddress (address) {
      const [err, res] = await this.$http.asyncPost('api/v1.0/check/deleteDeliveryAddress', address);
      if (!err && res) {
        if (res.data.success) {
          this.$vmessage.success('删除成功');
          this.getDeliveryAddressList();
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

  .title {
    color: #000;
    font-size: 20px;
  }

  .address-box {
    .address-content {
      margin-top: 20px;
      display: flex;
      flex-wrap: wrap;
    }

    .el-card {
      margin-bottom: 20px;
      border-radius: 10px;
      border: 0;
      width: 270px;
      box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2), -5px -5px 10px white, 2px 2px 1px #b3b3b3;
      background: transparent;
      transform: rotateX(20deg);
      cursor: pointer;
      text-shadow: 1px 1px 1px #ffffff;
      color: #656565;

      + .el-card {
        margin-left: 40px;
      }

      &:nth-child(4n+5) {
        margin-left: 0;
      }

      &:hover {
        box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2), -3px -3px 5px white, 2px 2px 1px #b3b3b3;
      }

      /*反光特效*/
      &:after {
        position: absolute;
        top: -70px;
        left: 0;
        content: "";
        width: 200%;
        height: 200%;
        background-image: linear-gradient(135deg, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 70%);
        transform: translateX(-100%);
      }

      &:hover:after {
        transform: translateX(100%);
        transition: all 0.7s ease-in-out;
      }

      .options {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: absolute;
        top: 10px;
        right: -50px;
        text-align: right;
        font-size: 12px;
        height: 60px;
        transition: right 0.5s ease-in-out;
      }

      a {
        color: #afafaf;
      }

      a:hover {
        color: #50b2ff;
      }

      &:hover .options {
        right: 5px;
        transition: right 0.5s ease-in-out;
      }

      ::v-deep .el-card__body {
        height: 160px;
      }

      /*地址选中状态*/
      &.selected {
        transform: skewX(0) rotateX(20deg);
        background: linear-gradient(135deg, #636363, #232323);
        box-shadow: 5px 5px 5px rgba(34, 50, 84, 0.5), -3px -3px 5px white, 2px 2px 1px #000;
        color: #fff;
        text-shadow: 1px 1px 1px #000;
      }

      &.selected .consignee {
        color: #ffc00f;
      }
    }

    .consignee {
      font-size: 16px;
      color: #FF9800;
      font-weight: bolder;
      letter-spacing: 2px;
    }

    .phone {
      margin-top: 15px;
      font-family: menlo, tahoma, sans-serif;
      font-size: 17px;
      letter-spacing: 3px
    }

    .address {
      margin-top: 10px;
      line-height: 1.5;
      font-size: 13px;
      letter-spacing: 2px;
    }

    .add-box.el-card:active {
      box-shadow: inset 5px 5px 10px rgba(0, 0, 0, 0.2), inset -5px -5px 10px white;
    }

    .add-box ::v-deep .el-card__body {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .add-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .add-inner p {
      margin-top: 10px;
    }
  }

  .address-form {
    width: 300px;
    margin: 0 auto;

    .el-button, ::v-deep .el-input__inner, ::v-deep.el-textarea__inner {
      border-radius: 10px;
    }

    .el-button {
      width: 100%;
      height: 40px;
    }
  }

  .buy-list-box {
    margin-top: 20px;
  }

  .goods-image img {
    width: 80px;
    height: 80px;
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
