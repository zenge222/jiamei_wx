<template>
  <div class="my_order">
    <!--<div class="tab_icon">
            <div @click="changeActive(index)" class="icon_box" v-for="(item,index) in imgs" :key="index">
              <img mode="widthFix" :src="item" />
            </div>
    </div>-->
    <!--  -->
    <van-tabs
      animated="true"
      sticky="true"
      swipe-threshold="6"
      swipeable="true"
      custom-class="order_tab"
      tab-class="order_tabs"
      :active="activeIndex"
      @change="changeOrderList"
    >
      <van-tab title="全部">
        <div class="order_list_null" v-show="orderList.length==0">
          <img class="default_pic" mode="widthFix" :src="noOrderPic">
          <p>目前没有任何订单</p>
        </div>

        <div class="order_container" v-show="orderList.length>0">
          <div class="order_list" v-for="(item,index) in orderList" :key="index">
            <div class="order_header">
              <span>{{item.createTime}}</span>
              <p>{{item.statusStr}}</p>
            </div>
            <div class="order_content">
              <img @click="toDetail(item)" class="order_img" mode="widthFix" :src="item.productImg">
              <!-- 礼包 -->
              <div class="right_content" v-if="item.indentType==0">
                <h3>{{item.productPackageName}}</h3>
                <p>省{{item.money-item.payMoney}}元</p>
                <div class="order_price">
                  <i>{{item.money}}元/{{item.priceUnitStr}}</i>
                  <em>X1</em>
                </div>
              </div>
              <!-- 小时工 -->
              <div class="right_content" v-if="item.indentType!=0">
                <h3>{{item.productName}}</h3>
                <p style="padding-top:40px;"></p>
                <div class="order_price">
                  <i>{{item.price}}元/{{item.priceUnitStr}}</i>
                  <em v-text="'X'+(item.servicesNum*item.everyTimeDuration)"></em>
                </div>
              </div>
            </div>
            <div class="order_footer">
              <!-- 预付款或礼包 -->
              <div class="footer_price" v-if="item.indentWaitPayType==1||item.indentWaitPayType==4">
                合计：
                <span>
                  {{item.payMoney}}
                  <i>元</i>
                </span>
              </div>
              <!-- 后付款 -->
              <div
                class="footer_price"
                v-if="item.indentWaitPayType==0||item.indentWaitPayType==2||item.indentWaitPayType==3"
              >
                合计：
                <span>
                  {{item.indentWaitPayMoney}}
                  <i>元</i>
                </span>
              </div>
              <div class="footer_btns">
                <p @click="callCustomerService" class="right_btn">联系客服</p>
                <!-- item.payStatus==5&& -->
                <!-- 
                  ？？？？ indentWaitPayStatus == 3 去支付 
                  1.我的订单 待支付接口变动
                -->
                <p @click="toPay(item)" v-if="item.indentWaitPayStatus==1" class="left_btn">去支付</p>
                <p
                  v-if="item.indentWaitPayStatus==2&&item.servicesNum!=item.useServicesNum&&item.indentType==0"
                  @click="toPackageDetails(item.id)"
                  class="left_btn"
                >预约服务</p>
                <p
                  v-if="item.indentWaitPayStatus==2&&item.servicesNum==item.useServicesNum&&item.indentType==0"
                  @click="toPackageDetails(item.id)"
                  class="left_btn"
                >查看服务</p>
                <p
                  v-if="item.indentWaitPayStatus==2&&item.indentType!=0"
                  @click="toPackageDetails(item.id)"
                  class="left_btn"
                >查看服务</p>
                <!-- <p v-if="item.status==4" class="left_btn clear_btn">订单已取消</p> -->
              </div>
            </div>
          </div>
          <i-load-more :tip="hasMore?'数据加载中':'暂无更多订单'" :loading="hasMore"/>
        </div>
      </van-tab>

      <van-tab tab-class="order_tabs" title="待支付">
        <div class="order_list_null" v-show="toBePaidList.length==0">
          <img class="default_pic" mode="widthFix" :src="noOrderPic">
          <p>目前没有任何订单</p>
        </div>

        <div class="order_container" v-show="toBePaidList.length>0">
          <div class="order_list" v-for="(item,index) in toBePaidList" :key="index">
            <div class="order_header">
              <span>{{item.indentCreateTime}}</span>
              <p>{{item.indentStatusStr}}</p>
            </div>
            <div class="order_content">
              <img
                @click="toDetail2(item)"
                class="order_img"
                mode="widthFix"
                :src="item.productSmallImg"
              >
              <!-- 礼包 -->
              <div class="right_content" v-if="item.indentStatus==0">
                <h3>{{item.productName}}</h3>
                <p>省{{item.indentMoney-item.indentPayMoney}}元</p>
                <div class="order_price">
                  <i>{{item.indentPayMoney}}元/{{item.indentPriceUnitStr}}</i>
                  <em>X1</em>
                </div>
              </div>
              <!-- 小时工 -->
              <div class="right_content" v-if="item.indentStatus!=0">
                <h3>{{item.productName}}</h3>
                <p style="padding-top:40px;"></p>
                <div class="order_price">
                  <i>{{item.indentPrice}}元/{{item.indentPriceUnitStr}}</i>
                  <em>X{{item.indentServicesNum}}</em>
                </div>
              </div>
            </div>
            <div class="order_footer">
              <div class="footer_price">
                合计：
                <span>
                  {{item.indentPayMoney}}
                  <i>元</i>
                </span>
              </div>
              <div class="footer_btns">
                <p @click="callCustomerService" class="right_btn">联系客服</p>
                <!-- v-if="item.indentWaitPayStatus==1" -->
                <p @click="toPay(item)" class="left_btn">去支付</p>
              </div>
            </div>
          </div>
          <i-load-more v-show="hasMore" :tip="hasMore?'数据加载中':'暂无更多订单'" :loading="hasMore"/>
        </div>
      </van-tab>

      <!-- <van-tab title="待确认">
        <div class="order_list_null">
          <img class="default_pic" mode="widthFix" :src="noOrderPic">
          <p>目前没有任何订单</p>
        </div>
      </van-tab>-->

      <van-tab title="待服务">
        <div class="order_list_null" v-show="orderList.length==0">
          <img class="default_pic" mode="widthFix" :src="noOrderPic">
          <p>目前没有任何订单</p>
        </div>

        <div class="order_container" v-show="orderList.length>0">
          <div class="order_list" v-for="(item,index) in orderList" :key="index">
            <div class="order_header">
              <span>{{item.createTime}}</span>
              <p>{{item.statusStr}}</p>
            </div>
            <div class="order_content">
              <img @click="toDetail(item)" class="order_img" mode="widthFix" :src="item.productImg">
              <!-- 礼包 -->
              <div class="right_content" v-if="item.indentType==0">
                <h3>{{item.productPackageName}}</h3>
                <p>省{{item.money-item.payMoney}}元</p>
                <div class="order_price">
                  <i>{{item.money}}元/{{item.priceUnitStr}}</i>
                  <em>X1</em>
                </div>
              </div>
              <!-- 小时工 -->
              <div class="right_content" v-if="item.indentType!=0">
                <h3>{{item.productName}}</h3>
                <p style="padding-top:40px;"></p>
                <div class="order_price">
                  <i>{{item.price}}元/{{item.priceUnitStr}}</i>
                  <em>X{{item.servicesNum}}</em>
                </div>
              </div>
            </div>
            <div class="order_footer">
              <!-- 预付款或礼包 -->
              <div class="footer_price" v-if="item.indentWaitPayType==1||item.indentWaitPayType==4">
                合计：
                <span>
                  {{item.payMoney}}
                  <i>元</i>
                </span>
              </div>
              <!-- 后付款 -->
              <div
                class="footer_price"
                v-if="item.indentWaitPayType==0||item.indentWaitPayType==2||item.indentWaitPayType==3"
              >
                合计：
                <span>
                  {{item.indentWaitPayMoney}}
                  <i>元</i>
                </span>
              </div>
              <div class="footer_btns">
                <p @click="callCustomerService" class="right_btn">联系客服</p>
                <!-- toAppoin(item) -->
                <p
                  v-if="item.servicesNum!=item.useServicesNum&&item.indentType==0"
                  @click="toPackageDetails(item.id)"
                  class="left_btn"
                >预约服务</p>
                <!-- == -->
                <p
                  v-if="(item.servicesNum==item.useServicesNum&&item.indentType==0)||item.indentType!=0"
                  @click="toPackageDetails(item.id)"
                  class="left_btn"
                >查看服务</p>
              </div>
            </div>
          </div>
          <i-load-more :tip="hasMore?'数据加载中':'暂无更多订单'" :loading="hasMore"/>
        </div>
      </van-tab>

      <van-tab title="已完成">
        <div class="order_list_null" v-show="orderList.length==0">
          <img class="default_pic" mode="widthFix" :src="noOrderPic">
          <p>目前没有任何订单</p>
        </div>

        <div class="order_container" v-show="orderList.length>0">
          <div class="order_list" v-for="(item,index) in orderList" :key="index">
            <div class="order_header">
              <span>{{item.createTime}}</span>
              <p>{{item.statusStr}}</p>
            </div>
            <div class="order_content">
              <img @click="toDetail(item)" class="order_img" mode="widthFix" :src="item.productImg">
              <!-- 礼包 -->
              <div class="right_content" v-if="item.indentType==0">
                <h3>{{item.productPackageName}}</h3>
                <p>省{{item.money-item.payMoney}}元</p>
                <div class="order_price">
                  <i>{{item.money}}元/{{item.priceUnitStr}}</i>
                  <em>X1</em>
                </div>
              </div>
              <!-- 小时工 -->
              <div class="right_content" v-if="item.indentType!=0">
                <h3>{{item.productName}}</h3>
                <p style="padding-top:40px;"></p>
                <div class="order_price">
                  <i>{{item.price}}元/{{item.priceUnitStr}}</i>
                  <em v-text="'X'+(item.servicesNum*item.everyTimeDuration)"></em>
                </div>
              </div>
            </div>
            <div class="order_footer">
              <!-- 预付款或礼包 -->
              <div class="footer_price" v-if="item.indentWaitPayType==1||item.indentWaitPayType==4">
                合计：
                <span>
                  {{item.payMoney}}
                  <i>元</i>
                </span>
              </div>
              <!-- 后付款 -->
              <div
                class="footer_price"
                v-if="item.indentWaitPayType==0||item.indentWaitPayType==2||item.indentWaitPayType==3"
              >
                合计：
                <span>
                  {{item.indentWaitPayMoney}}
                  <i>元</i>
                </span>
              </div>
              <div class="footer_btns">
                <button @click="callCustomerService" class="right_btn">联系客服</button>
                <!-- <button @click="toAppoin(item.id)" class="left_btn">预约服务</button> -->
              </div>
            </div>
          </div>
          <i-load-more v-show="hasMore" :tip="hasMore?'数据加载中':'暂无更多订单'" :loading="hasMore"/>
        </div>
      </van-tab>

      <!-- <van-tab title="待评价">
        <div class="order_list_null">
          <img class="default_pic" mode="widthFix" :src="noOrderPic">
          <p>目前没有任何订单</p>
        </div>
      </van-tab>-->
    </van-tabs>
    <van-popup
      :show="picPop"
      custom-class="name_pop2"
      position="bottom"
      @close="picPop=false"
      close-on-click-overlay="true"
    >
      <div class="pic1" style="color:#BABABA;">400-888-8888</div>
      <div class="pic2" @click="callPhone">呼叫</div>
      <div @click="picPop=false" class="close_pop">取消</div>
    </van-popup>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { _getOrderList, _getToBePaidList } from "../../service/personal";
