<template>
  <div class='testpage'>this about

    <div class='content'>erzi</div>
  </div>
</template>
<script>
export default {
  asyncData({app}) {
    return app.$axios
      .post(`http://mkserver.cnsuning.com/umss/mock/epwm/icbc/init.htm`, {})
      .then(res => {
        return res.data;
      });
  },
  created(){
      console.log(this.$data)
  },
  mounted(){
    // this.$router.push({ name: "index" });
  }
};
</script>
<style lang="less" scoped>
.testpage{
  color:red;
  .content{
    &{
      font-size: 20px;
    }
    color: green;
  }
}
</style>


