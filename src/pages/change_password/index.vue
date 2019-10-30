<template>
  <div class="forget_password">
    <div class="login_header">
      <h3>修改登录密码</h3>
    </div>
    <!-- <div class="input_group">
            <input class="b_num" value="+86" disabled>
            <input class="input_text" type="text" v-model="userInfo.phoneNum" placeholder="请输入手机账号">
    </div>-->
    <!-- <div class="input_group input_group2">
            <input v-model="userInfo.code" class="input_text" type="text" placeholder="请输入收到的验证码">
            <van-button v-if="showCodeBtn" custom-class="code_btn" @click="sendCode" type="success">获取验证码</van-button>
            <van-button v-if="!showCodeBtn" disabled custom-class="code_btn" type="success">{{codeNum+'后重发'}}</van-button>
    </div>-->
    <div class="input_group input_group2">
      <input class="input_text" type="password" v-model="userInfo.password" placeholder="请输入新密码">
    </div>
    <div class="input_group input_group2">
      <input class="input_text" type="password" v-model="userInfo.rePassword" placeholder="请确认新密码">
    </div>
    <van-button @click="modifySubmit" custom-class="login_btn" size="large">确定</van-button>

    <i-message id="message"/>
  </div>
</template>

<script>
import { _changePassword } from "../../service/personal";
export default {
  name: "forget_password",
  data() {
    return {
      // passwordType: 'password',
      // showCodeBtn: true,
      // timer: null,
      // codeNum: 60,
      userInfo: {
        // phoneNum: '',
        // code: '',
        password: "",
        rePassword: ""
      }
    };
  },
  onLoad() {
    // 监听页面加载
  },
  onHide() {},
  onShow() {
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
      wx.navigateTo({ url });
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
    modifySubmit() {
      if (!this.userInfo.password) {
        this.$Message({
          content: "请输入新密码",
          type: "warning"
        });
      } else if (this.userInfo.password != this.userInfo.rePassword) {
        this.$Message({
          content: "确认密码不一致",
          type: "warning"
        });
      } else {
        // flyio
        _changePassword(this.userInfo).then(res => {
          if (res.data.success) {
            // wx.showToast({
            //   title: "密码修改成功",
            //   icon: "success",
            //   duration: 1000,
            //   mask: true,
            //   success: e => {
            //     setTimeout(() => {
            //       let url = `../personal_info/main`;
            //       wx.navigateBack({ url });
            //     }, 1000);
            //   }
            // });
            wx.showModal({
              title: "提示",
              content: "密码修改成功",
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  let url = `../personal_info/main`;
                  wx.navigateBack({ url });
                }
              }
            });
          } else {
            this.$Message({
              content: res.data.message,
              type: "warning"
            });
          }
        });
      }
    }
  }
};
</script>

<style scoped>
</style>