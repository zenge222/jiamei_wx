<template>
  <div class="classify_detail">
    <!-- <img :src="detailImg" class="detail_img" mode="widthFix"> -->
    <div class="class_detail_parse">
      <wxParse :content="content" />
    </div>
    <div :class="{'sel_service':true,'fix-iphonex-buttom':isIphoneX}">
      <button v-if="detailInfo.type==3||detailInfo.type==1" class="sel_btn" @click="toDetail">购买体验包</button>
      <button
        v-if="detailInfo.type==3||detailInfo.type==2"
        class="sel_btn"
        @click="toAppointmentList"
      >我要包月</button>
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
          <input @click="selAddrList=true" type="text" :value="toFindInfo.areaValueName" disabled />
          <i-icon class="enter_icon" size="16" type="enter" />
        </div>
        <!-- 
          <div class="input_box">
            <input @click="selAddrList2=true" type="text" :value="toFindInfo.streetName" disabled>
            <i-icon class="enter_icon" size="16" type="enter"/>
          </div>
        -->

        <div class="input_box">
          <!-- toFindInfo.contactsPhone -->
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
    <!--  -->
    <!-- 街道 -->
    <!-- <van-popup
      custom-class="bottom_pop"
      :show="selAddrList2"
      position="bottom"
      overlay="false"
      @change="streetChange"
      @close="selAddrList2=false"
    >-->
    <!-- <van-area
        :value="streetValue"
        @cancel="selAddrList2=false"
        @confirm="onConfirm2"
        columns-num="1"
        title="请选择街道"
        :area-list="streetList"
    />-->
    <!-- <van-picker
        show-toolbar
        title="请选择街道"
        :columns="streetNames"
        @change="streetChange"
        :default-index="streetIndex"
        @cancel="selAddrList2=false"
        @confirm="selStreetSubmit"
    />-->
    <!-- </van-popup> -->

    <!-- -->
    <!--       
      lunar='false'
      clean="true"
      @selectYear="selectYear"
    -->
    <!-- <Calendar
      :months="months"
      :value="value"
      @next="next"
      @prev="prev"
      multi
      :begin="begin"
      :hasPrev="hasPrev"
      :hasNext="hasNext"
      :end="end"
      :events="events"
      @select="select"
      ref="calendar"
      @selectMonth="selectMonth"
    />-->
    <!-- <button @click="setToday">返回今日</button> -->
    <i-message id="message" />
  </div>
</template>

