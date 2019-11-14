<template>
  <div class="product_list">
    <div class="home_list" v-if="productParams.type==1">
      <div
        class="card_box"
        v-for="(item,index) in productList"
        :key="index"
        @click="toDetail(item)"
      >
        <img style="width:100%;" :src="item.smallImg" mode="widthFix" />
        <div class="pro_list_info1">
          <div class="info_item">
            <h3>{{item.name}}</h3>
            <div class="price item_top">
              <span class="activity">活动价￥</span>
              <span style="font-size:25px;">{{item.productPackages[0].price}}</span>
              <span>/{{item.productPackages[0].unitStr}}</span>
              <!-- <span>/{{item.productPackages[0].serviceNum}}次</span> -->
            </div>
          </div>
          <div class="info_item">
            <em>{{item.intro}}</em>
            <div class="flex_item item_bottom">
              <i>{{item.productPackages[0].originalPrice}}/{{item.productPackages[0].unitStr}}</i>
              <!-- <span></span> -->
              <!-- <p>/{{item.productPackages[0].serviceNum}}次</p> -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="home_list" v-if="productParams.type==2">
      <div
        class="card_box"
        v-for="(item,index) in productList"
        :key="index"
        @click="toDetail(item)"
      >
        <img style="width:100%;" :src="item.smallImg" mode="widthFix" />
        <div class="pro_list_info1">
          <div class="info_item">
            <h3>{{item.name}}</h3>
            <div class="price item_top">
              <span style="font-size:12px;">每{{item.priceUnitStr}}￥</span>
              <span style="font-size:25px;">{{item.price}}</span>
            </div>
          </div>
          <div class="info_item">
            <em>{{item.intro}}</em>
          </div>
        </div>
      </div>
    </div>
    <!--  -->
    <div class="home_list" v-if="productParams.type==3">
      <div
        class="card_box"
        v-for="(item,index) in productList"
        :key="index"
        @click="toDetail(item)"
      >
        <!--  -->
        <div class="title_head">
          <h3>{{item.name}}</h3>
          <div class="title_adorn">
            <img src="https://file.omnrj.com/static/images/def_label.png" mode="widthFix" />
            <p>服务任选</p>
          </div>
          <em>{{item.intro}}</em>
        </div>
        <img style="width:100%;" :src="item.smallImg" mode="widthFix" />
        <div class="card_flex">
          <div class="card_padding">
            <div class="card_item">
              提供包月服务 {{item.price}}元/{{item.priceUnitStr}}
              <div class="card_round1"></div>
              <div class="card_white1"></div>
              <div class="card_round2"></div>
              <div class="card_white2"></div>
            </div>
          </div>
          <div class="card_padding">
            <div class="card_item">
              体验大礼包 {{item.productPackages[0].price}}/{{item.productPackages[0].unitStr}}
              <div class="card_round1"></div>
              <div class="card_white1"></div>
              <div class="card_round2"></div>
              <div class="card_white2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <i-load-more :tip="hasMore?'数据加载中':'暂无更多产品'" :loading="hasMore" />
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
          if (this.productParams.pageNumber == page.totalPage) {
            _this.hasMore = false;
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
.pro_container {
  padding: 12px;
  .pro_item {
    padding: 16px 12px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 0 60px rgba(203, 203, 203, 0.15);
    margin-bottom: 12px;
    img {
      width: 100%;
    }
    .pro_info {
      .info_item {
        display: flex;
        justify-content: space-between;
        padding: 4px 0;
        h3 {
          font-size: 20px;
        }
        em {
          color: #eb5d2a;
          font-size: 12px;
          span {
            font-size: 18px;
          }
        }
        .info_label {
          i {
            display: inline-block;
            margin-right: 10px;
            color: #eb5d2a;
            font-size: 12px;
            line-height: 2;
            padding: 0 6px;
            border-radius: 8px;
            background: rgba(235, 93, 42, 0.1);
          }
        }
        .original_price {
          font-size: 12px;
          color: #bababa;
        }
        .price {
          text-decoration: line-through;
        }
        .see_detail {
          position: relative;
          background: #eb5d2a;
          color: #fff;
          line-height: 2;
          font-size: 14px;
          border-radius: 20px;
          padding: 0 26px 0 10px;
          img {
            position: absolute;
            right: 10px;
            top: 50%;
            width: 8px;
            transform: translate(0, -50%);
          }
        }
      }
    }
  }
}
</style>
