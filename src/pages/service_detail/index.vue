<template>
  <div class="service_detail">
    <!-- <van-tabs
      animated="true"
      sticky="true"
      swipe-threshold="4"
      swipeable="true"
      custom-class="order_tab"
      tab-class="order_tabs"
      :active="activeIndex"
      @change="changeOrderList"
    >
      <van-tab title="总次数">
        <div class="order_list_null" v-if="serviceList.length==0">
          <img class="default_pic" mode="widthFix" :src="noOrderPic">
          <p>目前没有任何服务明细</p>
        </div>
        <div v-if="serviceList.length>0">
          <div class="list_content">
            <div class="waiter_list" v-for="(item,index) in serviceList" :key="index">
              <img mode="widthFix" :src="item.employeeHeadImg">
              <div class="waiter_info">
                <div class="waiter_name">
                  <h3>{{item.employeeName}}{{item.employeeSex}}</h3>
                  <i>{{item.statusStr}}</i>
                </div>
                <p>{{item.startTime}}</p>
              </div>
            </div>
          </div>
          <i-load-more v-show="hasMore" :tip="hasMore?'数据加载中':'暂无更多服务明细'" :loading="hasMore"/>
        </div>
      </van-tab>

      <van-tab tab-class="order_tabs" title="已使用">
        <div class="order_list_null" v-if="serviceList.length==0">
          <img class="default_pic" mode="widthFix" :src="noOrderPic">
          <p>目前没有任何服务明细</p>
        </div>
        <div v-if="serviceList.length>0">
          <div class="list_content">
            <div class="waiter_list" v-for="(item,index) in serviceList" :key="index">
              <img mode="widthFix" :src="item.employeeHeadImg">
              <div class="waiter_info">
                <div class="waiter_name">
                  <h3>{{item.employeeName}}{{item.employeeSex}}</h3>
                </div>
                <p>{{item.startTime}}</p>
              </div>
            </div>
          </div>
          <i-load-more v-show="hasMore" :tip="hasMore?'数据加载中':'暂无更多服务明细'" :loading="hasMore"/>
        </div>
      </van-tab>

      <van-tab title="未使用">
        <div class="order_list_null" v-if="serviceList.length==0">
          <img class="default_pic" mode="widthFix" :src="noOrderPic">
          <p>目前没有任何服务明细</p>
        </div>
        <div v-if="serviceList.length>0">
          <div class="list_content">
            <div class="waiter_list" v-for="(item,index) in serviceList" :key="index">
              <img mode="widthFix" :src="item.employeeHeadImg">
              <div class="waiter_info">
                <div class="waiter_name">
                  <h3>{{item.employeeName}}{{item.employeeSex}}</h3>
                </div>
                <p>{{item.startTime}}</p>
              </div>
            </div>
          </div>
          <i-load-more v-show="hasMore" :tip="hasMore?'数据加载中':'暂无更多服务明细'" :loading="hasMore"/>
        </div>
      </van-tab>
    </van-tabs>-->

    <div class="order_list_null" v-if="serviceList.length==0">
      <img class="default_pic" mode="widthFix" :src="noOrderPic" />
      <p>目前没有任何服务明细</p>
    </div>
    <div v-if="serviceList.length>0">
      <div class="list_content">
        <div class="waiter_list" v-for="(item,index) in serviceList" :key="index">
          <div class="waiter_img">
            <img mode="widthFix" :src="item.employeeHeadImg" />
          </div>
          <div class="waiter_info">
            <div class="waiter_name">
              <h3>{{item.employeeName}}{{item.employeeSex}}</h3>
            </div>
            <p>{{item.timeGroup}}</p>
          </div>
        </div>
      </div>
      <i-load-more v-show="hasMore" :tip="hasMore?'数据加载中':'暂无更多服务明细'" :loading="hasMore" />
    </div>
  </div>
</template>

<script>
import { _getServiceDetailsList } from "../../service/detail";
export default {
  name: "service_detail",
  data() {
    return {
      noOrderPic: this.imgBastPath + "def_Diagram.png",
      serviceParams: {
        indentId: "",
        pageNumber: 1,
        pageSize: 8,
        status: 2
      },
      hasMore: true,
      serviceList: [],
      activeIndex: 0
    };
  },
  computed: {},
  onLoad(option) {
    this.serviceParams.indentId = option.indentId;
  },
  onShow() {
    this.getData("change");
  },
  onHide() {
    // 重置data 完成初始化
    Object.assign(this.$data, this.$options.data());
  },
  methods: {
    getData(flag) {
      let _this = this;
      _getServiceDetailsList(this.serviceParams).then(res => {
        if (res.data.success) {
          let page = res.data.data.page;
          let baseUrl = res.data.data.baseUrl || "https://file.omnrj.com";
          let resData = res.data.data.list;
          let servicesDate = "";
          if (resData.length > 0) {
            servicesDate = res.data.data.list[0].startTime.split(" ")[0];
          }
          resData.forEach(val => {
            let startTime = val.startTime.split(" ")[1];
            let endTime = val.endTime.split(" ")[1];
            val.timeGroup = servicesDate + " " + startTime + "-" + endTime;
            val.employeeHeadImg = baseUrl + val.employeeHeadImg;
          });
          console.log(resData);
          if (this.serviceParams.pageNumber == page.totalPage) {
            this.hasMore = false;
          }
          if (flag == "change") {
            this.serviceList = resData;
          } else {
            if (this.serviceParams.pageNumber >= page.totalPage) {
              this.hasMore = false;
            } else {
              this.serviceList = this.serviceList.concat(resData);
            }
          }
        }
      });
    },
    changeOrderList(e) {
      let tabIndex = e.mp.detail.index;
      this.activeIndex = tabIndex;
      switch (tabIndex) {
        case 0:
          this.serviceParams.pageNumber = 1;
          this.serviceParams.status = "";
          this.getData("change");
          break;
        case 1:
          this.serviceParams.pageNumber = 1;
          this.serviceParams.status = 3;
          this.getData("change");
          break;
        case 2:
          this.serviceParams.pageNumber = 1;
          this.serviceParams.status = 2;
          this.getData("change");
          break;
        default:
          break;
      }
    }
  },
  // 上拉加载
  onReachBottom: function() {
    this.serviceParams.pageNumber++;
    this.getData();
  },
  //下拉刷新
  onPullDownRefresh() {
    this.getData("change");
    wx.stopPullDownRefresh(); // 通知页面停止下拉刷新效果
  }
};
</script>

<style lang="less" scoped>
.order_list_null {
  margin-top: 10px;
  background: #fff;
  padding: 50px 0 300px 0;

  .default_pic {
    width: 50%;
    display: block;
    margin: 0 auto;
  }

  p {
    font-size: 12px;
    text-align: center;
    color: #818181;
    line-height: 40px;
  }
}
</style>