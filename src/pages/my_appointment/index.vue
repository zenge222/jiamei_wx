<template>
  <div class="my_order my_appointnemt">
    <!--<div class="tab_icon">
            <div @click="changeActive(index)" class="icon_box" v-for="(item,index) in imgs" :key="index">
              <img mode="widthFix" :src="item" />
            </div>
    </div>-->
    <van-tabs
      swipeable="true"
      animated="true"
      sticky="true"
      :custom-class="'order_tab'"
      :tab-class="'order_tabs'"
      :active="activeIndex"
      swipe-threshold="4"
      @change="onChange"
    >
      <van-tab title="待确认">
        <div class="order_list_null" v-if="appointList.length==0">
          <img class="default_pic" mode="widthFix" :src="noOrderPic" />
          <p>暂无预约面试申请</p>
        </div>
        <div class="list_card" v-if="appointList.length>0">
          <ul>
            <li class="list_box" v-for="(item,index) in appointList" :key="index">
              <div class="list_left">
                <img
                  @click="toDetail(item.employeeId)"
                  class="list_pic"
                  mode="widthFix"
                  :src="item.employeeHeadImg"
                />
              </div>
              <div class="list_right">
                <h3>{{item.employeeName}}</h3>
                <div class="info clearfix">
                  <h5>{{item.employeeAge}}岁</h5>
                  <h5>{{item.employeeDomicile}}</h5>
                  <h5>
                    <span>{{item.employeeWorkYears}}</span>年工作
                  </h5>
                  <h5>
                    服务过
                    <span>{{item.employeeAge}}</span>户
                  </h5>
                </div>
                <!-- <div class="rate_box">
                  <van-rate
                    custom-class="a"
                    icon-class="b"
                    :value="item.employeeLevel"
                    :size="'12'"
                    :count="'5'"
                    readonly="true"
                    @change="rateChange"
                  />
                </div>-->
                <div class="rate_container">
                  <img
                    :src="rateImg"
                    mode="widthFix"
                    v-for="(item2,index2) in item.employeeLevel"
                    :key="index2"
                  />
                </div>
                <div class="list_bottom clearfix">
                  <h4 class="fl">
                    <span></span>
                    {{item.employeePrice}}元/{{item.employeePriceUnit}}
                  </h4>
                  <!-- v-if="item.status==0" -->
                  <button @click="delItem(item.id,item.employeeId,index)" class="list_btn fr">取消面试</button>
                </div>
              </div>
            </li>
          </ul>
          <i-load-more :tip="hasMore?'数据加载中':'暂无更多数据'" :loading="hasMore" />
        </div>
      </van-tab>
      <!-- 
      <van-tab tab-class="order_tabs" title="待下单">
        <div class="order_list_null">
          <img class="default_pic" mode="widthFix" :src="noOrderPic">
          <p>目前没有任何订单</p>
        </div>
      </van-tab>-->

      <van-tab title="已结束">
        <div class="order_list_null" v-if="appointList.length==0">
          <img class="default_pic" mode="widthFix" :src="noOrderPic" />
          <p>暂无预约面试申请</p>
        </div>
        <div class="list_card" v-if="appointList.length>0">
          <ul>
            <li class="list_box" v-for="(item,index) in appointList" :key="index">
              <div class="list_left">
                <img
                  @click="toDetail(item.employeeId)"
                  class="list_pic"
                  mode="widthFix"
                  :src="item.employeeHeadImg"
                />
              </div>
              <div class="list_right">
                <h3>{{item.employeeName}}</h3>
                <div class="info clearfix">
                  <h5>{{item.employeeAge}}岁</h5>
                  <h5>{{item.employeeDomicile}}</h5>
                  <h5>
                    <span>{{item.employeeWorkYears}}</span>年工作
                  </h5>
                  <h5>
                    服务过
                    <span>{{item.employeeAge}}</span>户
                  </h5>
                </div>
                <div class="rate_container">
                  <img
                    :src="rateImg"
                    mode="widthFix"
                    v-for="(item2,index2) in item.employeeLevel"
                    :key="index2"
                  />
                </div>
                <div class="list_bottom clearfix">
                  <h4 class="fl">
                    <span></span>
                    {{item.employeePrice}}元/{{item.employeePriceUnit}}
                  </h4>
                  <p class="list_btn list_btn2 fr" v-if="item.status==4">面试成功</p>
                  <p class="list_btn list_btn3 fr" v-if="item.status==5">面试失败</p>
                  <p class="list_btn list_btn4 fr" v-if="item.status==6">已取消</p>
                  <p class="list_btn list_btn4 fr" v-if="item.status==2">放弃面试</p>
                </div>
              </div>
            </li>
          </ul>
          <i-load-more :tip="hasMore?'数据加载中':'暂无更多数据'" :loading="hasMore" />
        </div>
      </van-tab>
    </van-tabs>

    <toLoginPopup :showPop.sync="login_pop_show" :maskClose="false"></toLoginPopup>

    <i-message id="message" />
  </div>
