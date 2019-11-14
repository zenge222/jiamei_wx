<template>
  <div class="detail">
    <img class="detail_pic" mode="widthFix" :src="productDetail.bannerImg" />
    <div class="info">
      <div class="info_left">
        <h3>{{productDetail.name}}</h3>
        <p>{{productDetail.intro}}</p>
      </div>
      <div class="info_right">
        <h3>
          <span>{{productDetail.price}}/{{productDetail.priceUnitStr}}</span>
        </h3>
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

    <div :class="{'goods_action_box':true,'fix-iphonex-buttom':isIphoneX}">
      <div class="icon_box" @click="selAddrList=true;">
        <img mode="widthFix" :src="iconPoint" />
        <p>{{wxChangeLocation.orderCity}}</p>
      </div>
      <div class="icon_box" @click="toCallPhone">
        <img mode="widthFix" :src="iconCustomerService2" />
        <p>客服</p>
      </div>
      <div @click="selAddr=true;" class="right_btn">立即预约</div>
    </div>

    <van-popup
      custom-class="bottom_pop"
      :show="selAddr"
      position="bottom"
      overlay="true"
      @close="selAddr=false"
    >
      <div class="header">
        <span @click="selAddr=false">取消</span>
        <h3>选择预约地址</h3>
        <span></span>
      </div>
      <div class="container_box">
        <div class="input_box">
          <input @click="selAddrList2=true" type="text" :value="toFindInfo.areaValueName" disabled />
          <i-icon class="enter_icon" size="16" type="enter" />
        </div>
        <div class="input_box">
          <input
            type="text"
            maxlength="11"
            placeholder="请输入联系人电话"
            v-model="phoneLoginInfo.phoneNum"
            disabled
          />
        </div>
      </div>
      <div :class="{'footer_box':true,'pop-iphonex-buttom':isIphoneX}">
        <van-button custom-class="sel_btn" size="normal" @click="toAppointment">去挑选小时工</van-button>
      </div>
    </van-popup>

    <toLoginPopup :showPop.sync="login_pop_show"></toLoginPopup>
    <!-- <phonePopup :showPop.sync="phoneShow"></phonePopup> -->
    <!-- 预约区域 -->
    <van-popup
      custom-class="bottom_pop"
      :show="selAddrList2"
      position="bottom"
      overlay="false"
      @close="selAddrList=false"
    >
      <van-area
        :value="areaValue2"
        @cancel="selAddrList2=false"
        @confirm="onConfirm2"
        columns-num="3"
        title="请选择地址"
        :area-list="areaList"
      />
    </van-popup>
    <!-- 底部区域选择 -->
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
        :area-list="areaList"
      />
    </van-popup>
    <i-message id="message" />
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
import {
  _getclassifyDetail,
  _addAppointTry,
  _getAppointcitys
} from "../../service/classify";
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
      selAddrList2: false,
      selAddr: false,
      toFindInfo: {
        areaValueName: "请选择区域", // 上海市-上海市-浦东区
        // streetName: "测试街道1",
        areaCodes: [], // 310000, 310100, 310115
        // streetId: "1",
        contactsPhone: ""
      },
      typeIndex: 0,
      typeCount: 1,
      productDetail: {
        bannerImg: "",
        content: "", // 商品详情
        id: "",
        intro: "", // 套餐内容
        name: "",
        price: 0,
        priceUnit: 0,
        priceUnitStr: ""
      },
      orderId: "",
      areaValue: "", //310115
      currentCity: "",
      areaList: null,
      areaValue2: ""
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
      wxChangeLocation: state => state.login.wxChangeLocation,
      phoneLoginInfo: state => state.login.phoneLoginInfo
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
    this.selAddrList2 = false;
    this.selAddr = false;
    this.toFindInfo.areaValueName = "请选择区域";
    this.toFindInfo.areaCodes = [];
    this.toFindInfo.contactsPhone = "";
    let params = {
      id: option.id
    };
    this.typeId = option.id;
    _getclassifyDetail(params).then(res => {
      if (res.data.success) {
        this.productDetail = res.data.data.product;
        this.content = res.data.data.product.content;
        // this.detailImg =
        //   res.data.data.baseUrl +
        //   res.data.data.product.smallImg;
        //   console.log(this.detailImg)
        wx.setNavigationBarTitle({
          title: res.data.data.product.name
        });
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
    onConfirm2(e) {
      let values = e.mp.detail.values;
      let areas = `${values[0].name}-${values[1].name}-${values[2].name}`;
      this.areaValue2 = values[2].code;
      this.toFindInfo.areaValueName = areas;
      this.toFindInfo.areaCodes = [];
      values.forEach(val => {
        this.toFindInfo.areaCodes.push(val.code);
      });
      this.selAddrList2 = false;
    },
    onConfirm(e) {
      let values = e.mp.detail.values;
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
      // 关联预约区域
      let areas = `${values[0].name}-${values[1].name}-${values[2].name}`;
      this.areaValue2 = values[2].code;
      this.toFindInfo.areaValueName = areas;
      this.toFindInfo.areaCodes = [];
      values.forEach(val => {
        this.toFindInfo.areaCodes.push(val.code);
      });
      this.selAddrList2 = false;
    },
    toCallPhone() {
      wx.makePhoneCall({
        phoneNumber: "400-888-8888"
      });
    },
    toRegOrLogin() {
      let url = `../login/main`;
      wx.navigateTo({ url });
    },
    toAppointment() {
      let _this = this;
      let reg = /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
      if (this.toFindInfo.areaCodes.length < 3) {
        this.$Message({
          content: "请选择区域",
          type: "default"
        });
        return;
      } else {
        // 添加分类信息
        let params = {
          provinceId: this.toFindInfo.areaCodes[0],
          cityId: this.toFindInfo.areaCodes[1],
          areaId: this.toFindInfo.areaCodes[2],
          areaText: this.toFindInfo.areaValueName
        };
        _addAppointTry(params).then(res => {
          /*
             res id --> 下预约的时候用  
             this.productDetail.id --> 预约
          */
          if (res.data.success) {
            let url = `../appointment/main?productId=${
              _this.productDetail.id
            }&id=${res.data.data.id}`;
            wx.navigateTo({ url });
          }
        });
      }
    }
  }
};
</script>

<style scoped>
@import url("~mpvue-wxparse/src/wxParse.css");
</style>