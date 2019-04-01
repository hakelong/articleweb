<template>
    <div class="selector-item" :class="classNames" :style="flexStyle">
        <div v-if="!divider" ref="wrapper" class="selector-item-wrapper" :class="{ dragging: dragging }" :style="{ height: contentHeight + 'px' }">
            <div class="item-list" v-for="itemValue in mutatingValues" :class="{ 'selected': itemValue === currentValue }" :style="{ height: itemHeight + 'px', lineHeight: itemHeight + 'px' }">
                {{ typeof itemValue === 'object' && itemValue[valueKey] ? itemValue[valueKey] : itemValue }}
            </div>
        </div>
        <div v-if="divider">{{ content }}</div>
    </div>
</template>

<script type="text/babel">
    import transformUtil from '~/assets/common/transform.js';
    import { once, addClass, removeClass, emitter, draggable } from '~/assets/common/lib/common.js';

    const ITEM_HEIGHT = 36;

    export default {
        name: 'selector-item',

        props: {
            values: {
                type: Array,
                default() {
                    return [];
                }
            },
            value: {},
            visibleItemCount: {
                type: Number,
                default: 5
            },
            itemIndex: {
                type: Number
            },
            valueKey: String,
            divider: {
                type: Boolean,
                default: false
            },
            textAlign: {
                type: String,
                default: 'center'
            },
            flex: {},
            className: {},
            content: {},
            itemHeight: {
                type: Number,
                default: ITEM_HEIGHT
            },
            defaultIndex: {
                type: Number,
                default: 0,
                require: false
            }
        },

        data() {
            return {
                currentValue: this.value,
                mutatingValues: this.values,
                dragging: false
            };
        },

        mixins: [emitter],

        computed: {
            flexStyle() {
                return {
                    'flex': this.flex,
                    '-webkit-box-flex': this.flex
                };
            },
            classNames() {
                const PREFIX = 'selector-item-';
                let resultArray = [];

                let textAlign = this.textAlign || 'center';
                resultArray.push(PREFIX + textAlign);

                if (this.divider) {
                    resultArray.push(PREFIX + 'divider');
                }

                if (this.className) {
                    resultArray.push(this.className);
                }

                return resultArray.join(' ');
            },
            contentHeight() {
                return this.itemHeight * this.visibleItemCount;
            },
            valueIndex() {
                return this.mutatingValues.indexOf(this.currentValue);
            },
            dragRange() {
                let values = this.mutatingValues;
                let visibleItemCount = this.visibleItemCount;
                let itemHeight = this.itemHeight;

                return [ -itemHeight * (values.length - Math.ceil(visibleItemCount / 2)), itemHeight * Math.floor(visibleItemCount / 2) ];
            }
        },

        methods: {
            value2Translate(value) {
                let values = this.mutatingValues;
                let valueIndex = values.indexOf(value);
                let offset = Math.floor(this.visibleItemCount / 2);
                let itemHeight = this.itemHeight;

                if (valueIndex !== -1) {
                    return (valueIndex - offset) * -itemHeight;
                }
            },

            translate2Value(translate) {
                let itemHeight = this.itemHeight;
                translate = Math.round(translate / itemHeight) * itemHeight;
                let index = -(translate - Math.floor(this.visibleItemCount / 2) * itemHeight) / itemHeight;

                return this.mutatingValues[index];
            },

            initEvents() {
                let el = this.$refs.wrapper;
                let dragState = {};

                let velocityTranslate, prevTranslate, selectorItems;

                draggable(el, {
                    start: (event) => {
                        dragState = {
                            range: this.dragRange,
                            start: new Date(),
                            startLeft: event.pageX,
                            startTop: event.pageY,
                            startTranslateTop: transformUtil.getElementTransform(el).top
                        };
                        selectorItems = el.querySelectorAll('.item-list');
                    },

                    drag: (event) => {
                        this.dragging = true;

                        dragState.left = event.pageX;
                        dragState.top = event.pageY;

                        let deltaY = dragState.top - dragState.startTop;
                        let translate = dragState.startTranslateTop + deltaY;

                        transformUtil.transformElement(el, {translate:{
                            y:  translate
                        }});

                        velocityTranslate = translate - prevTranslate || translate;

                        prevTranslate = translate;

                    },

                    end: () => {
                        if (this.dragging) {
                            this.dragging = false;

                            let momentumRatio = 7;
                            let currentTranslate = transformUtil.getElementTransform(el).top;
                            let duration = new Date() - dragState.start;

                            let momentumTranslate;
                            if (duration < 300) {
                                momentumTranslate = currentTranslate + velocityTranslate * momentumRatio;
                            }

                            let dragRange = dragState.range;

                            this.$nextTick(() => {
                                let translate;
                                let itemHeight = this.itemHeight;
                                if (momentumTranslate) {
                                    translate = Math.round(momentumTranslate / itemHeight) * itemHeight;
                                } else {
                                    translate = Math.round(currentTranslate / itemHeight) * itemHeight;
                                }

                                translate = Math.max(Math.min(translate, dragRange[1]), dragRange[0]);

                                transformUtil.transformElement(el,{translate:{
                                    y:  translate
                                }});

                                this.currentValue = this.translate2Value(translate);

                            });
                        }

                        dragState = {};
                    }
                });
            },

            doOnValueChange() {
                let value = this.currentValue;
                let wrapper = this.$refs.wrapper;

                transformUtil.transformElement(wrapper, {translate:{
                    y:  this.value2Translate(value)
                }});
            },

            doOnValuesChange() {
                let el = this.$el;
                let items = el.querySelectorAll('.item-list');
                [].forEach.call(items, (item, index) => {
                    transformUtil.transformElement(item, {translate:{
                        y:  this.itemHeight * index
                    }});
                });
            }
        },

        mounted() {
            this.$emit('input', this.currentValue);

            if (!this.divider) {
                this.initEvents();
                this.doOnValueChange();
            }
        },

        watch: {
            values(val) {
                if(val&&val.length)
                    this.mutatingValues = val;
            },

            mutatingValues(val) {
                if (this.valueIndex === -1) {
                    this.currentValue = (val || [])[0];
                }
            },
            currentValue(val) {
                this.doOnValueChange();
                this.$emit('input', val);
                this.dispatch('selector', 'itemValueChange', this);
            },
            defaultIndex(val) {
                if ((this.mutatingValues[val] !== undefined) && (this.mutatingValues.length >= val + 1)) {
                    this.currentValue = this.mutatingValues[val];
                }
            }
        }
    };
