<template>
  <div class="my">
    <div class="my_header">
      <div class="h_left clearfix">
        <!-- widthFix -->
        <div class="user_header_pic fl">
          <img :mode="'widthFix'" :src="wxUserInfo.avatarUrl">
        </div>
        <div class="fl" style="padding-left:12px;">
          <h3>{{wxUserInfo.nickName||'先生/女士'}}</h3>
          <p>
            <img mode="widthFix" :src="phoneImg">
            {{phoneLoginInfo.phoneNum||'13***********'}}
          </p>
        </div>
      </div>
      <div class="h_right">
        <img @click="toPersonalInfo" mode="widthFix" :src="setUpImg">
      </div>
    </div>

    <div class="my_order">
      <div class="order_header clearfix">
        <p class="fl">我的订单</p>
        <div class="right_btn fr" @click="toMyOrder">
          <span>全部订单</span>
          <i-icon color="#868686" size="16" type="enter"/>
        </div>
      </div>
    </div>

    <van-row custom-class="order_menu">
      <van-col
        @click="toOrderList(item)"
        span="8"
        v-for="(item,index) in orderMenuList"
        :key="index"
      >
        <img mode="widthFix" :src="item.icon">
        <span>{{item.title}}</span>
      </van-col>
    </van-row>

    <div class="my_order my_order2" style="margin-top:8px;">
      <!--<div class="order_header clearfix">
        <img class="left_img" mode="widthFix" :src="'../../static/images/icon_Coupon.png'" />
        <p class="fl">优惠券</p>
        <div class="right_btn fr">
            <span></span>
            <i-icon color="#868686" type="enter" />
        </div>
      </div>-->
      <div class="order_header clearfix" @click="toMyAddress">
        <img class="left_img" mode="widthFix" :src="iconMap">
        <p class="fl">我的地址</p>
        <div class="right_btn fr">
          <span></span>
          <i-icon color="#868686" type="enter"/>
        </div>
      </div>
      <div class="order_header clearfix" @click="toMyEvaluation" style="border:none;">
        <img class="left_img" mode="widthFix" :src="iconEvaluate">
        <p class="fl">我的评价</p>
        <div class="right_btn fr">
          <span></span>
          <i-icon color="#868686" type="enter"/>
        </div>
      </div>
    </div>

    <div class="my_order my_order2" style="margin-top:8px;">
      <div class="order_header clearfix" @click="toProtocolService">
        <img class="left_img" mode="widthFix" :src="iconAgreement">
        <p class="fl">服务协议</p>
        <div class="right_btn fr">
          <span></span>
          <i-icon color="#868686" type="enter"/>
        </div>
      </div>
      <!-- @click="picPop=true;" -->
      <div class="order_header clearfix" style="border:none;" @click="toCallPhone">
        <img class="left_img" mode="widthFix" :src="iconCustomerService">
        <p class="fl">客服热线</p>
        <div class="right_btn fr">
          <span style="color:#868686;font-size:12px;">400-888-8888</span>
          <i-icon color="#868686" type="enter"/>
        </div>
      </div>
    </div>
    <toLoginPopup :showPop.sync="login_pop_show" :maskClose="true"></toLoginPopup>
    <!-- <phonePopup :showPop.sync="picPop"></phonePopup> -->
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { _getUserInfo } from "../../service/personal";
import toLoginPopup from "../../components/toLoginPopup";
import phonePopup from "../../components/phonePopup";
export default {
  name: "my",
  data() {
    return {
      login_pop_show: false,
      // userPic: "../../static/images/user.png",
      phoneImg: this.imgBastPath + "icon_ipone.png",
      setUpImg: this.imgBastPath + "btn_Set_up.png",
      iconMap: this.imgBastPath + "icon_map.png",
      iconEvaluate: this.imgBastPath + "icon_evaluate1.png",
      iconAgreement: this.imgBastPath + "icon_Agreement.png",
      iconCustomerService: this.imgBastPath + "icon_customer_service.png",
      picPop: false,
      userInfo: {
        name: "",
        phoneNumber: ""
      },
      orderMenuList: [
        { title: "待支付", icon: "../../static/tabs/confirmed.png", id: 1 },
        { title: "待服务", icon: "../../static/tabs/service.png", id: 2 },
        { title: "已完成", icon: "../../static/tabs/payment.png", id: 3 }
        // { title: "待评价", icon: "../../static/tabs/evaluate.png", id: 4 }
      ]
    };
  },
  computed: {
    ...mapState({
      wxLogin: state => state.login.wxLogin,
      wxUserInfo: state => state.login.wxUserInfo,
      phoneLoginInfo: state => state.login.phoneLoginInfo,
      phoneLogin: state => state.login.phoneLogin
    })
  },
  components: {
    toLoginPopup,
    phonePopup
  },
  onLoad() {},
  onShow() {
    this.init();
    // this.initPopup();
  },
  onHide() {
    // 重置data 完成初始化
    Object.assign(this.$data, this.$options.data());
  },
  methods: {
    ...mapActions(["toWxLogin", "toUserLogin"]),
    init() {
      let _this = this;
      if (this.phoneLogin) {
        _getUserInfo().then(res => {
          if (res.data.success) {
            let userInfo = res.data.data;
            _this.toUserLogin(userInfo);
          }
        });
      }
    },
    toOrderList(item) {
      let url = `../my_order/main?id=${item.id}`;
      wx.navigateTo({ url });
    },
    initPopup() {
      if (!this.phoneLogin) {
        // if (!this.wxLogin) {
        this.login_pop_show = true;
        // }
      } else {
        this.login_pop_show = false;
      }
    },
    toMyEvaluation() {
      let url = `../my_evaluation/main`;
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
              wx.switchTab({
                url: "/pages/my/main"
              });
            }
          });
        },
        fail: res => {
          // 获取失败的去引导用户授权
        }
      });
    },
    toCallPhone() {
      wx.makePhoneCall({
        phoneNumber: "400-888-8888"
      });
    },
    toRegOrLogin() {
      let url = `../login/main`;
      wx.navigateTo({ url });
    },
    toMyAddress() {
      let url = `../my_address/main`;
      wx.navigateTo({ url });
    },
    toPersonalInfo() {
      let url = "";
      if (this.phoneLoginInfo.phoneNum) {
        url = `../personal_info/main`;
        wx.navigateTo({ url });
      } else {
        this.login_pop_show = true;
      }
    },
    toMyOrder() {
      let url = `../my_order/main`;
      wx.navigateTo({ url });
    },
    toProtocolService() {
      let url = `../protocol_service/main`;
      wx.navigateTo({ url });
    },
    callPhone() {
      wx.makePhoneCall({
        phoneNumber: "400-888-8888"
      });
    }
  }
};
</script>

<style scoped>
</style>