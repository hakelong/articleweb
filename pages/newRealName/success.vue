<template>
    <div class="success-wrapper">
      <topBar>实名认证</topBar>
        <div class='icon-success'>
            <img class='success-img' src="~/assets/img/review.png">
            <p class='success-con'>用户留存证件申请成功，请等待人工审核</p>
        </div>
        <Button :isDisabled='false' style='width:3.43rem' @tapEvent='join'>完成</Button>
    </div>
</template>
<script>
import Button from "~/components/button";
export default {
  created() {
  },
  components: {
    Button
  },
  methods:{
      join(){
        window.location.href=toDownUrl;
      }
  },
  data(){
    return{
    }
  }
};
</script>

<style lang="scss" scoped>
.success-wrapper{
  height: 100%;
  width:100%;
  position:fixed;
  left:0;
  top:0;
  overflow-y: auto;
  background: #fff;
}
.icon-success {
  padding: 0.6rem 0;
  text-align: center;
  .success-con {
    text-align: center;
    margin-top: 0.3rem;
    font-size: 0.16rem;
    color: #333333;
  }
}
.icon-success .success-img {
  width: 0.55rem;
  height: 0.55rem;
}
</style>
