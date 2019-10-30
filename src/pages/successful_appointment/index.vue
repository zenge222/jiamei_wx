<template>
  <div class="successful_appointment">
    <div class="success_header">
      <div class="header">
        <img mode="widthFix" :src="iconSuccess">
        <h3>预约成功</h3>
        <p>家美顾问火速于您联系</p>
        <button @click="toAppoin" class="see_appoin">查看预约</button>
      </div>
      <div class="contact">
        <div class="card1">
          <img class="manager" mode="widthFix" :src="defHeadPortrait">
          <div class="manager_info">
            <h3>
              王经理
              <span>专属顾问</span>
            </h3>
            <p>
              电话：
              <span>13056770791</span>
            </p>
            <van-rate style="line-height:1;" readonly size="10" :value="5" @change="rateChange"/>
          </div>
        </div>
        <img @click="callPhone" class="phone" mode="widthFix" :src="btnIphone">
      </div>
      <div class="contact_me">
        <div class="border_box">
          您有任何服务疑问，都可以联系我！
          <div class="triangle_up">
            <span></span>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="more_container">
      <div class="more_header">
        <div class="header_left">
          <img mode="widthFix" :src="iconHighQuality">
          <span>优质月嫂推荐</span>
        </div>
        <div class="header_right">
          查看更多
          <i-icon color="#868686" type="enter"/>
        </div>
      </div>
      <div class="more_list">
        <div class="list_item">
          <div class="item_card">
            <img
              class="card_img"
              mode="widthFix"
              :src="'../../static/images/.png'"
            >
            <div class="item_text">
              <h3>王阿姨</h3>
              <p>
                <span>30岁</span>
                <span>浙江人</span>
              </p>
              <van-rate readonly size="10" :value="5" @change="rateChange"/>
            </div>
          </div>
        </div>
        <div class="list_item">
          <div class="item_card">
            <img
              class="card_img"
              mode="widthFix"
              :src="'../../static/images/def_Head_portrait_tow.png'"
            >
            <div class="item_text">
              <h3>王阿姨</h3>
              <p>
                <span>30岁</span>
                <span>浙江人</span>
              </p>
              <van-rate readonly size="10" :value="5" @change="rateChange"/>
            </div>
          </div>
        </div>
        <div class="list_item">
          <div class="item_card">
            <img
              class="card_img"
              mode="widthFix"
              :src="'../../static/images/def_Head_portrait_tow.png'"
            >
            <div class="item_text">
              <h3>王阿姨</h3>
              <p>
                <span>30岁</span>
                <span>浙江人</span>
              </p>
              <van-rate readonly size="10" :value="5" @change="rateChange"/>
            </div>
          </div>
        </div>
        <div class="list_item">
          <div class="item_card">
            <img
              class="card_img"
              mode="widthFix"
              :src="'../../static/images/def_Head_portrait_tow.png'"
            >
            <div class="item_text">
              <h3>王阿姨</h3>
              <p>
                <span>30岁</span>
                <span>浙江人</span>
              </p>
              <van-rate readonly size="10" :value="5" @change="rateChange"/>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <van-popup
      :show="picPop"
      custom-class="name_pop2"
      position="bottom"
      @close="picPop=false"
      close-on-click-overlay="true"
    >
      <div class="pic1" style="color:#BABABA;">13056770791</div>
      <div class="pic2" @click="callPhone">呼叫</div>
      <div @click="picPop=false" class="close_pop">取消</div>
    </van-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      picPop: false,
      defHeadPortrait: this.imgBastPath + "def_Head_portrait.png",
      iconSuccess: this.imgBastPath + "icon_success.png",
      btnIphone: this.imgBastPath + "btn_iphone.png",
      iconHighQuality: this.imgBastPath + "icon_high_quality.png"
    };
  },
  created() {},
  onLoad() {},
  onHide() {
    // 重置data 完成初始化
    Object.assign(this.$data, this.$options.data());
  },
  methods: {
    rateChange() {},
    callPhone() {
      wx.makePhoneCall({
        phoneNumber: "13056770791"
      });
    },
    toAppoin() {
      let url = `../my_appointment/main`;
      wx.switchTab({ url });
    }
  }
};
</script>

<style lang="less" scoped>
</style>
