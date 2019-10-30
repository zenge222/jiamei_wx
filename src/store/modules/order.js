// import request from '../../api/request';
// import apiConfig from '../../api/apiConfig';
import * as types from '../mutations';
const order = {
  state: {
    orderInfo: {
      id: '',
      name: '',
      productTypeTitle: '',
      smallImg: '',
      productTypeId: '',
      message: "",
      productPackage: null,
      intro: '',
    },
    editAddrInfo: {
      address: '',
      areaText: '',
      provinceId: '',
      cityId: '',
      areaId: '',
      id: '',
      linkName: '',
      linkPhone: '',
      longitude: '',
      latitude: '',
      sex: -1,
      userId: '',
      locationName: ''
    }
  },
  mutations: {
    [types.SEND_ORDER_INFO](state, data) {
      state.orderInfo = data;
    },
    [types.EDIT_ADDRESS_INFO](state, data) {
      if (data.fromMap) {
        state.editAddrInfo.address = data.address;
        state.editAddrInfo.areaText = data.areaText;
        state.editAddrInfo.provinceId = data.provinceId;
        state.editAddrInfo.cityId = data.cityId;
        state.editAddrInfo.areaId = data.areaId;
        state.editAddrInfo.longitude = data.longitude;
        state.editAddrInfo.latitude = data.latitude;
        state.editAddrInfo.locationName = data.locationName;
        state.editAddrInfo.sex = data.sex;
        state.editAddrInfo.linkName = data.linkName;
        state.editAddrInfo.linkPhone = data.linkPhone;
      } else {
        console.log(data)
        state.editAddrInfo = data;
      }
    },
    [types.INIT_ADD_ADDRESS](state) {
      state.editAddrInfo.address = '';
      state.editAddrInfo.areaText = '';
      state.editAddrInfo.longitude = '';
      state.editAddrInfo.latitude = '';
      state.editAddrInfo.linkName = '';
      state.editAddrInfo.linkPhone = '';
      state.editAddrInfo.locationName = '';
    },
  },
  actions: {
    sendOrderInfo({
      commit,
      state
    }, params) {
      commit(types.SEND_ORDER_INFO, params);
    },
    editAddressInfo({
      commit,
      state
    }, params) {
      commit(types.EDIT_ADDRESS_INFO, params);
    },
    initAddAddress({
      commit,
      state
    }) {
      commit(types.INIT_ADD_ADDRESS);
    }
  },
};

export default order;
