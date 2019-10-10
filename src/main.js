// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import SlideVerify from 'vue-monoplasty-slide-verify'
import axios from 'axios'
import layer from "layui-layer";
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'babel-polyfill';
import echarts from 'echarts';


Vue.use(ElementUI)
Vue.use(SlideVerify);

Vue.use(Viewer);
Vue.prototype.$http = axios
Vue.prototype.$echarts = echarts //引入组件
Vue.config.productionTip = false

axios.defaults.timeout = 20000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

axios.defaults.baseURL = 'http://192.168.18.236';


  //axios.defaults.baseURL = 'http://wxfarms.fpchy.com:9002';


Viewer.setDefaults({
  Options: { "inline": true, "button": true, "navbar": true, "title": true, "toolbar": true, "tooltip": true, "movable": true, "zoomable": true, "rotatable": true, "scalable": true, "transition": true, "fullscreen": true, "keyboard": true, "url": "data-source" }
});

//http request 拦截器
axios.interceptors.request.use(
  config => {
    if (localStorage.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers["token"]  = localStorage.token;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });

//http response 拦截器
axios.interceptors.response.use(
  response => {
    if(response.data.code == -14){
      localStorage.removeItem("token");
      layer.msg("登录超时，请重新登录")
      router.replace({
        path: 'login',
        query: {redirect: router.currentRoute.fullPath}
      })
    }
    return Promise.resolve(response.data)
  },
  error => {
    return Promise.reject(error)   // 返回接口返回的错误信息
  });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
