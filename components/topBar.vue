<template>
  <div v-if="isShow">
    <div class="topbar">
      <i class="back" @click="goback"></i>
      <span class="topbar-title">
        <slot></slot>
      </span>
    </div>
  </div>
</template>
<script>
import {Common} from '~/assets/common/common.js'
import {showHeaderUrl} from '~/api/urls'
import {DEVCONFIG} from '~/api/urls'
import api from '~/api/api'

export default {
  data() {
    return {
      isShow: true,
      showHead: true
    };
  },
  created() {
    if (process.client) {
      if (
        Common.getDeviceInfo().isSNYfb ||
        Common.getDeviceInfo().isEbuy ||
        Common.getDeviceInfo().isPlugin ||
        Common.getDeviceInfo().isWeChat ||
        Common.getDeviceInfo().isWeibo
      ) {
        this.isShow = false;
        return;
      }
      api.hideHeader().then(res=>{
        console.log(res)
      })
    }
  },
  methods: {
    goback() {
      window.history.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~/assets/css/_function.scss";
.topbar {
  text-align: center;
  height: 0.44rem;
  line-height: 0.44rem;
  position: relative;
  .back {
    position: absolute;
    width: 0.1rem;
    height: 0.18rem;
    background: url("../assets/img/BackCopy@3x.png") no-repeat;
    background-size: 0.1rem 0.18rem;
    background-position: center;
    left: 0.16rem;
    top: 0.13rem;
  }
}
.topbar-title {
  font-size: 0.18rem;
  color: #333333;
  letter-spacing: 0;
  text-align: center;
  line-height: 0.48rem;
}
</style>
