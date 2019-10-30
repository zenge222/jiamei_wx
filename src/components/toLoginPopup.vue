<template>
  <div class="login-pop">
    <van-popup
      :show="login_pop_show"
      custom-class="popup_sel1"
      @close="login_pop_show=false"
      :close-on-click-overlay="canMaskClose"
    >
      <p>{{popTile}}</p>
      <!-- <van-button
        v-if="!wxLogin"
        @click="getUserInfo"
        open-type="getUserInfo"
        :custom-class="'btn btn1'"
      >
        <img mode="widthFix" :src="wxPic" alt> 微信账号快速登录
      </van-button>-->
      <van-button @click="toRegOrLogin" :custom-class="'btn btn2'">
        <img mode="widthFix" :src="iponePic" alt> 手机号绑定
      </van-button>
      <p class="agree_text">
        登录代表您已同意
        <span>《家美用户协议》</span>
      </p>
    </van-popup>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      wxPic: this.imgBastPath + "weixin.png",
      iponePic: this.imgBastPath + "ipone.png",
      login_pop_show: this.showPop,
      canMaskClose: this.maskClose,
      popTile: "微信登录家美"
    };
  },
  props: {
    // popup 显示
    showPop: {
      type: Boolean,
      required: true
    },
    // 点击遮罩是否关闭
    maskClose: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    showPop(newVal, oldVal) {
      this.login_pop_show = newVal;
    },
    login_pop_show(newVal, oldVal) {
      //在监听你使用update事件来更新showPop 而在父组件不需要调用该函数
      this.$emit("update:showPop", newVal);
    }
  },
  computed: {
    ...mapState({
      wxLogin: state => state.login.wxLogin,
      authorization: state => state.login.authorization,
      phoneLogin: state => state.login.phoneLogin,
      phoneLoginInfo: state => state.login.phoneLoginInfo
    })
  },
  onShow() {
    if (this.wxLogin) {
      this.popTile = "绑定手机号";
    }
  },
  onLoad() {
    if (this.wxLogin) {
      this.popTile = "绑定手机号";
    }
  },
  methods: {
    ...mapActions(["toWxLogin"]),
    toRegOrLogin() {
      this.login_pop_show = false;
      // let url = `../login/main`;
      if (this.phoneLoginInfo.phoneNum) {
        // 手机登陆
        let url = `../phone_code_login/main`;
        wx.navigateTo({ url });
      } else {
        // 手机绑定
        let url = `../forget_password/main`;
        wx.navigateTo({ url });
      }
    },
    getUserInfo() {
      let _this = this;
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: res => {
              var userInfo = JSON.parse(res.rawData);
              console.log(userInfo);
              if (_this.authorization) {
                _this.login_pop_show = false;
              }
              _this.popTile = "绑定手机号";
              _this.toWxLogin(userInfo);
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
    }
  }
};
</script>

<style lang="less">
.popup_sel1 {
  width: 80%;
  padding: 20px;
  border-radius: 10px;

  p {
    margin: 0;
    padding-bottom: 30px;
    font-size: 16px;
    color: #666666;
    text-align: center;
  }

  .btn {
    width: 100%;
    display: block;
    padding-left: 30px;
    border-radius: 10px;
    font-size: 14px;
    line-height: 40px;
    height: 40px;
    position: relative;

    img {
      width: 24px;
      position: absolute;
      left: 30px;
      top: 12px;
    }
  }

  .btn1 {
    background: #19be6b;
    color: #fff;
    margin-bottom: 20px;
  }

  .btn2 {
    background: #f5f5f5;
    color: #333333;

    .btn2_img {
      width: 14px;
    }
  }

  .agree_text {
    padding-top: 20px;
    font-size: 12px;
    color: #999;

    span {
      color: #333;
    }
  }
}
</style>
