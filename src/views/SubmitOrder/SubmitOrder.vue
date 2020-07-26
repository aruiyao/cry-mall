<template>
  <div>
    <el-drawer
        title="我是标题"
        :visible.sync="drawer"
        :direction="direction"
        :wrapperClosable="false"
        :destroy-on-close="true"
    >
      <div class="">
        <el-form :model="addressForm" class="address-form" ref="addressForm" :rules="addressFormRules">
          <el-form-item prop="name">
            <el-input v-model="addressForm.name" placeholder="收货人姓名"></el-input>
          </el-form-item>
          <el-form-item prop="tel">
            <el-input v-model="addressForm.tel" placeholder="手机号码"></el-input>
          </el-form-item>
          <el-form-item prop="deliveryAddress">
            <el-input type="textarea" v-model="addressForm.deliveryAddress" placeholder="收货地址" rows="4"></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 25px;margin-bottom: 15px;">
            <el-button id="add" class="text-primary" @click="addDeliveryAddress">确认</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="drawer=false">关闭</el-button>
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
              <a href="javascript:void(0)">修改</a>
              <a href="javascript:void(0)">删除</a>
              <a href="javascript:void(0)">设为默认</a>
            </div>
          </el-card>
          <el-card class="add-box" @click.native="drawer=true">
            <div class="add-inner">
              <i class="el-icon el-icon-plus"></i>
              <p>添加新地址</p>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CryHeader from '@/components/CryHeader';
import { getStore } from '@/utils/storage';

export default {
  name: 'SubmitOrder',
  components: {
    CryHeader
  },
  data () {
    return {
      selectedAddress: 0,
      userId: getStore('userId'),
      drawer: false,
      direction: 'rtl',
      addressForm: {
        name: '',
        tel: '',
        deliveryAddress: ''
      },
      addressFormRules: {
        name: { required: true, message: '请输入收货人姓名', trigger: 'blur' },
        tel: { required: true, message: '请输入手机号码', trigger: 'blur' },
        deliveryAddress: { required: true, message: '请输入收货地址', trigger: 'blur' }
      },
      addressList: []
    };
  },
  created () {
    this.getDeliveryAddressList();
  },
  methods: {
    chooseAddress (index) {
      this.selectedAddress = index;
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
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
    async addDeliveryAddress () {
      document.getElementById('add').blur();
      this.$refs.addressForm.validate(async (valid) => {
        if (valid) {
          const params = {
            ...this.addressForm,
            userId: this.userId,
            page: { pageSize: 1 }
          };
          const [err, res] = await this.$http.asyncPost('api/v1.0/check/addDeliveryAddress', params);
          if (!err && res) {
            if (res.data.success) {
              this.$vmessage.success('添加成功');
              this.drawer = false;
              this.resetForm('addressForm');
            } else {
              this.$vmessage.error(res.data.msg);
            }
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/theme.scss";

  .address-box {
    .address-content {
      margin-top: 20px;
      display: flex;
      flex-wrap: wrap;
    }

    .title {
      color: #000;
      font-size: 20px;
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
</style>
