import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI, { Message, MessageBox } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入全局样式表
import './assets/css/global.css'

Vue.use(ElementUI)

Vue.config.productionTip = false

// 导入弹框提示组件
Vue.prototype.$message = Message
// confirm
Vue.prototype.$confirm = MessageBox.confirm

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
