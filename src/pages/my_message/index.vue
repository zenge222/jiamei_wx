<template>
  <div class="my_message">
    <div class="order_list_null" v-show="messageList.length==0">
      <img class="default_pic" mode="widthFix" :src="noMessagePic">
      <p>目前没有任何消息</p>
    </div>
    <div class="message_box" v-show="messageList.length>0">
      <div class="message_list">
        <div class="list_left">
          <div class="list_header">
            <span>HOT</span>
            <div class="header_info">
              <h3>99元团</h3>
              <div class="line"></div>
              <h3>限时6天</h3>
            </div>
          </div>
          <p>4小时保姆服务，库存有限，快来 抢购,还有很多活动>></p>
        </div>
        <img src="https://file.omnrj.com/upload/20190514143009766373.png" mode="widthFix" alt>
      </div>
      <i-load-more v-show="hasMore" :tip="hasMore?'数据加载中':'暂无更多消息'" :loading="hasMore"/>
    </div>
  </div>
</template>

<script>
import { _getUserMessage } from "../../service/home";
export default {
  name: "my_message",
  data() {
    return {
      noMessagePic: this.imgBastPath + "def_no_order.png",
      messageParams: {
        pageNumber: 1,
        pageSize: 6
      },
      messageList: [],
      hasMore: true
    };
  },
  computed: {},
  components: {},
  onLoad() {
    this.messageParams.pageNumber = 1;
    this.getData("change");
  },
  onShow() {},
  onHide() {
    // 重置data 完成初始化
    //  Object.assign(this.$data, this.$options.data());
  },
  methods: {
    getData(flag) {
      let _this = this;
      _getUserMessage(this.messageParams).then(res => {
        console.log(res);
        if (res.data.success) {
          let baseUrl = res.data.data.baseUrl;
          let page = res.data.data.page;
          let resData = res.data.data.list;
          // resData.forEach(val => {
          //   val.productImg = baseUrl + val.productImg;
          // });
          if (this.messageParams.pageNumber < page.totalPage) {
            this.hasMore = true;
          } else {
            this.hasMore = false;
          }
          if (flag == "change") {
            _this.messageList = resData;
          } else {
            _this.messageList = _this.messageList.concat(resData);
          }
        }
      });
    }
  },
  // 上拉加载
  onReachBottom: function() {
    this.messageParams.pageNumber++;
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
.my_message {
  height: 100%;
  .message_box {
    padding: 20px 12px;
    .message_list {
      background: #fff;
      padding: 12px;
      display: flex;
      margin-bottom: 12px;
      border-radius: 6px;
      .list_left {
        padding-right: 20px;
        .list_header {
          display: flex;
          align-items: center;
          > span {
            font-size: 10px;
            display: block;
            color: #fff;
            background: #eb5d2a;
            line-height: 1.6;
            border-radius: 6px;
            padding: 0 4px;
            margin-right: 6px;
          }
          .header_info {
            display: flex;
            align-items: center;
            // padding-bottom: 10px;
            h3 {
              font-size: 16px;
              line-height: 1;
            }
            .line {
              height: 14px;
              width: 1px;
              background: #333;
              margin: 0 4px;
            }
          }
        }
        > p {
          padding-top: 10px;
          font-size: 12px;
          color: #bababa;
          line-height: 1.6;
        }
      }
      img {
        width: 40%;
      }
    }
  }
}
.order_list_null {
  margin-top: 12px;
  background: #fff;
  padding: 50px 0 0 0;
  height: 100%;
  box-sizing: border-box;
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