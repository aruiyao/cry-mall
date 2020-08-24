<template>
  <div style="height: 100%">
    <h1 class="mall-name">CRY Mall</h1>
    <div class="login-container">
      <el-form :model="loginForm" :rules="rules" ref="loginForm" label-position="left" label-width="0px">
        <el-form-item prop="userName">
          <el-input class="account" type="text" v-model="loginForm.userName" auto-complete="off" size="medium"
                    placeholder="账号" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input class="checkPass" type="password" v-model="loginForm.password" auto-complete="off" size="medium"
                    placeholder="密码" prefix-icon="el-icon-if icon-password"></el-input>
        </el-form-item>

        <el-form-item prop="verifyCode">
          <el-input class="checkCode" type="text" placeholder="验证码" v-model="loginForm.verifyCode"
                    size="medium" prefix-icon="el-icon-if icon-ic_verifycode_filled"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button id="login" class="login-btn" @click.native.prevent="login" :loading="logining"
                     icon="el-icon-if icon-login-">
            <span>登录</span>
          </el-button>
        </el-form-item>
        <p class="error-msg">{{loginErrorMsg}}</p>
      </el-form>
    </div>
  </div>
</template>

<script>
import { setStore } from '@/utils/storage';

export default {
  name: 'Login',
  props: ['redirectUrl'],
  data () {
    return {
      loginForm: {
        userName: '',
        password: ''
      },
      loginErrorMsg: '',
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        verifyCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      logining: false
    };
  },
  created () {
  },
  computed: {},
  methods: {
    async login () {
      document.getElementById('login').blur();
      this.logining = true;
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          const params = {
            userName: this.loginForm.userName,
            password: this.loginForm.password
          };
          const [err, res] = await this.$http.asyncGet('api/v1.0/login', params);
          if (!err && res) {
            if (res.data.success) {
              setStore('token', res.data.data.token);
              setStore('userId', res.data.data.userId);
              if (this.redirectUrl) {
                this.$router.push(this.redirectUrl);
              } else {
                this.$router.push('/home');
              }
            } else {
              this.loginErrorMsg = res.data.msg;
            }
          }
          this.logining = false;
        } else {
          this.logining = false;
          return false;
        }
      });
    },
    register () {
      this.$router.replace('/register');
    }
  }
};
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/theme.scss";
  @import "~@/assets/style/mixin";

  .mall-name {
    font-size: 70px;
    font-weight: bolder;
    color: $mall-name;
    text-shadow: $text-shadow;
    letter-spacing: 2px;
    margin-left: 20px;
    height: 25vh;
  }

  .login-container {
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    width: 310px;
    margin: 0 auto;

    form {
      width: 100%;
    }

    .title {
      margin: 0px auto 40px auto;
      text-align: left;
      color: #505458;
    }

    img {
      width: 100px;
      height: 40px;
      position: absolute;
      right: 0;
      top: -5px;
      z-index: 99;
    }

    .el-form-item {
      margin-bottom: 30px
    }

    .login-btn {
      color: $color-red;
      width: 100%;
      height: 44px;
      font-size: 16px;

      span {
        letter-spacing: 5px;
      }
    }

    .error-msg {
      color: #F56C6C;
      font-size: 14px;
    }
  }

  .el-input--medium .el-input__inner {
    @include hlh(45px)
  }
</style>
