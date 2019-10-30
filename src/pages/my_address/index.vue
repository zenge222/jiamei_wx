<template>
  <div class="my_address">
    <div class="order_list_null" v-show="addressList.length==0">
      <img class="default_pic" mode="widthFix" :src="iconAddressWhite">
      <p>您还没有收货地址哦~</p>
    </div>

    <div
      class="has_address"
      v-show="addressList.length>0"
      style="margin-bottom:100px;background:#fff;"
    >
      <ul class="address_ul" v-for="(item,index) in addressList" :key="index">
        <li class="address_list">
          <div class="text_info">
            <h3>{{item.locationName}} {{item.address}}</h3>
            <span>{{item.linkName}}</span>
            <span style="padding:0 6px;">{{item.sex==0?'先生':'女士'}}</span>
            <span>{{item.linkPhone}}</span>
          </div>
          <img @click="toEditAddress(item,index)" mode="widthFix" :src="iconEditor">
        </li>
      </ul>
    </div>

    <div :class="{'btn_box':true,'fix-iphonex-buttom':isIphoneX}">
      <!-- <van-button @click="toAddAddress" custom-class="login_btn" size="normal">
        <img mode="widthFix" :src="iconAddWhite">
        <span>新增服务地址</span>
      </van-button>-->
      <button @click="toAddAddress" class="login_btn">
        <img mode="widthFix" :src="iconAddWhite">
        <span>新增服务地址</span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { _getMyUserAddress } from "../../service/personal";
export default {
  name: "my_address",
  data() {
    return {
      iconEditor: this.imgBastPath + "icon_editor.png",
      addressList: [],
      iconAddressWhite: this.imgBastPath + "icon_address_white.png",
      iconAddWhite: this.imgBastPath + "icon_add_white.png"
    };
  },
  computed: {
    ...mapState({
      isIphoneX: state => state.login.isIphoneX
    })
  },
  onLoad() {},
  onShow() {
    this.init();
    // 重置data 完成初始化
    Object.assign(this.$data, this.$options.data());
  },
  onHide() {},
  methods: {
    ...mapActions(["editAddressInfo", "initAddAddress"]),
    init() {
      let params = {
        pageNumber: 1,
        pageSize: 20
      };
      _getMyUserAddress(params).then(res => {
        if (res.data.success) {
          this.addressList = res.data.data.list;
        }
      });
    },
    toEditAddress(item, index) {
      // 储存
      let params = this.addressList[index];
      console.log(params);
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

<style scoped>
</style>