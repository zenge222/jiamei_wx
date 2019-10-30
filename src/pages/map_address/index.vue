<template>
  <div class="map_address">
    <div class="header">
      <div class="header_left clearfix">
        <div @click="toCityList">
          <i-icon class="l_icon fl" type="coordinates"/>
          <p class="fl">{{wxChangeLocation.cityName}}</p>
          <i-icon class="l_icon fl" type="unfold"/>
        </div>
        <input disabled type="text" @click="tosearchAddress" placeholder="小区/街道/学校等">
      </div>
      <!-- <div @click="toAddAddress" class="header_add_address">新增地址</div> -->
    </div>
    <map
      class="map_class"
      :style="'width: 100%; height:'+height+'px'"
      id="map"
      :longitude="wxChangeLocation.longitude"
      :latitude="wxChangeLocation.latitude"
      scale="14"
      @controltap="controltap"
      :markers="markers"
      @markertap="markertap"
      @regionchange="regionchange"
      @begin="regionChangeBegin"
      @end="regionChangeEnd"
      show-location
    ></map>
    <div class="nearby">
      <div
        :class="nearbyIndex==index?'active':''"
        v-for="(item,index) in nearbyAddressList"
        :key="index"
        @click="changeAddressList(item,index)"
      >
        <div class="round_left">
          <p></p>
        </div>
        <div class="list_info">
          <h3>{{item.title}}</h3>
          <p>{{item.address}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import QQMapWX from "../../../static/js/qqmap-wx-jssdk.js";
import { mapState, mapActions } from "vuex";
import { getUserLocation } from "../../api/wx_authorization";
export default {
  name: "map_address",
  data() {
    return {
      qqmapsdk: null,
      height: 250,
      imgBasePath: this.imgBasePath,
      longitude: "",
      latitude: "",
      markers: [
        {
          // iconPath: "../../static/images/icon_location.png",
          // id: 0,
          // latitude: 23.099994,
          // longitude: 113.32452,
          // width: 20,
          // height: 30
        }
      ],
      controls: [
        {
          id: 1,
          iconPath: "../../static/images/icon_location.png",
          position: {
            left: 0,
            top: 300 - 50,
            width: 50,
            height: 50
          },
          clickable: true
        }
      ],
      nearbyAddressList: [],
      nearbyIndex: -1
    };
  },
  computed: {
    ...mapState({
      mapKey: state => state.login.mapKey,
      wxLocation: state => state.login.wxLocation,
      wxChangeLocation: state => state.login.wxChangeLocation,
      mapNearbyAddressList: state => state.login.mapNearbyAddressList
    })
  },
  onLoad() {
    console.log(this.wxChangeLocation);
    this.markers[0].latitude = this.wxChangeLocation.latitude;
    this.markers[0].longitude = this.wxChangeLocation.longitude;
  },
  onShow() {
    // this.qqmapsdk = new QQMapWX({
    //   key: this.mapKey
    // });
    Object.assign(this.$data, this.$options.data());
    // 定位授权
    getUserLocation("map");
    this.nearbyAddressList = this.mapNearbyAddressList;
    console.log(this.mapNearbyAddressList);
  },
  onHide() {
    // 重置data 完成初始化
    // Object.assign(this.$data, this.$options.data());
  },
  methods: {
    ...mapActions(["wxSetPosition", "wxSetPositionName"]),
    regionchange(e) {
      console.log(e.type);
    },
    toCityList() {
      let url = `../city_list/main`;
      wx.navigateTo({ url });
    },
    tosearchAddress() {
      let url = `../search_address/main`;
      wx.navigateTo({ url });
    },
    markertap(e) {
      console.log(e.markerId);
    },
    controltap(e) {
      console.log(e.controlId);
    },
    regionChangeBegin(e){

    },
    regionChangeEnd(e){

    },
    // 获取经纬度
    // geo() {
    //   let _this = this;
    //   wx.getLocation({
    //     type: "wgs84",
    //     success: function(res) {
    //       // console.log(res)
    //       // _this.wxSetPosition(res);
    //       _this.getPositionName();
    //     },
    //     fail: () => {
    //       wx.navigateBack({
    //         delta: -1
    //       });
    //     }
    //   });
    // },
    // 定位授权
    // getUserLocation() {
    //   let _this = this;
    //   wx.getSetting({
    //     success: res => {
    //       // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
    //       // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
    //       // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
    //       if (
    //         res.authSetting["scope.userLocation"] != undefined &&
    //         res.authSetting["scope.userLocation"] != true
    //       ) {
    //         //未授权
    //         wx.showModal({
    //           title: "请求授权当前位置",
    //           content: "需要获取您的地理位置，请确认授权",
    //           success: function(res) {
    //             if (res.cancel) {
    //               //取消授权
    //               wx.showToast({
    //                 title: "拒绝授权",
    //                 icon: "none",
    //                 duration: 1000
    //               });
    //               console.log("拒绝授权");
    //               wx.navigateBack({
    //                 delta: -1
    //               });
    //             } else if (res.confirm) {
    //               //确定授权，通过wx.openSetting发起授权请求
    //               wx.openSetting({
    //                 success: function(res) {
    //                   if (res.authSetting["scope.userLocation"] == true) {
    //                     // wx.showToast({
    //                     //   title: "授权成功",
    //                     //   icon: "success",
    //                     //   duration: 1000
    //                     // });
    //                     //再次授权，调用wx.getLocation的API
    //                     _this.geo();
    //                   } else {
    //                     wx.showToast({
    //                       title: "授权失败",
    //                       icon: "none",
    //                       duration: 1000
    //                     });
    //                   }
    //                 }
    //               });
    //             }
    //           }
    //         });
    //       } else if (res.authSetting["scope.userLocation"] == undefined) {
    //         //用户首次进入页面,调用wx.getLocation的API
    //         _this.geo();
    //       } else {
    //         // console.log("授权成功");
    //         //调用wx.getLocation的API
    //         _this.geo();
    //       }
    //     }
    //   });
    // },
    // 逆解析
    // getPositionName() {
    //   let _this = this;

    //   let locations =
    //     _this.wxChangeLocation.latitude +
    //     "," +
    //     _this.wxChangeLocation.longitude;
    //   console.log(locations);
    //   this.qqmapsdk.reverseGeocoder({
    //     location: locations || "", //获取表单传入的位置坐标,不填默认当前位置,示例为string格式  "123,123"
    //     //get_poi: 1, //是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
    //     policy: 1, // 本策略主要用于收货地址、上门服务地址的填写，
    //     filter: "category=街道,小区,学校",
    //     success: function(res) {
    //       if (res.result) {
    //         // let city = res.result.address_component.city;
    //         // if (city.charAt(city.length - 1) == "市") {
    //         //   city = city.substr(0, city.length - 1);
    //         // }
    //         // let addressName = {
    //         //   cityName: city,
    //         //   otherName: res.result.address_component.street
    //         // };
    //         // _this.wxSetPositionName(addressName);
    //       }
    //       // 搜索
    //       _this.qqmapsdk.search({
    //         keyword: _this.wxChangeLocation.cityName, //搜索关键词
    //         location: locations, //设置周边搜索中心点 "39.980014,116.313972"
    //         success: function(res) {
    //           // 附近地点
    //           // console.log(res);
    //           _this.nearbyAddressList = res.data;
    //         },
    //         fail: function(res) {
    //           console.log(res);
    //         },
    //         complete: function(res) {}
    //       });
    //     },
    //     fail: function(error) {
    //       console.error(error);
    //     }
    //     // complete: function(res) {
    //     //   if (res.result) {
    //     //     _this.wxSetPositionName(res.result.address_component.street);
    //     //   }
    //     //   // 搜索
    //     //   console.log(_this.wxLocation);
    //     //   _this.qqmapsdk.search({
    //     //     keyword: _this.wxLocation.potionName, //搜索关键词
    //     //     location: locations, //设置周边搜索中心点 "39.980014,116.313972"
    //     //     success: function(res) {},
    //     //     fail: function(res) {
    //     //       console.log(res);
    //     //     },
    //     //     complete: function(res) {
    //     //       console.log(res);
    //     //     }
    //     //   });
    //     // }
    //   });
    // },
    changeAddressList(item, index) {
      let currentMakers = [
        {
          iconPath: "../../static/images/icon_location.png",
          id: 0,
          latitude: item.location.lat,
          longitude: item.location.lng,
          width: 25,
          height: 30
        }
      ];
      this.markers = [];
      this.markers = this.markers.concat(currentMakers);
      this.nearbyIndex = index;
      console.log(this.markers);
      console.log(item);
      this.markers[0].latitude = item.location.lat;
      this.markers[0].longitude = item.location.lng;
      // let location = {
      //   latitude: item.location.lat,
      //   longitude: item.location.lng
      // };
      // this.wxSetPosition(location);
    }
  }
};
</script>

<style lang="less" scoped>
</style>