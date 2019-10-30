<template>
  <div class="map_address">
    <div style="position:fixed;left:0;top:0;width:100%;z-index:2;">
      <div class="header">
        <div class="header_left clearfix">
          <div @click="toCityList">
            <i-icon class="l_icon fl" type="coordinates" />
            <p class="fl">{{wxChangeLocation.cityName}}</p>
            <i-icon class="l_icon fl" type="unfold" />
          </div>
          <input disabled type="text" @click="tosearchAddress" placeholder="小区/街道/学校等" />
        </div>
        <!-- <div @click="toAddAddress" class="header_add_address">新增地址</div> -->
      </div>
      <!-- <div class="position_loaction" @click="relocation">
        <van-icon name="aim" color="#EB5D2A" />
      </div> -->
      <map
        class="map_class"
        id="map"
        :longitude="myLongitude"
        :latitude="myLatitude"
        scale="18"
        bindcontroltap="controltap"
        :markers="markers"
        @markertap="markertap"
        @regionchange="regionChange"
        @begin="regionChangeBegin"
        @end="regionChangeEnd"
        show-location
        style="width: 100%; height: 250px;"
      ></map>
    </div>
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
import QQMapWX from "../../../static/js/qqmap-wx-jssdk.js";
import { mapState, mapActions } from "vuex";
import { getUserLocation } from "../../api/wx_authorization";
export default {
  name: "map_address",
  data() {
    return {
      qqmapsdk: null,
      myLatitude: 0.0,
      myLongitude: 0.0,
      markers: null,
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
    var _this = this;
    // 实例化API核心类
    this.qqmapsdk = new QQMapWX({
      key: this.mapKey
    });
    wx.getLocation({
      type: "gcj02",
      success: function(res) {
        // console.log(res);
        _this.myLatitude = res.latitude;
        _this.myLongitude = res.longitude;
      }
    });
  },
  onReady() {
    this.getLngLat();
  },
  onShow() {},
  onHide() {},
  methods: {
    ...mapActions(["wxSetPosition", "editAddressInfo", "wxSetPositionName"]),
    relocation() {
      // this.getLngLat();
    },
    //获取中间点的经纬度，并mark出来
    getLngLat() {
      var _this = this;
      let mapCtx = wx.createMapContext("map");
      // console.log(mapCtx);
      mapCtx.getCenterLocation({
        success: function(res) {
          console.log(res);
          let a = [
            {
              id: 0,
              iconPath: "../../static/images/icon_location.png",
              longitude: res.longitude,
              latitude: res.latitude,
              width: 30,
              height: 40
            }
          ];
          _this.markers = [];
          _this.markers = _this.markers.concat(a);
          _this.getPoiList(res.latitude, res.longitude);
        }
      });
    },
    toCityList() {
      let url = `../city_list/main`;
      wx.navigateTo({ url });
    },
    regionchange(e) {
      // 失效 去end处理
      // console.log(e);
      // console.log(1238)
      // if (e.mp.type == "end") {
      //   this.getLngLat();
      // } else {
      //   //begin
      // }
    },
    regionChangeBegin(e) {
      // console.log(e);
    },
    regionChangeEnd(e) {
      // console.log(e);
      this.getLngLat();
    },
    getPoiList(latitude, longitude) {
      var _this = this;
      _this.nearbyAddressList = [];
      // 调用接口
      this.qqmapsdk.reverseGeocoder({
        location: {
          latitude: latitude,
          longitude: longitude
        },
        get_poi: 1,
        poi_options: "policy=2;radius=3000;page_size=20;page_index=1",
        success: res => {
          // console.log(res.result.pois);
          _this.nearbyAddressList = _this.nearbyAddressList.concat(
            res.result.pois
          );
        },
        fail: function(res) {
          // console.log(res);
        },
        complete: function(res) {
          // console.log(res);
        }
      });
    },
    tosearchAddress() {
      let url = `../search_address/main`;
      wx.navigateTo({ url });
    },
    clickItem(e) {
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      this.address = e.mp.currentTarget.dataset.address;
      wx.navigateBack({
        delta: 1
      });
    },
    changeAddressList(item, index) {
      console.log(item);
      let params = {
        // address: item.address,
        provinceId: item.ad_info.province,
        cityId: item.ad_info.city,
        areaId: item.ad_info.district,
        longitude: item.location.lng,
        latitude: item.location.lat,
        locationName: item.title,
        sex: 0,
        linkName: "",
        linkPhone: "",
        fromMap: true
      };
      let fullAddress = item.address.trim();
      let addr =
        item.ad_info.province + item.ad_info.city + item.ad_info.district;
      if (fullAddress.includes(addr)) {
        let findArea = fullAddress.split(addr);
        params.areaText = findArea[1];
      } else {
        params.areaText = "";
      }
      // fullAddress.split(addr)[1]
      params.address = "";
      this.editAddressInfo(params);
      // let url = `../edit_address/main`;
      wx.navigateBack({
        delta: 1
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>