<template>
  <div class="user-box w">
    <cry-sidebar></cry-sidebar>
    <router-view></router-view>
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
.user-box{
  display: flex;
  align-items: flex-start;
}
</style>