</template>

<script>
import { _getAppointmentList } from "../../service/classify";
import { mapState, mapActions } from "vuex";
import {
  _getAppointList,
  _addAppoint,
  _delAppoint
} from "../../service/detail";
import toLoginPopup from "../../components/toLoginPopup";
export default {
  data() {
    return {
      iponePic: this.imgBastPath + "ipone.png",
      rateImg: this.imgBastPath + "icon_Diamonds.png",
      login_pop_show: false,
      noOrderPic: this.imgBastPath + "def_No_appointment.png",
      proPicture: this.imgBastPath + "pro_picture.png",
      imgs: [
        this.imgBastPath + "icon_all.png",
        this.imgBastPath + "icon_confirmed.png",
        this.imgBastPath + "icon_serve.png"
      ],
      activeIndex: 0,
      appointParams: {
        pageSize: 5,
        pageNumber: 1,
        type: "wait",
        loading: true
      },
      appointList: [],
      hasMore: true,
      haSreach: true
    };
  },
  components: {
    toLoginPopup
  },
  created() {},
  computed: {
    ...mapState({
      authorization: state => state.login.authorization,
      phoneLoginInfo: state => state.login.phoneLoginInfo
    })
  },
  onLoad() {},
  onShow() {
    if (!this.authorization) {
      this.login_pop_show = true;
    } else {
      this.login_pop_show = false;
      this.initList();
      this.getListData("change");
    }
    // Object.assign(this.$data, this.$options.data());
  },
  onHide() {
    // 重置data 完成初始化
    // Object.assign(this.$data, this.$options.data());
  },
  methods: {
    initList() {
      // this.appointList = [];
      this.appointParams.pageNumber = 1;
      this.hasMore = true;
    },
    getListData(flag) {
      let _this = this;
      _getAppointList(this.appointParams).then(res => {
        if (res.data.success) {
          let page = res.data.data.page;
          if (_this.appointParams.pageNumber < page.totalPage) {
            _this.haSreach = true;
          } else {
            _this.haSreach = false;
          }
          if (_this.appointParams.pageNumber == page.totalPage) {
            _this.hasMore = false;
          }
          let resData = [];
          let bastPath = res.data.data.baseUrl;
          resData = res.data.data.list;
          resData.forEach(val => {
            val.employeeHeadImg = bastPath + val.employeeHeadImg;
          });
          // resData.forEach((val,index)=>{
          //   _this.$set(_this.appointList,index,val);
          // })
          if (resData.length < 5) {
            _this.hasMore = false;
          }
          if (flag == "change") {
            _this.appointList = [];
            resData.forEach((val, index) => {
              _this.$set(_this.appointList, index, val);
            });
          } else {
            _this.appointList = _this.appointList.concat(resData);
          }
        }
      });
    },
    aaa(e) {
      console.log(e);
    },
    toDetail(id) {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let second = date.getSeconds();
      let time = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
      let url = `../aunt_detail/main?id=${id}&time=${time}&showBtn=0`;
      wx.navigateTo({ url });
    },
    delItem(id, employeeId, index) {
      // 等待 经理端 确认
      let _this = this;
      if (this.phoneLoginInfo.phoneNum) {
        wx.showModal({
          title: "提示",
          content: "确定取消此面试",
          success(res) {
            if (res.confirm) {
              let params = {
                id: id
              };
              _delAppoint(params).then(res => {
                if (res.data.success) {
                  // let listData = _this.appointList;
                  // listData.splice(index, 1);
                  // _this.appointList = [];
                  // listData.forEach((val, index) => {
                  //   _this.$set(_this.appointList, index, val);
                  // });
                  // 触发加载
                  // if (_this.appointList.length > 5) {
                  //   _this.appointParams.pageNumber++;
                  //   _this.getListData();
                  // }
                  _this.getListData("change");
                }
              });
            } else if (res.cancel) {
            }
          }
        });
      } else {
        this.login_pop_show = true;
      }
    },
    onChange(e) {
      let tabIndex = e.mp.detail.index;
      this.activeIndex = tabIndex;
      this.hasMore = true;
      switch (this.activeIndex) {
        case 0:
          this.initList();
          this.appointParams.type = "wait";
          this.getListData("change");
          break;
        case 1:
          this.initList();
          this.appointParams.type = "end";
          this.getListData("change");
          break;
        default:
          break;
      }
    }
    // toRegOrLogin() {
    //   let url = `../login/main`;
    //   wx.navigateTo({ url });
    // }
  },
  // 上拉加载
  onReachBottom() {
    if (this.haSreach) {
      this.appointParams.pageNumber++;
      this.getListData();
    }
  },
  //下拉刷新
  onPullDownRefresh() {
    this.initList();
    this.getListData("change");
    wx.stopPullDownRefresh(); // 通知页面停止下拉刷新效果
  }
};
</script>

<style lang="less" scoped>
</style>
