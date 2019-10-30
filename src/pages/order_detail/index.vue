<template>
  <div class="order_detail">
    <div class="detail_header">
      <h3>待服务</h3>
      <!-- <p>可点击【查看服务】查看相关服务信息</p> -->
    </div>
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
    <div class="remarks_box" v-if="orderSubmitInfo.remark!==''">
      <div class="remarks">
        <p>订单备注</p>
        <span>{{orderSubmitInfo.remark}}</span>
      </div>
    </div>
    <!-- <div class="services_detail" v-if="orderSubmitInfo.indentType!=0" @click="toPackage_details">
      <div class="services_item">
        <p>服务详情</p>
        <i-icon class="right_icon" color="#868686" type="enter"/>
      </div>
    </div>-->
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
        <p v-text="'X'+(orderSubmitInfo.everyTimeDuration*orderSubmitInfo.servicesNum)"></p>
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
          <p>￥{{orderSubmitInfo.money-orderSubmitInfo.payMoney}}</p>
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
        <span>{{orderSubmitInfo.indentNum}}</span>
        <button @click="copyText">复制</button>
      </div>
      <div>
        <span>下单时间：</span>
        <span>{{orderSubmitInfo.createTime}}</span>
      </div>
      <div v-if="orderSubmitInfo.indentWaitPayType==4||orderSubmitInfo.indentWaitPayType==1">
        <span>支付时间：</span>
        <span>{{orderSubmitInfo.indentWaitPayEndPayTime}}</span>
      </div>
      <div v-if="orderSubmitInfo.indentWaitPayType==4||orderSubmitInfo.indentWaitPayType==1">
        <span>支付方式：</span>
        <span>微信支付</span>
      </div>
      <div
        v-if="orderSubmitInfo.indentWaitPayType==0||orderSubmitInfo.indentWaitPayType==2||orderSubmitInfo.indentWaitPayType==3"
      >
        <span>付款类型：</span>
        <div class="type_item">
          <i>后付款</i>
          <em v-if="orderSubmitInfo.trialNum">(试用{{orderSubmitInfo.trialNum}}次)</em>
        </div>
      </div>
      <div
        v-if="orderSubmitInfo.indentWaitPayType==0||orderSubmitInfo.indentWaitPayType==2||orderSubmitInfo.indentWaitPayType==3"
      >
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
    <!-- 后付款待处理 -->

    <!-- 联系客服 -->
    <!-- picPop=true -->
    <!--  v-if="orderSubmitInfo.servicesNum!=orderSubmitInfo.useServicesNum" -->
    <div class="contact" @click="toCallPhone">
      <span>联系客服</span>
    </div>
    <!-- footer -->
    <div :class="{'service_bar':true,'fix-iphonex-buttom':isIphoneX}">
      <!-- <p v-if="orderSubmitInfo.servicesNum!=orderSubmitInfo.useServicesNum" @click="toAppoin">预约服务</p> -->
      <!--  v-if="orderSubmitInfo.servicesNum==orderSubmitInfo.useServicesNum" -->
      <p @click="toPackageDetails(orderSubmitInfo.id)">查看服务</p>
    </div>

    <!-- <phonePopup :showPop.sync="picPop" :phoneNumber="'400-888-8888'"></phonePopup> -->
  </div>
</template>

<script>
import phonePopup from "../../components/phonePopup";
import { _getOrderDetailInfo } from "../../service/detail";
import { _timestampToTime } from "../../api/common";
import { mapState, mapActions } from "vuex";
export default {
  name: "order_detail",
  data() {
    return {
      picPop: false,
      orderId: null,
      orderSubmitInfo: {
        linkName: "",
        linkPhone: "",
        address: "",
        remark: "",
        productPackageName: "",
        servicesNum: 0,
        money: 0,
        payMoney: 0,
        indentNum: "",
        createTime: "",
        updateTime: "",
        monthDay: 0,
        weekDay: 0,
        trialNum: null
      }
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
    this.orderId = option.orderId;
    this.getOrderInfo(this.orderId);
  },
  onShow() {},
  onHide() {
    // 重置data 完成初始化
    // Object.assign(this.$data, this.$options.data());
  },
  methods: {
    getOrderInfo(id) {
      let _this = this;
      let params = {
        id: id
      };
      _getOrderDetailInfo(params).then(res => {
        if (res.data.success) {
          let resData = res.data.data.indent;
          // let startTime = _timestampToTime(resData.createTime);
          // let endTime = _timestampToTime(resData.updateTime);
          // resData.createTime = startTime;
          // resData.updateTime = endTime;
          _this.orderSubmitInfo = resData;
          _this.orderSubmitInfo.productImg =
            res.data.data.baseUrl + _this.orderSubmitInfo.productImg;
          console.log(_this.orderSubmitInfo);
        }
      });
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
    toAppoin(item) {
      let url = `../date_selection/main?orderId=${
        this.orderSubmitInfo.id
      }&from=myOrder`;
      wx.navigateTo({ url });
    },
    toPackageDetails(id) {
      let url = `../package_details/main?orderId=${id}`;
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
  }
};
</script>

<style lang="less" scoped>
</style>