<template>
  <div class="add_address_page">
    <div class="addr_list">
      <div class="addr">
        <h3>服务地址：</h3>
        <div class="addr_info">
          <div class="addr_has" v-if="editAddrInfo.locationName" @click="toMapAddress">
            <p>{{editAddrInfo.locationName}}</p>
            <i-icon color="#868686" size="16" type="enter" />
          </div>
          <div class="addr_none" v-if="!editAddrInfo.locationName" @click="toMapAddress">
            <img mode="widthFix" :src="iconMap" />
            <span>点击选择</span>
          </div>
        </div>
      </div>
      <div class="addr">
        <h3>门牌号：</h3>
        <div class="addr_info">
          <input type="text" v-model="editAddrInfo.address" placeholder="详细地址，例：2幢2号202室" />
        </div>
      </div>
      <div class="addr">
        <h3>联系人：</h3>
        <div class="sex_info">
          <div class="input_box">
            <input type="text" v-model="editAddrInfo.linkName" placeholder="请填写服务人的姓名" />
          </div>
          <div class="sel_sex">
            <radio-group class="radio_group" @change="radioChange">
              <label class="radio_label" v-for="(list,index) in items" :key="index">
                <radio color="#EB5D2A" :value="list.name" :checked="list.checked" />
                {{list.value}}
              </label>
            </radio-group>
          </div>
        </div>
      </div>
      <div class="addr">
        <h3>手机号：</h3>
        <div class="addr_info">
          <input
            maxlength="11"
            v-model="editAddrInfo.linkPhone"
            placeholder="请填写服务人手机号码"
            type="text"
          />
        </div>
      </div>
    </div>
    <div class="footer_btns">
      <van-button @click="submitAddress" custom-class="btn add_btn">保存地址</van-button>
      <!-- <van-button @click="delPopShow=true" custom-class="btn del_btn">删除</van-button> -->
    </div>

    <van-popup custom-class="init_pop" :show="delPopShow" close-on-click-overlay="false">
      <div class="pop_container">
        <h3 class="title_has_colse">删除地址后将无法恢复 是否删除地址？</h3>
        <van-button @click="delSubmit" size="normal" custom-class="submit_btn_del">删除</van-button>
        <van-icon @click="delPopShow=false;" color="#666" custom-class="close_icon" name="cross" />
      </div>
    </van-popup>
    <van-popup custom-class="init_pop" :show="platePopShow" close-on-click-overlay="false">
      <div class="pop_container">
        <h3 class="title">还有点问题</h3>
        <p class="text_p">请填写楼层，门牌号</p>
        <van-button @click="platePopShow=false;" size="normal" custom-class="submit_btn_del">我知道了</van-button>
      </div>
    </van-popup>
    <i-message id="message" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { getUserLocation } from "../../api/wx_authorization";
import { _addAddress } from "../../service/personal";
export default {
  name: "edit_address",
  data() {
    return {
      iconMap: this.imgBastPath + "icon_map.png",
      items: [
        // checked: "true"
        { name: "0", value: "先生" },
        { name: "1", value: "女士" }
      ],
      textAddr: "鹤城新村2幢2号202室",
      delPopShow: false,
      platePopShow: false,
      address: ""
    };
  },
  computed: {
    ...mapState({
      editAddrInfo: state => state.order.editAddrInfo
    })
  },
  onLoad() {},
  onShow() {
    // 重置data 完成初始化
    Object.assign(this.$data, this.$options.data());
  },
  onHide() {},
  methods: {
    radioChange(e) {
      let sexNum = e.mp.detail.value;
      if (sexNum == "0") {
        this.items = [
          { name: "0", value: "先生", checked: "true" },
          { name: "1", value: "女士" }
        ];
      } else {
        this.items = [
          { name: "0", value: "先生" },
          { name: "1", value: "女士", checked: "true" }
        ];
      }
    },
    delSubmit() {
      // request
      wx.navigateBack({
        delta: 1
      });
      this.delPopShow = false;
    },
    submitAddress() {
      let reg = /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
      let selSex = false;
      this.items.find(val => {
        if (val.checked) {
          selSex = true;
        }
      });
      if (!this.editAddrInfo.locationName) {
        this.$Message({
          content: "请选择服务地址",
          type: "default"
        });
      } else if (!this.editAddrInfo.address) {
        // this.platePopShow = true;
        this.$Message({
          content: "请填写楼层，门牌号",
          type: "default"
        });
      } else if (!selSex) {
        this.$Message({
          content: "请选择性别",
          type: "default"
        });
      } else if (!this.editAddrInfo.linkName) {
        this.$Message({
          content: "请填写联系人",
          type: "default"
        });
      } else if (!reg.test(this.editAddrInfo.linkPhone)) {
        this.$Message({
          content: "请填写正确的手机号码",
          type: "default"
        });
      } else {
        if (this.items[0].checked) {
          this.editAddrInfo.sex = 0;
        } else {
          this.editAddrInfo.sex = 1;
        }
        let params = {
          provinceId: this.editAddrInfo.provinceId,
          cityId: this.editAddrInfo.cityId,
          areaId: this.editAddrInfo.areaId,
          areaText: this.editAddrInfo.areaText,
          address: this.editAddrInfo.address,
          linkName: this.editAddrInfo.linkName,
          linkPhone: this.editAddrInfo.linkPhone,
          sex: this.editAddrInfo.sex,
          locationName: this.editAddrInfo.locationName,
          longitude: this.editAddrInfo.longitude,
          latitude: this.editAddrInfo.latitude
        };
        _addAddress(params).then(res => {
          if (res.data.success) {
            wx.navigateBack({
              delta: 1
            });
          }
        });
      }
    },
    toMapAddress() {
      getUserLocation("add_edit_addr");
    }
  }
};
</script>

<style lang="less" scoped>
</style>