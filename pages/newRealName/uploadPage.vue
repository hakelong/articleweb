<template>
  <div class="page-con" style="background-color:#fff;padding-top:0">
    <topBar style="margin-bottom:0.1rem">拍摄证件</topBar>
    <div class="pic-unit">
      <div class="pic-box" @click="toastEnable('pic1')">
        <span class="edit-ico" v-show="isChooseFront"></span>
        <img src="~/assets/img/frontside.png" v-if="!isChooseFront">
        <img :src="frontSideShow" alt v-else>
      </div>
      <input
        class="file-btn hidden"
        type="file"
        accept="image/*"
        v-on:change="frontChange($event)"
        ref="pic1"
      >
    </div>
    <div class="pic-unit">
      <div class="pic-box" @click="toastEnable('pic2')">
        <span class="edit-ico" v-show="isChooseBack"></span>
        <img src="~/assets/img/backside.png" v-if="!isChooseBack">
        <img :src="backSideShow" alt v-else>
      </div>
      <input
        class="file-btn hidden"
        type="file"
        accept="image/*"
        v-on:change="backChange($event)"
        ref="pic2"
      >
    </div>
    <p class="desc d1">请务必使用本人二代身份证原件拍摄</p>
    <p class="desc d2">保证身份证边角完整、字体清晰、亮度均匀</p>
    <Button v-on:tapEvent="go" :isDisabled="!(isChooseFront&&isChooseBack)">提交</Button>
    <footer class="pagefoot">
      <div class="pagefoot-content">
        <img
          class="icon"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAkCAMAAACpD3pbAAAApVBMVEUAAABM2GVR32tM2GRN2GVN2GVQ2WZP3mhV2WhT4GxM2GVN12RN12RN12VN12VN2GVM2GRN2GVM2GVN2GZM2GZO2GZO2GdN2mVV3WZV43FV/4BN2GRO2GVQ2WhO2GdM2GT///9Q2Wja99/x/POc6amI5Zhd3HNW2mz8/vzg+OTP9NW+8Me78MSr7LZ94o71/Pbq+u3C8cq177+k67Cg6q1t34Fk3XnQT2OAAAAAH3RSTlMA+Rff6XYuHhsU5KCZ1dTSv72ibmBVSEAPCQajlzY00Lq2KAAAAO9JREFUOMvV0MeWgkAQQNHqJgvm7IQqQME4eeb/P21K9GijXR63vgULbmeopzXcKGq1Illfm4jNFwHHMVY9jWvbTabaHw2eXTzlJoORr6cTzYw3ejxeZIXMxZq+5dlvOf2gyPMl7Sx7p4fvhmhjOdrvxxcPKNdEWWrhT/7/V2ZEeWG92JbofUVEC+HeO9q3xTqr85lZ89JQxewaj7WkORq5zG3zRVapyW3mBI1YjRLmIYoNmWcNSRsz4PoS96GqY9cOHAqtyzshHAsciwZwKuxeajcEM0+ZqDy4KIjPGgdwnd9T1cyeD/Yiz3G8CO7vH4xKXHaNy1BOAAAAAElFTkSuQmCC"
          alt
        >
        <p class="text">信息已加密，仅用于身份认证</p>
      </div>
    </footer>
  </div>
</template>

