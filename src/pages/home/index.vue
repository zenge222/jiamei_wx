<template>
  <div class="home">
    <div class="header">
      <div class="header_left clearfix" @click="toSelAddress">
        <i-icon class="l_icon fl" size="16" type="coordinates" />
        <p class="fl">{{wxChangeLocation.street}}</p>
        <i-icon class="l_icon fl" size="16" type="unfold" />
      </div>
      <div class="more_box">
        <img
          style="width:25px;"
          mode="widthFix"
          :class="moreShow?'click_more':''"
          :src="btnMore"
          @click="changeMore"
        />
        <div class="more_info" v-show="showMoreBox">
          <div class="triangle_border_up"></div>
          <div class="more_list" @click="toMyOrder">
            <i-icon size="18" type="activity" />
            <span>我的订单</span>
          </div>
          <div class="more_list" @click="toMyMessage">
            <i-icon size="18" type="message" />
            <span>我的消息</span>
          </div>
          <div class="more_list" @click="scanCode">
            <i-icon size="18" type="scan" />
            <span>扫一扫</span>
          </div>
        </div>
      </div>
    </div>
    <div style="padding-top:54px;">
      <swiper
        class="swiper"
        @change="bannerChange"
        indicator-active-color="#EB5D2A"
        autoplay="true"
        interval="2000"
        duration="500"
        style="height:190px;"
      >
        <block v-for="(item, index) in movies" :key="index">
          <swiper-item>
            <img class="swiper_img" :src="item.imgUrl" mode="widthFix" />
          </swiper-item>
        </block>
      </swiper>
    </div>
    <div class="spot_box" v-if="movies.length>=2">
      <div :class="bannerIndex==index?'active':''" v-for="(item,index) in movies" :key="index"></div>
    </div>
    <!--  -->
    <!-- <button open-type="contact" @contact="handleContact">联系客服</button> -->
    <!-- 商品栏 -->
    <div class="pro_tab_container">
      <div
        class="pro_item"
        v-for="(item,index) in productList"
        :key="index"
        @click="toProductList(item)"
      >
        <img class="bg_pic" :src="item.imgUrl" mode="widthFix" />
        <div class="pro_info">
          <h3>{{item.title}}</h3>
          <p>{{item.intr}}</p>
        </div>
      </div>
    </div>

    <div class="title_content">
      <div class="line"></div>
      <h3>热销单品</h3>
      <div class="line"></div>
    </div>

    <div class="home_list">
      <cardItem :cardParams="mainProduct"></cardItem>
    </div>

    <div class="home_list" v-if="recommendProduct.productTypeId">
      <cardItem :cardParams="recommendProduct"></cardItem>
    </div>

    <div class="advert">
      <img src="https://file.omnrj.com/static/images/def_advertisement.png" mode="widthFix" alt />
    </div>

    <div class="home_list" style="padding:20px;" v-if="activityProduct.productTypeId">
      <cardItem :cardParams="activityProduct"></cardItem>
    </div>

    <div class="cut_bg"></div>

    <div class="home_list home_bottom">
      <div class="list_title">
        <div class="title_line"></div>我们是嘉美
      </div>
      <button v-show="false" open-type="getUserInfo" bindgetuserinfo="getUserInfo">授权</button>
    </div>
    <img mode="widthFix" style="width:100%;" :src="img1" />
    <div class="cut_bg"></div>
    <toLoginPopup :showPop.sync="login_pop_show"></toLoginPopup>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { getUserLocation } from "../../api/wx_authorization";
