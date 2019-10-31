<template>
  <div class="aunt_detail">
    <div class="detail_header">
      <img class="bg_img" mode="widthFix" :src="detailBgImg" />
      <div class="aunt_img">
        <img class="aunt_pic" :src="detailInfo.headImg" mode="widthFix" />
      </div>
    </div>
    <div class="aunt_info">
      <div class="info1">
        {{detailInfo.truename}}
        <span>五星员工</span>
        <span>ID:95271011</span>
      </div>
      <div class="info2">
        <span style="color:#666;">
          <i>{{detailInfo.price}}</i>元/小时
        </span>
        <span style="border-right:1px solid #F5F5F5;">{{detailInfo.age}}岁</span>
        <span style="border-right:1px solid #F5F5F5;">{{detailInfo.domicile}}</span>
        <span style="border-right:1px solid #F5F5F5;">
          <em>{{detailInfo.workYears}}</em>年工作
        </span>
        <span>
          服务过
          <em>{{detailInfo.level}}</em>户
        </span>
      </div>
      <div class="auth_info">
        <div class="auth_item">
          <!-- <i-icon size="18" color="#EB5D2A" type="success_fill" /> -->
          <img class="auth_right" :src="authOk" mode="widthFix" />
          <span>身份证</span>
        </div>
        <div class="auth_item">
          <img class="auth_right" :src="authOk" mode="widthFix" />
          <span>技能认证</span>
        </div>
        <div class="auth_item">
          <img class="auth_right" :src="authOk" mode="widthFix" />
          <span>健康认证</span>
        </div>
        <!-- <div class="auth_item">
          <img class="auth_right" :src="authOk" mode="widthFix">
          <span>技能认证</span>
        </div>-->
      </div>
    </div>
    <!-- 技能展示 -->
    <div class="skill_info">
      <h3>技能展示</h3>
      <div class="skill_list">
        <div class="list_item">
          <img class="auth_right" :src="auntImg" mode="widthFix" />
          <p>烹饪</p>
        </div>
        <div class="list_item">
          <img class="auth_right" :src="auntImg" mode="widthFix" />
          <p>烹饪</p>
        </div>
        <div class="list_item">
          <img class="auth_right" :src="auntImg" mode="widthFix" />
          <p>烹饪</p>
        </div>
        <div class="list_item">
          <img class="auth_right" :src="auntImg" mode="widthFix" />
          <p>烹饪</p>
        </div>
        <div class="list_item">
          <img class="auth_right" :src="auntImg" mode="widthFix" />
          <p>烹饪</p>
        </div>
        <div class="list_item">
          <img class="auth_right" :src="auntImg" mode="widthFix" />
          <p>烹饪</p>
        </div>
      </div>
    </div>
    <!-- 从业经历 -->
    <div class="auth_message">
      <h3>从业经历</h3>
      <p>保洁经验2-3年，证件齐全，保洁经验非常丰富，服务 20多个家庭，一致得到客户好评</p>
      <div class="record">
        <p>无犯罪记录</p>
        <span>所有月嫂必须通过公安机关无犯罪记录核查</span>
      </div>
    </div>
    <div class="work_time">
      <h3>工作时间表</h3>
    </div>
    <!--  -->
    <div class="work_time" style="border-bottom:none;margin-bottom:10px;">
      <Calendar
        :months="months"
        :value="timesValue"
        @next="next"
        @prev="prev"
        :showTime="showTime"
        :workTimeList="workDaysList"
        multi
        :begin="begin"
        :hasPrev="hasPrev"
        :hasNext="hasNext"
        :end="end"
        :events="events"
        @select="select"
        :canShowToast="false"
        ref="calendar"
        @selectMonth="selectMonth"
      />
      <!--  -->
    </div>
    <div class="comment_list">
      <h3 class="comment_h3">评语</h3>

      <!-- <div class="comment">
        <div class="user_header">
          <img :src="auntImg" mode="widthFix">
          <span>王先生</span>
        </div>
        <div class="user_score">
          <div class="score_item">
            <span style="padding-right:4px;">客户评分</span>
            <van-rate
              custom-class="a"
              icon-class="b"
              :value="5"
              :size="'12'"
              :count="'5'"
              readonly="true"
            />
            <span style="padding-left:4px;">5分</span>
          </div>
          <div class="score_time">
            <span>2019-04-29</span>
            <span>12:00</span>
          </div>
        </div>
        <p class="user_message">王阿姨的态度很好，下次还会叫她~！</p>
      </div>-->

      <div class="comment" v-for="(item,index) in comments" :key="index" v-if="comments.length>0">
        <div class="user_header">
          <img :src="item.userHeaderImg" mode="widthFix" />
          <span>{{item.userName}}</span>
        </div>
        <div class="user_score">
          <div class="score_item">
            <span style="padding-right:4px;">客户评分</span>
            <van-rate
              custom-class="a"
              icon-class="b"
              :value="item.score"
              :size="'12'"
              :count="'5'"
              readonly="true"
            />
            <span style="padding-left:4px;">{{item.score}}分</span>
          </div>
          <div class="score_time">
            <span>{{item.createTime}}</span>
            <!-- <span>2019-04-29</span>
            <span>12:00</span>-->
          </div>
        </div>
        <p class="user_message">{{item.content}}</p>
      </div>

      <p class="no_comment" v-if="comments.length==0">暂无评价</p>
    </div>
    <div class="to_interview" v-show="showBtn">
      <van-button @click="toInterview" round size="normal" custom-class="interview">立即预约面试</van-button>
    </div>
    <toLoginPopup :showPop.sync="login_pop_show"></toLoginPopup>
    <i-message id="message" />
  </div>
