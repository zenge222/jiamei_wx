import Vue from 'vue';
import Vuex from 'vuex';
import login from '../store/modules/login';
import order from '../store/modules/order';
import classify from '../store/modules/classify';
import addressHistory from '../store/modules/addressHistory';
import createPersistedState from 'vuex-persistedstate'
// import actions from './actions';
// import mutations from './mutations';
// import getters from './getters';
// import state from './state';
Vue.use(Vuex)

// 引入vuex-persistedstate，将vuex的数据持久化到本地 处理页面刷新 数据丢失
const store = new Vuex.Store({
  modules: {
    login,
    order,
    classify,
    addressHistory
  },
  // mutations,
  // getters,
  // actions,
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => wx.getStorageSync(key),
        setItem: (key, value) => wx.setStorageSync(key, value),
        removeItem: key => {}
      }
    })
  ]
})
export default store;
