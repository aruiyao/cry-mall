<template>
  <div id="main-frame">
    <transition name="fade">
      <cry-header v-if="isShow"></cry-header>
    </transition>
    <transition name="fade">
      <div id="router-outer" v-if="isShow">
        <router-view></router-view>
      </div>
    </transition>
  </div>
</template>

<script>
import CryHeader from '@/components/CryHeader';

export default {
  name: 'MainFrame',
  data () {
    return {
      isShow: false
    };
  },
  created () {
  },
  mounted () {
    this.isShow = true;
  },
  components: {
    CryHeader
  }
};
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
