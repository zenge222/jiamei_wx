<template>
  <div class="home_self">
    <img
      v-for="(list,index) in imgUrls"
      :key="index"
      :src="arry[index] ? imgUrls[index].url: '../../static/images/weixin.png'"
      :class="arry[index] ?'Action':''"
    >
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      damoHeight: "150", //demo高度
      imgUrls: [
        { url: "http://g.ydbcdn.com/site/imgs/1.png" },
        { url: "http://g.ydbcdn.com/site/imgs/2.png" },
        { url: "http://g.ydbcdn.com/site/imgs/3.png" },
        { url: "http://g.ydbcdn.com/site/imgs/4.png" },
      ],
      arry: [false, false, false, false]
    };
  },
  computed: {},
  onPageScroll: function(res) {
    var str = parseInt(res.scrollTop / this.damoHeight);
    this.arry[str] = true;
  },
  onLoad() {
    let num = Math.ceil(wx.getSystemInfoSync().windowHeight / 300);
    console.log(num)
    for (let i = 0; i < num+1; i++) {
      this.arry[i] = true;
    }
  },
  onShow() {},
  methods: {}
};
</script>

<style lang="less" scoped>
@import "./style.less";
image {
  opacity: 0;
  width: 100%;
  height: 300px;
  transition: opacity 0.4s linear 0.4s;
}
 
.Action {
  opacity: 1;
}
</style>