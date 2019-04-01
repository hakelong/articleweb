<template>
    <div class="selector" tabindex="-1" @touchmove.prevent>
        <div class="selector-bg" v-if="isShow"  @touchstart="touchStart($event)" @touchend="closeSelector(false, $event)"></div>
        <transition name="box">
            <div class="selector-box" v-if="isShow">
                <div class="selector-toolbar border-1px" v-if="showToolbar">
                    <div><a @touchstart.stop="touchStart($event)" @touchend.stop="closeSelector(false, $event)">取消</a></div>
                    <div>有效日期</div>
                    <div><a @touchstart.stop="touchStart($event)" @touchend.stop="closeSelector(true, $event)">确定</a></div>
                </div>
                <div class="selector-items">
                    <selector-item v-for="(item,idx) in items" :key="idx" :itemIndex="item.valueIndex" :valueKey="valueKey" :values="item.values || []" :text-align="item.textAlign || 'center'" :visible-item-count="visibleItemCount" :class-name="item.className" :flex="item.flex" v-model="values[item.valueIndex]" :divider="item.divider" :content="item.content" :itemHeight="itemHeight" :default-index="item.defaultIndex"></selector-item>
                    <div class="selector-center-highlight" :style="{ height: itemHeight + 'px', marginTop: -itemHeight / 2 + 'px' }"></div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script type="text/babel">
    import Vue from 'vue';
    import selectorItem from './selector-item.vue';
    let status={}
    export default {
        name: 'selector',

        componentName: 'selector',

        props: {
            items: {
                type: Array
            },
            showToolbar: {
                type: Boolean,
                default: false
            },
            visibleItemCount: {
                type: Number,
                default: 5
            },
            valueKey: String,
            itemHeight: {
                type: Number,
                default: function(){
                    return this.items[0].itemHeight||36
                }
            },
            complete: {
                type: Function,
                default: ()=>{}
            },
            cancel: {
                type: Function,
                default: ()=>{}
            },
            active: {
                type: Boolean,
                default: false
            }
        },

        data(){
            return {
                isShow: false,
                values:[]
            }
        },

        created() {
            this.$on('itemValueChange', this.itemValueChange);
            let items = this.items || [];
            let values = [];
            let valueIndexCount = 0;
            items.forEach(item => {
                if (!item.divider) {
                    item.valueIndex = valueIndexCount++;
                    this.values[item.valueIndex] = (item.values || [])[item.defaultIndex || 0];
//                    this.itemValueChange(item.valueIndex);
                }
            });
        },

        methods: {
            touchStart(e){
                var touches = e.touches[0];
                status.pageX = touches.pageX;
                status.pageY = touches.pageY;
                status.clientX = touches.clientX;
                status.clientY = touches.clientY;
                status.time = +new Date();
            },
            closeSelector(flag,e){
                e.preventDefault();
                var touches = e.changedTouches[0];
                status.time = +new Date() - status.time;
                status.distanceX = status.pageX - touches.pageX;
                status.distanceY = status.pageY - touches.pageY;
                if(!(status.time < 300 && Math.abs(status.distanceX) < 10 && Math.abs(status.distanceY) < 10)) return;
                if(flag){
                    this.complete && this.complete.call(this,this.values)
                } else {
                    this.cancel && this.cancel.call(this)
                }
            },
            itemValueChange(index) {
                // console.log(this.values[0].name);
                if(typeof index == 'object') index = index.itemIndex;
                this.$emit('change', this, this.values, index);

            },

            getItem(itemIndex) {
                let items = this.items || [];
                let count = 0;
                let target;
                let children = this.$children.filter(child => child.$options.name === 'selector-item');

                items.forEach(function(item, index) {
                    if (!item.divider) {
                        if (itemIndex === count) {
                            target = children[index];
                        }
                        count++;
                    }
                });

                return target;
            },
            getItemValue(index) {
                let item = this.getItem(index);
                if (item) {
                    return item.value;
                }
                return null;
            },
            setItemValue(index, value) {
                let item = this.getItem(index);
                if (item) {
                    item.currentValue = value;
                }
            },
            getItemValues(index) {
                let item = this.getItem(index);
                if (item) {
                    return item.mutatingValues;
                }
                return null;
            },
            setItemValues(index, values) {
                let item = this.getItem(index);
                if (item) {
                    item.mutatingValues = values;
                }
            },
            getValues() {
                return this.values;
            },
            setValues(values) {
                let itemCount = this.itemCount;
                values = values || [];
                if (itemCount !== values.length) {
                    throw new Error('values length is not equal item count.');
                }
                values.forEach((value, index) => {
                    this.setItemValue(index, value);
                });
            },
            onBlur(){
                this.cancel && this.cancel.apply(this);
            }
        },

        computed: {
            itemCount() {
                let items = this.items || [];
                let result = 0;
                items.forEach(function(item) {
                    if (!item.divider) result++;
                });
                return result;
            }
        },
        components: {
            selectorItem: selectorItem
        },

        activated(){
            this.isShow = true
        },

        deactivated(){
            this.isShow = false
        },

        mounted(){
            this.isShow = this.active
        }
    };
