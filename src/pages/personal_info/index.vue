<template>
  <div class="personal_info">
    <div class="my_order" @click="picPop=true">
      <div class="order_header">
        <p>头像</p>
        <div class="right_btn">
          <div class="user_header_pic">
            <img class="user_pic" mode="widthFix" :src="wxUserInfo.avatarUrl||userPic" />
          </div>
          <i-icon size="20" color="#BABABA" type="enter" />
        </div>
      </div>
    </div>

    <div class="my_order2">
      <div class="order_header" @click="namePop=true">
        <p>昵称</p>
        <div class="right_btn">
          <span style="color:#282828;">{{wxUserInfo.nickName||'先生/女士'}}</span>
          <i-icon color="#BABABA" size="14" type="enter" />
        </div>
      </div>
      <div class="order_header">
        <p>手机号码</p>
        <div class="right_btn">
          <span class="phone_number">
            {{phoneLoginInfo.phoneNum||'1************'}}
            <i
              style="display:inline-block;padding-left:10px;"
            >已验证</i>
          </span>
          <!-- <i-icon color="#BABABA" type="enter" /> -->
        </div>
      </div>
      <!-- <div class="order_header" @click="toChangePassword">
        <p>修改密码</p>
        <div class="right_btn">
          <span></span>
          <i-icon color="#BABABA" type="enter"/>
        </div>
      </div>-->
    </div>
    <!-- 
    <div class="my_order2" style="margin-top:12px;" @click="clearCache">
      <div class="order_header">
        <p>点击清理缓存</p>
        <div class="right_btn">
          <span style="color:#BABABA;">{{cacheNumber}}M</span>
          <i-icon color="#BABABA" type="enter"/>
        </div>
      </div>
    </div>-->

    <!-- <div style="text-align: center;">
      <van-button @click="outPhoneLogin" custom-class="login_btn">退出登录</van-button>
    </div>-->

    <van-popup custom-class="name_pop" :show="namePop" close-on-click-overlay="false">
      <h3>请输入您的新昵称</h3>
      <input v-model="changeName" type="text" />
      <van-button @click="changeNameSubmit" custom-class="name_btn">确定</van-button>
      <van-icon @click="closeNamePop" custom-class="close_icon" name="cross" color="#666" />
    </van-popup>

    <van-popup
      :show="picPop"
      custom-class="name_pop2"
      position="bottom"
      @close="picPop=false"
      close-on-click-overlay="true"
    >
      <div @click="getCamera" class="pic1">拍照</div>
      <div @click="getAlbum" class="pic2">从相册选择</div>
      <div @click="picPop=false" class="close_pop">取消</div>
    </van-popup>

    <i-message id="message" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { _changeNickName, _changeHeaderImg } from "../../service/personal";
export default {
  name: "personal_info",
  data() {
    return {
      namePop: false,
      picPop: false,
      changeName: "",
      cacheNumber: 8.2,
      carWin_img_hidden: true, //展示照片的view是否隐藏
      carWin_img: "", //存放照片路径的
      userPic: "../../static/images/user.png"
    };
  },
  computed: {
    ...mapState({
      wxLogin: state => state.login.wxLogin,
      phoneLogin: state => state.login.phoneLogin,
      wxUserInfo: state => state.login.wxUserInfo,
      phoneLoginInfo: state => state.login.phoneLoginInfo
    })
  },
  onLoad() {
    this.init();
  },
  onShow() {
    this.picPop = false;
  },
  onHide() {
    // 重置data 完成初始化
    // Object.assign(this.$data, this.$options.data());
  },
  methods: {
    ...mapActions([
      "toWxLogin",
      "changeNickName",
      "uploadUserPic",
      "delPhoneLogin"
    ]),
    init() {
      this.changeName = this.wxUserInfo.nickName;
    },
    closeNamePop() {
      this.namePop = false;
      this.changeName = this.wxUserInfo.nickName;
    },
    changeNameSubmit() {
      if (!this.changeName) {
        this.$Message({
          content: "请输入昵称",
          type: "warning"
        });
      } else {
        let userName = {
          nickname: this.changeName
        };
        _changeNickName(userName).then(res => {
          if (res.data.success) {
            this.namePop = false;
            this.changeNickName(this.changeName);
            this.$Message({
              content: res.data.message,
              type: "success"
            });
          }
        });
      }
    },
    getAlbum() {
      let _this = this;
      wx.chooseImage({
        count: 1,
        sourceType: ["album"],
        success: res => {
          // 无论用户是从相册选择还是直接用相机拍摄，路径都是在这里面
          let filePath = res.tempFilePaths[0];
          _this.carWin_img = filePath; //把照片路径存到变量中，
          _this.carWin_img_hidden = false; //让展示照片的view显示
          // 这个是使用微信接口保存文件到数据库
          // wx.uploadFile({
          //   url: "",
          //   filePath: filePath,
          //   name: 'file',
          //   success: function (res) {
          //   }
          // })
          let userPic = {
            headerImg: wx
              .getFileSystemManager()
              .readFileSync(filePath, "base64")
          };
          _changeHeaderImg(userPic).then(res => {
            if (res.data.success) {
              _this.uploadUserPic(_this.carWin_img);
              this.$Message({
                content: res.data.message,
                type: "success"
              });
            }
          });
        },
        fail: error => {
          // console.error("调用本地相册文件时出错")
          // console.warn(error)
        },
        complete: function() {}
      });
    },
    getCamera() {
      let _this = this;
      wx.chooseImage({
        count: 1,
        sourceType: ["camera"],
        success: res => {
          let filePath = res.tempFilePaths[0];
          _this.carWin_img = filePath; //把照片路径存到变量中，
          _this.carWin_img_hidden = false; //让展示照片的view显示
          _this.uploadUserPic(_this.carWin_img);
        },
        fail: error => {},
        complete: function() {}
      });
    },
    toChangePassword() {
      let url = `../change_password/main`;
      wx.navigateTo({ url });
    },
    clearCache() {
      wx.showToast({
        title: "缓存已清除",
        icon: "none",
        success: () => {
          this.cacheNumber = 0;
        }
      });
    },
    outPhoneLogin() {
      let _this = this;
      wx.showModal({
        title: "提示",
        content: "是否退出登录",
        success(res) {
          if (res.confirm) {
            _this.delPhoneLogin();
            let url = `../home/main`;
            wx.switchTab({ url });
          } else if (res.cancel) {
          }
        }
      });
    }
  }
};
</script>

<style scoped>
</style>