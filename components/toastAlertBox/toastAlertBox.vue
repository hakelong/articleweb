<template>

    <transition name="fade">
        <div class="toast-wrap" v-if="type == 'toast'&& !isRemove">
            <span class="toast">{{msg}}</span>
        </div>
        <div class="popwin-wrap" :class="rootClass" v-if="type == 'alertBox'&& !isRemove">
            <div class="cont-wrap">
                <div class="msg-box">
                    <p class="title" v-if="title">{{title}}</p>
                    <p class="msg" v-if="msg" v-html="msg"></p>
                </div>
                <ul class="btns">
                    <li class="close" v-if="closeBtn" @click="close">{{closeBtn}}</li>
                    <li class="confirm" v-if="confirmBtn" @click="confirm">{{confirmBtn}}</li>
                </ul>
            </div>
        </div>
        <div class="popwin-wrap" :class="rootClass" v-if="type=='alertProtocolBox'&& !isRemove">
            <div class="cont-wrap">
                <div class="msg-box">
                    <p class="title" v-if="title">{{title}}</p>
                    <p class="msg protocol-box" v-if="msg&&showmsg" v-html="msg"></p>
                    <iframe class="msg protocol-box" v-if="protocolUrl&&!showmsg" :src="protocolUrl" frameborder="0"></iframe>
                    <p class="submsg">点击按钮表示同意<span class="protocol" @click="gotoProtocol">《{{protocolName}}》</span></p>
                </div>
                <ul class="btns">
                    <li class="close" v-if="closeBtn" @click="closeProtocol">{{closeBtn}}</li>
                    <li class="confirm" v-if="confirmBtn" @click="confirmProtocol">{{confirmBtn}}</li>
                </ul>
            </div>
        </div>
    </transition>
</template>
<style lang="scss" rel="stylesheet/scss">
@import "~/assets/css/_function.scss";
//toast
.toast-wrap,
.popwin-wrap {
    position: fixed;
    max-width:750px;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
}
.toast-wrap {
    background-color: rgba(0, 0, 0, 0);
    .toast {
        display: block;
      position: fixed;
      bottom: 30%;
      left: 50%;
    @include transform(translate(-50%,-50%));
        padding: pxrem(10px) pxrem(18px);
        background-color: rgba(0, 0, 0, .7);
        font-size: pxrem(18px);
        color: #fff;
        text-align: center;
        border-radius: pxrem(12px);
    }
}
.popwin-wrap {
    background-color: rgba(0, 0, 0, 0.3);
    .cont-wrap {
        position:absolute;
        width: 80%;
        top:50%;
        left:50%;
        background-color: #fff;
        border-radius: pxrem(12px);
        overflow: hidden;
        @include transform(translate(-50%,-50%));
    }
    .msg-box{
        padding:pxrem(20px) 0;
        position: relative;
    }
    .protocol-box{
        max-height:pxrem(260px);
        padding-left:pxrem(20px);
        padding-right:pxrem(20px);
        width:100%;
        overflow-y: scroll;
    }
    .title,
    .msg {
        text-align: center;
        font-size: pxrem(15px);
        color: #333;

        padding-left:pxrem(20px);
        padding-right:pxrem(20px);
    }

    .title {
        line-height: pxrem(17px);
        padding-bottom: pxrem(13px);
        font-size: pxrem(17px);
    }
    .submsg{
        font-size:pxrem(12px);
        line-height: pxrem(12px);
        padding-top:pxrem(18px);
        padding-left:pxrem(20px);
        white-space: nowrap;
        .protocol{
            color: #3399ff;
        }
    }
    .tail-num {
        color: #FF5A00;
    }
    .btns {
        display: flex;
        @include border-top-1px(1px, #e8e8e8);
        li {
            flex: 1;
            height: pxrem(44px);
            line-height: pxrem(44px);
            font-size: pxrem(15px);
            text-align: center;
            &:not(:last-child) {
                @include border-top-1px(1px,  #e8e8e8);
            }
            &:nth-child(2) {
                @include border-left-1px(1px,  #e8e8e8);
            }
            &.close {
                color: #333;
            }
            &.confirm {
                color: #1F86ED;
                font-weight: 600;
                &.bold{
                    font-weight: 600;
                }
            }
        }
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .2s;
    .toast {
        transition: transform .2s
    }
}

.fade-enter,
.fade-leave-active {
    opacity: 0;
    .toast {
        /*transform: scale(0);*/
    }
}

</style>
<script>
export default {
    name: "toastAlertBox",
    data() {
        return {
            type:'',
            duration: 1500,
            isRemove: true,
            title:'',
            msg:'',
            rootClass:'',
            closeBtn:'',
            confirmBtn:'',
            confirmCallback:null,
            closeCallback:null,
            showmsg:true
        };
    },
    methods: {
        show(opt) {
            let _this = this;
            _this.type = opt.type;
          switch(opt.type){
            case "toast":
                _this.msg = opt.msg ? opt.msg : '' ;
              _this.isRemove = false;
              _this.preventScrollerEvent();
              setTimeout(() => {
                  _this.hide();
          }, opt.duration || _this.duration);
                  break;
            case "alertBox":
                  _this.rootClass = opt.rootClass ? opt.rootClass : '' ;
                  _this.msg = opt.msg ? opt.msg : '' ;
                  _this.title = opt.title ? opt.title : '';
                  _this.closeBtn = opt.closeBtn ? opt.closeBtn :'';
                  _this.confirmBtn = opt.confirmBtn ? opt.confirmBtn :'';
                  _this.closeCallback = opt.closeCallback ? opt.closeCallback :null;
                  _this.confirmCallback = opt.confirmCallback ? opt.confirmCallback :null;
                  _this.isRemove = false;
                  _this.preventScrollerEvent();
                  break;
            case "alertProtocolBox":
                  _this.rootClass = opt.rootClass ? opt.rootClass : '' ;
                  _this.msg = opt.msg ? opt.msg : '' ;
                  _this.title = opt.title ? opt.title : '';
                  _this.closeBtn = opt.closeBtn ? opt.closeBtn :'';
                  _this.confirmBtn = opt.confirmBtn ? opt.confirmBtn :'';
                  _this.closeCallback = opt.closeCallback ? opt.closeCallback :null;
                  _this.confirmCallback = opt.confirmCallback ? opt.confirmCallback :null;
                  _this.protocolUrl = opt.protocolUrl ? opt.protocolUrl :null;
                  _this.protocolName = opt.protocolName ? opt.protocolName :null;
                  _this.isRemove = false;
                  _this.preventScrollerEvent();
                  break;
            default:
          }


        },
        hide() {
            this.isRemove = true;
            this.removeScrollerEvent();
        },
        close() {
            var _this = this;
            if (_this.closeCallback) {
                _this.closeCallback();
            }
            _this.hide();
        },
        confirm() {
            var _this = this;
            if (_this.confirmCallback) {
                _this.confirmCallback();
            }
            _this.hide();
        },
        confirmProtocol(){
            if (this.confirmCallback) {
                this.confirmCallback();
            }
        },
        closeProtocol(){
            if (this.closeCallback) {
                this.closeCallback();
            }
        },
        gotoProtocol(){
            window.location.href = this.protocolUrl;
        },
        bodyScroll(event) {
            if (event.cancelable && !event.defaultPrevented) event.preventDefault();
        },
        removeScrollerEvent() {
            document.body.removeEventListener('touchmove', this.bodyScroll, false);
        },
        preventScrollerEvent() {
            document.body.addEventListener('touchmove', this.bodyScroll, false);
        },

    }
};
</script>