<script>
import Calendar from "change-mpvue-calendar";
import "change-mpvue-calendar/src/style.css";
import {
  _getclassifyDetail,
  _addAppointTry,
  _getAppointcitys
} from "../../service/classify";
import { mapState, mapActions } from "vuex";
import wxParse from "mpvue-wxparse";
export default {
  data() {
    return {
      hasPrev: false,
      hasNext: true,
      months: [
        // "January",
        // "February",
        // "March",
        // "April",
        // "May",
        // "June",
        // "July",
        // "August",
        // "September",
        // "October",
        // "November",
        // "December"
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月"
      ],
      disabledarr: ["2018-6-27", "2018-6-25"],
      value: [],
      begin: [], // 2019, 5, 13
      end: [], // 2019, 6, 13
      // events: { "2019-5-13": "今日备注", "2019-5-14": "一条很长的明日备注" },
      content: "",
      currentMonth: 0,
      detailInfo: {
        type: 0,
        content: "",
        id: "",
        intro: "",
        name: "",
        price: "",
        productId: "",
        productTypeTitle: ""
      },
      detailImg: this.imgBastPath + "details_page_pic.png",
      selAddr: false,
      selAddrList: false,
      areaValue: "", //310115
      streetValue: "", // 110000
      selAddrList2: false,
      toFindInfo: {
        areaValueName: "请选择区域", // 上海市-上海市-浦东区
        // streetName: "测试街道1",
        areaCodes: [], // 310000, 310100, 310115
        // streetId: "1",
        contactsPhone: ""
      },

      areaList: {
        // province_list: {
        //   110000: "北京省",
        //   120000: "天津省",
        //   310000: "上海市"
        // },
        // city_list: {
        //   310100: "上海市",
        //   110100: "北京市",
        //   120100: "天津市"
        // },
        // county_list: {
        //   110101: "东城区",
        //   110102: "西城区",
        //   110103: "朝阳区",
        //   110104: "丰台区",
        //   120101: "和平区",
        //   120102: "河东区",
        //   120103: "河西区",
        //   120104: "南开区",
        //   120105: "河北区",
        //   310115: "浦东新区"
        // }
      },
      // streetNames: [
      //   "测试街道1",
      //   "测试街道2",
      //   "测试街道3",
      //   "测试街道4",
      //   "测试街道5"
      // ],
      // streetIds: [1, 2, 3, 4, 5],
      // streetNames: [
      //   { text: "测试街道1", id: 1 },
      //   { text: "测试街道2", id: 2 },
      //   { text: "测试街道3", id: 3 },
      //   { text: "测试街道4", id: 4 }
      // ],
      // streetIndex: 0
      typeId: ""
    };
  },
  components: {
    Calendar,
    wxParse
  },
  computed: {
    ...mapState({
      isIphoneX: state => state.login.isIphoneX,
      phoneLoginInfo: state => state.login.phoneLoginInfo,
      wxChangeLocation: state => state.login.wxChangeLocation
    })
  },
  onLoad(option) {
    // this.initDate();
    // console.log(this.imgBastPath);
    // console.log(option);
    let params = {
      id: option.id
    };
    this.typeId = option.id;
    _getclassifyDetail(params).then(res => {
      if (res.data.success) {
        // console.log(res);
        this.detailInfo = res.data.data.product;
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
    this.init();
  },
  onHide() {
    // 重置data 完成初始化
    // Object.assign(this.$data, this.$options.data());
  },
  created() {},
  methods: {
    ...mapActions(["setClassify"]),
    init() {
      let _this = this;
      _getAppointcitys().then(res => {
        if (res.data.success) {
          _this.areaList = res.data.data.area_list;
          for (let i in _this.areaList.county_list) {
            if (
              _this.areaList.county_list[i] == _this.wxChangeLocation.orderArea
            ) {
              _this.areaValue = i;
              return;
              // console.log(i)
              // console.log(_this.areaList.county_list[i]);
            }
          }
          // console.log(_this.areaList.county_list);
          // console.log(_this.wxChangeLocation.orderArea);
        }
      });
      // this.areaValue = "310115";
      // this.streetValue = "110000";
      this.selAddrList = false;
      this.selAddr = false;
      this.toFindInfo.areaValueName = "请选择区域";
      this.toFindInfo.areaCodes = [];
      this.toFindInfo.contactsPhone = "";
    },
    //
    toDetail() {
      let url = `../detail/main?id=${this.typeId}`;
      wx.navigateTo({ url });
    },
    toAppointmentList() {
      this.selAddr = true;
      // let url = `../appointment/main`;
      // wx.navigateTo({ url });
    },
    onConfirm(e) {
      let values = e.mp.detail.values;
      let areas = `${values[0].name}-${values[1].name}-${values[2].name}`;
      this.areaValue = values[2].code;
      this.toFindInfo.areaValueName = areas;
      this.toFindInfo.areaCodes = [];
      values.forEach(val => {
        this.toFindInfo.areaCodes.push(val.code);
      });
      this.selAddrList = false;
    },
    //
    areaChange(e) {
      console.log("areaChange");
      this.streetIndex = 0;
      // 请求 街道数据
      // this.streetNames = [
      //   { text: "测试街道7", id: 7 },
      //   { text: "测试街道8", id: 8 },
      // ];
    },
    // streetChange(e) {
    //   const { picker, value, index } = e.mp.detail;
    //   // console.log(`当前值：${value}, 当前索引：${index}`);
    // },
    // selStreetSubmit(e) {
    //   console.log(e);
    //   const { picker, value, index } = e.mp.detail;
    //   // console.log(`当前值：${value}, 当前索引：${index}`);
    //   this.toFindInfo.streetName = value.text;
    //   this.toFindInfo.streetId = value.id;
    // },
    toAppointment() {
      let reg = /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
      if (this.toFindInfo.areaCodes.length < 3) {
        this.$Message({
          content: "请选择区域",
          type: "default"
        });
      }
      // else if (
      //   !this.toFindInfo.contactsPhone ||
      //   !reg.test(this.toFindInfo.contactsPhone)
      // ) {
      //   this.$Message({
      //     content: "请输入正确的手机号",
      //     type: "default"
      //   });
      // }
      else {
        // 添加分类信息
        let params = {
          provinceId: this.toFindInfo.areaCodes[0],
          cityId: this.toFindInfo.areaCodes[1],
          areaId: this.toFindInfo.areaCodes[2],
          areaText: this.toFindInfo.areaValueName
        };
        // phone: this.phoneLoginInfo.phone,
        // phone: this.toFindInfo.contactsPhone,
        _addAppointTry(params).then(res => {
          /*
             res id --> 下预约的时候用  
             this.detailInfo.id --> 预约
          */
          if (res.data.success) {
            let url = `../appointment/main?productId=${this.detailInfo.id}&id=${
              res.data.data.id
            }`;
            wx.navigateTo({ url });
          }
        });
        // console.log(this.toFindInfo);
      }
    }
    // ===================================================
    // initDate() {
    //   let date = new Date();
    //   let year = date.getFullYear();
    //   let month = date.getMonth() + 1;
    //   this.currentMonth = month;
    //   let day = date.getDate();
    //   // 设置开始时间
    //   this.begin = [year, month, day];
    //   console.log(this.begin);
    //   let nextYear = year;
    //   let nextMonth = month + 1;
    //   if (nextMonth > 12) {
    //     nextMonth = 1;
    //     nextYear = year + 1;
    //   }
    //   let nextMonthLastDay = new Date(nextYear, nextMonth, 0);
    //   let nextDay = day;
    //   if (day > nextMonthLastDay) {
    //     nextDay = nextMonthLastDay;
    //   }
    //   // 设置结束时间
    //   this.end = [nextYear, nextMonth, nextDay];
    //   console.log(this.end);
    // },
    // selectMonth(month, year) {
    //   console.log(year, month);
    // },
    // prev(year, month, weekIndex) {
    //   console.log("prev");
    //   if (this.currentMonth == month) {
    //     this.hasNext = true;
    //     this.hasPrev = false;
    //   }
    // },
    // next(year, month, weekIndex) {
    //   console.log("next");
    //   if (this.currentMonth < month) {
    //     this.hasNext = false;
    //     this.hasPrev = true;
    //   }
    // },
    // selectYear(year) {
    //   console.log(year);
    // },
    // setToday(val, val1, val2) {
    //   // console.log(this.$refs.calendar)
    //   this.$refs.calendar.setToday();
    // },
    // select(val, val2) {
    //   // console.log(val);
    //   if (val.length > 3) {
    //     console.log("最多选3个");
    //     console.log((this.value.length = 3));
    //   }
    // }
  }
};
</script>

<style lang="less" scoped>
@import url("~mpvue-wxparse/src/wxParse.css");
</style>