import { _getHomeList, _getOpenId } from "../../service/home";
import { _getUnit } from "../../api/common";
import { _sendWXuserInfo } from "../../service/personal";
import toLoginPopup from "../../components/toLoginPopup";
import cardItem from "../../components/cardItem";
import QQMapWX from "../../../static/js/qqmap-wx-jssdk";
export default {
  name: "home",
  data() {
    return {
      img1: this.imgBastPath + "def_Brand_promotion.png",
      iponePic: this.imgBastPath + "ipone.png",
      btnMore: this.imgBastPath + "btn_more.png",
      imgBastPath: this.imgBastPath,
      qqmapsdk: null,
      moreShow: false,
      showMoreBox: false,
      bannerIndex: 0,
      login_pop_show: false,
      // 商品栏
      productList: [
        {
          type: 2,
          title: "店长力荐",
          intr: "低至66",
          imgUrl: "https://file.omnrj.com/static/images/btn_recommend.png"
        },
        {
          type: 3,
          title: "随心选择",
          intr: "超值服务",
          imgUrl: "https://file.omnrj.com/static/images/btn_select.png"
        },
        {
          type: 1,
          title: "明星爆款",
          intr: "优惠特价",
          imgUrl: "https://file.omnrj.com/static/images/btn_Blasting.png"
        }
      ],
      // 主推
      mainProduct: {
        name: "",
        price: 0,
        smallImg: "",
        productTypeId: null,
        productTypeTitle: "",
        smallImg: "",
        priceUnitStr: "",
        type: 0,
        intro: ""
      },
      recommendProduct: {
        name: "",
        price: 0,
        smallImg: "",
        productTypeId: null,
        productTypeTitle: "",
        smallImg: "",
        priceUnitStr: "",
        type: 0,
        intro: ""
      },
      activityProduct: {
        name: "",
        price: 0,
        smallImg: "",
        productTypeId: null,
        productTypeTitle: "",
        smallImg: "",
        priceUnitStr: "",
        type: 0,
        intro: ""
      },
      movies: [],
      latitude: "",
      longitude: ""
    };
  },
  components: {
    toLoginPopup,
    cardItem
  },

  watch: {
    wxChangeLocation: {
      handler(newName, oldName) {
        this.fullName = newName + " " + this.lastName;
        this.init();
      },
      // 代表在wacth里声明了wxChangeLocation 这个方法之后立即先去执行handler方法
      immediate: true,
      deep: true
    }
  },
  computed: {
    ...mapState({
      wxLocation: state => state.login.wxLocation,
      wxChangeLocation: state => state.login.wxChangeLocation,
      wxLogin: state => state.login.wxLogin,
      authorization: state => state.login.authorization,
      mapKey: state => state.login.mapKey
    })
  },
  onLoad() {
    this.qqmapsdk = new QQMapWX({
      key: this.mapKey
    });
    let _this = this;
    wx.login({
      success: function(res) {
        if (res.code) {
          // console.log(res.code);
          let params = {
            id: res.code
          };
          _getOpenId(params).then(res => {
            if (res.data.success) {
              // let bastPath = res.data.data.baseUrl;
              let resData = res.data.data.user;
              let params = {
                nickName: resData.nickname,
                avatarUrl: resData.headerImg,
                gender: resData.sex,
                phone: resData.phone,
                name: "home"
              };
              _this.toUserLogin(params);
            }
          });
        }
      }
    });
    // if (!this.wxLogin) {
    //   this.login_pop_show = true;
    // }
    // 微信授权一次
    wx.getSetting({
      success(res) {
        console.log(res);
        if (res.authSetting["scope.userInfo"] == undefined) {
          // 初始化进入该页面
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: res => {
              var userInfo = JSON.parse(res.rawData);
              this.login_pop_show = false;
              this.toWxLogin(userInfo);
              let params = {
                headerImg: userInfo.avatarUrl,
                nickname: userInfo.nickName,
                sex: userInfo.gender
              };
              _sendWXuserInfo(params);
            }
          });
        } else {
          // 已废弃
          // wx.authorize({
          //   scope: "scope.userInfo",
          //   success() {
          //     wx.getUserInfo();
          //   }
          // });
        }
      }
    });
    // getUserLocation("home");
    this.getUserLocation();
  },
  onShow() {
    this.moreShow = false;
    this.showMoreBox = false;
    // this.init();
  },
  onHide() {
    // 重置data 完成初始化
    // Object.assign(this.$data, this.$options.data());
  },
  methods: {
    ...mapActions(["toWxLogin", "toUserLogin"]),
    ...mapMutations(["CHANGE_CHANGE_LOCATION"]),
    handleContact(e) {
      console.log(e);
    },
    init() {
      let _this = this;
      let params = {
        province: this.wxChangeLocation.orderProvince,
        city: this.wxChangeLocation.orderCity,
        area: this.wxChangeLocation.orderArea,
        streate: this.wxChangeLocation.street,
        longitude: this.wxChangeLocation.orderLong,
        latitude: this.wxChangeLocation.orderLat,
        loading: true
      };
      _getHomeList(params)
        .then(res => {
          if (res.data.success) {
            let bastPath = res.data.data.baseUrl;
            let banners = res.data.data.bannersList;
            banners.forEach(val => {
              val.imgUrl = bastPath + val.imgUrl;
            });
            this.movies = banners;

            if (res.data.data.mainProduct) {
              let mainData = res.data.data.mainProduct;
              mainData.smallImg = bastPath + res.data.data.mainProduct.smallImg;
              if (mainData.productPackages.length != 0) {
                mainData.productPackages[0].unitStr = _getUnit(
                  mainData.productPackages[0].priceUnit
                );
              }
              this.mainProduct = mainData;
              // this.mainProduct.intro = mainData.intro || "";
            }

            if (res.data.data.recommendProduct) {
              let recommendData = res.data.data.recommendProduct;
              recommendData.smallImg =
                bastPath + res.data.data.recommendProduct.smallImg;
              if (recommendData.productPackages.length != 0) {
                recommendData.productPackages[0].unitStr = _getUnit(
                  recommendData.productPackages[0].priceUnit
                );
              }
              this.recommendProduct = recommendData;
              // this.recommendProduct.intro = recommendData.intro || "";
            }

            if (res.data.data.activityProduct) {
              let activityData = res.data.data.activityProduct;
              activityData.smallImg =
                bastPath + res.data.data.activityProduct.smallImg;
              if (activityData.productPackages.length != 0) {
                activityData.productPackages[0].unitStr = _getUnit(
                  activityData.productPackages[0].priceUnit
                );
              }
              this.activityProduct = activityData;
              // this.activityProduct.intro = activityData.intro || "";
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onShareAppMessage() {
      return {
        title: "微信小程序联盟",
        desc: "最具人气的小程序开发联盟!",
        path: "/page/user?id=123"
      };
    },
    toProductList(item) {
      let url = `../product_list/main?type=${item.type}`;
      wx.navigateTo({ url });
    },
    toSelAddress() {
      let url = `../select_address/main`;
      wx.navigateTo({ url });
    },
    toPage(item) {
      let url = item.path;
      if (item.title == "分类") {
        wx.switchTab({ url });
      } else {
        wx.navigateTo({ url });
      }
    },
    toDetail(item) {
      // type 3 两个都有  1体验包(detail)  2包月(classify_detail)--> 钟点工
      let id = item.productTypeId;
      console.log(item.productTypeId);
      if (item.type == 1) {
        let url = `../detail/main?id=${id}`;
        wx.navigateTo({ url });
      } else {
        let url = `../classify_detail/main?id=${id}`;
        wx.navigateTo({ url });
      }
    },
    bannerChange(e) {
      this.bannerIndex = e.mp.detail.current;
    },
    changeMore() {
      this.moreShow = !this.moreShow;
      this.showMoreBox = !this.showMoreBox;
    },
    toMyOrder() {
      // if (this.authorization && this.wxLogin) {
      let url = `../my_order/main`;
      wx.navigateTo({ url });
      // } else {
      //   this.login_pop_show = true;
      // }
    },
    toMyMessage() {
      let url = `../my_message/main`;
      wx.navigateTo({ url });
    },
    scanCode() {
      wx.scanCode({
        success(res) {
          console.log(res.result);
        }
      });
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
              // wx.switchTab({
              //   url: "/pages/my_order/main"
              // });
            }
          });
        },
        fail: res => {
          // 获取失败的去引导用户授权
        }
      });
    },
    // 授权
    getUserLocation() {
      let _this = this;
      wx.getSetting({
        success: res => {
          if (
            res.authSetting["scope.userLocation"] != undefined &&
            res.authSetting["scope.userLocation"] != true
          ) {
            //未授权
            wx.showModal({
              title: "请求授权当前位置",
              content: "需要获取您的地理位置，请确认授权",
              success: function(res) {
                if (res.cancel) {
                } else if (res.confirm) {
                  //确定授权，通过wx.openSetting发起授权请求
                  wx.openSetting({
                    success: function(res) {
                      if (res.authSetting["scope.userLocation"] == true) {
                        _this.geo();
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
            _this.geo();
          } else {
            _this.geo();
          }
        }
      });
    },
    geo() {
      let _this = this;
      wx.getLocation({
        type: "wgs84",
        success: function(res) {
          // 主页定位授权
          _this.longitude = res.longitude;
          _this.latitude = res.latitude;
          // console.log(res);
          // store.commit(types.CHANGE_CHANGE_LOCATION, res); // change 市经纬度
          // store.commit(types.WX_SET_POSITION, res); // wx     街道经纬度
          _this.getPositionName();
        },
        fail: () => {}
      });
    },
    // 逆解析
    getPositionName(params) {
      let _this = this;
      let locations = "";
      locations = this.latitude + "," + this.longitude;
      // console.log(locations);
      this.qqmapsdk.reverseGeocoder({
        location: locations || "", //获取表单传入的位置坐标,不填默认当前位置,示例为string格式  "123,123"
        //get_poi: 1, //是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
        success: function(res) {
          // 是否在服务区 flyio
          let city = res.result.ad_info.city;
          let locationInfo = res.result.ad_info;
          if (city.charAt(city.length - 1) == "市") {
            city = city.substr(0, city.length - 1);
          }
          // 主页 change 街道
          let params = {
            province: locationInfo.province,
            city: city,
            area: locationInfo.district,
            street: res.result.address_component.street,
            longitude: locationInfo.location.lng,
            latitude: locationInfo.location.lat,
            name: "home"
          };
          // console.log(params);
          // 不在服务区 默认切上海   1 在服务区  0 未授权 2 不在服务区
          _this.CHANGE_CHANGE_LOCATION(params);
          // _this.store.commit(types.CHANGE_CHANGE_LOCATION, addressName); // change 街道名 市名
          // store.commit(types.WX_SET_POSITION_NAME, addressName); // wx     街道名
        },
        fail: function(error) {
          console.error(error);
        },
        complete: function(res) {}
      });
    }
  },
  //  desc: '小程序开发!',
  onShareAppMessage: function() {
    return {
      title: "说点什么",
      imageUrl: "https://file.omnrj.com/static/images/def_banner2.png"
    };
  }
};
</script>

<style lang="less" scoped>
@import "./style.less";
</style>