</script>

<style lang="scss" rel="stylesheet/scss">
    .selector-item {
        font-size: 18px;
        overflow: hidden;
        position: relative;
        max-height: 100%
    }

    .selector-item.selector-item-left {
        text-align: left;
    }

    .selector-item.selector-item-center {
        text-align: center;
    }

    .selector-item.selector-item-right {
        text-align: right;
    }

    .selector-item.selector-item-divider {
        color: #000;
        display: flex;
        align-items: center
    }

    .selector-item-wrapper {
        transition-duration: 0.3s;
        transition-timing-function: ease-out;
        backface-visibility: hidden;
    }

    .selector-item-wrapper.dragging,
    .selector-item-wrapper.dragging .item-list {
        transition-duration: 0s;
    }

    .item-list {
        height: 36px;
        line-height: 36px;
        padding: 0 10px;
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #707274;
        left: 0;
        top: 0;
        width: 100%;
        box-sizing: border-box;
        transition-duration: .3s;
        backface-visibility: hidden;
    }

    .selector-item-absolute .item-list {
        position: absolute;
    }

    .item-list.selected {
        color: #000;
        transform: translate3d(0, 0, 0) rotateX(0deg);
    }

    .selector-3d .item-lists {
        overflow: hidden;
        perspective: 700px;
    }

    .selector-3d .item-list,
    .selector-3d .selector-item,
    .selector-3d .selector-item-wrapper {
        transform-style: preserve-3d
    }

    .selector-3d .selector-item {
        overflow: visible
    }

    .selector-3d .item-list {
        transform-origin: center center;
        backface-visibility: hidden;
        transition-timing-function: ease-out
    }
</style>