</script>

<style lang="scss" >
    .selector {
        overflow: hidden;
        outline-width: 0;
        position: fixed;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 202;
        .selector-bg{
            width: 100%;
            height: 100%;
            position: absolute;
            bottom: 0;
            background: rgba(0,0,0,.6);
            transition: all 500ms ease-in-out;
        }
        .selector-box{
            width: 100%;
            height: 100%;
            display: -webkit-box;
            -webkit-box-pack: end;
            /*! autoprefixer: off */
            -webkit-box-orient: vertical;
            /*! autoprefixer: on */
        }
    }

    .selector-toolbar {
        height: 40px;
        background: #fff;
        width: 100%;
        display: -webkit-box;
        position: relative;
        div:first-child a{
            z-index:1000;
        }
        div{
            -webkit-box-flex: 1;
            width: 100%;
            
            &:last-child{
                text-align: right;
            }
            &:nth-child(2){
                display: inline-block;
                width: 80px;
                height: 40px;
                line-height: 40px;
                text-align: center;
                font-size: 16px;
            }
            a{
                display: inline-block;
                width: 80px;
                height: 40px;
                line-height: 40px;
                text-align: center;
                font-size: 17px;
                color: #1F86ED;
            }
            
        }
    }

    .border-1px{
        border-width: 0;
        border-bottom-width: 1px;
        border-color: #e8e8e8;
        border-style: solid;
    }

    @media (-webkit-min-device-pixel-ratio: 2){
        .border-1px:before {
            width: 200%;
            height: 200%;
            transform: scale(0.5);
            -webkit-transform: scale(0.5);
        }
    }

    @media (-webkit-min-device-pixel-ratio: 3){
        .border-1px:before {
            width: 300%;
            height: 300%;
            transform: scale(0.3333);
            -webkit-transform: scale(0.3333);
        }
    }

    .selector-items {
        width: 100%;
        display: flex;
        justify-content: center;
        text-align: right;
        font-size: 24px;
        position: relative;
        padding: 10px 0;
        background: #fff;
    }

    .selector-center-highlight {
        box-sizing: border-box;
        position: absolute;
        left: 0;
        width: 100%;
        top: 50%;
        margin-top: -18px;
        pointer-events: none
    }

    .selector-center-highlight:before,
    .selector-center-highlight:after {
        content: '';
        position: absolute;
        height: 1px;
        width: 100%;
        background-color: #eaeaea;
        display: block;
        z-index: 15;
        transform: scaleY(0.5);
    }

    .selector-center-highlight:before {
        left: 0;
        top: 0;
        bottom: auto;
        right: auto;
    }

    .selector-center-highlight:after {
        left: 0;
        bottom: 0;
        right: auto;
        top: auto;
    }

    .box-enter-active, .box-leave-active  {
        -webkit-transition: all .5s ease;
    }
    .box-enter,.box-leave-to{
        -webkit-transform: translateY(100%);
    }
</style>
