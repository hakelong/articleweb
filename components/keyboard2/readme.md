# Vue组件-键盘
## 使用说明
### 方式一
	
	
	引入js使用，在文件夹下有.js文件，在需要用到的文件里面，引入js文件
	import Keyboard from '**/**/Keyboard.js'; // 一定要写上扩展名
	在使用到的地方 
	
```
	/*
	* keyboardType 键盘类型 可不传 为 simple-num
 	* position 键盘相对位置 可不传 为 fixed
 	* completeFn 键盘完成回调方法 可不传 会 自动隐藏
 	* deleteFn 键盘删除回调方法  必传（业务逻辑处理）
 	* callbackFn 键盘字母点击回调方法  必传（业务逻辑处理）
 	* el 键盘挂在到那个节点上， 可不传 为 body节点上
 	* /
	let instance = new Keyboard({
		keyboardType : 'simple-num'
		position : 'fixed',
	    completeFn : (_this) => { console.log(_this); }
	    deleteFn : (_this) => { console.log(_this); },
	    callbackFn : (_this,val) => { console.log(_this,val); },
	    option.el : document.body
	});
	
```
方法

```
	instance.show();	// 显示键盘
	instance.hide();	// 隐藏键盘
	
	/**
	 * 设置键盘类型
	 * 入参的值有
	 * simple-num
	 * simple-idcard
	 * simple-point
	 * simple-chars-symbol
	 * complex-low
	 * complex-up
	 * complex-symbol
	 */
	instance.setKeyboardType('simple-idcard');  // 设置键盘类型
	
	/**
	 * 键盘的相对位置
	 * 入参的值有
	 * relative 相对定位的键盘
	 * absolute 决对定位的键盘
	 * fixed 决对定位的键盘
	 * @param {*} position 
	 */
	instance.setPosition('fixed');	// 设置键盘位置
```

### 方式二
	引入vue使用，在文件夹下有.vue文件，在需要用到的文件里面，引入vue文件
	import Keyboard from '**/**/Keyboard.vue'; 
	在使用到的地方 
	
```
	// 引入组件
	export default {
		components: {
			Keyboard
		}
	}
```

```
	// 使用组件
	<keyboard keyboardType="simple-num" 
				position="fixed" 
				@completeFn="completeFn" 
				:mKeyboardShow="mKeyboardShow" 
				@deleteFn="deleteFn" 
				@callbackFn="callbackFn"></keyboard>
	// 实现对应的属性和方法
```
	