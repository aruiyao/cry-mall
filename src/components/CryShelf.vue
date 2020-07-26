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
    border-radius: 8px;
    box-shadow: $box-shadow;
  }

  .title {
    position: relative;
    z-index: 10;
    height: 60px;
    padding: 0 10px 0 24px;
    border-bottom: 1px solid #fff;
    border-radius: 8px 8px 0 0;
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
