<template>
  <div class="service_agreement">
    <div class="head_item">
      <h3>“保洁服务”说明</h3>
      <p>尊敬的客户：</p>
      <p
        v-text="'感谢您订购嘉美美家“'+agreementText[getParams.num1].typeList[getParams.num2].type+'”服务（以下简称“本服务”）。本服务为了更好地使用本套餐，请仔细阅读本服务说明，如您无法认可本服务说明的内容，请您退出后取消支付，如您已完成支付，则视为您认可本服务说明。'"
      ></p>
    </div>
    <div
      class="list_item"
      v-for="(item,index) in agreementText[getParams.num1].typeList[getParams.num2].list"
      :key="index"
    >
      <h3 v-text="item.title"></h3>
      <p v-for="(list,key) in item.text" :key="key" v-text="list"></p>
    </div>
  </div>
</template>

<script>
import agreement from "../../api/agreementText.js";
export default {
  name: "serviceAgreement",
  data() {
    return {
      agreementText: agreement.agreementText,
      getParams: {
        num1: 0,
        num2: 0
      }
    };
  },
  components: {},
  computed: {},
  onLoad(option) {
    this.getParams.num1 = option.num1;
    this.getParams.num2 = option.num2;
    console.log(option);
    console.log(this.agreementText);
  },
  onShow() {},
  onHide() {
    // 重置data 完成初始化
    // Object.assign(this.$data, this.$options.data());
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.service_agreement {
  font-size: 12px;
  background: #fff;
  padding: 20px 10px 50px 10px;
  .head_item {
    h3 {
      font-size: 16px;
    }
  }
  .list_item {
    padding-top: 10px;
    h3 {
      font-size: 14px;
    }
  }
}
</style>