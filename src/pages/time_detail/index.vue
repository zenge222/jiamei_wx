<template>
  <div class="time_detail time_select_box">
    <div class="item_group2">
      <div class="g_item">
        <div class="mess_info3"></div>
        <p>可选择时间</p>
      </div>
      <div class="g_item">
        <div class="mess_info2"></div>
        <p>不可安排时间</p>
      </div>
      <div class="g_item">
        <div class="mess_info1"></div>
        <p>已工作安排时间</p>
      </div>
    </div>
    <ul>
      <li v-for="(time,x) in allTimeList" :key="x">
        <!--  @click="check(x,y)" -->
        <p
          v-for="(item,y) in time"
          :key="y"
          :class="{check:item.type==1,not_get:item.type==2,select:item.type==3,first_one:item.position==1,last_one:item.position==2}"
        >
          <span v-text="item.time"></span>
        </p>
      </li>
    </ul>
    <div class="bottom_btn_box">
      <van-button @click="goBack" custom-class="login_btn" size="normal">返回</van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "timeDetail",
  data() {
    return {
      clickNum: 0,
      submitX: -1,
      submitY: -1,
      tempX1: -1,
      tempY1: -1,
      tempX2: -1,
      tempY2: -1,

      dataTime: [
        {
          startTime: "7:00",
          endTime: "9:00"
        },
        {
          startTime: "15:00",
          endTime: "18:00"
        }
      ],
      tempAllTimeList: [
        "6:00",
        "6:30",
        "7:00",
        "7:30",
        "8:00",
        "8:30",
        "9:00",
        "9:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00",
        "20:30",
        "21:00",
        "21:30",
        "22:00",
        "",
        "",
        ""
      ],
      tempAllTimeArray: [],
      allTimeList: []
    };
  },
  components: {},
  computed: {},
  onLoad(option) {
    // console.log(JSON.parse(option.data).data.workTimeVos);
    if (option.data) {
      this.dataTime = JSON.parse(option.data).data.workTimeVos;
    }
    this.initTime(this.dataTime);
  },
  onShow() {},
  onHide() {
    // 重置data 完成初始化
    // Object.assign(this.$data, this.$options.data());
  },
  methods: {
    goBack() {
      wx.navigateBack({
        delta: -1
      });
    },
    initTime(networkData) {
      const that = this;
      that.allTimeList = new Array();
      that.tempAllTimeArray = new Array();
      for (let i = 0; i < that.tempAllTimeList.length; i++) {
        let tempObj = new Object();
        tempObj.time = that.tempAllTimeList[i];
        tempObj.type = 0;
        tempObj.position = 0;
        for (let k = 0; k < networkData.length; k++) {
          if (
            that.backTime(that.tempAllTimeList[i]) >=
              that.backTime(networkData[k].startTime) &&
            that.backTime(that.tempAllTimeList[i]) <=
              that.backTime(networkData[k].endTime)
          ) {
            tempObj.type = 1;
          }

          if (
            that.backTime(that.tempAllTimeList[i]) <
              that.backTime(networkData[0].startTime) &&
            that.backTime(that.tempAllTimeList[i]) >=
              that.backTime(networkData[0].startTime) - 3600000
          ) {
            tempObj.type = 2;
          }

          if (
            that.backTime(that.tempAllTimeList[i]) >
              that.backTime(networkData[k].endTime) &&
            that.backTime(that.tempAllTimeList[i]) <=
              that.backTime(networkData[k].endTime) + 3600000
          ) {
            tempObj.type = 2;
          }
        }
        that.tempAllTimeArray.push(tempObj);
      }
      let tempArr = new Array();
      for (let m = 0; m < that.tempAllTimeArray.length; m++) {
        if (m % 4 == 0) {
          if (tempArr.length != 0) that.allTimeList.push(tempArr);
          tempArr = new Array();
        }
        tempArr.push(that.tempAllTimeArray[m]);
      }
    },
    backTime(time) {
      let todayTime = new Date();
      let tempDay =
        todayTime.getFullYear() +
        "-" +
        (todayTime.getMonth() + 1) +
        "-" +
        todayTime.getDate() +
        " " +
        time +
        ":00";
      return new Date(tempDay).getTime();
    },
    check(x, y) {
      const that = this;
      if (that.clickNum > 1) {
        this.$toast("时间已选择，请取消后重新选择");
        return;
      }
      if (
        that.allTimeList[x][y].type == 1 ||
        that.allTimeList[x][y].type == 2 ||
        that.allTimeList[x][y].type == 3
      )
        return;
      if (that.clickNum == 0) {
        that.tempX1 = x;
        that.tempY1 = y;
        that.submitX = x;
        that.submitY = y;
        let tempX = x;
        let tempY = y;
        if (y + 4 > 6) {
          x = x + 1;
          y = y % 6;
        }
        if (
          that.allTimeList[x][y].type == 1 ||
          that.allTimeList[x][y].type == 2
        ) {
          //有冲突时间
          this.$toast("可服务时间不到两小时");
          return;
        }
        for (let i = 0; i < 4; i++) {
          if (tempY > 5) {
            tempX = tempX + 1;
            tempY = tempY % 6;
          }
          if (i == 0) {
            that.allTimeList[tempX][tempY].position = 1;
          }
          if (i == 3) {
            that.tempX2 = tempX;
            that.tempY2 = tempY;
            that.allTimeList[tempX][tempY].position = 2;
          }
          that.allTimeList[tempX][tempY].type = 3;
          tempY = tempY + 1;
        }
      }
      if (that.clickNum == 1) {
        that.initTime(that.dataTime);
        that.tempX2 = x;
        that.tempY2 = y;
        let intervalNum =
          that.tempX2 * 6 + that.tempY2 - that.tempX1 * 6 - that.tempY1;
        if (intervalNum < 0) {
          this.$toast("不可逆向选择时间");
          return;
        }
        for (let i = 0; i < intervalNum + 1; i++) {
          if (that.tempY1 > 5) {
            that.tempX1 = that.tempX1 + 1;
            that.tempY1 = that.tempY1 % 6;
          }
          if (i == 0) {
            that.allTimeList[that.tempX1][that.tempY1].position = 1;
          }
          that.allTimeList[that.tempX1][that.tempY1].type = 3;
          that.tempY1 = that.tempY1 + 1;
        }

        that.allTimeList[that.tempX2][that.tempY2].position = 2;
      }

      that.clickNum++;
    }
  }
};
</script>

