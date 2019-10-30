<template>
  <div class="login">
    <div class="login_header">
      <h3>登录家美</h3>
      <p @click="toLoginPage" class="text-one">注册</p>
    </div>
    <div class="input_group">
      <input maxlength="11" v-model="userInfo.phoneNum" type="text" placeholder="请输入手机账号">
    </div>
    <div class="input_group">
      <input
        v-model="userInfo.pwd"
        v-show="passwordType=='text'"
        class="input_text"
        type="text"
        placeholder="请输入您的密码"
      >
      <input
        v-model="userInfo.pwd"
        v-show="passwordType!='text'"
        class="input_text"
        type="password"
        placeholder="请输入您的密码"
      >
      <div v-show="passwordType=='password'" @click="openEye">
        <img mode="widthFix" :src="iconEye">
      </div>
      <div v-show="passwordType=='text'" @click="openEye">
        <img mode="widthFix" :src="iconOpenEyes">
      </div>
    </div>
    <van-button @click="loginSubmit" custom-class="login_btn" size="large">登录</van-button>
    <p @click="toFPPage" class="forget_pwd">忘记密码</p>

    <i-message id="message"/>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { _phoneLogin } from "../../service/personal";

export default {
  name: "login",
  data() {
    return {
      iconEye: this.imgBastPath + "icon_eye.png",
      iconOpenEyes: this.imgBastPath + "icon_open_eyes.png",
      passwordType: "password",
      userInfo: {
        phoneNum: "",
        pwd: ""
      }
    };
  },
  onLoad() {},
  onShow() {
    Object.assign(this.$data, this.$options.data());
  },
  computed: {
    ...mapState({
      authorization: state => state.login.authorization
    })
  },
  onHide() {},
  methods: {
    ...mapActions(["toUserLogin"]),
    openEye() {
      this.passwordType = this.passwordType === "text" ? "password" : "text";
    },
    toLoginPage() {
      let url = `../register/main`;
      wx.navigateTo({ url });
    },
    toFPPage() {
      let url = `../forget_password/main`;
      wx.navigateTo({ url });
    },
    loginSubmit() {
      if (!this.userInfo.phoneNum) {
        this.$Message({
          content: "请输入手机号码",
          type: "warning"
        });
      } else if (!this.userInfo.pwd) {
        this.$Message({
          content: "请输入密码",
          type: "warning"
        });
      } else {
        let user_info = {
          phone: this.userInfo.phoneNum,
          password: this.userInfo.pwd
        };
        _phoneLogin(user_info).then(res => {
          if (res.data.success) {
            // let url = `../home/main`;
            // this.toUserLogin(this.userInfo.phoneNum);
            wx.navigateBack(-1);
          } else {
            this.$Message({
              content: res.data.message,
              type: "error"
            });
          }
        });
        // flyio  同手机登录用户不同 返回用户信息

        //
      }
    }
  }
};
</script>

<style scoped>
</style>