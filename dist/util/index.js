import { isDom } from '@lxjx/utils';

var Status;
/* 40 | 32 | 24 */

(function (Status) {
  Status["info"] = "info";
  Status["success"] = "success";
  Status["warning"] = "warning";
  Status["error"] = "error";
})(Status || (Status = {}));

var Size;

(function (Size) {
  Size["large"] = "large";
  Size["small"] = "small";
})(Size || (Size = {}));

var FullSize;

(function (FullSize) {
  FullSize["large"] = "large";
  FullSize["small"] = "small";
  FullSize["big"] = "big";
})(FullSize || (FullSize = {}));

var Position;

(function (Position) {
  Position["left"] = "left";
  Position["top"] = "top";
  Position["right"] = "right";
  Position["bottom"] = "bottom";
})(Position || (Position = {}));

var Direction;

(function (Direction) {
  Direction["horizontal"] = "horizontal";
  Direction["vertical"] = "vertical";
})(Direction || (Direction = {}));

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
/** 传入dom时原样返回，传入包含dom对象的ref时返回current，否则返回undefined */

function getRefDomOrDom(target) {
  if (!target) return undefined;
  if (isDom(target)) return target;
  if (isDom(target.current)) return target.current;
  return undefined;
}
/** 获取窗口的滚动位置 */

function getDocScrollOffset() {
  var doc = document.documentElement;
  var body = document.body;
  return {
    x: doc.scrollLeft + body.scrollLeft,
    y: doc.scrollTop + body.scrollTop
  };
}
/** 指定错误消息和组件命名空间来抛出一个错误 */

function throwError(errorMsg, namespace) {
  throw new Error((namespace ? "".concat(namespace, " -> ") : '') + errorMsg);
}

export { Direction, FullSize, LG, MD, Position, SM, Size, Status, XL, Z_INDEX, Z_INDEX_DRAWER, Z_INDEX_MESSAGE, Z_INDEX_MODAL, getDocScrollOffset, getRefDomOrDom, stopPropagation, throwError };