import { _timestampToTime } from "../../api/common";
export default {
  data() {
    return {
      noOrderPic: this.imgBastPath + "def_no_order.png",
      orderPic: this.imgBastPath + "order_pic.png",
      imgs: [
        this.imgBastPath + "icon_all.png",
        this.imgBastPath + "icon_confirmed.png",
        this.imgBastPath + "icon_serve.png",
        this.imgBastPath + "icon_pay.png",
        this.imgBastPath + "icon_evaluate2.png"
      ],
      picPop: false,
      activeIndex: 0,
      orderParams: {
        pageNumber: 1,
        pageSize: 5,
        status: "",
        payStatus: "",
        loading: true
      },
      toBePaidParams: {
        pageNumber: 1,
        pageSize: 5
      },
      orderList: [],
      toBePaidList: [],
      hasMore: true,
      loadShow: true,
      haSreach: true
    };
  },
  created() {},
  computed: {},
  onLoad(option) {
    this.loadShow = false;
    console.log("onLoad");
    this.initData();
    if (option.id) {
      this.activeIndex = Number(option.id);
      switch (this.activeIndex) {
        case 1:
          // 待支付列表
          // this.orderParams.status = "";
          this.orderParams.payStatus = 0;
          this.getOrderToBePaidList(this.toBePaidParams, "change");
          // this.getOrderList(this.orderParams, "change");
          break;
        case 2:
          this.orderParams.status = 2;
          this.orderParams.payStatus = "";
          this.getOrderList(this.orderParams, "change");
          break;
        case 3:
          this.orderParams.status = 5;
          this.orderParams.payStatus = "";
          this.getOrderList(this.orderParams, "change");
          break;
        default:
          break;
      }
    } else {
      this.activeIndex = 0;
      this.getOrderList(this.orderParams, "change");
    }
  },
  onShow() {
    if (this.loadShow) {
      switch (this.activeIndex) {
        // 全部
        case 0:
          this.initData();
          this.orderParams.status = this.orderParams.payStatus = "";
          this.getOrderList(this.orderParams, "change");
          break;
        case 1:
          // 待支付
          this.initData();
          // this.orderParams.status = "";
          this.orderParams.payStatus = 0;
          this.getOrderToBePaidList(this.toBePaidParams, "change");
          // this.getOrderList(this.orderParams, "change");
          break;
        case 2:
          // 待服务
          this.initData();
          this.orderParams.status = 2;
          this.orderParams.payStatus = "";
          this.getOrderList(this.orderParams, "change");
          break;
        case 3:
          // 已完成
          this.initData();
          this.orderParams.status = 5;
          this.orderParams.payStatus = "";
          this.getOrderList(this.orderParams, "change");
          break;
        default:
          break;
      }
    }
    // 重置data 完成初始化
    // Object.assign(this.$data, this.$options.data());
  },
  onHide() {
    this.loadShow = true;
  },
  methods: {
    // changeActive(index) {
    //   this.activeIndex = index;
    // },
    initData() {
      // this.orderList = [];
      this.orderParams.pageNumber = 1;
      this.toBePaidParams.pageNumber = 1;
      this.hasMore = true;
    },
    toPay(item) {
      // if (item.priceUnit != 0) {
      //   // 经理端 支付页
      //   let url = `../order_payment2/main?id=${item.id}`;
      //   wx.navigateTo({ url });
      // } else {
      let url = `../order_payment/main?id=${item.id}`;
      wx.navigateTo({ url });
      // }
    },
    getOrderList(params, flag) {
      let _this = this;
      _getOrderList(params).then(res => {
        if (res.data.success) {
          let page = res.data.data.page;
          if (this.orderParams.pageNumber < page.totalPage) {
            this.haSreach = true;
          } else {
            this.haSreach = false;
          }
          let baseUrl = res.data.data.baseUrl;
          let resData = res.data.data.list;
          // resData.forEach(val => {
          //   val.createTime = _timestampToTime(val.createTime);
          //   val.updateTime = _timestampToTime(val.updateTime);
          // });
          if (this.orderParams.pageNumber == page.totalPage) {
            _this.hasMore = false;
          }
          resData.forEach(val => {
            val.productImg = baseUrl + val.productImg;
          });
          if (flag == "change") {
            _this.orderList = [];
            _this.orderList = resData;
          } else {
            _this.orderList = _this.orderList.concat(resData);
          }
          // console.log(_this.orderList);
        }
      });
    },
    getOrderToBePaidList(params, flag) {
      let _this = this;
      _getToBePaidList(params).then(res => {
        if (res.data.success) {
          let page = res.data.data.page;
          if (this.toBePaidParams.pageNumber < page.totalPage) {
            this.haSreach = true;
          } else {
            this.haSreach = false;
          }
          let baseUrl = res.data.data.baseUrl;
          let resData = res.data.data.list;
          if (this.toBePaidParams.pageNumber == page.totalPage) {
            _this.hasMore = false;
          }
          resData.forEach(val => {
            val.productSmallImg = baseUrl + val.productSmallImg;
          });
          if (flag == "change") {
            _this.toBePaidList = [];
            _this.toBePaidList = resData;
          } else {
            _this.toBePaidList = _this.toBePaidList.concat(resData);
          }
        }
      });
    },
    changeOrderList(e) {
      let tabIndex = e.mp.detail.index;
      this.activeIndex = tabIndex;
      this.hasMore = true;
      switch (tabIndex) {
        case 0:
          this.initData();
          this.orderParams.status = this.orderParams.payStatus = "";
          this.getOrderList(this.orderParams, "change");
          break;
        case 1:
          // 待支付
          this.initData();
          // this.orderParams.status = "";
          this.orderParams.payStatus = 0;
          // this.getOrderList(this.orderParams, "change");
          this.getOrderToBePaidList(this.toBePaidParams, "change");
          break;
        case 2:
          this.initData();
          this.orderParams.status = 2;
          this.orderParams.payStatus = "";
          this.getOrderList(this.orderParams, "change");
          break;
        case 3:
          this.initData();
          this.orderParams.status = 5;
          this.orderParams.payStatus = "";
          this.getOrderList(this.orderParams, "change");
          break;
        // case 4:
        //   break;
        default:
          console.log("default");
          break;
      }
    },
    toDetail2(item) {
      let url = `../to_be_paid/main?id=${item.indentId}`;
      wx.navigateTo({ url });
    },
    toDetail(item) {
      // indentWaitPayStatus  1待支付 2已支付 3超时
      // console.log(item.indentWaitPayStatus);
      console.log(item);
      // 待支付
      if (item.indentWaitPayStatus == 1) {
        let url = `../to_be_paid/main?id=${item.id}`;
        wx.navigateTo({ url });
        return;
      }
      // 订单超时 已取消页面
      if (item.indentWaitPayStatus == 3) {
        let url = `../cancelled_detail/main?id=${item.id}`;
        wx.navigateTo({ url });
        return;
      }
      // 已完成页面
      if (item.status == 3 || item.status == 5) {
        let url = `../order_fulfillment/main?id=${item.id}`;
        wx.navigateTo({ url });
        return;
      }
      // 服务已生效页面  item.status == 0 || item.status == 1 ||
      if (item.status == 2) {
        // if (item.indentType == 0) {
        //   // 礼包
        // } else if (item.indentType == 1) {
        //   // 周结算
        // } else if (item.indentType == 2) {
        //   // 月结
        // }
        let url = `../order_detail/main?orderId=${item.id}`;
        wx.navigateTo({ url });
        return;
      }
    },
    callPhone() {
      wx.makePhoneCall({
        phoneNumber: "400-888-8888"
      });
    },
    callCustomerService() {
      wx.makePhoneCall({
        phoneNumber: "400-888-8888"
      });
      // this.picPop = true;
    },
    toPackageDetails(id) {
      // let url = `../date_selection/main?orderId=${id}&from=myOrder`;
      let url = `../package_details/main?orderId=${id}`;
      wx.navigateTo({ url });
    },
    toAppoin(item) {
      let url = `../date_selection/main?orderId=${item.id}&from=myOrder`;
      wx.navigateTo({ url });
    },
    orderSubmits() {
      if (true) {
        let url = `../service_evaluation/main`;
        wx.navigateTo({ url });
      }
    }
  },
  // 上拉加载
  onReachBottom: function() {
    if (this.haSreach) {
      if (this.orderParams.payStatus === "") {
        this.orderParams.pageNumber++;
        this.getOrderList(this.orderParams);
        return;
      }
      if (this.orderParams.payStatus === 0) {
        this.toBePaidParams.pageNumber++;
        this.getOrderToBePaidList(this.toBePaidParams);
        return;
      }
    }
  },
  //下拉刷新
  onPullDownRefresh() {
    this.initData();
    if (this.orderParams.payStatus === "") {
      this.getOrderList(this.orderParams, "change");
      return;
    }
    if (this.orderParams.payStatus === 0) {
      this.getOrderToBePaidList(this.toBePaidParams, "change");
      return;
    }
    wx.stopPullDownRefresh(); // 通知页面停止下拉刷新效果
  }
};
</script>

<style lang="less" scoped>
</style>
