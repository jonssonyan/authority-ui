import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI, {Message, MessageBox} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 导入全局样式表
import './assets/css/global.css'
import * as echarts from 'echarts'


Vue.use(ElementUI);

Vue.config.productionTip = false;

// 导入弹框提示组件
Vue.prototype.$message = Message;
// confirm
Vue.prototype.$confirm = MessageBox.confirm;
// echarts
Vue.prototype.$echarts = echarts;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
