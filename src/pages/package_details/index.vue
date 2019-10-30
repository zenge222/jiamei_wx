<template>
  <div class="package_details">
    <div class="meal_card">
      <div class="card_header">
        <h3 v-if="packageData.indentType==0">{{packageData.productPackageName}}</h3>
        <h3 v-if="packageData.indentType!=0">{{packageData.productName}}</h3>
        <p>已激活</p>
      </div>
      <div class="contacts_info">
        <div class="contacts_item">
          <p>联系人：</p>
          <span>{{packageData.linkName}}</span>
        </div>
        <div class="contacts_item">
          <p>联系电话：</p>
          <span>{{packageData.linkPhone}}</span>
        </div>
        <div class="contacts_item">
          <p>服务地址：</p>
          <span>{{packageData.areaText}} {{packageData.address}}</span>
        </div>
      </div>
      <div class="decorate_garden">
        <p>
          <span></span>
        </p>
        <p>
          <span></span>
        </p>
        <p>
          <span></span>
        </p>
        <p>
          <span></span>
        </p>
        <p>
          <span></span>
        </p>
        <p>
          <span></span>
        </p>
        <p>
          <span></span>
        </p>
        <p>
          <span></span>
        </p>
        <p>
          <span></span>
        </p>
        <p>
          <span></span>
        </p>
        <p>
          <span></span>
        </p>
      </div>
      <div class="card_count">
        <h3>服务工单次数</h3>
        <p @click="toServiceDetail">
          <span>查看服务明细</span>
          <i-icon color="#868686" type="enter"/>
        </p>
      </div>
      <div class="used_count">
        <div class="used_list">
          <p>总次数</p>
          <span>{{packageData.servicesNum}}</span>
        </div>
        <div class="used_list">
          <p>已使用</p>
          <span>{{packageData.useServicesNum}}</span>
        </div>
        <div class="used_list">
          <p>未使用</p>
          <span>{{packageData.hasServicesNum}}</span>
        </div>
      </div>
      <div class="card_btns">
        <button
          v-if="packageData.hasServicesNum!=0&&packageData.indentType==0"
          @click="toAppoin"
        >预约服务</button>
        <button @click="toOrder">返回订单</button>
      </div>
      <div class="decorate_left"></div>
      <div class="decorate_right"></div>
    </div>
  </div>
</template>

<script>
import { _getWorkTime } from "../../service/detail";
export default {
  name: "package_details",
  data() {
    return {
      orderId: "",
      packageData: {
        productPackageName: "",
        indentType: 0,
        linkName: "",
        linkPhone: "",
        areaText: "",
        address: "",
        id: "",
        servicesNum: 0,
        useServicesNum: 0,
        hasServicesNum: 0
      }
    };
  },
  computed: {},
  onLoad(option) {
    console.log(option);
    if (option.orderId) {
      this.orderId = option.orderId;
    }
  },
  onShow() {
    let _this = this;
    if (this.orderId) {
      let params = {
        indentId: this.orderId
      };
      _getWorkTime(params).then(res => {
        if (res.data.success) {
          let resData = res.data.data.indent;
          // let workTimeCount = res.data.data.workDays.length;
          _this.packageData = resData;
          // _this.packageData.useServicesNum = workTimeCount;
          _this.packageData.hasServicesNum =
            _this.packageData.servicesNum - _this.packageData.useServicesNum;
          console.log(_this.packageData.hasServicesNum);
        }
      });
      // console.log(_this.packageData.hasServicesNum);
    }
  },
  onHide() {
    // 重置data 完成初始化
    // Object.assign(this.$data, this.$options.data());
  },
  methods: {
    toServiceDetail() {
      let url = `../service_detail/main?indentId=${this.packageData.id}`;
      wx.navigateTo({ url });
    },
    toAppoin() {
      let url = `../date_selection/main?orderId=${this.orderId}&from=package`;
      wx.navigateTo({ url });
    },
    toOrder() {
      let url = `../my_order/main`;
      wx.navigateBack({ url });
    }
  }
};
</script>

<style lang="less" scoped>
</style>