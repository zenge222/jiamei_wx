<template>
  <div class="user_agreement">
    <div class="head_item">
      <h3>用户服务协议</h3>
      <p v-text="userAgreement.version"></p>
    </div>
    <div class="list_item" v-for="(item,index) in userAgreement.typeList" :key="index">
      <h3 v-text="item.title"></h3>
      <p v-for="(item2,index2) in item.list" :key="index2" v-text="item2"></p>
    </div>
  </div>
</template>

<script>
import agreement from "../../api/agreementText.js";
export default {
  name: "userAgreement",
  data() {
    return {
      userAgreement: agreement.userText
    };
  },
  computed: {},
  onLoad() {
    console.log(this.userAgreement);
  },
  onShow() {},
  onHide() {
    // 重置data 完成初始化
    Object.assign(this.$data, this.$options.data());
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.user_agreement {
  font-size: 12px;
  background: #fff;
  padding: 20px 10px 50px 10px;
  .head_item {
    h3 {
      font-size: 20px;
      line-height: 1;
      padding-bottom: 10px;
      text-align: center;
    }
    p {
      text-align: right;
      font-size: 14px;
      padding-top: 10px;
    }
  }
  .list_item {
    padding-top: 10px;
    h3 {
      font-size: 14px;
    }
    p {
    }
  }
}
</style>