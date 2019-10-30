<template>
  <div class="order_payment">
    <div class="order_number">
      <p>
        订单号：
        <span>{{orderSubmitInfo.indentNum}}</span>
      </p>
    </div>
    <div class="order_card">
      <img class="card_img" mode="widthFix" :src="orderSubmitInfo.productImg">
      <div class="card_right">
        <div class="card_title">
          <span>{{orderSubmitInfo.productPackageName}}</span>
          <span>￥{{orderSubmitInfo.payMoney}}</span>
        </div>
        <!-- order_payment -->
        <div class="original_price">
          <!-- <p>{{orderSubmitInfo.servicesNum}}次{{orderSubmitInfo.productPackageName}}</p> -->
          <p v-text="orderSubmitInfo.productPackageIntro"></p>
          <em>￥{{orderSubmitInfo.money}}</em>
        </div>
        <p></p>
      </div>
    </div>
    <div class="list_group">
      <div class="list_box">
        <p>商品总金额</p>
        <div class="right">
          <span>￥{{orderSubmitInfo.money}}</span>
        </div>
      </div>
      <!-- <div class="list_box">
        <p>折扣金额</p>
        <div class="right">
          <span>-￥50</span>
        </div>
      </div>-->
    </div>
    <div class="list_group">
      <div class="list_box">
        <p>支付金额</p>
        <div class="right">
          <span style="color:#333;">￥{{orderSubmitInfo.payMoney}}</span>
        </div>
      </div>
    </div>
    <div class="list_group">
      <div class="list_box" style="border-bottom:1px solid #EFEFEF">
        <p>第三方支付</p>
        <div class="right">
          <span style="color:#EB5D2A;">￥{{orderSubmitInfo.payMoney}}.00</span>
        </div>
      </div>
      <!-- <div class="pay_mode">
        <div class="left_mode">
          <img mode="widthFix" :src="'../../static/images/icon_wx_payment.png'">
          <span>微信支付</span>
        </div>
        <van-radio checked-color="#EB5D2A"></van-radio>
        <van-radio checked-color="#EB5D2A"></van-radio>
      </div>-->
      <van-radio-group :value="radio" @change="radioChange">
        <van-cell-group>
          <van-cell custom-class="cell_pay" title="微信支付" clickable data-name="1" @click="clicka1">
            <img class="pay_img" mode="widthFix" :src="iconWxPayment">
            <van-radio checked-color="#EB5D2A" name="1"/>
          </van-cell>
          <!-- <van-cell  custom-class="cell_pay" title="支付宝" clickable data-name="2" @click="clicka2">
            <van-radio checked-color="#EB5D2A" name="2"/>
          </van-cell>-->
        </van-cell-group>
      </van-radio-group>
    </div>
    <div class="bottom_btn_box">
      <van-button @click="paySubmit" custom-class="login_btn" size="normal">确认支付</van-button>
    </div>
    <toLoginPopup :showPop.sync="login_pop_show"></toLoginPopup>
  </div>
</template>

<script>
import { _wxPayOrder } from "../../service/detail";
import {
  _getOrderDetailInfo,
  _submitPayment,
  _sendPayBack
} from "../../service/detail";
import { mapState, mapActions } from "vuex";
import toLoginPopup from "../../components/toLoginPopup";
export default {
  name: "order_payment",
  data() {
    return {
      pay_pop_product: this.imgBastPath + "pay_pop_product.png",
      iconWxPayment: this.imgBastPath + "icon_wx_payment.png",
      radio: "1",
      orderSubmitInfo: {
        indentNum: "",
        id: "",
        money: 0,
        payMoney: 0,
        productImg: "",
        productPackageName: ""
      },
      login_pop_show: false
    };
  },
  computed: {
    ...mapState({
      phoneLoginInfo: state => state.login.phoneLoginInfo
    })
  },
  components: {
    toLoginPopup
  },
  onLoad(option) {
    // this.orderId = option.id;
    let params = {
      id: option.id
    };
    this.getDetail(params);
  },
  onShow() {},
  onHide() {
    // 重置data 完成初始化
    // Object.assign(this.$data, this.$options.data());
  },
  methods: {
    getDetail(params) {
      let _this = this;
      _getOrderDetailInfo(params).then(res => {
        if (res.data.success) {
          console.log(2);
          console.log(res);
          _this.orderSubmitInfo = res.data.data.indent;
          console.log(_this.orderSubmitInfo);
          _this.orderSubmitInfo.productImg =
            res.data.data.baseUrl + _this.orderSubmitInfo.productImg;
        }
      });
    },
    clicka1() {
      this.radio = "1";
    },
    clicka2() {
      this.radio = "2";
    },
    radioChange(e) {
      this.radio = e.mp.detail;
    },
    paySubmit() {
      let _this = this;
      if (this.phoneLoginInfo.phoneNum) {
        let params = {
          indentId: this.orderSubmitInfo.id
        };
        let price = this.orderSubmitInfo.payMoney;
        _wxPayOrder(params).then(res => {
          console.log(res);
          let wxParams = res.data.data.payObj;
          wx.requestPayment({
            timeStamp: wxParams.timeStamp,
            nonceStr: wxParams.nonceStr,
            package: wxParams.package,
            signType: "MD5",
            paySign: wxParams.paySign,
            success: function(res) {
              console.log(res);
              let params = {
                id: _this.orderSubmitInfo.id
              };
              let url = `../pay_success/main?money=${
                _this.orderSubmitInfo.payMoney
              }&id=${_this.orderSubmitInfo.id}`;
              wx.redirectTo({ url });
            },
            fail: function(res) {
              wx.showToast({
                title: "支付失败",
                icon: "none",
                duration: 2000
              });
            }
          });
        });
      } else {
        this.login_pop_show = true;
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>