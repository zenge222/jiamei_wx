<template>
  <div class="select_address">
    <div class="header">
      <div class="header_left clearfix">
        <div @click="toCityList" class="location_item">
          <i-icon class="l_icon fl" type="coordinates" />
          <p class="fl">{{wxChangeLocation.cityName}}</p>
          <i-icon class="l_icon fl" type="unfold" />
        </div>
        <input type="text" @click="tosearchAddress" disabled placeholder="小区/街道/学校等" />
      </div>
      <div @click="toAddAddress" class="header_add_address">新增地址</div>
    </div>
    <div class="sel_container">
      <div class="sel_header">
        <h3 @click="toHome">{{wxLocation.cPotionName}}</h3>
        <div class="to_location" @click="toRelocation">
          <img mode="widthFix" :src="iconRepositioning" />
          <span>重新定位</span>
        </div>
      </div>
      <div class="sel_addr_list">
        <div class="list_header">
          <img mode="widthFix" :src="iconHome" />
          <span>我的服务地址</span>
        </div>
        <div
          :class="{'my_addr_list':true,'down_active':downMore}"
          :style="downMore?'height:'+moreHeight+'rpx':''"
        >
          <div
            ref="addr"
            class="addr_info"
            v-for="(item,index) in myAddressList"
            :key="index"
            @click="myAddressClick(item,index)"
          >
            <h3>{{item.locationName}} {{item.address}}</h3>
            <p>
              <span>{{item.linkName}}</span>
              <span>{{item.sex==0?'先生':'女士'}}</span>
              <span>{{item.linkPhone}}</span>
            </p>
          </div>
          <!-- <div class="addr_info">
            <h3>决斗学院 鹤城新村2幢2号202室</h3>
            <p>
              <span>王鑫斌</span>
              <span>先生</span>
              <span>13056770791</span>
            </p>
          </div>-->
          <div v-show="myAddressList.length>3" class="addr_load_more" @click="openList">
            <span>展开更多地址</span>
            <i-icon color="#868686" :type="downMore?'packup':'unfold'" />
          </div>
        </div>
      </div>
    </div>

    <van-popup :show="isInService" custom-class="popup_Tips1">
      <img class="not_service_pic" :src="notInServiceImg" mode="widthFix" />
      <h3>该地址不在商家服务范围</h3>
      <p>亲，重新选择您的服务地址吧</p>
      <van-button round size="normal" @click="isInService=false" custom-class="tips_submit">确定</van-button>
    </van-popup>

    <van-popup :show="login_pop_show" @close="login_pop_show=false" custom-class="popup_sel1">
      <p>登录或注册家美</p>
      <!-- <van-button
        v-if="!wxLogin"
        @click="getUserInfo"
        open-type="getUserInfo"
        :custom-class="'btn btn1'"
      >
        <img mode="widthFix" :src="'../../static/images/weixin.png'" alt> 微信账号快速登录
      </van-button>-->
      <van-button @click="toRegOrLogin" :custom-class="'btn btn2'">
        <img mode="widthFix" :src="iponePic" alt /> 手机号注册/登录
      </van-button>
      <p class="agree_text">
        登录代表您已同意
        <span>《家美用户协议》</span>
      </p>
    </van-popup>
    <i-message id="message" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import QQMapWX from "../../../static/js/qqmap-wx-jssdk.js";
import { getUserLocation } from "../../api/wx_authorization";
import { _getMyUserAddress } from "../../service/personal";
export default {
  name: "select_address",
  data() {
    return {
      isInService: false,
      notInServiceImg: this.imgBastPath + "not_in_service_map.png",
      iconRepositioning: this.imgBastPath + "icon_Repositioning.png",
      iconHome: this.imgBastPath + "icon_home.png",
      iponePic: this.imgBastPath + "ipone.png",
      downMore: false,
      login_pop_show: false,
      moreHeight: 0,
      myAddressList: []
    };
  },
  computed: {
    ...mapState({
      wxLogin: state => state.login.wxLogin,
      authorization: state => state.login.authorization,
      mapKey: state => state.login.mapKey,
      wxLocation: state => state.login.wxLocation,
      wxChangeLocation: state => state.login.wxChangeLocation
    })
  },
  onLoad() {},
  onShow() {
    this.qqmapsdk = new QQMapWX({
      key: this.mapKey
    });
    this.init();
    // 重置data 完成初始化
    Object.assign(this.$data, this.$options.data());
  },
  onHide() {},
  methods: {
    ...mapActions([
      "toWxLogin",
      "wxSetPosition",
      "wxSetPositionName",
      "changeChangeLocation",
      "initAddAddress"
    ]),
    init() {
      let params = {
        pageNumber: 1,
        pageSize: 20
      };
      _getMyUserAddress(params).then(res => {
        if (res.data.success) {
          this.myAddressList = res.data.data.list;
          // console.log(this.myAddressList);
        }
      });
    },
    toCityList() {
      let url = `../city_list/main`;
      wx.navigateTo({ url });
    },
    myAddressClick(item, index) {
      let params = {
        latitude: item.latitude,
        longitude: item.longitude,
        street: item.locationName,
        name: "selUserAddress"
      };
      //街道名 街道经纬度
      this.changeChangeLocation(params);
      wx.switchTab({
        url: `../home/main`
      });
    },
    openList() {
      this.downMore = !this.downMore;
      if (this.downMore) {
        let count = this.myAddressList.length;
        this.moreHeight = (count * 83 + 64 - count) * 2;
      }
    },
    toAddAddress() {
      if (this.authorization) {
        this.initAddAddress();
        let url = `../add_address/main`;
        wx.navigateTo({ url });
      } else {
        this.login_pop_show = true;
      }
    },
    toHome() {
      if (this.wxLocation.cPotionName == "定位失败") {
        this.$Message({
          content: "请点击定位",
          type: "default"
        });
      } else {
        let params = {
          name: "selLocation"
        };
        this.changeChangeLocation(params);
        wx.switchTab({
          url: "../home/main"
        });
      }
    },
    toRegOrLogin() {
      let url = `../login/main`;
      wx.navigateTo({ url });
    },
    getUserInfo() {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: res => {
              var userInfo = JSON.parse(res.rawData);
              this.login_pop_show = false;
              this.toWxLogin(userInfo);
              wx.navigateTo({
                url: "../search_address/main"
              });
            }
          });
        },
        fail: res => {
          // 获取失败的去引导用户授权
        }
      });
    },
    tosearchAddress() {
      // 如果已授权
      if (this.wxChangeLocation.cityLatitude) {
        let url = `../search_address/main?page=selAddress`;
        wx.navigateTo({ url });
      } else {
        getUserLocation("search");
      }
    },
    toRelocation() {
      getUserLocation("reset");
    }
  }
};
</script>

<style lang="less" scoped>
</style>