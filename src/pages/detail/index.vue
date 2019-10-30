<template>
  <div class="detail">
    <!--mode="widthFix"-->
    <img class="detail_pic" mode="widthFix" :src="productDetail.bannerImg" />
    <div class="info">
      <div class="info_left">
        <h3>{{productDetail.name}}</h3>
        <p>{{productDetail.intro}}</p>
      </div>
      <div class="info_right">
        <h3>
          折后价
          <span>￥{{mealInfo.price}}</span>
        </h3>
        <!--text-decoration: line-through-->
        <p>￥{{mealInfo.originalPrice}}</p>
      </div>
    </div>

    <!-- <div class="auths clearfix">
      <p>认证</p>
      <div class="auth_info">
        <div class="auth_list">
          <span>
            <img mode="widthFix" :src="'../../static/images/cion_confirm.png'"> 身份认证
          </span>
        </div>
        <div class="auth_list">
          <span>
            <img mode="widthFix" :src="'../../static/images/cion_confirm.png'"> 健康认证
          </span>
        </div>
        <div class="auth_list">
          <span>
            <img mode="widthFix" :src="'../../static/images/cion_confirm.png'"> 技能认证
          </span>
        </div>
      </div>
    </div>-->

    <div class="sel_project" @click="paymentShow=true">
      <div>
        选择
        <span style="padding-left:10px;">{{mealInfo.title}}</span>
      </div>
      <div>
        <span style="padding-right:10px;">请选择套餐</span>
        <i-icon color="#868686" type="enter" />
      </div>
    </div>

    <!-- meal-content -->
    <div class="meal_content">
      <div class="title">套餐内容</div>
      <div class="meal_data">
        <!-- <p>保洁经验2-3年，证件齐全，保洁经验非常丰富，服务 20多个家庭，一致得到客户好评</p>
        <p>计费方式：</p>
        <p>4次日常保洁，每次4小时</p>-->
        <wxParse :content="mealInfo.intro" />
      </div>
    </div>

    <div class="class_title">
      <div class="line line_left"></div>
      <h3>商品详情</h3>
      <div class="line line_right"></div>
    </div>
    <div class="product_content">
      <wxParse :content="productDetail.content" />
    </div>
    <!-- <img class="detail_pic" mode="widthFix" :src="'../../static/images/detail.png'"> -->

    <div :class="{'goods_action_box':true,'fix-iphonex-buttom':isIphoneX}">
      <div class="icon_box" @click="selArea">
        <img mode="widthFix" :src="iconPoint" />
        <p>{{wxChangeLocation.orderCity}}</p>
      </div>
      <div class="icon_box" @click="toCallPhone">
        <img mode="widthFix" :src="iconCustomerService2" />
        <p>客服</p>
      </div>
      <div @click="paymentClick" class="right_btn">立即购买</div>
    </div>

    <van-popup custom-class="pay_pop" position="bottom" :show="paymentShow" @close="paymentClose">
      <div class="pop_content">
        <div class="pop_header">
          <img class="header_img" mode="widthFix" :src="payPopProduct" />
          <div class="header_title">
            <h3>{{mealInfo.title}}</h3>
            <p>
              <span>{{mealInfo.price}}</span>元/
              <!-- <span>{{mealInfo.serviceNum}}</span>套 -->
              <span style="font-size:12px;" v-text="mealInfo.unitStr"></span>
            </p>
          </div>
        </div>
        <div class="pop_type">
          <h3>选择商品</h3>
          <ul class="type_list">
            <li
              :class="typeIndex==index?'active':''"
              v-for="(item,index) in productDetail.productPackages"
              :key="index"
              @click="changeMeal(item,index)"
            >{{item.title}}</li>
          </ul>
        </div>
        <!-- <div class="pop_count">
          <p>购买数量</p>
          <div>
            <van-stepper :value="typeCount" @change="countChange"/>
          </div>
        </div>-->
      </div>
      <div :class="{'pop_btn_box':true,'fix-iphonex-buttom':isIphoneX}">
        <van-button @click="toSubmitOrder" custom-class="pay_btn">立即购买</van-button>
      </div>
    </van-popup>
    <toLoginPopup :showPop.sync="login_pop_show"></toLoginPopup>
    <!-- <phonePopup :showPop.sync="phoneShow"></phonePopup> -->
    <van-popup
      custom-class="bottom_pop"
      :show="selAddrList"
      position="bottom"
      overlay="false"
      @close="selAddrList=false"
    >
      <van-area
        :value="areaValue"
        @cancel="selAddrList=false"
        @confirm="onConfirm"
        columns-num="3"
        title="请选择地址"
        @change="areaChange"
        :area-list="areaList"
      />
    </van-popup>
  </div>
</template>

