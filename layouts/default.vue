<template>
  <div class="appVue">
    <nuxt keep-alive/>
  </div>
</template>
<script>

export default {
}
</script>

<style lang='scss'>
@import "~/assets/css/_function.scss";
@import "~/assets/css/_module.scss";
@import "~/assets/css/_reset.scss";

.appVue {
  height: 100%;
  width: 100%;
  position: relative;
}
#__layout,#__nuxt{
  height: 100%;
  width: 100%;
  position: relative;
}
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
