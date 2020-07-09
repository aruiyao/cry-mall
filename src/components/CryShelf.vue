<template>
  <div class="gray-box">
    <div class="title">
      <h2>{{title}}</h2>
    </div>
    <div>
      <!-- 具名插槽 -->
      <slot name='content'></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CryShelf',
  props: ['title']
};
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/theme.scss";
  .gray-box {
    position: relative;
    margin-bottom: 30px;
    /*overflow: hidden;*/
    /*background: #fff;*/
    border-radius: 8px;
    /*border: 1px solid rgba(0, 0, 0, 0.14);*/
    /*box-shadow: 0 3px 8px -6px rgba(0, 0, 0, 0.1);*/
    box-shadow: $box-shadow;
  }

  .title {
    position: relative;
    z-index: 10;
    height: 60px;
    padding: 0 10px 0 24px;
    /*border-bottom: 1px solid rgba(0, 0, 0, 0.14);*/
    border-bottom: 1px solid #fff;
    border-radius: 8px 8px 0 0;
    /*box-shadow: rgba(0, 0, 0, 0.06) 0 1px 7px;*/
    line-height: 60px;
    font-size: 18px;
    color: #333;
    text-shadow: $text-shadow;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      font-size: 18px;
      font-weight: 400;
      color: #626262;
      display: inline-block;
    }
  }
</style>
