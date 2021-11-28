import Vue from 'vue'
import VueRouter from 'vue-router'
import {getToken} from "../utils/auth";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: () => import('../views/login')
    },
    {
        path: '/register',
        component: () => import('../views/register')
    },
    {
        path: '/layout',
        component: () => import('../layout'),
        redirect: '/user',
        children: [
            {
                path: '/user',
                component: () => import('../views/user')
            },
            {
                path: '/category',
                component: () => import('../views/category')
            },
            {
                path: '/product',
                component: () => import('../views/product')
            },
            {
                path: '/order',
                component: () => import('../views/order')
            },
            {
                path: '/power',
                component: () => import('../views/power')
            },
            {
                path: '/role',
                component: () => import('../views/role')
            },
        ]
    }
];

const router = new VueRouter({
    routes
});

// 路由控制守卫,解决需要登录才可以访问的页面
router.beforeEach((to, from, next) => {
    // 如果访问的首页直接放行
    if (to.path === '/login' || to.path === '/register') return next();
    // 获取token
    const hasToken = getToken();
    // 没有token放回登录界面
    if (!hasToken) return next('/login');
    // 有token放行
    return next()
});

export default router
