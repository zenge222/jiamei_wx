<template>
  <div class="protocol_service">
    <div class="list-container">
      <!-- <div class="list_item">
        <p>保洁类</p>
        <ul>
          <li>
            <i-icon color="#EB5D2A" size="18" type="document" />
            <span>餐宴类服务协议</span>
          </li>
          <li>
            <i-icon color="#EB5D2A" size="18" type="document" />
            <span>插花类服务协议</span>
          </li>
          <li>
            <i-icon color="#EB5D2A" size="18" type="document" />
            <span>保洁类服务协议</span>
          </li>
        </ul>
      </div>-->
      <div class="list_item" v-for="(item,index) in agreementText" :key="index">
        <p v-text="item.bigType"></p>
        <ul>
          <li v-for="(list,index2) in item.typeList" :key="index2" @click="toDetail(index,index2)">
            <i-icon color="#EB5D2A" size="18" type="document" />
            <span v-text="'嘉美'+list.type+'类服务协议'"></span>
          </li>
        </ul>
      </div>

      <div class="list_item">
        <p>用户协议</p>
        <ul>
          <li @click="toDetail2">
            <i-icon color="#EB5D2A" size="18" type="document" />
            <span>嘉美用户协议</span>
          </li>
        </ul>
      </div>
      <!-- 
      <div class="list_item">
        <p>小时工类</p>
        <ul>
          <li>
            <i-icon color="#EB5D2A" size="18" type="document"/>
            <span>家美小时工类用户协议</span>
          </li>
          <li>
            <i-icon color="#EB5D2A" size="18" type="document"/>
            <span>家美小时工类用户协议</span>
          </li>
        </ul>
      </div>-->
    </div>
  </div>
</template>

<script>
import agreement from "../../api/agreementText.js";
export default {
  name: "protocol_service",
  data() {
    return {
      agreementText: agreement.agreementText
    };
  },
  computed: {},
  onLoad() {
    console.log(agreement);
  },
  onShow() {},
  onHide() {
    // 重置data 完成初始化
    Object.assign(this.$data, this.$options.data());
  },
  methods: {
    toDetail(num1, num2) {
      let url = `../service_agreement/main?num1=${num1}&num2=${num2}`;
      wx.navigateTo({ url });
    },
    toDetail2() {
      let url = `../user_agreement/main`;
      wx.navigateTo({ url });
    }
  }
};
</script>

<style scoped>
</style>