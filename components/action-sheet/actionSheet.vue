<template>
    <div class="action-sheet">
        <transition name="fade">
        <div v-if="isSheetBgShow" v-tap="{fn:closeSheet}" class="action-sheet-bg"></div>
        </transition>
        <div class="sheet-box" v-bind:class="{out:!isSheetShow}">
            <div v-tap="{fn:closeSheet}" class="title">{{sheetConfig.title}}</div>
            <div class="sel-con">
                <div v-for="(item,index) in sheetConfig.cardInforList" v-tap="{fn:selectDone,args:[item,index]}" class="sel-unit" :class="{'disabled':item.disabled}">
                    <div class="sel-r">
                      <img :src="item.bankCode" alt="">
                    </div>
                    <div class="sel-c">
                      {{item.bankName}}
                      <em>({{item.cardNo.substr(item.cardNo.length-4)}})</em>
                    </div>
                    <div class="sel-l" v-bind:class="{selected:idx==index}"></div>
                </div>
                <div v-tap="{fn:addSheet}" class="add-sel"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ["sheetConfig",'bcardBackUrl'],
        mounted:function(){
            let _this=this;
            _this.isSheetBgShow=true;
           
            setTimeout(function(){
                _this.idx=_this.sheetConfig.selectdIdx;
                _this.isSheetShow=true;
            },100);
        },
        methods: {
            selectDone:function(args) {
                let item = args[1];
                if(item.disabled) {
                    return false;
                }
                this.$emit("selectDoneEvent", args[2]);
                this.idx=args[1];
                
                bus.app.cardInfo = args[1];
                bus.app.isShowCard = false;
                this.closeSheet();
            },
            closeSheet:function(){
                let _this=this;
                _this.isSheetShow=false;
                setTimeout(function(){
                    _this.isSheetBgShow=false;
                    _this.$emit("closeSheetEvent");
                },300);
            },
            addSheet(){
              this.$emit("addSheetEvent");
            //   增加信用卡跳转
            

    


            window.sessionStorage.setItem('detailAddress',bus.app.addressInfo.detailAddress||'');
            window.sessionStorage.setItem('relativeName',bus.app.addressInfo.relativeName||'');
            window.sessionStorage.setItem('mobile',bus.app.addressInfo.mobile||'');
            window.sessionStorage.setItem('txqq',bus.app.addressInfo.txqq||'');
            window.sessionStorage.setItem('stateTxt',bus.app.addressInfo.stateTxt||'');
            window.sessionStorage.setItem('cityTxt',bus.app.addressInfo.cityTxt||'');
            window.sessionStorage.setItem('townTxt',bus.app.addressInfo.townTxt||'');
            window.sessionStorage.setItem('state',bus.app.addressInfo.state);
            console.log(bus.app.addressInfo.state);

            // 跳转到绑卡页面
            window.location.href=this.bcardBackUrl;
            }
        },
        data(){
            return {
                idx:0,
                isSheetShow:false,
                isSheetBgShow:false
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import "~@/scss/_function.scss";
    .action-sheet{
        display: block;
        width: 100%;
        height: 100%;
        position: fixed;
        z-index:9999;
        top:0;
        left: 0;
        .action-sheet-bg{
            display: block;
            width: 100%;
            height: 100%;
            position: fixed;
            top:0;
            left: 0;
            background-color: rgba(0,0,0,0.6);
            z-index: 99;
        }
        .sheet-box{
            position: fixed;
            bottom: 0;
            left: 0;
            background-color: #ffffff;
            width: 100%;
            z-index: 100;
            height: pxrem(370px);
        @include transition(all 300ms ease-in-out);
            .title{
                display: block;
                width: 100%;
                height: pxrem(50px);
                line-height: pxrem(50px);
                text-align: center;
                font-size:pxrem(17px);
              position: relative;
            }
            .title:before{
              display: block;
              content: "";
              position: absolute;
              top:0;
              left: 0;
              width:pxrem(50px);
              height: pxrem(50px);
              background: url('./close.png') no-repeat;
              background-position: center center;
              -moz-background-size:pxrem(14px) auto;
              background-size:pxrem(14px) auto;
            }
            .title:after{
              display: block;
              content: "";
              position: absolute;
              bottom:0;
              left: 0;
              height: 1px;
              width: 100%;
              background-color: #E8E8E8;
              @include transform(scaleY(0.5))
            }
            .sel-con {
                max-height: pxrem(260px);
                overflow-y: auto;
            }
            .add-sel{
              display: block;
              width: 100%;
              height: pxrem(54px);
              background: url('./add.png') no-repeat;
              background-position: center center;
              -moz-background-size:pxrem(30px) auto;
              background-size:pxrem(30px) auto;
            }
            .sel-unit{
                @include flexbox;
                position: relative;
                width: 100%;
                height: pxrem(50px);
                line-height: pxrem(50px);
                font-size:pxrem(16px);
                position:relative;
                &.disabled {
                    color:#ccc;
                }
                .sel-r{
                    width: pxrem(54px);
                  height: pxrem(50px);
                  line-height: pxrem(50px);
                    img{
                      display: block;
                      width: pxrem(18px);
                      height: pxrem(18px);
                      margin: pxrem(13px) auto;
                    }
                }
                .sel-c{
                    @include flex;
                  height: pxrem(50px);
                  line-height: pxrem(50px);
                    em{
                      font-style: normal;
                      font-size: pxrem(13px);
                      color: #666666;
                    }
                }
                .sel-l{
                    width: 0.4rem;
                  height: pxrem(50px);
                  line-height: pxrem(50px);
                }
                .selected{
                    background: url('./chose.png') no-repeat;
                    background-position: center center;
                    -moz-background-size:pxrem(24px) auto;
                    background-size:pxrem(24px) auto;
                }
            }
            .sel-unit:after{
              display: block;
              content: "";
              position: absolute;
              bottom:0;
              left: 0;
              height: 1px;
              width: 100%;
              background-color: #E8E8E8;
            @include transform(scaleY(0.5))
            }
        }
        .out{
            @include transform(translateY(100%))
        }
    }
</style>