<style lang="less" scoped>
.time_select_box {
  font-size: 16px;
  .item_group2 {
    position: fixed;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;
    padding: 10px 15px;
    background: #ffebeb;
    .g_item {
      display: flex;
      align-items: center;
    }
    .mess_info1 {
      width: 10px;
      height: 10px;
      border-radius: 100%;
      background: #eb5d2a;
      margin-right: 6px;
    }
    .mess_info2 {
      width: 10px;
      height: 10px;
      border-radius: 100%;
      background: #bababa;
      margin-right: 6px;
    }
    .mess_info3 {
      width: 10px;
      height: 10px;
      border-radius: 100%;
      border: 1px solid #bababa;
      margin-right: 6px;
    }
    p {
      font-size: 12px;
      margin-right: 15px;
    }
  }
  ul {
    padding: 55px 15px 100px 15px;
  }
  li {
    display: flex;
    // flex-direction: row;
    // flex-wrap: wrap;
    border-bottom: 1px solid #ddd;
    // padding: 0 5px;

    &:nth-child(1) {
      border-top: 1px solid #ddd;
    }

    p {
      flex: 1;
      // width: 25%;
      text-align: center;
      height: 70px;

      border-right: 1px solid #ddd;
      display: flex;
      align-items: center;

      span {
        flex: 1;
        height: 40px;
        line-height: 40px;
      }

      &:nth-child(1) {
        border-left: 1px solid #ddd;
      }

      &.check {
        background-color: #eb5d2a;
        color: #fff;
      }

      &.not_get {
        background-color: #bababa;
        color: #fff;
      }

      &.select {
        span {
          background-color: #eb5d2a;
          color: #fff;
        }
      }

      &.first_one {
        span {
          border-bottom-left-radius: 20px;
          border-top-left-radius: 20px;
        }
      }

      &.last_one {
        span {
          border-bottom-right-radius: 20px;
          border-top-right-radius: 20px;
        }
      }
    }
  }
}
// .bottom_btn_box {
//   width: 100%;
//   position: fixed;
//   left: 0;
//   bottom: 0;
//   background: #fff;
//   padding: 15px 0;
//   .login_btn {
//     background:#EB5D2A;
//     border-radius: 44px;
//     color: #fff;
//     margin-top: 30px;
//     width: 70%;
//     display: block;
//     margin: 0 auto;
//   }
// }
</style>