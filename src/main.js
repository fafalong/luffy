// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 引入element-ui组件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import moment from 'moment'

import './assets/css/reset.css'

// 导入全局 axios 的插件
import MyHttpServrt from '../src/plugins/http'

// 导入全局自定义组件 -处理日期格式
import mybread from '../src/components/cuscom/myBread'

// 使用vue的插件 element-ui
Vue.use(ElementUI);

// 使用 axios 的插件
Vue.use(MyHttpServrt);

Vue.config.productionTip = false

// 自定义全局过滤器
Vue.filter('fmtdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})


// 使用全局自定义组件
Vue.component(mybread.name, mybread)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
