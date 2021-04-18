import _defineProperty from '@babel/runtime/helpers/defineProperty';
import { FullSizeEnum } from 'm78/types';

var _SIZE_MAP;
/** 与style库同步，用于js代码的常用屏幕尺寸 */

var SM = 576;
var MD = 768;
var LG = 992;
var XL = 1200;
/** 与style库同步，用于js代码的z-index预设值 */

var Z_INDEX = 1000;
var Z_INDEX_DRAWER = 1400;
var Z_INDEX_MODAL = 1800;
var Z_INDEX_MESSAGE = 2200;
/** size */

var SIZE_MAP = (_SIZE_MAP = {
  "default": 32
}, _defineProperty(_SIZE_MAP, FullSizeEnum.small, 24), _defineProperty(_SIZE_MAP, FullSizeEnum.large, 40), _defineProperty(_SIZE_MAP, FullSizeEnum.big, 60), _SIZE_MAP);
/** 禁止冒泡的便捷扩展对象 */

var stopPropagation = {
  onClick: function onClick(e) {
    e.stopPropagation();
  }
};
/** throw error */

function throwError(errorMsg, namespace) {
  throw new Error("M78 -> ".concat(namespace ? "".concat(namespace, " -> ") : '', " ").concat(errorMsg));
}
function sendWarning(msg, namespace) {
  console.log("M78 -> ".concat(namespace ? "".concat(namespace, " -> ") : '', " ").concat(msg));
}

export { LG, MD, SIZE_MAP, SM, XL, Z_INDEX, Z_INDEX_DRAWER, Z_INDEX_MESSAGE, Z_INDEX_MODAL, sendWarning, stopPropagation, throwError };
