import * as types from '../mutations';
const addressHistory = {
  state: {
    addressList: [],
    locationList: [],
  },
  mutations: {
    // 添加地址定位记录
    addAddressHistory(state, data) {
      state.addressList.unshift(data);
    },
    // 清除地址定位记录 
    clearAddressHistory(state) {
      state.addressList = [];
    },
    // 添加城市定位记录
    addLocationHistory(state, data) {
      state.locationList.unshift(data);
    },
    // 清除城市定位记录
    clearLocationHistory(state) {
      state.locationList = [];
    },
  },
  actions: {

  },
}
export default addressHistory;
