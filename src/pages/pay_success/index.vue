<template>
  <div class="pay_success">
    <div class="success_info">
      <img mode="widthFix" :src="paySuccess" />
      <p style="font-size:20px;">订单支付成功</p>
      <p style="font-size:20px;">
        ¥
        <span style="font-size:25px;">{{payMoney}}</span>
      </p>
      <!-- <p style="font-size:14px;color:#999;">进入订单详情可修改服务时间哦</p> -->
      <div class="success_buttons">
        <button @click="toOrderDetail" class="btn">查看订单详情</button>
        <button v-if="indentType==0" @click="toSubscribe" class="btn">立即预约服务</button>
        <button v-if="indentType!=0" @click="toSeeServices" class="btn">查看服务</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      payMoney: 0,
      orderId: null,
      paySuccess: this.imgBastPath + "pay_success.png",
      indentType: -1
    };
  },
  created() {},
  computed: {},
  onLoad(option) {
    this.payMoney = Number(option.money).toFixed(2);
    this.orderId = option.id;
    this.indentType = option.indentType;
    console.log(this.orderId);
  },
  onHide() {
    // 重置data 完成初始化
    // Object.assign(this.$data, this.$options.data());
  },
  methods: {
    toOrderDetail() {
      let url = `../order_detail/main?orderId=${this.orderId}`;
      wx.navigateTo({ url });
    },
    //
    toSubscribe() {
      // let url = `../successful_appointment/main`;
      let url = `../date_selection/main?orderId=${
        this.orderId
      }&from=paySuccess`;
      wx.navigateTo({ url });
    },
    toSeeServices() {
      let url = `../package_details/main?orderId=${this.orderId}`;
      wx.navigateTo({ url });
    }
  }
};
</script>

<style lang="less" scoped>
</style>
