<template>
  <div class="appointment">
    <div v-if="false" style="padding-top: 100px;">
      <img class="default_img" mode="widthFix" :src="img1" alt />
      <p>暂无预约面试申请</p>
      <van-button @click="appointmentClick" :custom-class="'to_button'">去预约</van-button>
    </div>

    <!-- 预约列表 -->
    <!-- animated="true" swipeable="true" sticky="true" -->
    <van-tabs
      custom-class="order_tab"
      tab-class="order_tabs"
      :active="activeIndex"
      swipe-threshold="6"
      @change="onChange"
      sticky="true"
    >
      <van-tab title="综合">
        <div class="order_list_null" v-show="appListData.length==0">
          <img class="default_pic" mode="widthFix" :src="defNoOrder" />
          <p>目前没有任何预约服务</p>
        </div>

        <div class="list_card" v-show="appListData.length>0">
          <ul>
            <li class="list_box" v-for="(item,index) in appListData" :key="index">
              <div class="list_left">
                <img
                  @click="toDetail(item.id)"
                  class="list_pic"
                  mode="widthFix"
                  :src="item.headImg"
                />
              </div>
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
                    <span v-text="item.serviceFamily"></span>户
                  </h5>
                </div>

                <!-- <div class="rate_box">
                  <van-rate
                    custom-class="a"
                    icon-class="b"
                    :value="item.level"
                    :size="'12'"
                    :count="'5'"
                    readonly="true"
                    @change="rateChange"
                  />
                </div>-->

                <div class="rate_container">
                  <img
                    :src="rateImg"
                    mode="widthFix"
                    v-for="(item2,index2) in item.level"
                    :key="index2"
                  />
                </div>

                <div class="list_bottom clearfix">
                  <h4 class="fl">
                    <span>{{item.price}}</span>元/小时
                  </h4>
                  <button @click="toDetail2(item.id)" class="list_btn fr">立即面试</button>
                </div>
              </div>
            </li>
          </ul>
          <i-load-more :tip="hasMore?'数据加载中':'暂无更多数据'" :loading="hasMore" />
        </div>
      </van-tab>

      <van-tab tab-class="order_tabs" title="按价格">
        <div class="price_change" v-show="showpriceUp">
          <div @click="upPrice" :class="priceUp?'active1':''">
            <!-- <span></span> -->
          </div>
          <div @click="downPrice" :class="!priceUp?'active2':''">
            <!-- <span></span> -->
          </div>
        </div>

        <div class="order_list_null" v-show="appListData.length==0">
          <img class="default_pic" mode="widthFix" :src="noOrder" />
          <p>目前没有任何预约服务</p>
        </div>

        <div class="list_card" v-show="appListData.length>0">
          <ul>
            <li class="list_box" v-for="(item,index) in appListData" :key="index">
              <div class="list_left">
                <img
                  @click="toDetail(item.id)"
                  class="list_pic"
                  mode="widthFix"
                  :src="item.headImg"
                />
              </div>
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
                <!-- <div class="rate_box">
                  <van-rate
                    custom-class="a"
                    icon-class="b"
                    :value="item.level"
                    :size="'12'"
                    :count="'5'"
                    readonly="true"
                    @change="rateChange"
                  />
                </div>-->
                <div class="rate_container">
                  <img
                    :src="rateImg"
                    mode="widthFix"
                    v-for="(item2,index2) in item.level"
                    :key="index2"
                  />
                </div>
                <div class="list_bottom clearfix">
                  <h4 class="fl">
                    <span>{{item.price}}</span>元/小时
                  </h4>
                  <button @click="toDetail2(item.id)" class="list_btn fr">立即面试</button>
                </div>
              </div>
            </li>
          </ul>
          <i-load-more :tip="hasMore?'数据加载中':'暂无更多数据'" :loading="hasMore" />
        </div>
      </van-tab>

      <van-tab title="按经验">
        <div class="order_list_null" v-show="appListData.length==0">
          <img class="default_pic" mode="widthFix" :src="noOrder" />
          <p>目前没有任何预约服务</p>
        </div>

        <div class="list_card" v-show="appListData.length>0">
          <ul>
            <li class="list_box" v-for="(item,index) in appListData" :key="index">
              <div class="list_left">
                <img
                  @click="toDetail(item.id)"
                  class="list_pic"
                  mode="widthFix"
                  :src="item.headImg"
                />
              </div>
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
                <div class="rate_container">
                  <img
                    :src="rateImg"
                    mode="widthFix"
                    v-for="(item2,index2) in item.level"
                    :key="index2"
                  />
                </div>
                <div class="list_bottom clearfix">
                  <h4 class="fl">
                    <span>{{item.price}}</span>元/小时
                  </h4>
                  <button @click="toDetail2(item.id)" class="list_btn fr">立即面试</button>
                </div>
              </div>
            </li>
          </ul>
          <i-load-more :tip="hasMore?'数据加载中':'暂无更多数据'" :loading="hasMore" />
        </div>
      </van-tab>

      <van-tab title="按星级">
        <div class="age_change" v-show="showAgeUp">
          <div @click="upAge" :class="ageUp?'active1':''">
            <!-- <span></span> -->
          </div>
          <div @click="downAge" :class="!ageUp?'active2':''">
            <!-- <span></span> -->
          </div>
        </div>
        <div class="order_list_null" v-show="appListData.length==0">
          <img class="default_pic" mode="widthFix" :src="noOrder" />
          <p>目前没有任何预约服务</p>
        </div>

        <div class="list_card" v-show="appListData.length>0">
          <ul>
            <li class="list_box" v-for="(item,index) in appListData" :key="index">
              <div class="list_left">
                <img
                  @click="toDetail(item.id)"
                  class="list_pic"
                  mode="widthFix"
                  :src="item.headImg"
                />
              </div>
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
                <div class="rate_container">
                  <img
                    :src="rateImg"
                    mode="widthFix"
                    v-for="(item2,index2) in item.level"
                    :key="index2"
                  />
                </div>
                <div class="list_bottom clearfix">
                  <h4 class="fl">
                    <span>{{item.price}}</span>元/小时
                  </h4>
                  <button @click="toDetail2(item.id)" class="list_btn fr">立即面试</button>
                </div>
              </div>
            </li>
          </ul>
          <i-load-more :tip="hasMore?'数据加载中':'暂无更多数据'" :loading="hasMore" />
        </div>
      </van-tab>

      <!-- <van-tab title="筛选">
        <div v-show="showKeepBox" class="show_keep" @click="showKeep"></div>
        <div class="screen_box" v-show="showScreen">
          <div :class="!showScreen?'display_none':''">
            <div class="screen_list">
              <div style="font-size:14px;">此功能暂不开放</div>
              <div class="screen_item">
                <h3>价格</h3>
                <div class="items">
                  <p>
                    <span class="active">8888元</span>
                  </p>
                  <p>
                    <span>9999元</span>
                  </p>
                  <p>
                    <span>12222元</span>
                  </p>
                </div>
              </div>
              <div class="screen_item">
                <h3>经验</h3>
                <div class="items">
                  <p>
                    <span class="active">5户以下</span>
                  </p>
                  <p>
                    <span>5-15户</span>
                  </p>
                  <p>
                    <span>15户以上</span>
                  </p>
                </div>
              </div>
              <div class="screen_item">
                <h3>年龄</h3>
                <div class="items">
                  <p>
                    <span class="active">35岁以下</span>
                  </p>
                  <p>
                    <span>35~40岁</span>
                  </p>
                  <p>
                    <span>40岁~45岁</span>
                  </p>
                  <p>
                    <span>45岁以上</span>
                  </p>
                </div>
              </div>
              <div class="screen_item">
                <h3>技能</h3>
                <div class="items">
                  <p>
                    <span class="active">烹饪</span>
                  </p>
                  <p>
                    <span>除螨</span>
                  </p>
                  <p>
                    <span>擦洗</span>
                  </p>
                  <p>
                    <span>除尘</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="btns">
              <button class="btn clear_btn">清除条件</button>
              <button @click="toScreen" class="btn submit_btn">确定筛选</button>
            </div>
            <div @click="aa" class="pretend_mask"></div>
          </div>
        </div>
        <div class="order_list_null" v-show="appListData.length==0">
          <img class="default_pic" mode="widthFix" :src="noOrder">
          <p>目前没有任何预约服务</p>
        </div>

        <div class="list_card" v-show="appListData.length>0">
          <ul>
            <li class="list_box" v-for="(item,index) in appListData" :key="index">
              <img @click="toDetail(item.id)" class="list_left" mode="widthFix" :src="item.headImg">
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
                <div class="rate_container">
                  <img
                    :src="rateImg"
                    mode="widthFix"
                    v-for="(item2,index2) in item.level"
                    :key="index2"
                  >
                </div>
                <div class="list_bottom clearfix">
                  <h4 class="fl">
                    <span>{{item.price}}</span>元/小时
                  </h4>
                  <button @click="toDetail2(item.id)" class="list_btn fr">立即面试</button>
                </div>
              </div>
            </li>
          </ul>
          <i-load-more :tip="hasMore?'数据加载中':'暂无更多数据'" :loading="hasMore"/>
        </div>
      </van-tab>-->
    </van-tabs>

    <!--预约列表-->
    <!-- <div class="list_card">
      <ul>
        <li class="list_box">
          <img  @click="toDetail" class="list_left" mode="widthFix" :src="'../../static/images/pro_picture.png'">
          <div class="list_right">
            <h3>王阿姨</h3>
            <div class="info clearfix">
              <h5>30岁</h5>
              <h5>浙江人</h5>
              <h5>
                <span>4</span>年工作
              </h5>
              <h5>服务过
                <span>20</span>户</h5>
            </div>
            <div class="rate_box">
              <van-rate custom-class="a" icon-class="b" :value="5" :size="'12'" :count="'5'" readonly="true" @change="rateChange" />
            </div>
            <div class="list_bottom clearfix">
              <h4 class="fl">
                <span>12000</span>元/月
              </h4>
              <button class="list_btn fr">待确认</button>
            </div>
          </div>
        </li>

        <li class="list_box">
          <img @click="toDetail" class="list_left" mode="widthFix" :src="'../../static/images/pro_picture.png'">
          <div class="list_right">
            <h3>王阿姨</h3>
            <div class="info clearfix">
              <h5>30岁</h5>
              <h5>浙江人</h5>
              <h5>
                <span>4</span>年工作
              </h5>
              <h5>服务过
                <span>20</span>户</h5>
            </div>
            <div class="rate_box">
              <van-rate custom-class="a" icon-class="b" :value="5" :size="'12'" :count="'5'" readonly="true" @change="rateChange" />
            </div>
            <div class="list_bottom clearfix">
              <h4 class="fl">
                <span>12000</span>元/月
              </h4>
              <button class="list_btn fr">待确认</button>
            </div>
          </div>
        </li>

      </ul>
    </div>-->

    <!-- <van-popup :show="login_pop_show" @close="onClose" custom-class="popup_sel1">
      <p>登录或注册家美</p>
      <van-button @click="toRegOrLogin" :custom-class="'btn btn2'">
        <img mode="widthFix" :src="iponePic" alt> 手机号注册/登录
      </van-button>
      <p class="agree_text">
        登录代表您已同意
        <span>《家美用户协议》</span>
      </p>
    </van-popup>-->

    <!-- <van-area :area-list="areaList"/> -->
    <toLoginPopup :showPop.sync="login_pop_show"></toLoginPopup>
    <i-message id="message" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { _getAppointmentList } from "../../service/classify";
