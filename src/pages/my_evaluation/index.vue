<template>
  <div class="my_evaluation">
    <van-tabs
      swipeable="true"
      animated="true"
      sticky="true"
      :custom-class="'order_tab'"
      :tab-class="'order_tabs'"
      :active="activeIndex"
      swipe-threshold="4"
      @change="onChange"
    >
      <van-tab title="待评价">
        <div style="padding-top:26px;">
          <div class="order_list_null" v-if="noneEvaluate.length==0">
            <img class="default_pic" mode="widthFix" :src="noOrderPic" />
            <p>目前没有任何评价</p>
          </div>

          <div
            class="evaluation_list"
            v-if="noneEvaluate.length>0"
            v-for="(item,index) in noneEvaluate"
            :key="index"
          >
            <div class="header_title">
              订单号：
              <span>{{item.indentNum}}</span>
            </div>
            <div class="product_card">
              <img :src="cardImg" mode="widthFix" />
              <div class="carf_right">
                <h3>{{item.productName}}</h3>
                <p>￥{{item.indentMoney}}</p>
              </div>
            </div>
            <div class="to_evaluate">
              <span>{{item.createTime}}</span>
              <p @click="toEvaluate(item)">评价</p>
            </div>
          </div>
          <i-load-more :tip="hasMore1?'数据加载中':'暂无更多评价'" :loading="hasMore1" />
        </div>
      </van-tab>

      <van-tab title="已评价">
        <div style="padding-top:26px;">
          <div class="order_list_null" v-if="hasEvaluate.length==0">
            <img class="default_pic" mode="widthFix" :src="noOrderPic" />
            <p>目前没有任何评价</p>
          </div>

          <div
            class="evaluation_list"
            v-if="hasEvaluate.length>0"
            v-for="(item,index) in hasEvaluate"
            :key="index"
          >
            <div class="header_title">
              订单号：
              <span>{{item.indentNum}}</span>
            </div>
            <div class="product_card">
              <img :src="cardImg" mode="widthFix" />
              <div class="carf_right">
                <h3>{{item.productName}}</h3>
                <p>￥{{item.payMoney}}</p>
              </div>
            </div>
            <div class="card_footer_box">
              <div class="card_footer">
                <div class="footer_title">
                  <!-- <i>1</i> -->
                  <span>{{item.content}}</span>
                </div>
                <div class="footer_date">
                  <div class="date_rate">
                    <van-rate
                      custom-class="rate_a"
                      icon-class="rate_b"
                      :value="item.averageScroe"
                      :size="'12'"
                      :count="'5'"
                      readonly="true"
                    />
                    <span>{{item.averageScroe}}分</span>
                  </div>
                  <p>{{item.createTime}}</p>
                </div>
              </div>
            </div>
            <div class="open_more">
              <p @click="toEvaluationList(item)">
                点击查看全部评价
                <i-icon class="more_icon" type="enter" />
              </p>
            </div>
          </div>
          <i-load-more :tip="hasMore2?'数据加载中':'暂无更多评价'" :loading="hasMore2" />
          <!-- <div class="evaluation_list">
            <div class="header_title">
              订单号：
              <span>33216546546565165165156</span>
            </div>
            <div class="product_card">
              <img :src="cardImg" mode="widthFix">
              <div class="carf_right">
                <h3>星级家·保洁套餐</h3>
                <p>￥200.00</p>
              </div>
            </div>
            <div class="card_footer_box">
              <div class="card_footer">
                <div class="footer_title">
                  <i>1</i>
                  <span>王阿姨的态度很好，下次还会叫她~！</span>
                </div>
                <div class="footer_date">
                  <div class="date_rate">
                    <van-rate
                      custom-class="rate_a"
                      icon-class="rate_b"
                      :value="5"
                      :size="'12'"
                      :count="'5'"
                      readonly="true"
                    />
                    <span>4.6分</span>
                  </div>
                  <p>
                    2019-04-29
                    <span>12:00</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="open_more">
              <p @click="toEvaluationList">
                点击查看全部评价
                <i-icon class="more_icon" type="enter"/>
              </p>
            </div>
          </div>-->
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { _getServicesData, _getNoneServicesData } from "../../service/personal";
export default {
  name: "my_evaluation",
  data() {
    return {
      cardImg: this.imgBastPath + "def_product.png",
      noOrderPic: this.imgBastPath + "def_evaluate1.png",
      activeIndex: 0,
      servicesParams: {
        pageNumber: 1,
        pageSize: 5,
        loading: true
      },
      servicesParams2: {
        pageNumber: 1,
        pageSize: 5,
        loading: true
      },
      hasEvaluate: [],
      noneEvaluate: [],
      hasMore1: true,
      hasMore2: true,
      haSreach: true
    };
  },
  computed: {},
  onLoad() {},
  onReady() {},
  onShow() {
    // this.activeIndex = 0;
    this.servicesParams2.pageNumber = 1;
    this.getList2("change");
  },
  onHide() {
    // 重置data 完成初始化
    // Object.assign(this.$data, this.$options.data());
  },
  methods: {
    // 获取已评价列表
    getList(flag) {
      let _this = this;
      _getServicesData(this.servicesParams).then(res => {
        if (res.data.success) {
          let page = res.data.data.page;
          if (this.servicesParams.pageNumber < page.totalPage) {
            this.haSreach = true;
          } else {
            this.haSreach = false;
          }
          let bastPath = res.data.data.baseUrl;
          let resData = res.data.data.list;
          if (resData.length < 5) {
            _this.hasMore2 = false;
          }
          resData.forEach(val => {
            val.productImg = bastPath + val.productImg;
          });
          if (flag == "change") {
            _this.hasEvaluate = resData;
          } else {
            _this.hasEvaluate = _this.hasEvaluate.concat(resData);
          }
        }
      });
    },
    // 获取待评价列表
    getList2(flag) {
      let _this = this;
      _getNoneServicesData(this.servicesParams2).then(res => {
        if (res.data.success) {
          let page = res.data.data.page;
          if (this.servicesParams2.pageNumber < page.totalPage) {
            this.haSreach = true;
          } else {
            this.haSreach = false;
          }
          let bastPath = res.data.data.baseUrl;
          let resData = res.data.data.list;
          if (resData.length < 5) {
            _this.hasMore1 = false;
          }
          resData.forEach(val => {
            val.productImg = bastPath + val.productImg;
          });
          if (flag == "change") {
            _this.noneEvaluate = resData;
          } else {
            _this.noneEvaluate = _this.noneEvaluate.concat(resData);
          }
        }
      });
    },
    toEvaluate(item) {
      let url = `../service_evaluation/main?id=${item.id}`;
      wx.navigateTo({ url });
    },
    toEvaluationList(item) {
      let url = `../evaluation_list/main?id=${item.id}`;
      wx.navigateTo({ url });
    },
    onChange(e) {
      let tabIndex = e.mp.detail.index;
      this.activeIndex = tabIndex;
      // this.hasMore = true;
      switch (this.activeIndex) {
        case 0:
          this.getList2("change");
          break;
        case 1:
          this.getList("change");
          break;
        default:
          break;
      }
    }
  },
  // 上拉加载
  onReachBottom: function() {
    if (this.haSreach) {
      if (this.activeIndex == 0) {
        this.servicesParams2.pageNumber++;
        this.getList2();
      } else {
        this.servicesParams.pageNumber++;
        this.getList();
      }
    }
  },
  //下拉刷新
  onPullDownRefresh() {
    if (this.activeIndex == 0) {
      this.servicesParams2.pageNumber = 1;
      this.getList2("change");
    } else {
      this.servicesParams.pageNumber = 1;
      this.getList("change");
    }
    wx.stopPullDownRefresh(); // 通知页面停止下拉刷新效果
  }
};
</script>

<style lang="less" scoped>
.order_list_null {
  background: #fff;
  padding: 50px 0 300px 0;

  .default_pic {
    width: 50%;
    display: block;
    margin: 0 auto;
  }

  p {
    font-size: 12px;
    text-align: center;
    color: #818181;
    line-height: 40px;
  }
}
</style>