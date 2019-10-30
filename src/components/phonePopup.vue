<template>
  <div class="phone-pop">
    <van-popup
      :show="picPop"
      custom-class="name_pop2"
      position="bottom"
      @close="picPop=false"
      close-on-click-overlay="true"
    >
      <div class="pic1" style="color:#BABABA;">{{phone}}</div>
      <div class="pic2" @click="callPhone">呼叫</div>
      <div @click="picPop=false" class="close_pop">取消</div>
    </van-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      picPop: this.showPop,
      phone: this.phoneNumber
    };
  },
  props: {
    // popup 显示
    showPop: {
      type: Boolean,
      required: true
    },
    phoneNumber: {
      type: String,
      default: "400-888-8888"
    }
  },
  watch: {
    showPop(newVal, oldVal) {
      this.picPop = newVal;
    },
    picPop(newVal, oldVal) {
      //在监听你使用update事件来更新showModal 而在父组件不需要调用该函数
      this.$emit("update:showPop", newVal);
    }
  },
  onShow() {},
  onLoad() {},
  methods: {
    callPhone() {
      wx.makePhoneCall({
        phoneNumber: "400-888-8888"
      });
    }
  }
};
</script>

<style lang="less" scoped>
.name_pop2 {
  background-color: transparent !important;
  padding: 20px 16px;

  div {
    width: 100%;
    background: #fff;
    color: #666;
    font-size: 16px;
    text-align: center;
    line-height: 50px;
  }

  .pic1 {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  .pic2 {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  .close_pop {
    border-radius: 10px;
    margin: 10px 0;
  }

  div:first-child {
    border-bottom: 1px solid #dcdcdc;
  }
}
</style>