import toLoginPopup from "../../components/toLoginPopup";
import { _addAppoint } from "../../service/detail";
export default {
  data() {
    return {
      weiXin: this.imgBastPath + "weixin.png",
      rateImg: this.imgBastPath + "icon_Diamonds.png",
      iponePic: this.imgBastPath + "ipone.png",
      defNoOrder: this.imgBastPath + "def_no_order.png",
      login_pop_show: false,
      appParams: {
        orderBy: "", // price：价格，experience：经验，age：年龄
        pageNumber: 1,
        pageSize: 5,
        orderDir: "", // desc，逆向，asc：正向
        startTime: "",
        endTime: "",
        appointTryId: "",
        productId: ""
        // loading: true
      },
      appListData: [],
      hasMore: true,
      areaList: {
        province_list: {
          110000: "北京市",
          120000: "天津市"
        },
        city_list: {
          110100: "北京市",
          110200: "县",
          120100: "天津市",
          120200: "县"
        },
        county_list: {
          110101: "东城区",
          110102: "西城区",
          110105: "朝阳区",
          110106: "丰台区",
          120101: "和平区",
          120102: "河东区",
          120103: "河西区",
          120104: "南开区",
          120105: "河北区"
        }
      },
      login_pop_show: false,
      a: 2,
      actions4: [],
      noOrder: this.imgBastPath + "def_no_order.png",
      img1: this.imgBastPath + "no-appointment.png",
      proPicture: this.imgBastPath + "pro_picture.png",
      priceUp: true,
      ageUp: true,
      showpriceUp: false,
      showAgeUp: false,
      showScreen: false,
      activeIndex: 0,
      showKeepBox: false,
      haSreach: true
    };
  },
  created() {},
  components: {
    toLoginPopup
  },
  computed: {
    ...mapState({
      wxLogin: state => state.login.wxLogin,
      phoneLogin: state => state.login.phoneLogin,
      authorization: state => state.login.authorization,
      phoneLoginInfo: state => state.login.phoneLoginInfo
    })
  },
  onLoad(option) {
    this.appListData = [];
    if (option) {
      /*
          id -->              下预约的时候用  
          productTypeId -->   预约
       */
      this.appParams.productId = option.productId;
      this.appParams.appointTryId = option.id;
      this.initData();
      this.getDataList(this.appParams);
    }
  },
  onShow() {},
  onHide() {
    this.login_pop_show = false;
    // 重置data 完成初始化
    // Object.assign(this.$data, this.$options.data());
  },
  methods: {
    ...mapActions(["toWxLogin"]),
    appointmentClick() {
      if (!this.phoneLoginInfo.phoneNum) {
        this.login_pop_show = true;
      }
    },
    toScreen() {
      // 筛选 flyio
      this.showScreen = false;
    },
    upPrice() {
      this.initData();
      this.appParams.orderDir = "asc";
      this.getDataList(this.appParams, "change");
      this.priceUp = true;
    },
    downPrice() {
      this.initData();
      this.appParams.orderDir = "desc";
      this.getDataList(this.appParams, "change");
      this.priceUp = false;
    },
    upAge() {
      this.initData();
      this.appParams.orderDir = "asc";
      this.getDataList(this.appParams, "change");
      this.ageUp = true;
    },
    downAge() {
      this.initData();
      this.appParams.orderDir = "desc";
      this.getDataList(this.appParams, "change");
      this.ageUp = false;
    },
    getDataList(params, flag) {
      let _this = this;
      _getAppointmentList(params).then(res => {
        if (res.data.success) {
          let page = res.data.data.page;
          if (this.appParams.pageNumber < page.totalPage) {
            this.haSreach = true;
          } else {
            this.haSreach = false;
            _this.hasMore = false;
          }
          let bastPath = res.data.data.baseUrl;
          let resData = res.data.data.list;
          resData.forEach(val => {
            val.headImg = bastPath + val.headImg;
            // val.headerImg = bastPath + "/upload/20190514143009766373.png";
          });
          // if (resData.length < 5) {
          //   _this.hasMore = false;
          // }
          if (flag == "change") {
            _this.appListData = resData;
          } else {
            _this.appListData = _this.appListData.concat(resData);
          }
          // resData.forEach((val,index)=>{
          //   _this.$set(_this.appListData,index,val);
          // })
          // this.appListData.push(...resData);
        }
      });
    },
    initData() {
      // this.appListData = [];
      this.appParams.pageNumber = 1;
      this.hasMore = true;
    },
    onClose() {
      this.login_pop_show = false;
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
                url: "/pages/home/main"
              });
            }
          });
        },
        fail: res => {
          // 获取失败的去引导用户授权
        }
      });
    },
    toRegOrLogin() {
      let url = `../login/main`;
      wx.navigateTo({ url });
    },
    rateChange() {},
    toDetail(id) {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let second = date.getSeconds();
      let time = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
      let url = `../aunt_detail/main?id=${id}&time=${time}&showBtn=1&appointTryId=${
        this.appParams.appointTryId
      }&productId=${this.appParams.productId}`;
      wx.navigateTo({ url });
    },
    toDetail2(id) {
      if (this.phoneLoginInfo.phoneNum) {
        let params = {
          employeeId: id,
          appointTryId: this.appParams.appointTryId,
          productId: this.appParams.productId
        };
        _addAppoint(params).then(res => {
          if (res.data.success) {
            let url = `../successful_appointment/main`;
            wx.navigateTo({ url });
          } else {
            this.$Message({
              content: res.data.message,
              type: "error"
            });
          }
        });
      } else {
        this.login_pop_show = true;
      }
    },
    onChange(e) {
      let tabIndex = e.mp.detail.index;
      this.activeIndex = tabIndex;
      this.hasMore = true;
      switch (tabIndex) {
        // 综合
        case 0:
          this.initData(); // pageNumber = 1   appListData= []  hasMore=true
          this.appParams.orderBy = "";
          this.appParams.orderDir = "";
          this.appParams.startTime = "";
          this.appParams.endTime = "";
          this.showpriceUp = this.showAgeUp = this.showKeepBox = false;
          this.getDataList(this.appParams, "change");
          break;
        // 按价格
        case 1:
          this.initData();
          this.appParams.orderBy = "price";
          this.appParams.orderDir = "asc";
          this.priceUp = true;
          this.appParams.startTime = "";
          this.appParams.endTime = "";
          this.showpriceUp = true;
          this.showAgeUp = false;
          this.getDataList(this.appParams, "change");
          break;
        case 2:
          // 按经验
          this.initData();
          this.appParams.orderBy = "experience";
          this.appParams.orderDir = "asc";
          this.appParams.startTime = "";
          this.appParams.endTime = "";
          this.getDataList(this.appParams, "change");
          this.showpriceUp = this.showAgeUp = this.showKeepBox = false;
          break;

        case 3:
          // 按星际
          this.initData();
          this.appParams.orderBy = "age";
          this.appParams.orderDir = "";
          this.appParams.startTime = "";
          this.ageUp = true;
          this.appParams.endTime = "";
          this.getDataList(this.appParams, "change");
          this.showAgeUp = true;
          this.showpriceUp = this.showKeepBox = false;
          break;
        // 删选
        case 4:
          this.initData();
          this.showScreen = this.showKeepBox = true;
          this.showpriceUp = this.showAgeUp = false;
          console.log(this.showScreen);
          break;
        default:
          break;
      }
    },
    aa() {
      console.log(this.showScreen);
      this.showScreen = false;
      console.log(this.showScreen);
    },
    showKeep() {
      this.showScreen = true;
    }
  },
  // 上拉加载
  onReachBottom: function() {
    console.log(this.haSreach, this.hasMore);
    if (this.haSreach) {
      this.appParams.pageNumber++;
      this.getDataList(this.appParams);
    }
  },
  //下拉刷新
  onPullDownRefresh() {
    this.initData();
    this.getDataList(this.appParams, "change");
    wx.stopPullDownRefresh(); // 通知页面停止下拉刷新效果
  }
};
</script>

<style lang="less" scoped>
</style>
