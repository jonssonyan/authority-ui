import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import UserList from '../views/user/UserList.vue'
import CategoryList from '../views/category/CategoryList.vue'
import ProductList from '../views/product/ProductList.vue'
import OrderList from '../views/order/OrderList.vue'
import RightsList from '../views/power/RightsList.vue'
import RoleList from '../views/power/RoleList.vue'
import Register from "../views/Register";
import axios from "axios";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/register',
        component: Register
    },
    {
        path: '/home',
        component: Home,
        children: [
            {
                path: '/userList',
                component: UserList
            },
            {
                path: '/categoryList',
                component: CategoryList
            },
            {
                path: '/productList',
                component: ProductList
            },
            {
                path: '/orderList',
                component: OrderList
            },
            {
                path: '/rightsList',
                component: RightsList
            },
            {
                path: '/roleList',
                component: RoleList
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
    const tokenStr = window.sessionStorage.getItem('Authorization');
    // 没有token放回登录界面
    if (!tokenStr) return next('/login');
    // 有token放行
    return next()
});

axios.interceptors.request.use((config) => {
    config.headers.Authorization = window.sessionStorage.getItem('Authorization');
    return config
});

// axios 配置
axios.defaults.baseURL = 'http://localhost:8888/authority';
Vue.prototype.$http = axios;

export default router
