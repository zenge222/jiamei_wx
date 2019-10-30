<template>
  <div class="aaa">
    <div class="week_day">
      <span>日</span>
      <span>一</span>
      <span>二</span>
      <span>三</span>
      <span>四</span>
      <span>五</span>
      <span>六</span>
    </div>
    <!-- wx:for="{{monthDay}}" wx:key="{{index}}" -->
    <!-- 
         curYear="{{item.curYear}}" header-style='header-style' curMonth="{{item.curMonth}}" weekheight="{{weekheight}}" weekTitle_show="{{weekTitle_show}}" circle_show="{{circle_show}}" closelaststyle="{{closelaststyle&&index==0}}" bindselectDate="dayClick"
         speciallist="{{speciallist}}" header_show='{{header_show}}' prev="{{prev}}" next="{{next}}"
    -->
    <div v-for="(item,index) in monthDay" :key="index">
      <calendar
        :curYear="item.curYear"
        header-style="header-style"
        :curMonth="item.curMonth"
        :weekheight="weekheight"
        :weekTitle_show="weekTitle_show"
        :circle_show="circle_show"
        :closelaststyle="closelaststyle&&index==0"
        :speciallist="speciallist"
        :header_show="header_show"
        :prev="prev"
        :next="next"
        @selectDate="dayClick"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: "aaa",
  data() {
    return {
      MONTHS: [
        "Jan.",
        "Feb.",
        "Mar.",
        "Apr.",
        "May.",
        "June.",
        "July.",
        "Aug.",
        "Sept.",
        "Oct.",
        "Nov.",
        "Dec."
      ],
      demo2_days_style: [],
      year: new Date().getFullYear(), // 年份
      month: new Date().getMonth() + 1, // 月份
      day: new Date().getDate(),
      str: "", //this.MONTHS[new Date().getMonth()], // 月份字符串

      prev: false,
      next: false,
      circle_show: false,
      closelaststyle: true,
      header_show: true,
      weekTitle_show: false,
      weekheight: 80,
      speciallist: [],
      monthDay: []
    };
  },
  computed: {},
  watch: {
    speciallist(newName, oldName) {
      // this.speciallist = newName + ' ' + this.lastName;
      console.log(newName);
      console.log(oldName);
    }
  },

  onLoad() {
    // this.speciallist = [
    //   { date: "2019-05-13", background: "yellow", text: "文字1", color: "" },
    //   { date: "2019-05-14", background: "red", text: "文字2" },
    //   { date: "2019-05-15", background: "blue", text: "文字" },
    //   { date: "2019-05-16", background: "orange", text: "文字" },
    //   { date: "2019-05-17", background: "white", text: "文字" }
    // ];
    // console.log(this.speciallist);
    this.init();
  },
  onShow() {},
  onHide() {},
  methods: {
    init() {
      this.str = this.MONTHS[new Date().getMonth()]; // 月份字符串
      const days_count = new Date(this.year, this.month, 0).getDate();
      let demo1_days_style = new Array();
      let month = new Array();
      let currentYear = new Date().getFullYear();
      let currentMonth = new Date().getMonth();
      for (let m = 0; m < 12; m++) {
        currentMonth++;
        if (currentMonth > 12) {
          currentMonth = currentMonth - 12;
          currentYear = currentYear + 1;
        }
        let monthObj = {
          curMonth: currentMonth,
          curYear: currentYear
        };
        month.push(monthObj);
      }
      this.monthDay = month;
    },
    next(event) {
      //监听点击下个月事件:nextMonth
      console.log(event.mp.detail);
    },
    prev(event) {
      //监听点击上个月事件:prevMonth
      console.log(event.mp.detail);
    },
    dayClick(event) {
      //监听点击日历具体某一天的事件:dayClick
      const days_count = new Date(this.year, this.month, 0).getDate();
      let tempDay = event.mp.detail.date;
      // let specialArr = this.speciallist;
      console.log(event.mp.detail.date);
      let specialObj = {
        date: event.mp.detail.date,
        background: "#EB5D2A",
        color: "#fff"
      };
      this.speciallist.push(specialObj);
      // console.log(this.speciallist);

      // specialArr.push(specialObj);
      // this.speciallist.push(specialObj);
      // this.peciallist= specialArr;

      // console.log(this.$data.speciallist)
      // console.log(specialArr)
      // Object.assign(this.$data.speciallist, specialArr);
      // console.log(event)
      // console.log(this.peciallist[0])
      // this.$set(this.peciallist[0],0,specialObj)
      // Vue.set(this.speciallist, specialObj, specialArr);
      // specialArr.push(specialObj);
      // this.speciallist = specialArr;
      // console.log(this.speciallist)
    }
  }
};
</script>

<style lang="less" scoped>
@import "./style.less";
</style>