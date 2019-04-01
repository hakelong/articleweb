<template>
  <footer class="pagefoot">
    <img class="icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAkCAMAAACpD3pbAAAApVBMVEUAAABM2GVR32tM2GRN2GVN2GVQ2WZP3mhV2WhT4GxM2GVN12RN12RN12VN12VN2GVM2GRN2GVM2GVN2GZM2GZO2GZO2GdN2mVV3WZV43FV/4BN2GRO2GVQ2WhO2GdM2GT///9Q2Wja99/x/POc6amI5Zhd3HNW2mz8/vzg+OTP9NW+8Me78MSr7LZ94o71/Pbq+u3C8cq177+k67Cg6q1t34Fk3XnQT2OAAAAAH3RSTlMA+Rff6XYuHhsU5KCZ1dTSv72ibmBVSEAPCQajlzY00Lq2KAAAAO9JREFUOMvV0MeWgkAQQNHqJgvm7IQqQME4eeb/P21K9GijXR63vgULbmeopzXcKGq1Illfm4jNFwHHMVY9jWvbTabaHw2eXTzlJoORr6cTzYw3ejxeZIXMxZq+5dlvOf2gyPMl7Sx7p4fvhmhjOdrvxxcPKNdEWWrhT/7/V2ZEeWG92JbofUVEC+HeO9q3xTqr85lZ89JQxewaj7WkORq5zG3zRVapyW3mBI1YjRLmIYoNmWcNSRsz4PoS96GqY9cOHAqtyzshHAsciwZwKuxeajcEM0+ZqDy4KIjPGgdwnd9T1cyeD/Yiz3G8CO7vH4xKXHaNy1BOAAAAAElFTkSuQmCC" alt="">
    <p class="text"><slot>信息已加密，仅用于身份认证</slot></p>
  </footer>
</template>

<script type="text/babel">
  export default {
    name: 'pageFooter',
    data (){
      return{

      }
    },
    components: {
    },
    created() {
    },
    methods:{
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  @import '~/assets/css/_function.scss';
    .pagefoot{
        position: absolute;
        width:100%;
        height:pxrem(20px);
        bottom:pxrem(20px);
        display: flex;
        align-items: center;
        justify-content: center;
        .icon{
            display:block;
            width:pxrem(13px);
            height:pxrem(16px);
            margin-right: pxrem(5px);
        }
        .text{
            font-size: pxrem(13px);
            line-height: pxrem(20px);
            color: #666666;
            letter-spacing: 0;
        }
    }
</style>
