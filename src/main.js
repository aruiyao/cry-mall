import Vue from 'vue';
import router from './router';
import store from './store';
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import selfAxios from '@/api/axiosConfig';
import '@/api/initElementProps';
import App from './App.vue';
import VMessage from '@/components/messageTips';
import VMessageBox from '@/components/messageBox';
import VueLazyload from 'vue-lazyload';
import { getStore } from '@/utils/storage';

Vue.config.goodsionTip = false;

Vue.prototype.$http = selfAxios;
Vue.prototype.$vmessage = VMessage;
Vue.prototype.$vmessagebox = VMessageBox;

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'dist/error.png',
  loading: 'dis/loading.gif',
  attempt: 1
});

Vue.use(Element);
router.beforeEach(async (to, from, next) => {
  if (to.path !== '/login') {
    const [err, res] = await selfAxios.asyncGet('api/v1.0/checkLogin');
    if (!err && res) {
      if (res.data.success) {
        const isLogin = res.data.data.isLogin;
        store.commit('isLogin', isLogin);
        if (to.meta.needLogin) {
          if (!isLogin) {
            next({
              name: 'login',
              query: {
                redirectUrl: to.fullPath
              }
            });
          } else {
            next();
          }
        } else {
          next();
        }
      } else {
        VMessage.error(res.data.msg);
        next({ path: '/login' });
      }
    }
  } else {
    next();
  }
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
