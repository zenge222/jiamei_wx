<template>
  <div class="order_detail">
    <div class="detail_header">
      <h3>待支付</h3>
      <p
        v-if="orderSubmitInfo.indentWaitPayType==1||orderSubmitInfo.indentWaitPayType==4 ||orderSubmitInfo.indentType==3"
      >剩余 {{orderTime}} 超时将取消订单请及时支付</p>
    </div>
    <!-- <div class="detail_header" v-if="overTime">
      <h3>已取消</h3>
    </div>-->
    <div class="order_address">
      <div class="address_info">
        <h3>
          {{orderSubmitInfo.linkName}}
          <span>{{orderSubmitInfo.linkPhone}}</span>
        </h3>
        <p
          v-if="orderSubmitInfo.indentType==0"
          v-text="orderSubmitInfo.provinceId+orderSubmitInfo.cityId+orderSubmitInfo.areaId+' '+orderSubmitInfo.areaText+orderSubmitInfo.address"
        ></p>
        <p
          v-if="orderSubmitInfo.indentType!=0"
          v-text="orderSubmitInfo.areaText+' '+orderSubmitInfo.address"
        ></p>
      </div>
      <!-- <i-icon custom-class="right_icon" color="#868686" type="enter"/> -->
    </div>
    <div class="remarks_box">
      <div class="remarks">
        <p>订单备注</p>
        <span>{{orderSubmitInfo.remark}}</span>
      </div>
    </div>
    <div class="services_detail" v-if="orderSubmitInfo.indentType!=0" @click="toPackage_details">
      <div class="services_item">
        <p>服务详情</p>
        <i-icon class="right_icon" color="#868686" type="enter" />
      </div>
    </div>
    <!-- card header-->
    <div class="order_card" style="border-bottom:1px solid #EFEFEF;">
      <img class="card_img" mode="widthFix" :src="orderSubmitInfo.productImg" />
      <!-- 礼包 -->
      <div class="card_right" v-if="orderSubmitInfo.indentType==0">
        <div class="card_title">
          <span>{{orderSubmitInfo.productPackageName}}</span>
          <span>￥{{orderSubmitInfo.money}}</span>
        </div>
        <p>{{orderSubmitInfo.productPackageIntro}}</p>
        <p>X1</p>
      </div>
      <!-- 小时工 -->
      <div class="card_right" v-if="orderSubmitInfo.indentType!=0">
        <div class="card_title">
          <span>{{orderSubmitInfo.productName}}</span>
          <span v-text="orderSubmitInfo.price+'/'+orderSubmitInfo.priceUnitStr"></span>
        </div>
        <p>{{orderSubmitInfo.productIntro}}</p>
        <p v-text="'X'+(orderSubmitInfo.servicesNum*orderSubmitInfo.everyTimeDuration)"></p>
      </div>
    </div>
    <!-- card price -->
    <div class="price_content">
      <div class="list_content">
        <div class="price_list">
          <span>商品总价</span>
          <p>￥{{orderSubmitInfo.money}}</p>
        </div>
        <div class="price_list" v-if="orderSubmitInfo.indentType==0">
          <span>折扣</span>
          <p v-text="'￥'+(orderSubmitInfo.money-orderSubmitInfo.payMoney)"></p>
        </div>
      </div>
      <div class="end_totle">
        <span>实际应付</span>
        <p>￥{{orderSubmitInfo.payMoney}}</p>
      </div>
    </div>
    <!-- order other info -->
    <div class="other_info">
      <div>
        <span>订单编号：</span>
        <span style="flex: 1;">{{orderSubmitInfo.indentNum}}</span>
        <button @click="copyText">复制</button>
      </div>
      <div>
        <span>下单时间：</span>
        <span>{{orderSubmitInfo.createTime}}</span>
      </div>
      <div v-if="orderSubmitInfo.indentWaitPayType==2||orderSubmitInfo.indentWaitPayType==3">
        <span>付款类型：</span>
        <div class="type_item">
          <i>后付款</i>
          <em v-if="orderSubmitInfo.trialNum">(试用{{orderSubmitInfo.trialNum}}次)</em>
        </div>
      </div>
      <div v-if="orderSubmitInfo.indentWaitPayType==2||orderSubmitInfo.indentWaitPayType==3">
        <span>支付周期：</span>
        <div class="type_item" v-if="orderSubmitInfo.indentWaitPayType==2">
          <i>周结</i>
          <em>(周{{orderSubmitInfo.weekDay}})</em>
        </div>
        <div class="type_item" v-if="orderSubmitInfo.indentWaitPayType==3">
          <i>月结</i>
          <em>({{orderSubmitInfo.monthDay}}日)</em>
        </div>
      </div>
    </div>
    <!-- 联系客服 -->
    <div class="contact">
      <span @click="toCallPhone">联系客服</span>
    </div>
    <!-- footer -->
    <div :class="{'service_bar':true,'fix-iphonex-buttom':isIphoneX}" v-if="!overTime">
      <!-- <p>取消订单</p> -->
      <p @click="toPay" class="to_pay">去支付</p>
    </div>

    <!-- <phonePopup :showPop.sync="picPop" :phoneNumber="'400-888-8888'"></phonePopup> -->
  </div>
