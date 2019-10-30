import Vue from 'vue'
import App from './App'
import store from './store/index'
import * as types from './store/mutations';
const Fly = require("flyio/dist/npm/wx");
import request from './api/request';
// const imgBastPath = 'https://fzh.oss-cn-beijing.aliyuncs.com/jiamei/';
const imgBastPath = 'https://file.omnrj.com/static/images/';
// 兼容vue-router写法
// import MpvueRouterPatch from 'mpvue-router-patch'
// Vue.use(MpvueRouterPatch)
wx.getSystemInfo({
  success: function (res) {
    if (res.model == 'iPhone X') {
      store.commit(types.SETIPHONEX, true);
    }
  }
});

const {
  $Message,
  $Toast
} = require('../static/iview/base/index');
Vue.config.productionTip = false // 阻止 vue 在启动时生成生产提示。
App.mpType = 'app'
Vue.prototype.$store = store;
Vue.prototype.$fly = Fly;
Vue.prototype.$Message = $Message;
Vue.prototype.$Toast = $Toast;
Vue.prototype.imgBastPath = imgBastPath;
// console.log(wx)
const app = new Vue(App)
app.$mount()
