import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'MainFrame',
    component: () => import('@/views/MainFrame.vue'),
    redirect: 'home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/Home/Home')
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/User/User')
      },
      {
        path: 'productdetail',
        name: 'productdetail',
        component: () => import('@/views/ProductDetail/ProductDetail')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/Login')
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/components/403')
  },
  {
    // 特别注意这个路由，要保证此路由在所有路由的最后面，所有未匹配到的路径显示404
    path: '*',
    component: () => import('@/components/404')
  }
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
});

// 解决再次点击当前菜单控制台报错
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace (location) {
  return originalReplace.call(this, location).catch(err => err);
};
// 解决再次点击当前菜单控制台报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err);
};

export default router;
