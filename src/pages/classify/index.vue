<template>
  <div class="classify">
    <div class="header">
      <div class="header_left clearfix" @click="toSelAddress">
        <i-icon class="l_icon fl" type="coordinates" />
        <p class="fl">{{wxChangeLocation.street}}</p>
        <i-icon class="l_icon fl" type="unfold" />
      </div>
      <div class="more_box">
        <img
          style="width:20px;"
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

    <div class="class_box">
      <ul class="class_menu">
        <li
          @click="changeClass(item,index)"
          :class="classActive==index?'active':''"
          v-for="(item,index) in classInfo"
          :key="index"
        >{{item.title}}</li>
      </ul>
      <div class="class_content">
        <div class="header_img">
          <img class="banner" mode="widthFix" :src="hotBanner" />
          <img mode="widthFix" class="hot" :src="hotPic" />
        </div>
        <div class="class_title">
          <div class="line line_left"></div>
          <h3>推荐分类</h3>
          <div class="line line_right"></div>
        </div>
        <div class="class_list">
          <div
            class="list"
            v-for="(item,index) in classList"
            :key="index"
            @click="toClassifyDetail(item,index)"
          >
            <img class="list_pic" mode="widthFix" :src="item.img" />
            <p>{{item.title}}</p>
          </div>
        </div>
      </div>
    </div>
    <van-popup
      :show="login_pop_show"
      @click="login_pop_show=false"
      custom-class="popup_sel1"
      close-on-click-overlay="true"
    >
      <p>登录或注册家美</p>
      <van-button
        v-if="!wxLogin"
        @click="getUserInfo"
        open-type="getUserInfo"
        :custom-class="'btn btn1'"
      >
        <img mode="widthFix" :src="weixinPic" alt /> 微信账号快速登录
      </van-button>
      <van-button @click="toRegOrLogin" :custom-class="'btn btn2'">
        <img mode="widthFix" :src="iponePic" alt /> 手机号注册/登录
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
import { _getclassifyList } from "../../service/classify";
export default {
  data() {
    return {
      btnMore: this.imgBastPath + "btn_more.png",
      hotBanner: this.imgBastPath + "def_classification_banner.png",
      hotPic: this.imgBastPath + "def_hot.png",
      weixinPci: this.imgBastPath + "weixin.png",
      iponePic: this.imgBastPath + "ipone.png",
      moreShow: false,
      showMoreBox: false,
      login_pop_show: false,
      classInfo: [
        // { title: '热门', id: 1 },
        // { title: '保洁清洗', id: 2 },
        // { title: '搬家拉货', id: 3 },
        // { title: '房屋维修', id: 4 },
        // { title: '家电维修', id: 5 },
        // { title: '数码维修', id: 6 },
        // { title: '上门安装', id: 7 },
        // { title: '健康咨询', id: 8 },
        // { title: '保姆月嫂', id: 9 }
      ],
      classActive: 0,
      classList: [
        // {
        //   title: "日常保洁",
        //   img: "../../static/tabs/appointment-active.png",
        //   path: ""
        // },
        // {
        //   title: "深度保洁",
        //   img: "../../static/tabs/appointment-active.png",
        //   path: ""
        // },
        // {
        //   title: "开荒保洁",
        //   img: "../../static/tabs/appointment-active.png",
        //   path: ""
        // },
        // {
        //   title: "擦玻璃",
        //   img: "../../static/tabs/appointment-active.png",
        //   path: ""
        // },
        // {
        //   title: "杀虫除螨",
        //   img: "../../static/tabs/appointment-active.png",
        //   path: ""
        // },
        // {
        //   title: "家居养护",
        //   img: "../../static/tabs/appointment-active.png",
        //   path: ""
        // }
      ]
    };
  },
  computed: {
    ...mapState({
      wxLocation: state => state.login.wxLocation,
      wxLogin: state => state.login.wxLogin,
      wxChangeLocation: state => state.login.wxChangeLocation,
      phoneLogin: state => state.login.phoneLogin
    })
  },
  onLoad() {
    this.init();
  },
  onShow() {
    this.showMoreBox = false;
  },
  methods: {
    ...mapActions(["toWxLogin"]),
    init() {
      let params = {
        loading: true
      };
      _getclassifyList(params).then(res => {
        if (res.data.success) {
          let bastUrl = res.data.data.baseUrl;
          this.classInfo = res.data.data.productTypes;
          this.classInfo.forEach(val => {
            val.childList.forEach(el => {
              el.img = bastUrl + el.img;
            });
          });
          this.classList = this.classInfo[0].childList;
        }
      });
    },
    toSelAddress() {
      let url = `../select_address/main`;
      wx.navigateTo({ url });
    },
    toMyMessage() {
      let url = `../my_message/main`;
      wx.navigateTo({ url });
    },
    changeMore() {
      this.moreShow = !this.moreShow;
      this.showMoreBox = !this.showMoreBox;
    },
    toMyOrder() {
      if (!this.phoneLogin) {
        if (!this.wxLogin) {
          this.login_pop_show = true;
        } else {
          let url = `../my_order/main`;
          wx.navigateTo({ url });
        }
      } else {
        let url = `../my_order/main`;
        wx.navigateTo({ url });
      }
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
              wx.switchTab({
                url: "/pages/my_order/main"
              });
            }
          });
        },
        fail: res => {
          // 获取失败的去引导用户授权
        }
      });
    },

    changeClass(item, index) {
      this.classActive = index;
      this.classList = this.classInfo[index].childList;
    },
    toClassifyDetail(item, index) {
      // 1礼包  2.钟点工 3.双拼  待处理 。。。。。。
      if (item.productType == 1) {
        let url = `../detail/main?id=${item.id}`;
        wx.navigateTo({ url });
      } else {
        let url = `../classify_detail/main?id=${item.id}`;
        wx.navigateTo({ url });
      }
    }
    //  // 上拉加载
    // onReachBottom: function() {
    //     this.policyParams.pageNum++;
    //     this.getDataList();
    // },
    // // 停止下拉刷新
    // async onPullDownRefresh() {
    //     this.initData();
    //     this.getDataList();
    //     wx.stopPullDownRefresh();
    // }
  },
  created() {}
};
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