</template>

<script>
import { _getEmployeeDetail } from "../../service/detail";
import Calendar from "change-mpvue-calendar";
import toLoginPopup from "../../components/toLoginPopup";
import { mapState, mapActions } from "vuex";
import { _addAppoint } from "../../service/detail";
export default {
  data() {
    return {
      detailBgImg: this.imgBastPath + "def_background1.png",
      authOk: this.imgBastPath + "icon_have.png",
      auntImg: this.imgBastPath + "aunt_head_portrait.png",
      auntId: "",
      auntInfo: {},
      hasPrev: false,
      login_pop_show: false,
      hasNext: true,
      showTime: true,
      benginTime: "",
      finishTime: "",
      disabledarr: [], // "2018-6-27", "2018-6-25"
      timesValue: [], // [2019, 5, 13], [2019, 5, 14]
      value2: [],
      begin: [], //
      minHour: 8,
      maxHour: 16,
      currentMonth: 0,
      currentYear: "",
      selectData: [],
      detailInfo: {
        age: 0,
        domicile: "",
        headImg: "",
        id: "",
        level: 0,
        price: 0,
        truename: "",
        workYears: "",
        appointTryId: "",
        productId: ""
      },
      workDaysList: [],
      comments: [],
      showBtn: true
    };
  },
  components: {
    Calendar,
    toLoginPopup
  },
  computed: {
    ...mapState({
      phoneLoginInfo: state => state.login.phoneLoginInfo
    })
  },
  onLoad(option) {
    // Object.assign(this.$data, this.$options.data());
    // 挑选小时工进入 --> 用于立即预约
    console.log(option)
    this.detailInfo.productId = option.productId;
    if (this.detailInfo.appointTryId) {
      this.detailInfo.appointTryId = option.appointTryId;
    }
    console.log(this.detailInfo)
    // 挑选小时工进入 和 我的预约进入
    this.auntId = option.id;
    let params = {
      id: this.auntId,
      month: option.time,
      productId:this.detailInfo.productId,
    };
    if (option.showBtn == 0) {
      this.showBtn = false;
    } else {
      this.showBtn = true;
    }
    let _this = this;

    var myDate = new Date();
    let y = myDate.getFullYear();
    let M = myDate.getMonth() + 1;
    let d = myDate.getDate();
    // 当前日期之前灰
    this.begin = [y, M, d];

    _getEmployeeDetail(params).then(res => {
      if (res.data.success) {
        console.log(res);
        _this.timesValue = [];
        _this.workDaysList = [];
        this.comments = [];
        let bastPath = res.data.data.baseUrl;
        let res1 = res.data.data.employee;
        let resTimes = res.data.data.workDays;
        let commentData = res.data.data.services;
        let times = [];
        _this.detailInfo.age = res1.age;
        _this.detailInfo.domicile = res1.domicile;
        _this.detailInfo.headImg = bastPath + res1.headImg;
        _this.detailInfo.id = res1.id;
        _this.detailInfo.level = res1.level;
        _this.detailInfo.price = res1.price;
        _this.detailInfo.truename = res1.truename;
        _this.detailInfo.workYears = res1.workYears;
        // 处理  commentData --> comments
        commentData.forEach(val => {
          val.userHeaderImg = bastPath + val.userHeaderImg;
        });
        _this.comments = _this.comments.concat(commentData);
        if (resTimes) {
          resTimes.forEach(val => {
            let arr = [];
            let arr2 = val.workDay.split("-");
            arr2.forEach(val2 => {
              arr.push(Number(val2));
            });
            val.workDay = arr.join("-");
            times.push(arr);
          });
          _this.workDaysList = resTimes;
        }
        _this.timesValue = _this.timesValue.concat(times);
      }
    });
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    this.currentYear = year;
    this.currentMonth = month;
  },
  onHide() {
    // 重置data 完成初始化
    // Object.assign(this.$data, this.$options.data());
  },
  created() {},
  methods: {
    toInterview() {
      if (this.phoneLoginInfo.phoneNum) {
        let params = {
          employeeId: this.detailInfo.id,
          appointTryId: this.detailInfo.appointTryId,
          productId: this.detailInfo.productId
        };
        _addAppoint(params).then(res => {
          if (res.data.success) {
            let url = `../successful_appointment/main`;
            wx.navigateTo({ url });
          } else {
            this.$Message({
              content: res.data.message,
              type: "error"
            });
          }
        });
      } else {
        this.login_pop_show = true;
      }
    },
    prev(year, month, weekIndex) {
      let yearShow = Number(this.currentYear) >= Number(year);
      if (yearShow && this.currentMonth == month) {
        this.hasNext = true;
        this.hasPrev = false;
      }
    },
    next(year, month, weekIndex) {
      let yearShow = Number(this.currentYear) < Number(year);
      if (yearShow || this.currentMonth < month) {
        // this.hasNext = false;
        this.hasPrev = true;
      }
      // console.log(this.hasPrev);
    }
  }
};
</script>

<style lang="less" scoped>
</style>