<script>
import { _getProductDetail } from "../../service/detail";
import { mapState, mapActions, mapMutations } from "vuex";
import { _getUnit } from "../../api/common";
import wxParse from "mpvue-wxparse";
import qs from "qs";
import toLoginPopup from "../../components/toLoginPopup";
import phonePopup from "../../components/phonePopup";
import { _getAppointcitys } from "../../service/classify";
export default {
  name: "detail",
  data() {
    return {
      iconPoint: this.imgBastPath + "icon_Point.png",
      payPopProduct: this.imgBastPath + "pay_pop_product.png",
      iponeIcon: this.imgBastPath + "ipone.png",
      iconCustomerService2: this.imgBastPath + "icon_customer_service.png",
      paymentShow: false,
      login_pop_show: false,
      phoneShow: false,
      selAddrList: false,
      types: ["星级家·保洁套餐一", "星级家·保洁套餐二", "星级家·保洁套餐三"],
      typeIndex: 0,
      typeCount: 1,
      productDetail: {
        bannerImg: "",
        content: "", // 商品详情
        id: "",
        intro: "", // 套餐内容
        name: "",
        price: 0,
        productImages: [{ imgUrl: "" }],
        productPackages: [], // 套餐
        productTypeId: "",
        productTypeTitle: "",
        servicesNum: 0,
        smallImg: ""
      },
      mealInfo: {
        id: "",
        intro: "",
        originalPrice: 0,
        price: 0,
        productId: "",
        serviceNum: 0,
        title: "",
        unitStr: ""
      },
      orderId: "",
      areaValue: "", //310115
      currentCity: "",
      areaList: null
    };
  },
  components: {
    wxParse,
    toLoginPopup,
    phonePopup
  },
  computed: {
    ...mapState({
      isIphoneX: state => state.login.isIphoneX,
      authorization: state => state.login.authorization,
      phoneLogin: state => state.login.phoneLogin,
      wxChangeLocation: state => state.login.wxChangeLocation
    })
  },
  onLoad(option) {
    // 重置data 完成初始化
    Object.assign(this.$data, this.$options.data());
    this.currentCity = this.wxChangeLocation.orderCity;
    this.orderId = option.id;
    _getAppointcitys().then(res => {
      if (res.data.success) {
        this.areaList = res.data.data.area_list;
      }
    });
  },
  onShow() {
    this.login_pop_show = false;
    this.paymentShow = false;

    let params = {
      id: this.orderId,
      loading: true
    };
    _getProductDetail(params).then(res => {
      if (res.data.success) {
        let baseUrl = res.data.data.baseUrl;
        this.productDetail = res.data.data.product;
        // if (this.productDetail.productImages.length > 0) {
        //   this.productDetail.productImages[0].imgUrl =
        //     baseUrl + this.productDetail.productImages[0].imgUrl;
        // }
        this.productDetail.bannerImg = baseUrl + this.productDetail.bannerImg;
        this.productDetail.smallImg = baseUrl + this.productDetail.smallImg;
        this.productDetail.productPackages.forEach(val => {
          val.unitStr = _getUnit(val.priceUnit);
        });
        if (this.productDetail.productPackages) {
          this.mealInfo = this.productDetail.productPackages[0];
        }
      }
    });
  },
  onHide() {
    // 重置data 完成初始化
    // Object.assign(this.$data, this.$options.data());
  },
  methods: {
    ...mapActions(["sendOrderInfo"]),
    ...mapMutations(["CHANGE_CHANGE_LOCATION"]),
    paymentClose() {
      this.paymentShow = false;
    },
    selArea() {
      this.selAddrList = true;
    },
    onConfirm(e) {
      let values = e.mp.detail.values;
      // let areas = `${values[0].name}-${values[1].name}-${values[2].name}`;
      // this.areaValue = values[2].code;
      // this.toFindInfo.areaValueName = areas;
      // this.toFindInfo.areaCodes = [];
      // values.forEach(val => {
      //   this.toFindInfo.areaCodes.push(val.code);
      // });
      // 储存订单信息  解析经纬度 待处理
      let city = values[1].name;
      if (city.charAt(city.length - 1) == "市") {
        city = city.substr(0, city.length - 1);
      }
      let params = {
        province: values[0].name,
        city: city,
        area: values[2].name,
        name: "order"
      };
      this.CHANGE_CHANGE_LOCATION(params);
      // 请求地区相应数据 xxx
      // console.log(values[0].name, values[1].name, values[2].name);
      this.selAddrList = false;
    },
    areaChange(e) {
      console.log("areaChange");
    },
    changeMeal(item, index) {
      this.typeIndex = index;
      console.log(item);
      this.mealInfo = this.productDetail.productPackages[index];
    },
    toCallPhone() {
      wx.makePhoneCall({
        phoneNumber: "400-888-8888"
      });
    },
    paymentClick() {
      this.paymentShow = true;
    },
    toRegOrLogin() {
      let url = `../login/main`;
      wx.navigateTo({ url });
    },
    toSubmitOrder() {
      if (this.phoneLogin) {
        // 存状态
        let sendOrderInfo = {
          id: this.productDetail.id,
          name: this.productDetail.name,
          productTypeTitle: this.productDetail.productTypeTitle,
          smallImg: this.productDetail.smallImg,
          productTypeId: this.productDetail.productTypeId,
          message: "",
          productPackage: this.mealInfo,
          intro: this.productDetail.intro
        };
        this.sendOrderInfo(sendOrderInfo);
        let url = `../submit_order/main`;
        wx.navigateTo({ url });
      } else {
        this.login_pop_show = true;
      }
    }
  }
};
</script>

<style scoped>
@import url("~mpvue-wxparse/src/wxParse.css");
</style>