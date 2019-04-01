<template>
    <transition name="m-keyboard" v-on:after-enter="afterEnter">
        <div class="m-keyboard" tabindex='-1' @touchstart.prevent  v-if="mKeyboardShow" :class="positionClass" ref="keyboardRef" @blur="onBlur"  v-focus>
            <div class="m-simple" v-if="simplerKeyboard.length > 0" >
                <div class="m-nums clearfix">
                    <div class="m-key" v-for="key in simplerKeyboard">
                        <div class="val" :class="addValClazz(key)" :val="key.val" @touchstart="keyTouchStart($event,key)" @touchend="keyTouchEnd($event,key)">{{key.val}}</div>
                    </div>
                </div>
                <div class="m-oper">
                    <div class="m-oper-con m-delete" val="delete" @touchstart="keyTouchStart($event)" @touchend="keyTouchEnd($event)"></div>
                    <div class="m-oper-con m-complete" @touchstart="complete">完成</div>
                </div>
            </div>
            <div class="m-complex" v-if="complexKeyboard.length > 0">
                <div class="m-row clearfix" v-for="rows in complexKeyboard">
                    <div class="m-key" :class="key.clazz" v-for="key in rows">
                        <div :val="key.val" class="val" v-text="returnComplexText(key)"  @touchstart="keyTouchStart($event,key)" @touchend="keyTouchEnd($event,key)">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script type="text/babel">
    export default {
        props: {
            keyboardType: {
                type: String,
                default: 'simple-num',  // simple-num/simple-idcard/simple-num-point   //complex
            },
            position: {
                type: String,
                default: 'fixed'
            },
            completeFn: {
                type: Function
            },
            afterEnterFn: {
                type: Function
            },
            mKeyboardShow: {
                type: Boolean,
                default: false
            },
            deleteFn: {
                type: Function
            },
            callbackFn: {
                type: Function
            },
            // beforeFn: {
            //     type: Function
            // }
        },
        data() {
            return {
                simplerKeyboardConfig : [{val:1},{val:2},{val:3},
                    {val:4},{val:5},{val:6},
                    {val:7},{val:8},{val:9},
                    {val:''},{val:0},{val:''}],
                simplerKeyboard:[],
                complexKeyboardConfig: {
                    lowercase:[
                        [{val:'q'},{val:'w'},{val:'e'},{val:'r'},{val:'t'},{val:'y'},{val:'u'},{val:'i'},{val:'o'},{val:'p'}],
                        [{val:'a',clazz:'margin-left'},{val:'s'},{val:'d'},{val:'f'},{val:'g'},{val:'h'},{val:'j'},{val:'k'},{val:'l'}],
                        [{val:'low-up',clazz:'low-up'},{val:'z'},{val:'x'},{val:'c'},{val:'v'},{val:'b'},{val:'n'},{val:'m'},{val:'delete',clazz:'delete'}],
                        [{val:'123',clazz:'nums'},{val:'#+=',clazz:'symbol'},{val:'space',clazz:'space'},{val:'finish',clazz:'finish'}]
                    ],
                    uppercase:[
                        [{val:'Q'},{val:'W'},{val:'E'},{val:'R'},{val:'T'},{val:'Y'},{val:'U'},{val:'I'},{val:'O'},{val:'P'}],
                        [{val:'A',clazz:'margin-left'},{val:'S'},{val:'D'},{val:'F'},{val:'G'},{val:'H'},{val:'J'},{val:'K'},{val:'L'}],
                        [{val:'up-low',clazz:'up-low'},{val:'Z'},{val:'X'},{val:'C'},{val:'V'},{val:'B'},{val:'N'},{val:'M'},{val:'delete',clazz:'delete'}],
                        [{val:'123',clazz:'nums'},{val:'#+=',clazz:'symbol'},{val:'space',clazz:'space'},{val:'finish',clazz:'finish'}]
                    ],
                    symbol:[
                        [{val:'!'},{val:'@'},{val:'#'},{val:'$'},{val:'%'},{val:'^'},{val:'&'},{val:'*'},{val:'('},{val:')'}],
                        [{val:'+'},{val:'-'},{val:'='},{val:'_'},{val:'\''},{val:':'},{val:';'},{val:'?'},{val:'~'},{val:'|'}],
                        [{val:','},{val:'.'},{val:'<'},{val:'>'},{val:'['},{val:']'},{val:'{'},{val:'}'},{val:'delete',clazz:'delete delete-symbol'}],
                        [{val:'123',clazz:'nums'},{val:'abc',clazz:'symbol'},{val:'space',clazz:'space'},{val:'finish',clazz:'finish'}]
                    ]
                },
                complexKeyboard:[],
            }
        },
        created() {
            this.changeKeyboard(this.keyboardType);
        },
        directives: {
            focus: {
                // 指令的定义
                inserted: function (el) {
                    setTimeout(function() {
                        el.focus();
                    },350);
                }
            }
        },
        methods : {
            afterEnter(){
                this.afterEnterFn(document.querySelector('.m-keyboard').getBoundingClientRect());
            },
            // 键盘按下
            keyTouchStart(e,key) {
                let target = e.target;
                let val = target.getAttribute('val');
                if(!val) {
                    return;
                }
                if(val === 'finish') {
                    this.complete();
                    return;
                }

                target.style.backgroundColor = '#b1b1b1';
                if(val === 'low-up') {
                    this.changeKeyboard('complex-up');
                    return;
                } else if(val === 'up-low') {
                    this.changeKeyboard('complex-low');
                    return;
                } else if(val === '123') {
                    this.changeKeyboard('simple-chars-symbol');
                    return;
                } else if(val === 'ABC' || val === 'abc') {
                    this.changeKeyboard('complex-low');
                    return;
                } else if(val === '#+=') {
                    this.changeKeyboard('complex-symbol');
                    return;
                } else if(val === 'space') {
                    val = ' ';
                }

                if(val === 'delete') {
                    // 调用删除方法
                    !!this.deleteFn && this.deleteFn(this);
                } else {
                    // 调用正常方法
                    !!this.callbackFn && this.callbackFn(val,this);
                }
            },
            // 键盘抬起
            keyTouchEnd(e,key) {
                let target = e.target;
                let val = target.getAttribute('val');
                if(val !== 'finish') {
                    target.style.backgroundColor = '#fff';
                }
            },
            addValClazz(key) {
                return key.clazz;
            },
            // 完成
            complete() {
                this.mKeyboardShow = false;
//                !!this.completeFn && this.completeFn(this);
            },
            onBlur() {
                this.mKeyboardShow = false;
            },
            // 改变键盘
            changeKeyboard(type) {
                this.complexKeyboard = [];
                this.simplerKeyboard = [];
                switch(type) {
                    case 'simple-num':
                        this.simplerKeyboard = this.simplerKeyboardConfig;
                        this.simplerKeyboard[9].val = '';
                        this.simplerKeyboard[9].clazz = '';
                        break;
                    case 'simple-idcard':
                        this.simplerKeyboard = this.simplerKeyboardConfig;
                        this.simplerKeyboard[9].val = 'X';
                        this.simplerKeyboard[9].clazz = '';
                        break;
                    case 'simple-point':
                        this.simplerKeyboard = this.simplerKeyboardConfig;
                        this.simplerKeyboard[9].val = '.';
                        this.simplerKeyboard[9].clazz = 'point';
                        break;
                    case 'simple-chars-symbol':
                        this.simplerKeyboard = this.simplerKeyboardConfig;
                        this.simplerKeyboard[9].val = 'ABC';
                        this.simplerKeyboard[9].clazz = 'chars';
                        this.simplerKeyboard[11].val = '#+=';
                        this.simplerKeyboard[11].clazz = 'symbol';
                        break;
                    case 'complex-low':
                        this.complexKeyboard = this.complexKeyboardConfig.lowercase;
                        break;
                    case 'complex-up':
                        this.complexKeyboard = this.complexKeyboardConfig.uppercase;
                        break;
                    case 'complex-symbol':
                        this.complexKeyboard = this.complexKeyboardConfig.symbol;
                        break;
                    default:
                        break;
                }
            },
            // 返回键盘键值
            returnComplexText(key) {
                if(key.val === 'space') {
                    return '空格';
                } else if(key.val === 'finish') {
                    return '完成';
                } else if(key.val === 'up-low' || key.val === 'low-up' || key.val === 'delete') {
                    return '';
                } else {
                    return key.val;
                }
            }
        },
        watch: {
            // 改变键盘类型
            keyboardType(newType,oldType) {
                this.changeKeyboard(newType);
            },
            mKeyboardShow(newVal,oldVal) {
                if(oldVal&&!newVal) {
                    this.completeFn && this.completeFn(this);
                }
            }
        },
        computed: {
            positionClass() {
                return this.position;
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import './keyboard.scss';
</style>
