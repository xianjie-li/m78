import { isDom } from '@lxjx/utils';

/** 与@lxjx/sass-base同步，用于js代码的常用屏幕尺寸 */

var SM = 576;
var MD = 768;
var LG = 992;
var XL = 1200;
/** 与@lxjx/sass-base同步，用于js代码的z-index预设值 */

var Z_INDEX = 1000;
var Z_INDEX_DRAWER = 1400;
var Z_INDEX_MODAL = 1800;
var Z_INDEX_MESSAGE = 2200;
/** 禁止冒泡的便捷扩展对象 */

var stopPropagation = {
  onClick: function onClick(e) {
    e.stopPropagation();
  }
};
/** 占位函数 */

var dumpFn = function dumpFn() {
  for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
    arg[_key] = arguments[_key];
  }

  return arg;
};
/** 获取指定dom元素的指定样式值 */


function getStyle(obj, attr) {
  if (!obj) return; // @ts-ignore

  if (!obj.currentStyle && !window.getComputedStyle) return null; // @ts-ignore currentStyle非标准属性

  return obj.currentStyle ? obj.currentStyle[attr] : window.getComputedStyle(obj)[attr];
}

function getFirstScrollParent(ele) {
  var node = null;

  function handle(el) {
    var parent = el.parentNode;

    if (parent) {
      var e = parent;
      var h = e.offsetHeight;
      var sH = e.scrollHeight;

      if (sH > h) {
        var overflow = getStyle(e, 'overflow');

        if (overflow === 'scroll' || overflow === 'auto') {
          node = e;
          return;
        }
      }

      handle(e);
    }
  }

  handle(ele);
  return node;
}
/**
 * 元素是否在视口可见位置
 * @param el - 待检测元素
 * @param option
 * @param option.fullVisible - 默认完全不可见时才算不可见，设置为true只要元素有部分遮挡即视为不可见
 * @param option.wrapEl - 默认以视口计算可见性，通过此项指定元素
 * */


function checkElementVisible(el, option) {
  var _ref = option || {},
      _ref$fullVisible = _ref.fullVisible,
      fullVisible = _ref$fullVisible === void 0 ? false : _ref$fullVisible,
      wrapEl = _ref.wrapEl;

  var yMin = 0;
  var xMin = 0;
  var yMax = window.innerHeight;
  var xMax = window.innerWidth;

  if (wrapEl) {
    var _wrapEl$getBoundingCl = wrapEl.getBoundingClientRect(),
        _top = _wrapEl$getBoundingCl.top,
        _left = _wrapEl$getBoundingCl.left,
        _bottom = _wrapEl$getBoundingCl.bottom,
        _right = _wrapEl$getBoundingCl.right;

    yMin += _top;
    xMin += _left;
    yMax -= yMax - _bottom;
    xMax -= xMax - _right; // 减去元素右边到视口右边
  }

  var _el$getBoundingClient = el.getBoundingClientRect(),
      top = _el$getBoundingClient.top,
      left = _el$getBoundingClient.left,
      bottom = _el$getBoundingClient.bottom,
      right = _el$getBoundingClient.right;

  var bottomPass = (fullVisible ? bottom : top) < yMax;
  var topPass = (fullVisible ? top : bottom) > yMin;
  var leftPass = (fullVisible ? left : right) > xMin;
  var rightPass = (fullVisible ? right : left) < xMax;
  return topPass && rightPass && bottomPass && leftPass;
}
/** 如果入参为truthy或0则返回，否则返回false */


function isTruthyOrZero(arg) {
  return !!arg || arg === 0;
}
/** 返回入参中第一个truthy值或0 */


function getFirstTruthyOrZero() {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  for (var _i = 0, _args = args; _i < _args.length; _i++) {
    var arg = _args[_i];

    if (isTruthyOrZero(arg)) {
      return arg;
    }
  }

  return false;
}
/**
 * 根据传入的node节点查询其所有父节点中是否存在指定节点
 * @param node - 待查询的节点
 * @param matcher - 匹配器，递归接收父节点，返回值决定是否匹配
 * @param depth - 询深度
 * */


function getCurrentParent(node, matcher, depth) {
  var hasMatch = false;
  var cDepth = 0;

  function recur(n) {
    if (depth) {
      cDepth++;
      if (cDepth === depth) return;
    }

    if (!n) {
      return;
    }

    var pNode = n.parentNode;

    if (pNode) {
      var res = matcher(pNode);

      if (res) {
        hasMatch = true;
        return;
      }
    }

    recur(pNode);
  }

  recur(node);
  return hasMatch;
}

function triggerHighlight(t, color) {
  if (isDom(t)) {
    mountHighlight(t, color);
  } else {
    var temp = document.querySelectorAll(t);

    if (temp.length) {
      Array.from(temp).forEach(function (item) {
        return mountHighlight(item, color);
      });
    }
  }
}

function mountHighlight(target) {
  var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '#1890ff';
  target.style.boxShadow = "0 0 0 4px ".concat(color);

  function clickHandle() {
    target.style.boxShadow = '';
    document.removeEventListener('click', clickHandle);
  }

  document.addEventListener('click', clickHandle);
}

export { LG, MD, SM, XL, Z_INDEX, Z_INDEX_DRAWER, Z_INDEX_MESSAGE, Z_INDEX_MODAL, checkElementVisible, dumpFn, getCurrentParent, getFirstScrollParent, getFirstTruthyOrZero, getStyle, isTruthyOrZero, stopPropagation, triggerHighlight };
