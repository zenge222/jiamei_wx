<template>
  <div class="service_evaluation">
    <div class="rate_header">
      <img :src="rateData.productImg" mode="widthFix" />
      <div class="header_info">
        <h3>
          {{rateData.productName}}
          <!-- （第<span>1</span>次） -->
        </h3>
        <p>
          {{rateData.createTime}}
          <!-- 2019-04-22
          <span style="padding-left:10px;">14:26</span>-->
        </p>
      </div>
    </div>
    <div class="rate_content">
      <h3>服务评价</h3>
      <textarea
        v-model="rateData.content"
        placeholder="说说本次的感受,我们将更做的更好"
        class="msg_input"
        type="text"
        bindtap
      ></textarea>
      <div class="rate_check_container">
        <div class="rate_check_list" v-for="(item,index) in rateList" :key="index">
          <h3>{{item.title}}</h3>
          <van-radio-group
            :custom-class="'check_container'"
            :value="item.score"
            @change="rateChange($event,item,index)"
          >
            <van-radio
              :custom-class="'check_radio'"
              :label-class="'right_title'"
              checked-color="#EB5D2A"
              v-for="(item2,index2) in rateList1"
              :key="index2"
              :name="item2.name"
            >
              <span :class="item.score==item2.name?'active':''">{{item2.title}}</span>
            </van-radio>
          </van-radio-group>
        </div>

        <!-- <div class="rate_check_list">
          <h3>请问您对今天的服务满意吗？</h3>
          <van-radio-group
            :custom-class="'check_container'"
            :value="rateVal2"
            @change="rateChange2"
          >
            <van-radio
              :custom-class="'check_radio'"
              :label-class="'right_title'"
              checked-color="#EB5D2A"
              v-for="(item,index) in rateList1"
              :key="index"
              :name="item.name"
            >
              <span :class="rateVal2==item.name?'active':''">{{item.title}}</span>
            </van-radio>
          </van-radio-group>
        </div>

        <div class="rate_check_list">
          <h3>请问您对今天的服务满意吗？</h3>
          <van-radio-group
            :custom-class="'check_container'"
            :value="rateVal3"
            @change="rateChange3"
          >
            <van-radio
              :custom-class="'check_radio'"
              :label-class="'right_title'"
              checked-color="#EB5D2A"
              v-for="(item,index) in rateList1"
              :key="index"
              :name="item.name"
            >
              <span :class="rateVal3==item.name?'active':''">{{item.title}}</span>
            </van-radio>
          </van-radio-group>
        </div>-->
      </div>
    </div>
    <div :class="{'to_interview':true,'fix-iphonex-buttom':isIphoneX}">
      <van-button @click="toPublish" round size="normal" custom-class="interview">发布</van-button>
    </div>
    <van-toast id="custom-selector" />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { _getCheckServicesItem, _addServices } from "../../service/personal";
export default {
  data() {
    return {
      orderPic: this.imgBastPath + "pro_picture.png",
      rateList1: [
        { name: "5", title: "很满意" },
        { name: "3", title: "一般" },
        { name: "1", title: "不满意" }
      ],
      rateData: {
        id: "",
        content: "",
        productImg: "",
        productPackageName: "",
        createTime: "",
        indentMoney: ""
      },
      rateList: []
    };
  },
  created() {},
  computed: {
    ...mapState({
      isIphoneX: state => state.login.isIphoneX
    })
  },
  onLoad(option) {
    let _this = this;
    let params = {
      servicesId: option.id
    };
    console.log(params)
    _getCheckServicesItem(params).then(res => {
      console.log(res);
      if (res.data.success) {
        let bastPath = res.data.data.baseUrl || "https://file.omnrj.com";
        let resData = res.data.data.services;
        resData.content = "";
        resData.productImg = bastPath + resData.productImg;
        _this.rateData = resData;
        let resData2 = res.data.data.servicesItems;
        resData2.forEach(val => {
          val.score = "5";
        });
        _this.rateList = resData2;
        console.log(_this.rateData);
      }
    });
  },
  onHide() {
    // 重置data 完成初始化
    Object.assign(this.$data, this.$options.data());
  },
  methods: {
    rateChange(e, item, index) {
      this.rateList[index].score = e.mp.detail;
    },
    rateChange1(e) {
      this.rateVal1 = e.mp.detail;
    },
    rateChange2(e) {
      this.rateVal2 = e.mp.detail;
    },
    rateChange3(e) {
      this.rateVal3 = e.mp.detail;
    },
    toPublish() {
      let _this = this;
      let itemArr = [];
      this.rateList.forEach(val => {
        let arr = {};
        arr.id = val.id;
        arr.score = val.score;
        itemArr.push(arr);
      });
      console.log();
      let params = {
        id: this.rateData.id,
        content: this.rateData.content,
        itemJson: JSON.stringify(itemArr)
      };
      _addServices(params).then(res => {
        if (res.data.success) {
          wx.showToast({
            title: "评价成功",
            // icon: "success",
            mask: true,
            image: "../../static/images/icon_Evaluation_success.png",
            duration: 2000,
            success() {
              setTimeout(() => {
                // let url = `../my_order/main`;
                wx.navigateBack(-1);
              }, 2000);
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>
