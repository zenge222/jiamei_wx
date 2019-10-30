<template>
  <div class="my_evaluation">
    <div class="evaluation_list">
      <!-- <div class="header_title">
        订单号：
        <span>33216546546565165165156</span>
      </div>-->
      <div class="product_card">
        <img :src="cardImg" mode="widthFix" />
        <div class="carf_right">
          <h3>{{servicesData.indent.productName}}</h3>
          <p>￥{{servicesData.indent.payMoney}}</p>
        </div>
      </div>
      <div class="card_footer_box">
        <div class="card_footer" v-for="(item,index) in servicesData.list" :key="index">
          <div class="footer_title">
            <i>{{index+1}}</i>
            <span>{{item.content}}</span>
          </div>
          <div class="footer_date">
            <div class="date_rate">
              <van-rate
                custom-class="rate_a"
                icon-class="rate_b"
                :value="item.score"
                :size="'12'"
                :count="'5'"
                readonly="true"
              />
              <span>{{item.score}}分</span>
            </div>
            <p>
              {{item.createTime}}
              <!-- 2019-04-29
              <span>12:00</span>-->
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { _getServicesList } from "../../service/personal";
export default {
  name: "my_evaluation",
  data() {
    return {
      cardImg: this.imgBastPath + "def_product.png",
      servicesParams: {
        indentId: "",
        pageNumber: 1,
        pageSize: 99,
        loading: true
      },
      servicesData: {
        indent: {
          productImg: "",
          productName: "",
          productPackageName: ""
        },
        list: []
      }
    };
  },
  computed: {},
  onLoad(option) {
    this.servicesParams.indentId = option.id;
    this.getDataList();
  },
  onReady() {},
  onShow() {},
  onHide() {
    // 重置data 完成初始化
    // Object.assign(this.$data, this.$options.data());
  },
  methods: {
    getDataList() {
      let _this = this;
      _getServicesList(this.servicesParams).then(res => {
        if (res.data.success) {
          let bastPath = res.data.data.baseUrl;
          let resData = res.data.data;
          resData.indent.productImg = bastPath + resData.indent.productImg;
          _this.servicesData = resData;
        }
      });
    }
  }
};
</script>

<style scoped>
</style>