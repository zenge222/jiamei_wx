<template>
  <div class="card_item" @click="toDetail(cardInfo)">
    <!-- type 1 礼包  2 钟点工 3 双拼 -->
    <!--  v-if="mainProduct.type==3" -->
    <div class="title_head" v-if="cardInfo.type==3">
      <h3>{{cardInfo.name}}</h3>
      <div class="title_adorn">
        <img src="https://file.omnrj.com/static/images/def_label.png" mode="widthFix" />
        <p>服务任选</p>
      </div>
      <em>{{cardInfo.intro}}</em>
    </div>
    <!-- 商品图片 -->
    <!-- https://file.omnrj.com/static/images/def_Gift _Picture.png -->
    <img style="width:100%;display:block;" :src="cardInfo.smallImg" mode="widthFix" />
    <!-- 内容 -->
    <!-- type 1 礼包  2 钟点工 3 双拼 -->
    <div class="pro_list_info1" style="padding-top:10px" v-if="cardInfo.type==1||cardInfo.type==2">
      <div class="info_item">
        <h3>{{cardInfo.name}}</h3>
        <div class="price item_top" v-if="cardInfo.type==2">
          <span style="font-size:12px;">每{{cardInfo.priceUnitStr}}￥</span>
          <span style="font-size:25px;">{{cardInfo.price}}</span>
        </div>
        <div class="price item_top" v-if="cardInfo.type==1">
          <span class="activity">活动价￥</span>
          <span style="font-size:25px;">{{cardInfo.productPackages[0].price}}</span>
          <!-- <span>/{{mainProduct.productPackages[0].serviceNum}}次</span> -->
          <span>/{{cardInfo.productPackages[0].unitStr}}</span>
        </div>
      </div>
      <div class="info_item">
        <em>{{cardInfo.intro}}</em>
        <div class="flex_item item_bottom" v-if="cardInfo.type==1">
          <i>{{cardInfo.productPackages[0].originalPrice}}/{{cardInfo.productPackages[0].unitStr}}</i>
          <!-- <p>/{{mainProduct.productPackages[0].serviceNum}}次</p> -->
          <!-- <p></p> -->
        </div>
      </div>
    </div>
    <!-- 卡卷 -->
    <div class="card_flex" v-if="cardInfo.type==3">
      <div class="card_padding">
        <div class="card_item" style="padding:5px 8px;">
          提供包月服务 {{cardInfo.price}}元/{{cardInfo.priceUnitStr}}
          <div class="card_round1"></div>
          <div class="card_white1"></div>
          <div class="card_round2"></div>
          <div class="card_white2"></div>
        </div>
      </div>
      <div class="card_padding">
        <div class="card_item" style="padding:5px 8px;">
          体验大礼包 {{cardInfo.productPackages[0].price}}/{{cardInfo.productPackages[0].unitStr}}
          <div class="card_round1"></div>
          <div class="card_white1"></div>
          <div class="card_round2"></div>
          <div class="card_white2"></div>
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
.card_item {
  padding: 10px 8px;
  background: #fff;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  margin-top: 12px;

  .title_head {
    padding-bottom: 10px;

    > em {
      font-size: 12px;
      color: #bababa;
    }

    h3 {
      font-size: 20px;
      line-height: 20px;
      display: inline-block;
    }

    .title_adorn {
      display: inline-block;
      margin-left: 8px;
      position: relative;

      img {
        display: block;
        width: 60px;
      }

      p {
        width: 100%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        text-align: center;
        font-size: 10px;
      }
    }
  }

  .pro_list_info1 {
    // padding-top: 10px;

    .info_item {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      line-height: 1;
      .price {
        color: #eb5d2a;
      }

      h3 {
        font-size: 20px;
        line-height: 1;
      }

      em {
        padding-top: 10px;
        font-size: 12px;
        color: #666666;
      }

      i {
        font-size: 12px;
        color: #666666;
        text-decoration: line-through;
      }
    }
  }
}

.card_flex {
  display: flex;
  justify-content: space-between;
  padding-top: 10px;

  .card_padding:first-child {
    padding-right: 8px;
    box-sizing: border-box;
  }

  .card_padding:last-child {
    padding-left: 8px;
    box-sizing: border-box;
  }

  .card_padding {
    width: 50%;

    .card_item {
      border: 1px solid #eb5d2a;
      text-align: center;
      font-size: 12px;
      // line-height: 2;
      position: relative;
      color: #eb5d2a;

      .card_round1,
      .card_round2 {
        width: 10px;
        height: 10px;
        border-radius: 100%;
        border: 1px solid #eb5d2a;
        background: #fff;
      }

      .card_white1,
      .card_white2 {
        width: 6px;
        height: 20px;
        background: #fff;
      }

      .card_round1 {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translate(-50%, -50%);
      }

      .card_white1 {
        position: absolute;
        top: 50%;
        left: -4px;
        transform: translate(-50%, -50%);
      }

      .card_round2 {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translate(50%, -50%);
      }

      .card_white2 {
        position: absolute;
        top: 50%;
        right: -4px;
        transform: translate(50%, -50%);
      }
    }
  }
}
.item_bottom {
  font-size: 12px;
  color: #bababa;
}

.item_top {
  .activity {
    font-size: 12px;
  }
  span:last-child {
    font-size: 12px;
  }
}
</style> 
