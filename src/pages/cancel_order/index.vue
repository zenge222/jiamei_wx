<template>
  <div class="order_detail">
    <div class="detail_header">
      <h3>已取消</h3>
    </div>
    <div class="order_address">
      <div class="address_info">
        <h3>
          王先生
          <span>1305677778</span>
        </h3>
        <p>浙江省宁波市江东区 兴民路222号鹤城新村2幢2号402室</p>
      </div>
      <i-icon custom-class="right_icon" color="#868686" type="enter"/>
    </div>
    <div class="remarks_box">
      <div class="remarks">
        <p>订单备注</p>
        <span>打扫的干净点</span>
      </div>
    </div>
    <!-- card header-->
    <div class="order_card" style="border-bottom:1px solid #EFEFEF;">
      <img class="card_img" mode="widthFix" :src="'../../static/images/pay_pop_product.png'">
      <div class="card_right">
        <div class="card_title">
          <span>星级家·保洁套餐</span>
          <span>￥250</span>
        </div>
        <p>4次日常保洁</p>
        <p>X1</p>
      </div>
    </div>
    <!-- card price -->
    <div class="price_content">
      <div class="list_content">
        <div class="price_list">
          <span>商品总价</span>
          <p>￥250</p>
        </div>
        <div class="price_list">
          <span>折扣</span>
          <p>￥50</p>
        </div>
      </div>
      <div class="end_totle">
        <span>实际应付</span>
        <p>￥200</p>
      </div>
    </div>
    <!-- order other info -->
    <div class="other_info">
      <div>
        <span>订单编号：</span>
        <span>123456789123456</span>
        <button>复制</button>
      </div>
      <div>
        <span>下单时间：</span>
        <span>2019年04月16日 17:51:01</span>
      </div>
      <div>
        <span>支付时间：</span>
        <span>2019年04月16日 18:00:01</span>
      </div>
      <div>
        <span>支付方式：</span>
        <span>微信支付</span>
      </div>
    </div>
    <!-- 联系客服 -->
    <div class="contact">
      <span>联系客服</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "order_detail",
  data() {
    return {};
  },
  computed: {},
  onLoad() {},
  onShow() {},
  onHide() {
    // 重置data 完成初始化
    Object.assign(this.$data, this.$options.data());
  },
  methods: {
    // toPackageDetails() {
    //   let url = `../package_details/main`;
    //   wx.navigateTo({ url });
    // }
  }
};
</script>

<style lang="less" scoped>
</style>