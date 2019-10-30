<template>
  <div class="submit_order">
    <div class="order_header" @click="addressShow=true;stopInput = true;">
      <div class="address_info" v-show="!currentAddress.linkName">
        <p style="padding-top:0">请选择服务地址</p>
      </div>
      <div class="address_info" v-show="currentAddress.linkName">
        <h3>
          {{currentAddress.linkName}}
          <span>{{currentAddress.linkPhone}}</span>
        </h3>
        <p>{{currentAddress.locationName}} {{currentAddress.address}}</p>
      </div>
      <i-icon custom-class="right_icon" color="#868686" type="enter" />
    </div>

    <div class="order_card">
      <img class="card_img" mode="widthFix" :src="orderInfo.smallImg" />
      <div class="card_right">
        <div class="card_title">
          <span v-text="orderInfo.productPackage.title"></span>
          <span>￥{{orderInfo.productPackage.price}}</span>
        </div>
        <div class="original_price">
          <!-- <p>{{orderInfo.productPackage.serviceNum}}次{{orderInfo.productTypeTitle}}</p> -->
          <p v-text="orderInfo.intro"></p>
          <em>￥{{orderInfo.productPackage.originalPrice}}</em>
        </div>
        <p>X1</p>
      </div>
    </div>

    <div class="list_box">
      <p>折扣</p>
      <div class="right">
        <span>-￥{{orderInfo.productPackage.originalPrice-orderInfo.productPackage.price}}</span>
        <!-- <i-icon custom-class="right_icon" color="#868686" type="enter" /> -->
      </div>
    </div>

    <div class="leave_message">
      <h3>我想嘱咐家美</h3>
      <!-- style="word- wrap:break-word onfocus="this.blur()"" maxlength="80" -->
      <textarea :disabled="stopInput" v-model="orderInfo.message" class="msg_input" type="text"></textarea>
      <div class="agree_info" @click="agreementChange">
        <!--  @change="agreementChange" -->
        <van-checkbox
          custom-class="vant_checkbox"
          name="aa"
          checked-color="#EB5D2A"
          :value="agreement"
        ></van-checkbox>
        <span>
          购买即使为同意
          <em>《好家XXX协议》</em>
        </span>
      </div>
    </div>

    <div :class="{'submit_bottom':true,'fix-iphonex-buttom':isIphoneX}">
      <div class="bottom_info">
        <p>
          待支付：
          <em>￥{{orderInfo.productPackage.price}}</em>
          <!-- <span>(已折扣￥{{orderInfo.productPackage.originalPrice-orderInfo.productPackage.price}})</span> -->
        </p>
      </div>
      <button :class="!canSubmit?'disable_btn':''" @click="submitOrder" :disabled="!canSubmit">提交订单</button>
    </div>

    <van-popup custom-class="addr_pop" position="bottom" :show="addressShow" @close="selAddrClose">
      <div class="addr_header">
        <p @click="selAddrClose">取消</p>
        <h3>选择服务地址</h3>
        <p></p>
      </div>
      <div class="max_height">
        <div class="addr_list" v-for="(item,index) in addressList" :key="index">
          <div class="addr_left">
            <!-- <input
              name="address"
              :value="item.value"
              @click="checkedAddr(item,index)"
              type="radio"
              :checked="item.checked"
            />-->
            <van-checkbox
              custom-class="vant_checkbox"
              name="aa"
              @click="checkedAddr(item,index)"
              checked-color="#EB5D2A"
              :value="item.checked"
            ></van-checkbox>
          </div>
          <div class="addr_right">
            <div
              :class="{'addr_info':true,'not_range':!item.inArea}"
              @click="checkedAddr(item,index)"
            >
              <h3>{{item.locationName}} {{item.address}}</h3>
              <div class="user_info">
                <span>{{item.linkName}}</span>
                <span>{{item.sex==0?'先生':'女士'}}</span>
                <span>{{item.linkPhone}}</span>
              </div>
            </div>
            <img
              @click="toEditAddress(item,index)"
              class="edit_img"
              mode="widthFix"
              :src="iconEditor2"
            />
          </div>
        </div>
      </div>
      <div class="add_address">
        <img mode="widthFix" :src="iconAddressAdd" />
        <span @click="toAddAddress">新增服务地址</span>
      </div>
    </van-popup>
    <!-- @close="selAddrInfoClose" -->
    <van-popup custom-class="pop_tips" :show="selAddrInfoShow">
      <div class="tips_box">
        <img class="tips_close" mode="widthFix" :src="closeIcon" @click="selAddrInfoShow=false" />
        <h3>提示</h3>
        <!-- 您当前选择城市为 上海浦东区 若想要使用该地址，请返回上一页重新 选择城市 宁波江东区 -->
        <p>您当前选择城市为 {{wxChangeLocation.orderCity}} {{wxChangeLocation.orderArea}}</p>
        <p>若想要使用该地址，请返回上一页重新</p>
        <p>选择城市</p>
        <button class="back_sel" @click="backDetail">返回选择</button>
      </div>
    </van-popup>

    <i-message id="message" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { _toSubmitOrder } from "../../service/detail";
