<template>
  <div class="forget_password">
    <div class="login_header">
      <h3>手机绑定</h3>
    </div>
    <div class="input_group">
      <input class="b_num" value="+86" disabled>
      <input
        class="input_text"
        maxlength="11"
        type="text"
        v-model="userInfo.phoneNum"
        placeholder="请输入手机账号"
      >
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
    <!-- <div class="input_group input_group2">
            <input class="input_text" type="text" v-model="userInfo.newPwd" placeholder="请输入新密码">
    </div>-->
    <van-button @click="modifySubmit" custom-class="login_btn" size="large">确定</van-button>

    <i-message id="message"/>
  </div>
</template>

<script>
import { _sendRegCode, _bindPhone, _getUserInfo } from "../../service/personal";
import { _getOpenId } from "../../service/home";
import { mapState, mapActions } from "vuex";
import MD5 from "js-md5";
export default {
  name: "forget_password",
  data() {
    return {
      passwordType: "password",
      showCodeBtn: true,
      timer: null,
      codeNum: 60,
      userInfo: {
        phoneNum: "",
        code: "",
        newPwd: ""
      }
    };
  },
  onLoad() {
    // 监听页面加载
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
    ...mapActions(["toUserLogin"]),
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
        /*
          短信添加字段 String lastNumber = StringUtil.getPartString(phone, 4, false);  获取后4位
          添加请求头 String cipher = MD5.enCode(MD5.enCode(timestamp + phone) + timestamp + MD5.enCode(timestamp + lastNumber) + phone);
        */
        let phone = this.userInfo.phoneNum;
        let lastNumber = phone.split("").reverse().join("").substr(0, 4).split("").reverse().join("");
        let timestamp = +new Date();
        let str =
          timestamp +
          "" +
          phone +
          "" +
          timestamp +
          "" +
          timestamp +
          "" +
          lastNumber +
          "" +
          phone;
        let md5Str = MD5(str);
        let params = {
          phone: this.userInfo.phoneNum,
          timestamp: timestamp,
          md5Str: md5Str
        };
        // 发送验证码
        _sendRegCode(params);
      }
    },
    modifySubmit() {
      let _this = this;
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
      }
      // else if (!this.userInfo.newPwd) {
      //     this.$Message({
      //         content: '请输入新密码',
      //         type: 'warning'
      //     });
      // }
      else {
        let params = {
          phone: this.userInfo.phoneNum,
          code: this.userInfo.code
        };
        _bindPhone(params).then(res => {
          if (res.data.success) {
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
            wx.navigateBack(-1);
            // _getUserInfo().then(res => {
            //   if (res.data.success) {
            //     let userInfo = res.data.data;
            //     _this.toUserLogin(userInfo);
            //   }
            // });
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