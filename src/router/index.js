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
        component: () => import('@/views/Home/Home'),
        meta: {
          needLogin: false
        }
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/User/User'),
        meta: {
          needLogin: true
        }
      },
      {
        path: 'goodsdetail',
        name: 'goodsdetail',
        component: () => import('@/views/GoodsDetail/GoodsDetail'),
        meta: {
          needLogin: false
        }
      },
      {
        path: 'usercenter',
        name: 'usercenter',
        component: () => import('@/views/UserCenter/index'),
        children: [
          {
            path: 'myorder',
            name: 'myorder',
            component: () => import('@/views/UserCenter/OrderManage/OrderList'),
            meta: {
              needLogin: true
            }
          },
          {
            path: 'addressmanage',
            name: 'addressmanage',
            component: () => import('@/views/UserCenter/AddressManage/AddressList'),
            meta: {
              needLogin: true
            }
          }
        ]
      }
    ]
  },
  {
    path: '/submitorder',
    name: 'submitorder',
    component: () => import('@/views/SubmitOrder/SubmitOrder'),
    meta: {
      needLogin: true
    }
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/Cart/Cart'),
    meta: {
      needLogin: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/Login'),
    props: route => ({ redirectUrl: route.query.redirectUrl }),
    meta: {
      needLogin: false
    }
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