import { _getUserAddress } from "../../service/personal";
import qs from "qs";
export default {
  name: "submit_order",
  data() {
    return {
      payPopProductP: this.imgBastPath + "pay_pop_product.png",
      iconEditor2: this.imgBastPath + "icon_editor2.png",
      iconAddressAdd: this.imgBastPath + "icon_address_add.png",
      closeIcon: this.imgBastPath + "btn_close.png",
      stopInput: false,
      agreement: false,
      addressShow: false,
      canSubmit: false,
      selAddrInfoShow: false,
      leaveMessage: " ",
      addrMessageInfo: "",
      addressList: [
        // {
        //   address: "决斗学院 鹤城新村2幢2号202室",
        //   name: "王鑫斌",
        //   sex: "1",
        //   phone: "13056770791",
        //   checked: true,
        //   value: "1"
        // }
      ],
      currentAddress: {
        address: "",
        areaId: "",
        areaText: "",
        cityId: "",
        id: "",
        latitude: "",
        linkName: "",
        linkPhone: "",
        longitude: "",
        provinceId: "",
        userId: ""
      }
    };
  },
  computed: {
    ...mapState({
      orderInfo: state => state.order.orderInfo,
      isIphoneX: state => state.login.isIphoneX,
      wxChangeLocation: state => state.login.wxChangeLocation
    })
  },
  onLoad() {
    console.log("--onLoad--");
    console.log(this.orderInfo);
    // this.init();
    // console.log(this.orderInfo)
  },
  onShow() {
    this.currentAddress = [];
    // 添加地址后 返回 请求地址数据
    this.init();
  },
  onHide() {
    // 重置data 完成初始化
    // Object.assign(this.$data, this.$options.data());
  },
  methods: {
    ...mapActions(["initAddAddress", "editAddressInfo"]),
    init() {
      let params = {
        pageNumber: 1,
        pageSize: 20,
        province: this.wxChangeLocation.orderProvince,
        city: this.wxChangeLocation.orderCity,
        area: this.wxChangeLocation.orderArea
      };
      // console.log(this.wxChangeLocation);
      _getUserAddress(params).then(res => {
        if (res.data.success) {
          let address = res.data.data.list;
          let arr1 = [];
          let arr2 = [];
          address.forEach(val => {
            val.checked = false;
            if (val.inArea) {
              arr1.push(val);
            } else {
              arr2.push(val);
            }
          });
          if (arr1.length > 0) {
            arr1[0].checked = true;
            this.currentAddress = arr1[0];
          }
          this.addressList = arr1.concat(...arr2);
          // this.addressList = res.data.data.list;
          // this.addressList.forEach(val => {
          //   val.checked = false;
          // });
          // this.addressList[0].checked = true;
          // this.currentAddress = this.addressList[0];
          // console.log(this.currentAddress);
        }
      });
    },
    backDetail() {
      this.selAddrInfoShow = false;
      wx.navigateBack({
        delta: -1
      });
    },
    agreementChange() {
      this.canSubmit = !this.canSubmit;
      this.agreement = !this.agreement;
    },
    selAddrInfoClose() {
      this.selAddrInfoShow = false;
    },
    submitOrder() {
      if (!this.agreement) {
        this.$Message({
          content: "请同意《好家XXX协议》",
          type: "warning"
        });
      } else if (!this.currentAddress.linkName) {
        this.$Message({
          content: "请选择服务地址",
          type: "warning"
        });
      } else {
        // console.log("submit");
        let params = {
          addressId: this.currentAddress.id,
          productId: this.orderInfo.id,
          productPackageId: this.orderInfo.productPackage.id,
          remark: this.orderInfo.message
        };
        _toSubmitOrder(params).then(res => {
          console.log(res);
          let sendId = res.data.data.indentId;
          if (res.data.success) {
            let url = `../order_payment/main?id=${sendId}`;
            wx.navigateTo({ url });
          } else {
            this.$Message({
              content: res.data.message,
              type: "warning"
            });
            // this.selAddrInfoShow = true;
          }
        });
      }
    },
    selAddrClose() {
      this.stopInput = false;
      this.addressShow = false;
    },
    checkedAddr(item, index) {
      console.log(item);
      if (item.inArea) {
        this.addressList.forEach(val => {
          val.checked = false;
        });
        this.currentAddress = this.addressList[index];
        item.checked = true;
        this.stopInput = false;
        this.addressShow = false;
      } else {
        // 您当前选择城市为 上海浦东区 若想要使用该地址，请返回上一页重新 选择城市 宁波江东区
        // this.wxChangeLocation.orderProvince
        // this.addrMessageInfo = `您当前选择城市为${
        //   this.wxChangeLocation.orderCity
        // }${
        //   this.wxChangeLocation.orderArea
        // }若想要使用该地址，请返回上一页重新 选择城市${item.cityId}${
        //   item.areaId
        // }`;
        // console.log(
        //   this.wxChangeLocation.orderCity,
        //   this.wxChangeLocation.orderArea
        // );
        this.selAddrInfoShow = true;
      }
    },
    toEditAddress(item, index) {
      // 储存
      let params = this.addressList[index];
      this.editAddressInfo(params);
      let url = `../edit_address/main`;
      wx.navigateTo({ url });
    },
    toAddAddress() {
      this.initAddAddress();
      let url = `../add_address/main`;
      wx.navigateTo({ url });
    }
  }
};
</script>

<style lang="less" scoped>
</style>