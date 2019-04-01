/**
 * Created by wangyu on 2017/12/7.
 */
let transformObj={};
if(process.client){
let translate3d = false;
let style = document.documentElement.style;
let cssPrefix = '',fnPrefix = '';

if ('MozAppearance' in style) {
  cssPrefix = cssPrefix + '-moz-';
  fnPrefix = fnPrefix + 'Moz';
} else if ('WebkitAppearance' in style) {
  cssPrefix = cssPrefix+'-webkit-';
  fnPrefix = fnPrefix + 'Webkit';
}


let perspectiveProperty = fnPrefix + 'Perspective';
let defaultTransformProperty = 'Transform';
let defaultTransformName = 'transform';
let transformProperty = fnPrefix + 'Transform';
let transformStyleName = cssPrefix + 'transform';
let transitionProperty = fnPrefix + 'Transition';
let transitionStyleName = cssPrefix + 'transition';
let transitionEndProperty = fnPrefix.toLowerCase() + 'TransitionEnd';

if (document.createElement('div').style[perspectiveProperty] !== undefined) {
  translate3d = true;
}

const getTransform = function(el) {
  let transformObj = {left: 0, top: 0};
  if (el === null || el.style === null) return result;

  let transform = el.style[transformProperty];
  let matches = /translate\(\s*(-?\d+(\.?\d+?)?)px,\s*(-?\d+(\.\d+)?)px\)\s*translateZ\(0px\)/ig.exec(transform);
  if (matches) {
    transformObj.left = +matches[1];
    transformObj.top = +matches[3];
  }

  return transformObj;
};

const transformElement = function(el, options) {
  if (options === undefined||options.translate === undefined||(options.translate.x === undefined && options.translate.y === undefined)) return;

  if (el === undefined || el.style === null) return;

  if (!el.style[transformProperty] && options.translate.x === 0 && options.translate.y === 0) return;

  let x = options.translate.x,y = options.translate.y;
  if (x === undefined || y === undefined) {
    let transform = getTransform(el);
    if (x === undefined) {
      x = transform.left;
    }
    if (y === undefined) {
      y = transform.top;
    }
  }

  cancelTransformElement(el);

  if (translate3d) {
    el.style.setProperty(defaultTransformName, 'translate(' + (x ? (x + 'px') : '0px') + ',' + (y ? (y + 'px') : '0px') + ') translateZ(0px)');
    el.style.setProperty(transformStyleName, 'translate(' + (x ? (x + 'px') : '0px') + ',' + (y ? (y + 'px') : '0px') + ') translateZ(0px)');
  } else {
    el.style.setProperty(defaultTransformName, 'translate(' + (x ? (x + 'px') : '0px') + ',' + (y ? (y + 'px') : '0px') + ')');
    el.style.setProperty(transformStyleName, 'translate(' + (x ? (x + 'px') : '0px') + ',' + (y ? (y + 'px') : '0px') + ')');
  }
};

const cancelTransformElement = function(el) {
  if (el === null || el.style === null) return;
  let transformValue = el.style[defaultTransformName];
  if (transformValue) {
    transformValue = transformValue.replace(/translate\(\s*(-?\d+(\.?\d+?)?)px,\s*(-?\d+(\.\d+)?)px\)\s*translateZ\(0px\)/g, '');
    el.style.setProperty(defaultTransformName, transformValue);
  }
  transformValue = el.style[transformProperty]
  if (transformValue) {
    transformValue = transformValue.replace(/translate\(\s*(-?\d+(\.?\d+?)?)px,\s*(-?\d+(\.\d+)?)px\)\s*translateZ\(0px\)/g, '');
    el.style.setProperty(transformStyleName, transformValue);
  }
};

let transform  = {
  transformProperty: transformProperty,
  transformStyleName: transformStyleName,
  transitionProperty: transitionProperty,
  transitionStyleName: transitionStyleName,
  transitionEndProperty: transitionEndProperty,
  getElementTransform: getTransform,
  transformElement: transformElement,
  cancelTransformElement: cancelTransformElement
};
transformObj=transform
}else{
  transformObj={}
}

export default transformObj ;
