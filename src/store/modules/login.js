// import request from '../../api/request';
// import apiConfig from '../../api/apiConfig';
import * as types from '../mutations';
const login = {
  state: {
    mapKey: 'X7ABZ-724RG-CMFQX-I72XT-HSNSZ-HVBCR',
    APPID: 'wx49a9b81ff012bbd6',
    openId: '初始openId',
    AppSecret: '5cf64256e73a5620ae3e70f8a9a667f6',
    isIphoneX: false,
    // 手机登录
    phoneLogin: false,
    phoneLoginInfo: {
      phoneNum: '',
      phone:'',
    },
    // 授权登录
    wxLogin: false,
    smstoken: '',
    authorization: '',
    // 微信授权用户信息
    wxUserInfo: {
      nickName: '',
      avatarUrl: '',
      gender: null,
      province: '',
      city: '',
      country: ''
    },
    // 微信授权定位信息
    wxLocation: {
      potionName: '定位失败', // 当前街道定位 不变
      latitude: '',
      longitude: '',

      // potionCityName:'',     // 详情页 当前城市定位  暂时不做 
      // potionCityLatitude:'',
      // potionCityLongitude:'',

      cityName: '定位失败', // 城市列表 重新定位
      cityLatitude: '',
      cityLongitude: '',

      cPotionName: '定位失败', // 选择地址 街道重新定位 不变
      cLatitude: '',
      cLongitude: '',
    },
    wxChangeLocation: {
      street: '上海', // 街道切换 主页
      latitude: '31.40527',
      longitude: '121.48941',

      cityName: '上海', // 城市切换
      cityLatitude: '31.40527',
      cityLongitude: '121.48941',

      orderProvince: '上海市',
      orderCity: '上海',
      orderArea: '长岭区',
      orderLat: '31.40527', // 默认待修改
      orderLong: '121.48941', // 默认待修改

    },
    mapNearbyAddressList: [],

  },
  mutations: {
    [types.SETIPHONEX](state, data) {
      state.isIphoneX = data;
    },
    [types.TO_WX_LOGIN](state, data) {
      state.wxLogin = true;
      state.wxUserInfo = data;
    },
    [types.GET_MAP_NEARBY_LIST](state, data) {
      state.mapNearbyAddressList = data.data;
    },
    [types.TO_PHONE_LOGIN](state, data) {
      if (data.name == 'home') {
        if (data.phone) {
          state.phoneLogin = true;
        } else {
          state.phoneLogin = false;
        }
        state.phoneLoginInfo.phoneNum = data.phone;
        state.phoneLoginInfo.phone = data.phone;
        state.wxUserInfo.nickName = data.nickName;
        state.wxUserInfo.avatarUrl = data.avatarUrl;
      } else {
        state.phoneLogin = true;
        state.phoneLoginInfo.phoneNum = data.info.phone;
        state.phoneLoginInfo.phone = data.info.phone;
        state.wxUserInfo.nickName = data.info.nickname;
        state.wxUserInfo.avatarUrl = data.info.headerImg;
      }

    },
    [types.CHANGE_NICKNAME](state, data) {
      state.wxUserInfo.nickName = data;
    },
    [types.UPLOAD_USER_PIC](state, data) {
      state.wxUserInfo.avatarUrl = data;
    },
    [types.DEL_PHONE_LOGIN](state) {
      state.phoneLogin = false;
      state.phoneLoginInfo.phoneNum = '';
      state.phoneLoginInfo.phone = '';
      //   state.authorization = '';
    },
    [types.WX_SET_POSITION](state, data) {
      if (data.name == "reset") {
        state.wxLocation.cLatitude = data.latitude;
        state.wxLocation.cLongitude = data.longitude;
      } else if (data.name == "resetName") {
        state.wxLocation.cPotionName = data.street;
      } else if (data.name == "search") {
        state.wxChangeLocation.cityLatitude = data.latitude;
        state.wxChangeLocation.cityLongitude = data.longitude;
      } else if (data.name == "searchName") {
        state.wxLocation.cityName = data.cityName;
      } else {
        state.wxLocation.latitude = data.latitude;
        state.wxLocation.longitude = data.longitude;
        state.wxChangeLocation.latitude = data.latitude;
        state.wxChangeLocation.longitude = data.longitude;
      }
    },
    [types.WX_SET_POSITION_NAME](state, data) {
      state.wxLocation.potionName = data.street;
    },
    [types.SET_AUTHORIZATION](state, data) {
      if (data.name == "setToken") {
        state.authorization = data.token;
      } else {
        state.authorization = data.token;
        state.phoneLogin = data.phoneLogin;
        state.phoneLoginInfo.phoneNum = data.phoneNum;
        state.phoneLoginInfo.phone = data.phoneNum;
      }
    },
    [types.CHANGE_WX_CITY](state, data) {
      // 修改城市
      if (data.name == "cityListName") {
        state.wxLocation.cityName = data.cityName;
      } else if (data.name == "cityListLL") {
        state.wxLocation.cityLatitude = data.latitude;
        state.wxLocation.cityLongitude = data.longitude;
      }
    },
    [types.CHANGE_CHANGE_LOCATION](state, data) {
      if (data.name == "home") {
        console.log(data)
        state.wxChangeLocation.street = data.street;
        state.wxChangeLocation.cityName = data.city;
        state.wxLocation.potionName = data.street;
        state.wxLocation.latitude = data.latitude;
        state.wxLocation.longitude = data.longitude;
        state.wxChangeLocation.latitude = data.latitude;
        state.wxChangeLocation.longitude = data.longitude;

        state.wxChangeLocation.orderCity = data.city;
        state.wxChangeLocation.orderArea = data.area;
        state.wxChangeLocation.orderProvince = data.province;
        state.wxChangeLocation.orderLat = data.latitude;
        state.wxChangeLocation.orderLong = data.longitude;
      } else if (data.name == "order") {
        state.wxChangeLocation.orderProvince = data.province;
        state.wxChangeLocation.orderCity = data.city;
        state.wxChangeLocation.orderArea = data.area;
        // state.wxChangeLocation.orderLat: '31.40527', // 待处理
        // state.wxChangeLocation.orderLong: '121.48941', // 待处理
      } else if (data.name == "reset") {
        state.wxLocation.latitude = data.latitude;
        state.wxLocation.longitude = data.longitude;
      } else if (data.all || data.name == "selUserAddress") {
        state.wxChangeLocation.street = data.street;
        state.wxChangeLocation.latitude = data.latitude;
        state.wxChangeLocation.longitude = data.longitude;
      } else if (data.changeCity == "cityItem") {
        state.wxChangeLocation.cityLatitude = data.latitude;
        state.wxChangeLocation.cityLongitude = data.longitude;
        state.wxChangeLocation.cityName = data.cityName;
      } else if (data.name == 'checkCurrentLocation') {
        state.wxChangeLocation.cityLatitude = state.wxLocation.cityLatitude
        state.wxChangeLocation.cityLongitude = state.wxLocation.cityLongitude
        state.wxChangeLocation.cityName = state.wxLocation.cityName
      } else if (data.name == 'selLocation') {
        state.wxChangeLocation.latitude = state.wxLocation.cLatitude;
        state.wxChangeLocation.longitude = state.wxLocation.cLongitude;
        state.wxChangeLocation.street = state.wxLocation.cPotionName;
      } else {
        state.wxChangeLocation.cityLatitude = data.latitude;
        state.wxChangeLocation.cityLongitude = data.longitude;
      }
    },
  },
  actions: {
    toWxLogin({
      commit,
      state
    }, params) {
      commit(types.TO_WX_LOGIN, params);
    },
    getMapNearbyList({
      commit,
      state
    }, params) {
      commit(types.GET_MAP_NEARBY_LIST, params);
    },
    WxOutLogin({
      commit,
      state
    }) {
      commit(types.WX_OUT_LOGIN);
    },
    toUserLogin({
      commit,
      state
    }, params) {
      commit(types.TO_PHONE_LOGIN, params);
    },
    delPhoneLogin({
      commit,
      state
    }, params) {
      commit(types.DEL_PHONE_LOGIN);
      // 调用登录接口
      if (state.wxLogin) {
        wx.login({
          success: () => {
            wx.getUserInfo({
              success: res => {
                var userInfo = JSON.parse(res.rawData);
                commit(types.TO_WX_LOGIN, userInfo);
              }
            });
          },
          fail: res => {}
        });
      }
    },
    changeNickName({
      commit,
      state
    }, params) {
      commit(types.CHANGE_NICKNAME, params);
    },
    uploadUserPic({
      commit,
      state
    }, params) {
      commit(types.UPLOAD_USER_PIC, params);
    },
    wxSetPosition({
      commit,
      state
    }, params) {
      commit(types.WX_SET_POSITION, params);
    },
    wxSetPositionName({
      commit,
      state
    }, params) {
      commit(types.WX_SET_POSITION_NAME, params);
    },
    changeChangeLocation({
      commit,
      state
    }, params) {
      commit(types.CHANGE_CHANGE_LOCATION, params);
    },
    changeWxCity({
      commit,
      state
    }, params) {
      commit(types.CHANGE_WX_CITY, params);
    }
  },
};

export default login;
