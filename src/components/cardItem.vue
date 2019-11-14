<template>
  <div class="card_item2" @click="toDetail(cardInfo)">
    <!-- type 1 礼包  2 钟点工 3 双拼 -->
    <div class="title_group">
      <h3 v-text="cardInfo.name"></h3>
      <p v-if="cardInfo.type==1" v-text="cardInfo.intro"></p>
    </div>
    <div class="card_group">
      <!-- https://file.omnrj.com/static/images/def_test.png -->
      <img style="width:100%;" :src="cardInfo.smallImg" mode="widthFix" />
      <div class="card_btm">
        <div class="bg_img">
          <img
            style="width:100%;"
            src="https://file.omnrj.com/static/images/pro_dec.png"
            mode="widthFix"
          />
          <p v-text="cardInfo.name"></p>
        </div>
        <div class="price_item" v-if="cardInfo.type==1">
          <span class="activity">活动价￥</span>
          <span>{{cardInfo.productPackages[0].price}}</span>
          <!-- <span>/{{mainProduct.productPackages[0].serviceNum}}次</span> -->
          <span>/{{cardInfo.productPackages[0].unitStr}}</span>
          <div class="old_price">
            <span v-text="cardInfo.productPackages[0].originalPrice"></span>
            <span>/{{cardInfo.productPackages[0].unitStr}}</span>
          </div>
        </div>
        <div class="price_item" v-if="cardInfo.type==2">
          <span>{{cardInfo.price}}/</span>
          <span>{{cardInfo.priceUnitStr}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cardInfo: this.cardParams
    };
  },
  props: {
    cardParams: {
      type: Object,
      required: true
    }
  },
  watch: {
    cardInfo: function(newVal, oldVal) {
      this.cardInfo = newVal;
    }
  },
  onLoad() {
    console.log(this.cardParams);
    // this.cardParams.intro = this.cardParams.intro||"";
  },
  methods: {
    toDetail(item) {
      // type 3 两个都有  1体验包(detail)  2包月(classify_detail)
      let id = item.productTypeId;
      if (item.type == 1) {
        let url = `../detail/main?id=${id}`;
        wx.navigateTo({ url });
      } else {
        let url = `../classify_detail/main?id=${id}`;
        wx.navigateTo({ url });
      }
    }
  }
};
</script>
<style lang="less">
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
    > img {
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
