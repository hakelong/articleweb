<template>
    <transition name="fade" :duration="{ enter: 200, leave:200 }">
    <div class="page-loading-box" v-show="isShow">
    <div class="page-loading">
      <div class="page-circle" style="background: url(&quot;//lcres.suning.com/common/style/app/images/page-loading.svg&quot;) no-repeat;"></div>
      <svg class="svg-circle" width="40" height="40" viewBox="-1 -1 36 36" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink">
      <path fill="#fff" d="M22.941,17.764h-1.133H13.73l0.336-0.734h6.703c2.875,0,3.609-1.805,3.609-3.029v-1.89 c0-1.041-0.643-1.408-1.529-1.408h-1.133h-8.262h-0.765h-2.05v6.334h0.857l-2.081,4.498h2.632l0.979-2.111h0.857l-2.02,4.591h2.509 l1.989-4.56h1.163l-1.989,4.56h2.478l1.991-4.56h1.836v1.988c0,0.674-0.611,1.102-1.377,1.102h-0.888l-0.643,1.5h2.113 c2.691,0,3.609-1.621,3.609-2.846v-1.775C24.625,18.285,23.828,17.764,22.941,17.764z M21.596,12.165v2.295 c0,0.673-0.521,1.163-1.316,1.163h-6.794v-0.948h7.039v-1.53h-7.039v-0.979H21.596z"></path>
      <path opacity=".25" d="M17 0 A17 17 0 0 0 17 34 A17 17 0 0 0 34 17 A17 17 0 0 0 17 0" stroke="#fff" fill="rgba(0,0,0,0)"></path></svg>
      </div>
    </div>
    </transition>
</template>
<style  type="text/babel">
 body{padding:0;margin:0 auto;}
    body >.page-loading-box{position: fixed;}
    .page-loading-box{width: 100%;height:100%;top: 0;z-index: 100002;position: fixed;left: 0;}
    .page-loading-box *{box-sizing: content-box;}
    .page-loading{width: 80px;height: 80px;left: 50%;top: 50%;background: rgba(0,0,0,0.6);position: absolute;border-radius: 10px;margin: -40px -40px;}
    .page-loading-box .page-circle,.page-loading-box svg{width: 40px;height: 40px;top:20px; left:20px;position:absolute;}
</style>
<script>
export default {
    name: "pageLoadingBox",
    data() {
        return {
           isShow: false,
           triggerFn: null,
        };
    },
    methods: {
        show() {
            this.triggerFn = setTimeout(()=>{
                this.isShow = true;
            },800);
            
        },
        hide() {
            clearInterval(this.triggerFn);
            this.isShow = false;
        },
    }
};
</script>