<script type="text/babel">
import Button from "~/components/button.vue";
import api from '~/api/api'
export default {
  name: "App",
  computed: {},
  data() {
    return {
      isChooseBack: false,
      isChooseFront: false,
      frontSide: "",
      backSide: "",
      frontSideShow: "",
      backSideShow: "",
      isSupportisCamera: false
    };
  },
  components: {
    Button
  },
  created() {
    // let loadingBox = document.getElementById("loading-box");
    // loadingBox && loadingBox.parentNode.removeChild(loadingBox);
  },
  activated() {
    let loadingBox = document.getElementById("loading-box");
    loadingBox && loadingBox.parentNode.removeChild(loadingBox);
  },
  methods: {
    go() {
      if (this.isChooseFront && this.isChooseBack) {
        this.$pageLoadingBox.show();
        //提交
        //  ajax success后跳往后续流程
        let params = {
          frontFile: this.frontSide,
          backFile: this.backSide
        };
        api
          .submitIdentityPhoto(params)
          .then(res => {
            this.$pageLoadingBox.hide();
            if (res.data.responseCode === "9999") {
              this.$toastAlertBox.show({
                type: "alertBox",
                msg: "系统异常，请重新上传",
                confirmBtn: "确认",
                confirmCallback: function() {}
              });
            } else if (res.data.responseCode === "0000") {
              this.$router.push({ name: "newRealName-photoPwd" });
            } else if (res.data.responseCode === "A712") {
              this.$toastAlertBox.show({
                type: "alertBox",
                msg: res.data.responseMsg,
                confirmBtn: "确认",
                confirmCallback: function() {
                  window.location.href = uploadCheckUrl;
                }
              });
            } else if (res.data.responseCode === "0003") {
              this.$toastAlertBox.show({
                type: "alertBox",
                msg: "rsf接口异常",
                confirmBtn: "确认",
                confirmCallback: function() {}
              });
            }else{
              this.$toastAlertBox.show({
                type: "alertBox",
                msg: res.data.responseMsg,
                confirmBtn: "确认",
                confirmCallback: function() {}
              });
            }
          })
          .catch(err => {
            console.log(err);
            this.showToast();
            this.$pageLoadingBox.hide();
          });
      } else {
        return;
      }
    },
    showToast: function(val) {
      this.$toastAlertBox.show({
        type: "toast",
        msg: val || "网络开小差，请重试"
      });
    },
    toastEnable(val) {
      let _this = this;
      window.isSupportisCamera = function(res) {
        if (res.isEnable == "true") {
          if (val == "pic1") {
            _this.$refs.pic1.click();
          } else {
            _this.$refs.pic2.click();
          }
        } else {
          try {
            _this.showToast("请开启摄像头访问权限");
          } catch (e) {
            _this.showToast("请开启摄像头访问权限");
          }
        }
      };
      this.checkCamera(val);
    },
    frontChange($event) {
      let _this = this;
      var reader = new FileReader();
      reader.onload = (function(file) {
        return function(e) {
          // console.log("压缩前：" + e.target.result.length / 1024 + "kb");
          _this.canvasDataURL(
            e.target.result,
            {
              quality: window.appConfig.quality,
              scale: window.appConfig.scale
            },
            function(res) {
              if (res.length / 1024 > 2048) {
                _this.showToast("图片过大");
                return;
              } else {
                _this.frontSide = res;
                _this.frontSideShow = e.target.result;
                _this.isChooseFront = true;
              }
            }
          );
        };
      })($event.target.files[0]);
      $event.target.files.length > 0 &&
        reader.readAsDataURL($event.target.files[0]);
    },
    backChange($event) {
      let _this = this;
      var reader = new FileReader();
      reader.onload = (function(file) {
        return function(e) {
          // console.log("压缩前：" + e.target.result.length / 1024 + "kb");
          _this.canvasDataURL(
            e.target.result,
            {
              quality: window.appConfig.quality,
              scale: window.appConfig.scale
            },
            function(res) {
              if (res.length / (1024 * 1024) > 2) {
                _this.showToast("图片过大");
                return;
              } else {
                _this.backSide = res;
                _this.backSideShow = e.target.result;
                _this.isChooseBack = true;
              }
            }
          );
        };
      })($event.target.files[0]);
      $event.target.files.length > 0 &&
        reader.readAsDataURL($event.target.files[0]);
    },
    /**
     * 图片压缩，默认同比例压缩
     * @param {Object} path
     *   pc端传入的路径可以为相对路径，但是在移动端上必须传入的路径是照相图片储存的绝对路径
     * @param {Object} obj
     *   obj 对象 有 width， height， quality(0-1)
     * @param {Object} callback
     *   回调函数有一个参数，base64的字符串数据
     */
    canvasDataURL(path, obj, callback) {
      var img = new Image();
      img.src = path;
      img.onload = function() {
        var that = this;
        // 默认按比例压缩
        var w = that.width,
          h = that.height,
          scale = w / h;
        w = obj.width || w;
        h = obj.height || w / scale;
        // console.log("压缩前尺寸：" + w + " * " + h);
        w = parseInt(w * (obj.scale - 0.1));
        h = parseInt(h * (obj.scale - 0.1));
        // console.log("压缩后  尺寸：" + w + " * " + h);
        var quality = 0.6; // 默认图片质量为0.6
        //生成canvas
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        // 创建属性节点
        var anw = document.createAttribute("width");
        anw.nodeValue = w;
        var anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, w, h);
        // 图像质量
        if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
          quality = obj.quality;
        }
        // quality值越小，所绘制出的图像越模糊
        var base64 = canvas.toDataURL("image/jpeg", quality - 0.05);
        // 回调函数返回base64的值
        // console.log("压缩后：" + base64.length / 1024 + "kb");
        callback(base64);
      };
    },
    checkCamera(val) {
      let _this = this;
      try {
        hiWalletJavaScript.isCameraEnable("isSupportisCamera");
      } catch (e) {
        //非华为环境直接尝试调用
        if (val == "pic1") {
          this.$refs.pic1.click();
        } else {
          this.$refs.pic2.click();
        }
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import "~/assets/css/_function.scss";
html {
  position: relative;
  height: 100%;
}

body {
  background: #fff;
  height: 100%;
}

.wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  font-family: PingFangSC-Regular;
}
.page-con {
  padding-top: pxrem(30px);
  height: 100%;
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
}

.appVue {
  width: 100%;
  .pic-unit:nth-child(1) {
    padding-top: 0.1rem;
    height: 1.4rem;
  }
  .pic-unit {
    display: block;
    width: 100%;
    height: 1.3rem;
    margin-bottom: 0.1rem;
    position: relative;
    .pic-box {
      display: block;
      width: pxrem(204px);
      height: pxrem(130px);
      margin: 0 auto;
      overflow: hidden;
      -moz-border-radius: pxrem(12px);
      -webkit-border-radius: pxrem(12px);
      border-radius: pxrem(12px);
      position: relative;
      img {
        position: absolute;
        display: block;
        width: 100%;
        height: 100%;
        z-index: 2;
        left: 50%;
        top: 0;
        @include translateX(-50%);
      }
      .edit-ico {
        width: 0.6rem;
        height: 0.6rem;
        position: absolute;
        top: 0;
        right: 0;
        background: url(data:image/png;base64,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);
        filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')";
        -moz-background-size: 0.6rem 0.6rem;
        background-size: 0.6rem 0.6rem;
        background-repeat: no-repeat;
        background-position: center center;
        z-index: 3;
      }
      .show {
        display: block;
      }
    }
    .file-btn {
      // display: none;
      height: 1.3rem;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      filter: alpha(opacity=0);
      -moz-opacity: 0;
      opacity: 0;
      z-index: 99;
    }
  }
  .desc {
    font-size: pxrem(13px);
    color: #909090;
    text-align: center;
    line-height: pxrem(21px);
  }
  .desc.d1 {
    margin-bottom: pxrem(50px);
  }
}
.hidden {
  display: none;
}
// .pagefoot {
//   position: absolute;
//   width: 100%;
//   height: pxrem(20px);
//   bottom: pxrem(20px);
//   display: -webkit-box;
//   -webkit-box-align: center;
//   -webkit-box-pack: center;
//   .icon {
//     display: block;
//     width: pxrem(13px);
//     height: pxrem(16px);
//     margin-right: pxrem(5px);
//   }
//   .text {
//     font-size: pxrem(13px);
//     line-height: pxrem(20px);
//     color: #666666;
//     letter-spacing: 0;
//   }
// }
.pagefoot {
  position: absolute;
  width: 100%;
  bottom: 0.2rem;
  .pagefoot-content {
    width: 2rem;
    margin: 0 auto;
  }
  .icon {
    float: left;
    width: 0.13rem;
    height: 0.16rem;
    margin-right: 0.05rem;
    margin-top: 0.02rem;
  }
  .text {
    font-size: pxrem(13px);
    line-height: pxrem(20px);
    color: #666666;
    letter-spacing: 0;
  }
}
</style>
