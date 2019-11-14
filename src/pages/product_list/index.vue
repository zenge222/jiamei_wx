<template>
  <div class="product_list clearfix">
    <div class="home_list">
      <div
        class="card_item2"
        v-for="(item,index) in productList"
        :key="index"
        @click="toDetail(item)"
      >
        <!-- type 1 礼包  2 钟点工 3 双拼 -->
        <div class="title_group">
          <h3 v-text="item.name"></h3>
          <p v-if="item.type==1" v-text="item.intro"></p>
        </div>
        <div class="card_group">
          <img
            style="width:100%;"
            :src="item.smallImg"
            mode="widthFix"
          />
          <div class="card_btm">
            <div class="bg_img">
              <img
                style="width:100%;"
                src="https://file.omnrj.com/static/images/pro_dec.png"
                mode="widthFix"
              />
              <p v-text="item.name"></p>
            </div>
            <div class="price_item" v-if="item.type==1">
              <span class="activity">活动价￥</span>
              <span>{{item.productPackages[0].price}}</span>
              <!-- <span>/{{mainProduct.productPackages[0].serviceNum}}次</span> -->
              <span>/{{item.productPackages[0].unitStr}}</span>
              <div class="old_price">
                <span v-text="item.productPackages[0].originalPrice"></span>
                <span>/{{item.productPackages[0].unitStr}}</span>
              </div>
            </div>
            <div class="price_item" v-if="item.type==2">
              <span>{{item.price}}/</span>
              <span>{{item.priceUnitStr}}</span>
            </div>
          </div>
        </div>
      </div>
      <i-load-more :tip="hasMore?'数据加载中':'暂无更多产品'" :loading="hasMore" />
    </div>
  </div>
</template>

<script>
import { _getHomeProductList } from "../../service/home";
import { _getUnit } from "../../api/common";
export default {
  data() {
    return {
      iconRight: this.imgBastPath + "btn_view.png",
      productParams: {
        type: "",
        pageNumber: 1,
        pageSize: 6,
        loading: true
      },
      productList: [],
      hasMore: true
    };
  },
  created() {},
  computed: {},
  onLoad(option) {
    this.productParams.type = option.type;
    console.log(option.type);
    this.productParams.pageNumber = 1;
    this.productList = [];
    this.getData();
  },
  onShow() {
    // 重置data 完成初始化
    // Object.assign(this.$data, this.$options.data());
  },
  onHide() {},
  methods: {
    initData() {
      this.productParams.pageNumber = 1;
    },
    getData(flag) {
      let _this = this;
      _getHomeProductList(this.productParams).then(res => {
        if (res.data.success) {
          let page = res.data.data.page;
          let baseUrl = res.data.data.baseUrl || "https://file.omnrj.com";
          let resData = res.data.data.list;
          resData.forEach(val => {
            val.smallImg = baseUrl + val.smallImg;
            if (val.productPackages.length != 0) {
              val.productPackages[0].unitStr = _getUnit(
                val.productPackages[0].priceUnit
              );
            }
          });
          if (_this.productParams.pageNumber <= page.totalPage) {
            if (flag && falg == "change") {
              _this.productList = resData;
            } else {
              _this.productList = _this.productList.concat(resData);
            }
          }
          if (this.productParams.pageNumber == page.totalPage||res.data.data.list.length==0) {
            _this.hasMore = false;
            return;
          }
        }
      });
    },
    toDetail(item) {
      // type  1体验包(detail)  2包月(classify_detail) 3 两个都有
      let id = item.productTypeId;
      if (item.type == 1) {
        let url = `../detail/main?id=${id}`;
        wx.navigateTo({ url });
      } else {
        let url = `../classify_detail/main?id=${id}`;
        wx.navigateTo({ url });
      }
    },
    toProductDetail(item) {
      // 1 预约  0 商品详情
      let id = item.productTypeId;
      if (item.productTypeLinkType == 0) {
        let url = `../detail/main?id=${id}`;
        wx.navigateTo({ url });
      } else {
        let url = `../classify_detail/main?id=${id}`;
        wx.navigateTo({ url });
      }
    }
  },
  // 上拉加载
  onReachBottom: function() {
    this.productParams.pageNumber++;
    this.getData();
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.initData();
    this.getData("change");
    wx.stopPullDownRefresh(); // 通知页面停止下拉刷新效果
  }
};
</script>

<style lang="less" scoped>
.card_item2 {
  background: url("https://file.omnrj.com/static/images/home_pro_bg.png")
    no-repeat;
  background-size: 100%;
  width: 100%;
  .title_group {
    display: flex;
    align-items: center;
    color: #fff;
    padding: 10px 15px;
    > h3 {
      font-size: 18px;
      line-height: 1;
      padding-right: 13px;
    }
    > p {
      font-size: 9px;
      line-height: 1;
      padding: 4px 6px;
      background: #fff;
      color: #ea5d2b;
      border-radius: 2.5px;
    }
  }
  .card_group {
    // padding: 0 35px;
    box-shadow: 6px 6px 9px rgba(0, 0, 0, 0.08);
    margin: 0 35px 35px 35px;
    >img{
      display: block;
    }
  }
  .card_btm {
    display: flex;
    justify-content: space-between;
    height: 48px;
    .bg_img {
      width: 110px;
      position: relative;
      > img {
        position: absolute;
        left: -4px;
        top: 0;
        z-index: 1;
      }
      > p {
        position: absolute;
        z-index: 2;
        left: 11px;
        top: 11px;
        font-size: 14px;
        color: #fff;
      }
    }
    .price_item {
      text-align: right;
      padding-right: 10px;
      > span {
        color: #ea5d2b;
        font-size: 12px;
      }
      .old_price {
        text-decoration: line-through;
        font-size: 9px;
        color: #999;
      }
    }
  }
}
</style>
