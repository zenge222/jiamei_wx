<template>
  <div class="date_selection">
    <!-- <h3 class="sel_tilte">初体验可任选{{servicesInfo.hasServicesNum}}次服务日期，长期服务请购买套餐</h3> -->
    <Calendar
      :months="months"
      :value="timesValue"
      @next="next"
      @prev="prev"
      multi
      :begin="begin"
      :hasPrev="hasPrev"
      :hasNext="hasNext"
      :end="end"
      :events="events"
      @select="select"
      :servicesInfo="servicesInfo"
      :selTimeList="areaList"
      ref="calendar"
      @selectMonth="selectMonth"
    />
    <button class="date_submit_btn" @click="dateSubmit">提交</button>
    <van-popup
      custom-class="center_pop"
      :show="messagePopShow"
      position="center"
      overlay="false"
      @close="messagePopShow=false"
    >
      <div class="success_item">
        <img class="success_icon" :src="successIcon" mode="widthFix" alt />
        <h3>定制成功</h3>
        <button @click="linkToSerivce" class="service_btn">查看服务列表</button>
      </div>
    </van-popup>
    <i-message id="message" />
  </div>
</template>

<script>
import Calendar from "change-mpvue-calendar";
import "change-mpvue-calendar/src/style.css";
import { _addWorkTime, _getWorkTime } from "../../service/detail";
import { _getTimeList } from "../../api/common";
export default {
  name: "date_selection",
  data() {
    return {
      // selInfo:{
      //   benginCode:'110101',
      //   endCode:'120201'
      // },
      //
      successIcon: this.imgBastPath + "icon_Custom_success.png",
      messagePopShow: false,
      hasPrev: false,
      hasNext: true,
      months: [
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
      timesValue: [], // [2019, 5, 13], [2019, 5, 14]
      incomeTimeValue: [],
      value2: [],
      begin: [], // 2019, 5, 13
      // end: [], // 2019, 6, 13
      // events: {
      //   "2019-5-13": { time: "08:00-13:00", code1: "110101", code2: "120201" },
      //   "2019-5-14": { time: "15:30-18:00", code: "120402", code2: "120701" }
      // },
      currentMonth: 0,
      // currentSelDay: "",
      // selData: new Map(),
      // currentDate: "8:00",
      minHour: 8,
      maxHour: 16,
      selectData: [],
      orderId: null,
      fromMyOrder: false,
      hasServices: 0,
      servicesInfo: {
        servicesNum: 0,
        useServicesNum: 0,
        hasServicesNum: 0,
        everyTimeDuration: 0
      },
      areaList: {}
    };
  },
  computed: {},
  components: {
    Calendar
  },
  onLoad(option) {
    Object.assign(this.$data, this.$options.data());
    this.orderId = option.orderId;
    if (
      (option.from && option.from == "myOrder") ||
      option.from == "package" ||
      option.from == "paySuccess"
    ) {
      this.fromMyOrder = true;
    }
    this.initDate();
    if (this.fromMyOrder) {
      let _this = this;
      let params = {
        indentId: this.orderId
      };
      _getWorkTime(params).then(res => {
        if (res.data.success) {
          let times = [];
          let workUseCount = res.data.data.workDays;
          _this.servicesInfo.servicesNum = res.data.data.indent.servicesNum;
          _this.servicesInfo.everyTimeDuration =
            res.data.data.indent.everyTimeDuration;
          _this.servicesInfo.useServicesNum =
            res.data.data.indent.useServicesNum;
          _this.servicesInfo.hasServicesNum =
            res.data.data.indent.servicesNum -
            res.data.data.indent.useServicesNum;
          _this.areaList = _getTimeList(_this.servicesInfo.everyTimeDuration);
          if (workUseCount) {
            workUseCount.forEach(val => {
              let arr = [];
              let arr2 = val.workDay.split("-");
              arr2.forEach(val2 => {
                arr.push(Number(val2));
              });
              val.workDay = arr.join("-");
              times.push(arr);
            });
            _this.timesValue = times;
            _this.incomeTimeValue = [];
            for (let i = 0; i < times.length; i++)
              this.incomeTimeValue.push(times[i].join("-"));
          }
        }
      });
    }
  },
  onShow() {},
  onHide() {
    // 重置data 完成初始化
    // Object.assign(this.$data, this.$options.data());
    // console.log(this.$refs.calendar)
  },
  methods: {
    sureCancelTime() {
      let _this = this;
      wx.showModal({
        title: "提示",
        content: "确定取消",
        success(res) {
          if (res.confirm) {
            _this.currentVal2[_this.cancelIndex].selected = false;
            _this.selectData.splice(_this.cancelIndex, 1);
            _this.currentVal2.splice(_this.cancelIndex, 1);
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    initDate() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      this.currentMonth = month;
      let day = date.getDate();
      // 设置开始时间
      this.begin = [year, month, day + 1];
      let nextYear = year;
      let nextMonth = month + 1;
      if (nextMonth > 12) {
        nextMonth = 1;
        nextYear = year + 1;
      }
      let nextMonthLastDay = new Date(nextYear, nextMonth, 0);
      let nextDay = day + 2;
      if (day > nextMonthLastDay) {
        nextDay = nextMonthLastDay;
      }
      // 设置结束时间
      this.end = [nextYear, nextMonth, nextDay];
    },
    selectMonth(month, year) {
      console.log(year, month);
    },
    prev(year, month, weekIndex) {
      console.log("prev");
      if (this.currentMonth == month) {
        this.hasNext = true;
        this.hasPrev = false;
      }
    },
    next(year, month, weekIndex) {
      console.log("next");
      if (this.currentMonth < month) {
        // this.hasNext = false;
        this.hasPrev = true;
      }
    },
    selectYear(year) {
      console.log(year);
    },
    setToday(val, val1, val2) {
      // console.log(this.$refs.calendar)
      this.$refs.calendar.setToday();
    },

    select(val, val2) {
      // 获取当前日期    初始化无效 组件缓存了记录 待解决
      this.selectData = val2;
      console.log("select");
      console.log(this.selectData);
    },
    linkToSerivce() {
      wx.navigateBack(-1);
    },
    dateSubmit() {
      let _this = this;
      let timeArr = [];
      let tempSelectData = new Array();
      for (let i = 0; i < _this.selectData.length; i++) {
        if (_this.incomeTimeValue.indexOf(_this.selectData[i].date) < 0) {
          tempSelectData.push(_this.selectData[i]);
        }
      }

      if (tempSelectData.length > 0) {
        tempSelectData.forEach(val => {
          let timeObj = {};
          timeObj.startTime = `${val.date} ${val.benginTime}`;
          timeObj.endTime = `${val.date} ${val.finishTime}`;
          timeArr.push(timeObj);
        });
        let params = {
          indentId: this.orderId,
          timeJsons: JSON.stringify(timeArr)
        };
        _addWorkTime(params).then(res => {
          if (res.data.success) {
            if (_this.fromMyOrder) {
              // wx.navigateBack(-1);
              this.messagePopShow = true;
            } else {
              let url = `../my_appointment/main`;
              wx.switchTab({ url });
            }
          } else {
            this.$Message({
              content: res.data.message,
              type: "warning"
            });
          }
        });
      } else {
        this.$Message({
          content: "请至少添加一个时间段",
          type: "warning"
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.date_selection {
  .sel_tilte {
    background: #fdf5d4;
    font-size: 12px;
    color: #666;
    text-align: center;
    line-height: 32px;
  }

  .date_submit_btn {
    display: block;
    margin: 20px auto;
    line-height: 40px;
    height: 40px;
    color: #fff;
    background: #eb5d2a;
    border-radius: 40px;
    width: 60%;
    border: 1px solid #eb5d2a;
    font-size: 14px;
  }
}
</style>
