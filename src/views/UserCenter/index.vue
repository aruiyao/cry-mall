<template>
  <div class="user-box w">
    <cry-sidebar></cry-sidebar>
    <div class="user-right">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import CrySidebar from '@/components/CrySidebar';

export default {
  name: 'index',
  components: {
    CrySidebar
  }
};
</script>

<style scoped>
  .user-box {
    display: flex;
    align-items: flex-start;
  }

  .user-right {
    width: 970px;
    padding: 50px 30px;
    box-shadow: -3px -3px 5px #FFF, 3px 3px 5px #BABECC;
    border-radius: 10px;
  }
</style>
