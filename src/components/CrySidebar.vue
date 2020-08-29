<template>
  <div class="side-box">
    <div class="side-title">用户中心</div>
    <div v-for="(item,index) in menuList" :key="item.name" @click="chooseMenu(item,index)"
         :class="{'selected':selectedIndex===index}" class="side-item"> {{item.name}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'CrySidebar',
  data () {
    return {
      selectedIndex: 0,
      menuList: [
        {
          name: '我的订单',
          routerName: 'myorder'
        },
        {
          name: '收货地址',
          routerName: 'addressmanage'
        },
        {
          name: 'aaa',
          routerName: 'myoraaader'
        }
      ]
    };
  },
  created () {
    this.selectedIndex = this.menuList.findIndex(item => item.routerName === this.$route.name);
  },
  methods: {
    chooseMenu (item, index) {
      this.selectedIndex = index;
      this.$router.push({ name: item.routerName });
    }
  }
};
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/theme.scss";

  .side-box {
    width: 200px;
    text-align: center;
    cursor: pointer;
    box-shadow: $box-shadow;
    border-radius: 10px;
    letter-spacing: 1px;
    user-select: none;
    margin-right: 40px;
  }

  .side-title{
    font-size: 18px;
    padding: 50px 0 30px 0;
    color: #000;
  }

  .side-item {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    color: #666;
    text-shadow: $text-shadow;
    transition: font-size 0.2s linear;

    &:hover {
      box-shadow: -2px -2px 5px $color-white, 2px 2px 5px $color-shadow;
    }
    &:active{
      box-shadow: inset -1px -1px 2px $color-white, inset 1px 1px 2px $color-shadow;
    }

    &.selected{
      box-shadow: inset -1px -1px 2px $color-white, inset 1px 1px 2px $color-shadow;
    }
  }
</style>
