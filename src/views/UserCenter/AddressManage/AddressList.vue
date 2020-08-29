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
            <el-button id="add" type="primary" @click="addDeliveryAddress">确认</el-button>
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
            <el-button id="modify" type="primary" @click="updateDeliveryAddress">确认</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="closeModifyAddr">关闭</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
    <div class="address-title">
      <div>收货地址</div>
      <el-button @click="handleAdd" id="addBtn" type="primary" icon="el-icon-plus" class="add-btn">
        添加地址
      </el-button>
    </div>
    <el-table :data="addressList" tooltip-effect="dark" style="width: 100%">
      <el-table-column v-for="item in tableProps"
                       :prop="item.prop"
                       :label="item.label"
                       :key="item.label"
                       :width="item.width"
      ></el-table-column>
      <el-table-column width="100px">
        <template slot-scope="scope">
          <span v-if="scope.row.isDefault===1">默认地址</span>
          <el-link :underline="false" type="primary" v-if="scope.row.isDefault===0" @click="setDefault(scope.row)">设为默认</el-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100px" class-name="operate-cell" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="handelModify(scope.row)"></el-button>
          <el-button icon="el-icon-delete" circle @click="deleteDeliveryAddress(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getStore } from '@/utils/storage';

export default {
  name: 'AddressList',
  data () {
    return {
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
      tableProps: [
        { label: '姓名', prop: 'name', width: 200 },
        { label: '收货地址', prop: 'deliveryAddress' },
        { label: '联系方式', prop: 'tel', width: 140 }
      ]
    };
  },
  created () {
    this.getDeliveryAddressList();
  },
  methods: {
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
    resetFields (formName) {
      this.$refs[formName].resetFields();
    },
    clearValidate (formName) {
      this.$refs[formName].clearValidate();
    },
    handleAdd () {
      this.addDrawer = true;
      document.getElementById('addBtn').blur();
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
    closeModifyAddr () {
      this.modifyDrawer = false;
      this.clearValidate('modifyAddressForm');
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
    async setDefault (address) {
      const params = {
        id: address.id,
        isDefault: 1,
        userId: this.userId
      };
      const [err, res] = await this.$http.asyncPost('api/v1.0/check/updateDefault', params);
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
  .address-title {
    font-size: 20px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .add-btn {
    width: 120px;
    height: 35px;
    font-size: 12px;

    i {
      font-size: 12px;
    }
  }

  ::v-deep .operate-cell .cell {
    overflow: unset;
  }

  .el-table .el-button {
    width: 30px;
    height: 30px;
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
