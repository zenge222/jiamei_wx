import store from '../store/index'
import * as types from '../store/mutations';
import QQMapWX from "../../static/js/qqmap-wx-jssdk.js";
const login = store.state.login;
const qqmapsdk = new QQMapWX({
  key: login.mapKey
});

// --------------------------------------------- 定位授权 + 逆解析 -----------------------------------------------
export function getUserLocation(params) {
  wx.getSetting({
    success: res => {
      // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
      // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
      // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
      if (
        res.authSetting["scope.userLocation"] != undefined &&
        res.authSetting["scope.userLocation"] != true
      ) {
        //未授权
        wx.showModal({
          title: "请求授权当前位置",
          content: "需要获取您的地理位置，请确认授权",
          success: function (res) {
            if (res.cancel) {} else if (res.confirm) {
              //确定授权，通过wx.openSetting发起授权请求
              wx.openSetting({
                success: function (res) {
                  if (res.authSetting["scope.userLocation"] == true) {
                    if (params == "search") {
                      let url = `../search_address/main`;
                      wx.navigateTo({
                        url
                      });
                    } else if (params == "add_edit_addr") {
                      let url = `../map_address2/main`;
                      wx.navigateTo({
                        url
                      });
                    }
                    geo(params);
                  } else {
                    wx.showToast({
                      title: "授权失败",
                      icon: "none",
                      duration: 1000
                    });
                  }
                }
              });
            }
          }
        });
      } else if (res.authSetting["scope.userLocation"] == undefined) {
        //用户首次进入页面,调用wx.getLocation的API
        if (params == "search") {
          let url = `../search_address/main?page=selAddress`;
          geo(params);
          wx.navigateTo({
            url
          });
        } else if (params == "add_edit_addr") {
          let url = `../map_address2/main`;
          wx.navigateTo({
            url
          });
        } else {
          geo(params);
        }
      } else {
        // console.log("授权成功");
        //调用wx.getLocation的API
        if (params == "search") {
          let url = `../search_address/main?page=selAddress`;
          geo(params);
          wx.navigateTo({
            url
          });
        } else if (params == "add_edit_addr") {
          let url = `../map_address2/main`;
          wx.navigateTo({
            url
          });
        } else {
          geo(params);
        }

      }
    }
  });
}

function geo(params) {
  let _this = this;
  wx.getLocation({
    type: "wgs84",
    success: function (res) {
      // 主页定位授权
      // if (params == "home") {
      //   store.commit(types.CHANGE_CHANGE_LOCATION, res); // change 市经纬度
      //   store.commit(types.WX_SET_POSITION, res); // wx     街道经纬度
      //   home(params);
      // } else 
      if (params == "reset") {
        res.name = "reset";
        store.commit(types.WX_SET_POSITION, res); // wx  c   街道经纬度
        getPositionName(params)
      } else if (params == "search") {
        res.name = "search";
        store.commit(types.WX_SET_POSITION, res);
      } else if (params == "cityList") {
        res.name = "cityListLL"
        store.commit(types.CHANGE_WX_CITY, res); // wx 市 经纬度
        getPositionName(params)
      } else {
        // map
        store.commit(types.WX_SET_POSITION, res); // wx     街道经纬度
        getPositionName(params);
      }

    },
    fail: () => {}
  });
}
// 逆解析
function getPositionName(params) {
  let _this = this;
  let locations = "";
  if (params == 'reset') {
    locations = "";
  } else if (params == 'map') {
    locations = login.wxLocation.latitude + "," + login.wxLocation.longitude;
  } else if (params == 'cityList') {
    // locations =login.wxLocation.latitude + "," + login.wxLocation.longitude;
  } else {
    // console.log('else')
    // console.log(login.wxChangeLocation)
    locations = login.wxChangeLocation.latitude + "," + login.wxChangeLocation.longitude;
  }
  qqmapsdk.reverseGeocoder({
    location: locations || "", //获取表单传入的位置坐标,不填默认当前位置,示例为string格式  "123,123"
    //get_poi: 1, //是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
    success: function (res) {
      // 是否在服务区 flyio
      let city = res.result.ad_info.city;
      let locationInfo = res.result.ad_info;
      if (city.charAt(city.length - 1) == "市") {
        city = city.substr(0, city.length - 1);
      }
      let addressName = {
        street: res.result.address_component.street,
        cityName: city // 市 待处理
      };
      // 主页 change 街道
      // if (params == "home") {
      //   let params = {
      //     province: locationInfo.province,
      //     city: city,
      //     area: locationInfo.district,
      //     street: addressName.street,
      //     longitude: locationInfo.location.lng,
      //     latitude: locationInfo.location.lat
      //   }
      //   console.log(params)
      //   // 不在服务区 默认切上海   1 在服务区  0 未授权 2 不在服务区
      //   addressName.name = 'home';
      //   store.commit(types.CHANGE_CHANGE_LOCATION, addressName); // change 街道名 市名
      //   store.commit(types.WX_SET_POSITION_NAME, addressName); // wx     街道名
      // } else 
      if (params == "cityList") {
        let params = {
          cityName: addressName.cityName,
          name: 'cityListName'
        };
        store.commit(types.CHANGE_WX_CITY, params); // wx 市名 
      } else if (params == 'reset') {
        let params = {
          street: addressName.street,
          name: 'resetName'
        };
        store.commit(types.WX_SET_POSITION, params); // wx  c   街道名
      } else if (params == 'search') {
        let params = {
          cityName: addressName.city,
          name: 'searchName'
        };
        store.commit(types.WX_SET_POSITION, params); // wx  c   城市
      } else if (params == "map") {
        let params = {
          street: res.result.address_component.street, // 市 待处理
          name: 'map'
        };
        store.commit(types.WX_SET_POSITION_NAME, params); // wx     街道名
        qqmapsdk.search({
          keyword: login.wxLocation.potionName, //搜索关键词
          location: locations, //设置周边搜索中心点 "39.980014,116.313972"
          success: function (res) {
            // 附近地点
            // console.log(res);
            store.commit(types.GET_MAP_NEARBY_LIST, res);
            // _this.nearbyAddressList = res.data;
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {}
        });
      } else {
        store.commit(types.WX_SET_POSITION_NAME, addressName); // wx     街道名
      }
    },
    fail: function (error) {
      console.error(error);
    },
    complete: function (res) {}
  });
}
