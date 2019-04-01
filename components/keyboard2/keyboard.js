import Vue from 'vue';
import _keyboard from './keyboard.vue';

let KeyboardComponent = Vue.extend(_keyboard);

let getAnInstance = function() {
  return new KeyboardComponent().$mount();
};

/**
 * 键盘对象
 * @param {*} option 
 * 可传参数
 * keyboardType 键盘类型 可不传 为 simple-num
 * position 键盘相对位置 可不传 为 fixed
 * completeFn 键盘完成回调方法 可不传 会 自动隐藏
 * deleteFn 键盘删除回调方法  必传（业务逻辑处理）
 * callbackFn 键盘字母点击回调方法  必传（业务逻辑处理）
 * el 键盘挂在到那个节点上， 可不传 为 body节点上
 */
let Keyboard = function(option) {
    this.instance = getAnInstance();
    this.instance.keyboardType = option.keyboardType;
    this.instance.position = option.position;
    this.instance.completeFn = option.completeFn;
    this.instance.afterEnterFn = option.afterEnterFn;
    this.instance.deleteFn = option.deleteFn;
    this.instance.callbackFn = option.callbackFn;
    this.instance.beforeFn = option.beforeFn;
    this.instance.mKeyboardShow = false;
    option.el = option.el || document.body;
    option.el.appendChild(this.instance.$el);
    this.$el = this.instance.$el;
}
/**
 * 显示键盘
 */
Keyboard.prototype.show = function() {
    this.instance.beforeFn && this.instance.beforeFn();
    this.instance.mKeyboardShow = true;
}
/**
 * 隐藏键盘
 */
Keyboard.prototype.hide = function() {
    this.instance.mKeyboardShow = false;
};
/**
 * 设置键盘类型
 * keyboardType 值有
 * simple-num
 * simple-idcard
 * simple-point
 * simple-chars-symbol
 * complex-low
 * complex-up
 * complex-symbol
 */
Keyboard.prototype.setKeyboardType = function(keyboardType) {
    this.instance.keyboardType = keyboardType;
}
/**
 * 键盘的相对位置
 * position的值有
 * relative 相对定位的键盘
 * absolute 决对定位的键盘
 * fixed 决对定位的键盘
 * @param {*} position 
 */
Keyboard.prototype.setPosition = function(position) {
    this.instance.position = position;
}

/**
 * 返回子组件dom对象
 */
Keyboard.prototype.getEl = function() {
    return this.instance.$el;
};

export default Keyboard;