</template>

<script>
import phonePopup from "../../components/phonePopup";
import { _getOrderDetailInfo } from "../../service/detail";
import { mapState, mapActions } from "vuex";
export default {
  name: "order_detail",
  data() {
    return {
      overTime: false,
      picPop: false,
      orderSubmitInfo: {
        linkName: "",
        linkPhone: "",
        address: "",
        id: "",
        remark: "",
        productPackageName: "",
        everyTimeDuration: 0,
        indentWaitPayType: null,
        servicesNum: 0,
        money: 0,
        payMoney: 0,
        indentNum: "",
        createTime: "",
        updateTime: "",
        provinceId: "",
        cityId: "",
        areaId: "",
        monthDay: 0,
        weekDay: 0,
        trialNum: null
      },
      orderTime: "",
      timeStamp: ""
    };
  },
  computed: {
    ...mapState({
      isIphoneX: state => state.login.isIphoneX
    })
  },
  components: {
    phonePopup
  },
  onLoad(option) {
    // 重置data 完成初始化
    Object.assign(this.$data, this.$options.data());
    console.log(option);
    this.getOrderInfo(option.id);
  },
  onShow() {
    // setInterval(function() {
    //   let createTime = 1559632440000 / 1000;
    //   let endTime = createTime + 900;
    //   let clientTime = Date.parse(new Date()) / 1000;
    //   let lastTime = endTime - clientTime;
    //   let lastPayTime = "";
    //   let int_minute;
    //   if (lastTime > 0) {
    //     int_minute = Math.floor(lastTime / 60);
    //     lastTime -= int_minute * 60;
    //     lastPayTime = int_minute + "分" + lastTime + "秒";
    //   } else {
    //   }
    //   console.log(lastPayTime);
    // }, 1000);
  },
  onHide() {},
  methods: {
    countTime() {
      var date = new Date();
      var now = date.getTime();
      //设置截止时间
      var endDate = new Date(this.timeStamp);
      var end = endDate.getTime();
      //时间差
      var leftTime = end - now;
      let d = 0,
        h = 0,
        m = 0,
        s = 0;
      // 定义变量 d,h,m,s保存倒计时的时间
      if (leftTime >= 0) {
        // d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
        h = Math.floor((leftTime / 1000 / 60 / 60) % 24);
        m = Math.floor((leftTime / 1000 / 60) % 60);
        s = Math.floor((leftTime / 1000) % 60);
        setTimeout(this.countTime, 1000);
      } else {
        this.overTime = true;
        // 订单支付超时待处理 跳转已取消页面
        // let url = `../cancelled_detail/main?id=${this.orderSubmitInfo.id}`;
        // wx.redirectTo({ url });
      }
      // console.log(`${d}天${h}:${m}:${s}`);
      this.orderTime = `${h}:${m}:${s}`;
      // console.log(this.orderTime)
      // 递归每秒调用countTime方法，显示动态时间效果
    },
    toCallPhone() {
      wx.makePhoneCall({
        phoneNumber: "400-888-8888"
      });
    },
    toPackage_details() {
      let url = `../package_details/main?orderId=${this.orderSubmitInfo.id}`;
      wx.navigateTo({ url });
    },
    getOrderInfo(id) {
      let _this = this;
      let params = {
        id: id
      };
      _getOrderDetailInfo(params).then(res => {
        if (res.data.success) {
          let resData = res.data.data.indent;

          _this.orderSubmitInfo = resData;
          _this.orderSubmitInfo.productImg =
            res.data.data.baseUrl + _this.orderSubmitInfo.productImg;
          _this.timeStamp = res.data.data.indent.indentWaitPayEndPayTime.replace(
            /-/g,
            "/"
          );
          // 非后付款  后付款试用待处理
          _this.orderSubmitInfo.trialNum = res.data.data.communicate.trialNum;
          if (
            resData.indentWaitPayType == 1 ||
            resData.indentWaitPayType == 4
          ) {
            _this.countTime();
          }
        }
      });
    },
    toPay() {
      let url = `../order_payment/main?id=${this.orderSubmitInfo.id}`;
      wx.navigateTo({ url });
    },
    copyText() {
      wx.setClipboardData({
        data: this.orderSubmitInfo.indentNum,
        success(res) {
          wx.getClipboardData({
            success(res) {
              console.log(res.data);
            }
          });
        }
      });
    }
    // toPackageDetails() {
    //   let url = `../package_details/main`;
    //   wx.navigateTo({ url });
    // }
  }
};
</script>

<style lang="less" scoped>
</style>