<template>
  <div class="register">
    <div class="login_header">
      <h3>注册家美</h3>
      <p @click="toLoginPage" class="text-one">登录</p>
    </div>
    <div class="input_group">
      <input class="b_num" value="+86" disabled>
      <input maxlength="11" class="input_text" type="text" v-model="userInfo.phoneNum" placeholder="请输入手机账号">
    </div>
    <div class="input_group input_group2">
      <input v-model="userInfo.code" class="input_text" type="text" placeholder="请输入收到的验证码">
      <van-button v-if="showCodeBtn" custom-class="code_btn" @click="sendCode" type="success">获取验证码</van-button>
      <van-button
        v-if="!showCodeBtn"
        disabled
        custom-class="code_btn"
        type="success"
      >{{codeNum+'后重发'}}</van-button>
    </div>
    <div class="input_group">
      <input
        v-model="userInfo.pwd"
        class="input_text"
        style="flex:1;"
        type="password"
        placeholder="请输入您的密码"
      >
    </div>
    <div class="input_group">
      <input
        v-model="userInfo.pwd2"
        class="input_text"
        style="flex:1;"
        type="password"
        placeholder="请确认您的密码"
      >
    </div>

    <van-button @click="registerSubmit" custom-class="login_btn" size="large">注册</van-button>
    <p class="agree_text">
      注册美家代表您已同意
      <span>《家美用户协议》</span>
    </p>

    <i-message id="message"/>
  </div>
</template>

<script>
import { _sendRegCode, _phoneRegSubmit } from "../../service/personal";
import { mapState, mapActions } from "vuex";
export default {
  name: "login",
  data() {
    return {
      showCodeBtn: true,
      timer: null,
      codeNum: 60,
      userInfo: {
        phoneNum: "",
        pwd: "",
        pwd2: "",
        code: ""
      }
    };
  },
  onLoad() {
    // 监听页面加载
  },
  computed: {
    ...mapState({
      smstoken: state => state.login.smstoken
    })
  },
  onHide() {
    // -监听页面隐藏
    // 重置data 完成初始化
    Object.assign(this.$data, this.$options.data());
  },
  onUnload() {
    // 监听页面卸载生命周期函数
    clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    toLoginPage() {
      let url = `../login/main`;
      wx.navigateBack({ url });
    },
    sendCode() {
      let reg = /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
      if (this.userInfo.phoneNum == "") {
        this.$Message({
          content: "请输入手机号",
          type: "warning"
        });
      } else if (!reg.test(this.userInfo.phoneNum)) {
        this.$Message({
          content: "手机号格式错误",
          type: "warning"
        });
      } else {
        this.showCodeBtn = false;
        let codeInfo = {
          phone: this.userInfo.phoneNum,
          smsType: 1
        };
        _sendRegCode(codeInfo).then(res => {
          console.log(res);
        });
        this.timer = setInterval(() => {
          if (this.codeNum > 0) {
            this.codeNum--;
          } else {
            this.showCodeBtn = true;
            this.codeNum = 60;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    },
    registerSubmit() {
      if (!this.userInfo.phoneNum) {
        this.$Message({
          content: "请输入手机号码",
          type: "warning"
        });
      } else if (!this.userInfo.code) {
        this.$Message({
          content: "请输入验证码",
          type: "warning"
        });
      } else if (!this.userInfo.pwd) {
        this.$Message({
          content: "请输入密码",
          type: "warning"
        });
      } else if (this.userInfo.pwd != this.userInfo.pwd2) {
        this.$Message({
          content: "密码不一致",
          type: "warning"
        });
      } else {
        let regInfo = {
          phone: this.userInfo.phoneNum,
          password: this.userInfo.pwd,
          rePassword: this.userInfo.pwd2,
          code: this.userInfo.code
        };
        _phoneRegSubmit(regInfo)
          .then(res => {
            if (res.data.success) {
              let url = `../login/main`;
              wx.navigateTo({ url });
            } else {
              this.$Message({
                content: res.data.message,
                type: "warning"
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }
};
</script>

<style scoped>
</style>