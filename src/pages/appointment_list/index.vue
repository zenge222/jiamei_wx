<template>
  <div class="appointment_list">
    <div class="app_tab_bar">
      <ul class="tab_box">
        <li
          :class="{'tab_item':true,'tab_active':activeIndex==index}"
          v-for="(item,index) in tabBarList"
          :key="index"
          @click="tabChange(item,index)"
        >
          {{item.title}}
          <!-- v-show="showpriceUp" -->
          <div class="price_change">
            <div :class="priceUp?'active1':''">
              <!-- <span></span> -->
            </div>
            <div :class="!priceUp?'active2':''">
              <!-- <span></span> -->
            </div>
          </div>
        </li>
        <!-- <div class="bottom_line"></div> -->
      </ul>
      <div style="margin-top:12px;">
        <div class="order_list_null" v-show="appListData.length==0">
          <img class="default_pic" mode="widthFix" :src="noOrder">
          <p>目前没有任何预约服务</p>
        </div>
        <div class="list_card" v-show="appListData.length>0">
          <ul>
            <li class="list_box" v-for="(item,index) in appListData" :key="index">
              <img @click="toDetail" class="list_left" mode="widthFix" :src="item.headImg">
              <div class="list_right">
                <h3>{{item.truename}}</h3>
                <div class="info clearfix">
                  <h5>{{item.age}}岁</h5>
                  <h5>{{item.domicile}}</h5>
                  <h5>
                    <span>{{item.workYears}}</span>年工作
                  </h5>
                  <h5>
                    服务过
                    <span>0</span>户
                  </h5>
                </div>
                <div class="rate_box">
                  <van-rate
                    custom-class="a"
                    icon-class="b"
                    :value="item.level"
                    :size="'12'"
                    :count="'5'"
                    readonly="true"
                    @change="rateChange"
                  />
                </div>
                <div class="list_bottom clearfix">
                  <h4 class="fl">
                    <span>{{item.price}}</span>元/小时
                  </h4>
                  <button @click="toDetail2" class="list_btn fr">预约面试</button>
                </div>
              </div>
            </li>
          </ul>
          <i-load-more :tip="hasMore?'数据加载中':'暂无更多数据'" :loading="hasMore"/>
        </div>
      </div>
    </div>

    <!-- <van-popup :show="login_pop_show" @close="onClose" custom-class="popup_sel1">
      <p>登录或注册家美</p>
      <van-button
        v-if="!wxLogin"
        @click="getUserInfo"
        open-type="getUserInfo"
        :custom-class="'btn btn1'"
      >
        <img mode="widthFix" :src="weiXin" alt> 微信账号快速登录
      </van-button>
      <van-button @click="toRegOrLogin" :custom-class="'btn btn2'">
        <img mode="widthFix" :src="iponePic" alt> 手机号注册/登录
      </van-button>
      <p class="agree_text">
        登录代表您已同意
        <span>《家美用户协议》</span>
      </p>
    </van-popup>-->
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { _getAppointmentList } from "../../service/classify";
export default {
  data() {
    return {
      weiXin: this.imgBastPath + "weixin.png",
      iponePic: this.imgBastPath + "ipone.png",
      defNoOrder: this.imgBastPath + "def_no_order.png",
      noOrder: this.imgBastPath + "def_no_order.png",
      img1: this.imgBastPath + "no-appointment.png",
      proPicture: this.imgBastPath + "pro_picture.png",
      tabBarList: [
        { title: "综合", id: 1 },
        { title: "按价格", id: 2 },
        { title: "按经验", id: 3 },
        { title: "按星级", id: 4 }
        // { title: "筛选", id: 5 }
      ],
      activeIndex: 0,
      appParams: {
        orderBy: "", // price：价格，experience：经验，age：年龄
        pageNumber: 1,
        pageSize: 5,
        orderDir: "", // desc，逆向，asc：正向
        startTime: "",
        endTime: "",
        productTypeId: "",
        loading: true
      },
      appListData: [],
      hasMore: true,
      login_pop_show: false
    };
  },
  created() {},
  computed: {
    ...mapState({
      wxLogin: state => state.login.wxLogin,
      phoneLogin: state => state.login.phoneLogin
    })
  },
  onLoad(option) {
    this.appListData = [];
    // this.appParams.productTypeId = option.id;
    this.getDataList(this.appParams);
  },
  onShow() {
    // this.getDataList(this.appParams);
  },
  onHide() {
    // 重置data 完成初始化
    // Object.assign(this.$data, this.$options.data());
  },
  methods: {
    ...mapActions(["toWxLogin"]),
    // appointmentClick() {
    //   if (!this.phoneLogin) {
    //     if (!this.wxLogin) {
    //       this.login_pop_show = true;
    //     }
    //   }
    // },
    getDataList(params) {
      let _this = this;
      _getAppointmentList(params).then(res => {
        if (res.data.success) {
          let bastPath = res.data.data.baseUrl;
          let resData = res.data.data.list;
          resData.forEach(val => {
            val.headImg = bastPath + val.headImg;
            // val.headerImg = bastPath + "/upload/20190514143009766373.png";
          });
          //  _this.appListData = resData;
          // console.log(resData)
          // _this.appListData = _this.appListData.concat(resData)
          // _this.appListData.push(...resData);
          // resData.forEach((val, index) => {
          //   _this.set(_this.appListData, index, val);
          // });
          // console.log(this.$set);
          // let itemLen = _this.appListData.length;
          // this.$set(this.data, index, this.data[index]); this.$set(this.arrList, 0, 10);
          // _this.$set(_this.appListData,0,resData[0]);
          console.log(_this.appListData);
        }
      });
    },
    initData() {
      this.appParams.pageNumber = 1;
      this.appListData = [];
      this.hasMore = true;
    },
    // onClose() {
    //   this.login_pop_show = false;
    // },
    // getUserInfo() {
    //   // 调用登录接口
    //   wx.login({
    //     success: () => {
    //       wx.getUserInfo({
    //         success: res => {
    //           var userInfo = JSON.parse(res.rawData);
    //           this.login_pop_show = false;
    //           this.toWxLogin(userInfo);
    //           wx.switchTab({
    //             url: "/pages/home/main"
    //           });
    //         }
    //       });
    //     },
    //     fail: res => {
    //       // 获取失败的去引导用户授权
    //     }
    //   });
    // },
    // toRegOrLogin() {
    //   let url = `../register/main`;
    //   wx.navigateTo({ url });
    // },
    // rateChange() {},
    // toDetail() {
    //   let url = `../aunt_detail/main`;
    //   wx.navigateTo({ url });
    // },
    // toDetail2() {
    //   let url = `../successful_appointment/main`;
    //   wx.navigateTo({ url });
    // },
    tabChange(item, index) {
      let tabIndex = index;
      this.activeIndex = tabIndex;
      console.log(item);
      switch (tabIndex) {
        // 综合
        case 0:
          // this.initData(); // pageNumber = 1   appListData= []  hasMore=true
          // this.appParams.orderBy = "";
          // this.appParams.orderDir = "";
          // this.appParams.startTime = "";
          // this.appParams.endTime = "";
          // this.showpriceUp = this.showAgeUp = this.showKeepBox = false;
          // this.getDataList(this.appParams);
          break;
        // 按价格
        case 1:
          // this.initData();
          // this.appParams.orderBy = "price";
          // this.appParams.orderDir = "";
          // this.appParams.startTime = "";
          // this.appParams.endTime = "";
          // this.showpriceUp = true;
          // this.showAgeUp = false;
          // this.getDataList(this.appParams);
          break;
        case 2:
          // 按经验
          // this.initData();
          // this.appParams.orderBy = "experience";
          // this.appParams.orderDir = "";
          // this.appParams.startTime = "";
          // this.appParams.endTime = "";
          // this.getDataList(this.appParams);
          // this.showpriceUp = this.showAgeUp = this.showKeepBox = false;
          break;

        case 3:
          // 按星际
          // this.initData();
          // this.appParams.orderBy = "age";
          // this.appParams.orderDir = "";
          // this.appParams.startTime = "";
          // this.appParams.endTime = "";
          // this.getDataList(this.appParams);
          // this.showAgeUp = true;
          // this.showpriceUp = this.showKeepBox = false;
          break;
        // 删选
        case 4:
          // this.initData();
          // this.showScreen = this.showKeepBox = true;
          // this.showpriceUp = this.showAgeUp = false;
          // console.log(this.showScreen);
          break;
        default:
          break;
      }
    }
    // aa() {
    //   console.log(this.showScreen);
    //   this.showScreen = false;
    //   console.log(this.showScreen);
    // },
    // showKeep() {
    //   this.showScreen = true;
    // }
  },
  // 上拉加载
  onReachBottom: function() {
    console.log("onReachBottom");
    this.appParams.pageNumber++;
    this.getDataList(this.appParams);
  },
  //停止下拉刷新 async
  onPullDownRefresh() {
    this.initData();
    this.getDataList(this.appParams);
    wx.stopPullDownRefresh();
  }
};
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
