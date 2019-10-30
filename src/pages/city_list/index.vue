<template>
  <div class="city_list">
    <div class="city_header">
      <div class="location_info">
        <i-icon size="16" color="#666" type="coordinates" />
        <span>当前定位</span>
      </div>
      <div class="location_box">
        <h3 class="current_city" @click="changeCityCurrent">{{wxLocation.cityName}}</h3>
        <div class="to_location" @click="toLocation">
          <img mode="widthFix" :src="iconRepositioning" />
          <span>重新定位</span>
        </div>
      </div>
    </div>
    <div class="fill_bg"></div>
    <div class="option_citys">
      <div class="common_city" v-show="locationList.length>0">
        <div class="common_header">
          <span>常用城市：</span>
          <i-icon @click="delCityList" type="trash" size="20" color="#BABABA" />
        </div>
        <div class="common_list">
          <div
            v-for="(item,index) in locationList"
            @click="historyChangeCity(item)"
            :key="index"
            class="item_city"
          >{{item.cityName}}</div>
        </div>
      </div>
      <div class="common_city">
        <div class="common_header">
          <span>已开通城市：</span>
        </div>
        <div class="common_list">
          <!--  :class="{'item_city':true,'active':activeIndex==index}" -->
          <div
            v-for="(item,index) in optionList2"
            :key="index"
            :class="{'item_city':true}"
            @click="changeCity2(item,index)"
          >{{item.cityName}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { getUserLocation } from "../../api/wx_authorization";
export default {
  name: "city_list",
  data() {
    return {
      iconRepositioning: this.imgBastPath + "icon_Repositioning.png",
      optionList1: [
        {
          cityName: "宁波",
          latitude: "29.89889",
          longitude: "121.84431",
          checked: false
        },
        {
          cityName: "上海",
          latitude: "31.40527",
          longitude: "121.48941",
          checked: false
        },
        {
          cityName: "北京",
          latitude: "40.22077",
          longitude: "116.23128",
          checked: false
        }
      ],
      optionList2: [
        { cityName: "宁波", latitude: "29.89889", longitude: "121.84431" },
        { cityName: "上海", latitude: "31.40527", longitude: "121.48941" },
        { cityName: "北京", latitude: "40.22077", longitude: "116.23128" }
      ],
      activeIndex: -1
    };
  },
  onLoad() {},
  onHide() {
    // 重置data 完成初始化
    Object.assign(this.$data, this.$options.data());
  },
  computed: {
    ...mapState({
      wxLocation: state => state.login.wxLocation,
      wxChangeLocation: state => state.login.wxChangeLocation,
      locationList: state => state.addressHistory.locationList
    })
  },
  methods: {
    ...mapActions(["changeChangeLocation"]),
    ...mapMutations(["addLocationHistory", "clearLocationHistory"]),
    toLocation() {
      // 城市定位 存 确定提交 vuex  待。。。。。。。
      getUserLocation("cityList");
    },
    changeCity1(item, index) {
      item.checked = !item.checked;
      console.log(item);
    },
    historyChangeCity(item) {
      this.changeChangeLocation(item);
      wx.navigateBack({
        delta: 1
      });
    },
    changeCity2(item, index) {
      this.activeIndex = index;
      let params = {
        latitude: item.latitude,
        longitude: item.longitude,
        cityName: item.cityName,
        changeCity: "cityItem"
      };
      this.changeChangeLocation(params);
      let hasCity = false;
      this.locationList.find(val => {
        if (val.cityName && val.cityName === item.cityName) hasCity = true;
      });
      if (!hasCity) this.addLocationHistory(params);
      wx.navigateBack({
        delta: 1
      });
    },
    delCityList() {
      this.clearLocationHistory();
    },
    changeCityCurrent() {
      if (this.wxLocation.cityLatitude) {
        let params = {
          name: "checkCurrentLocation"
        };
        this.changeChangeLocation(params);
        wx.navigateBack({
          delta: 1
        });
      } else {
        // 定位失败
      }
    }
  }
};
</script>

<style scoped>
</style>