<template>
  <div class="select_address">
    <div class="header">
      <div class="header_left clearfix">
        <div @click="toCityList">
          <i-icon class="l_icon fl" type="coordinates" />
          <p class="fl">{{wxChangeLocation.cityName}}</p>
          <i-icon class="l_icon fl" type="unfold" />
        </div>
        <input @input="searchAddress" type="text" v-model="inputAddress" placeholder="小区/街道/学校等" />
      </div>
      <div @click="goBack" class="header_add_address">取消</div>
    </div>

    <div class="sel_container" v-show="showHistory&&addressList.length>0">
      <div class="history_search">
        <h3>历史搜索</h3>
        <i-icon @click="clearAddress" size="20" color="#BABABA" type="trash" />
      </div>
      <div class="history_list">
        <div
          class="list_item"
          v-for="(item,index) in addressList"
          :key="index"
          v-text="item.locationName"
          @click="streetToHome(item)"
        ></div>
      </div>
    </div>

    <div class="search_list_container">
      <div
        class="search_list"
        v-for="(item,index) in nearbyAddressList"
        :key="index"
        @click="selAddress(item)"
      >
        <div class="list_top">
          <h3>{{item.title}}</h3>
          <!-- <span>{{item.distance}}</span> -->
        </div>
        <p>{{item.address}}</p>
      </div>
      <div class="message_info" v-show="nearbyAddressList.length==0 && !showHistory">
        <h3>找不到地址？</h3>
        <p>请尝试只输入小区、学校或街道，</p>
        <p>详细地址（如门牌号）可稍后输入。</p>
      </div>
    </div>

    <van-popup :show="isInService" custom-class="popup_Tips1">
      <img class="not_service_pic" :src="notInServiceImg" mode="widthFix" />
      <h3>该地址不在商家服务范围</h3>
      <p>亲，重新选择您的服务地址吧</p>
      <van-button round size="normal" @click="isInService=false" custom-class="tips_submit">确定</van-button>
    </van-popup>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import QQMapWX from "../../../static/js/qqmap-wx-jssdk.js";
export default {
  name: "select_address",
  data() {
    return {
      isInService: false,
      showHistory: true,
      notInServiceImg: this.imgBastPath + "not_in_service_map.png",
      downMore: false,
      inputAddress: "",
      qqmapsdk: null,
      nearbyAddressList: [],
      fromPage: ""
    };
  },
  computed: {
    ...mapState({
      mapKey: state => state.login.mapKey,
      wxLocation: state => state.login.wxLocation,
      wxChangeLocation: state => state.login.wxChangeLocation,
      addressList: state => state.addressHistory.addressList
    })
  },
  onLoad(option) {
    if (option) {
      this.fromPage = option.page;
    }
  },
  onShow() {
    // 重置data 完成初始化 注意组件缓存数据
    // Object.assign(this.$data, this.$options.data());
    this.initData();
    this.qqmapsdk = new QQMapWX({
      key: this.mapKey
    });
  },
  onHide() {},
  methods: {
    ...mapActions(["editAddressInfo", "changeChangeLocation"]),
    ...mapMutations(["addAddressHistory", "clearAddressHistory"]),
    toCityList() {
      let url = `../city_list/main`;
      wx.navigateTo({ url });
    },
    initData() {
      this.showHistory = this.addressList.length > 0 ? true : false;
      this.inputAddress = "";
      this.nearbyAddressList = [];
    },
    searchAddress() {
      // 搜索

      /*
        地址解析
        北京 昌平区  lat:40.22077   lng:116.23128
        上海 宝山区  lat:31.40527   lng:121.48941
        宁波 北仑区  lat:29.89889   lng:121.84431
      */
      // this.qqmapsdk.geocoder({
      //   //获取表单传入地址
      //   address: "xxx", //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      //   success: function(res) {//成功后的回调
      //     console.log(res);
      //   },
      //   fail: function(error) {
      //     console.error(error);
      //   },
      //   complete: function(res) {
      //     console.log(res);
      //   }
      // })
      this.showHistory = false;
      // 切换城市
      console.log(this.wxChangeLocation);
      let option =
        this.wxChangeLocation.cityLatitude +
        "," +
        this.wxChangeLocation.cityLongitude;
      let _this = this;
      this.qqmapsdk.search({
        keyword: _this.inputAddress, //搜索关键词
        location: option, // 设置周边搜索中心点 "39.980014,116.313972"
        policy: 1, // 本策略主要用于收货地址、上门服务地址的填写，
        filter: "category=街道,小区,学校",
        success: function(res) {
          // 附近地点
          // console.log(res);
          // console.log(res.data);
          _this.nearbyAddressList = res.data;
        },
        fail: function(res) {
          console.log(res);
        },
        complete: function(res) {}
      });
    },
    goBack() {
      // let url = `../select_address/main`;
      wx.navigateBack(-1);
    },
    clearAddress() {
      this.showHistory = false;
      this.clearAddressHistory();
    },
    streetToHome(item) {
      if (this.fromPage == "selAddress") {
        let params = {
          latitude: item.latitude,
          longitude: item.longitude,
          street: item.locationName,
          all: true
        };
        this.changeChangeLocation(params);
        wx.switchTab({
          url: "../home/main"
        });
      } else {
        this.editAddressInfo(item);
        wx.navigateBack({
          delta: 2
        });
      }
    },
    selAddress(item) {
      let params2 = {
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
        params2.areaText = findArea[1];
      } else {
        params2.areaText = "";
      }
      params2.address = "";
      let hasAddr = true;
      this.addressList.find(val => {
        if (val.street && val.street === params.street) {
          hasAddr = false;
        }
      });
      if (hasAddr) this.addAddressHistory(params2);

      if (this.fromPage == "selAddress") {
        let params = {
          latitude: item.location.lat,
          longitude: item.location.lng,
          street: item.title,
          all: true
        };
        this.changeChangeLocation(params);
        wx.switchTab({
          url: "../home/main"
        });
      } else {
        // 非选择地址页面进入
        this.editAddressInfo(params2);
        wx.navigateBack({
          delta: 2
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>