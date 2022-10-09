import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import { isDom, isNumber } from "./is.js";
import { clamp } from "./number.js";
var portalsID = "J__PORTALS__NODE__";
/**
 * get a dom, multiple calls will return the same dom
 * @param namespace - create a uniq node by namespace
 * @return - dom
 * */ export var getPortalsNode = function(namespace) {
    var id = portalsID + (namespace ? namespace.toLocaleUpperCase() : "DEFAULT");
    var portalsEl = document.getElementById(id);
    if (!portalsEl) {
        var el = document.createElement("div");
        el.id = id;
        portalsEl = document.body.appendChild(el);
    }
    return portalsEl;
};
/**
 * get scrollbar width
 * @param className - If the element customizes the scroll bar through css, pass in the class name for customization
 * @return scroll - bar [x, y] width, generally 0 on mobile, unless you customize the scroll bar
 * */ export function getScrollBarWidth(className) {
    // Create the measurement node
    var scrollEl = document.createElement("div");
    if (className) scrollEl.className = className;
    scrollEl.style.overflow = "scroll";
    scrollEl.style.height = "200px";
    scrollEl.style.width = "200px";
    scrollEl.style.border = "2px solid red";
    document.body.appendChild(scrollEl);
    var wSize = scrollEl.offsetWidth - scrollEl.clientWidth;
    var hSize = scrollEl.offsetWidth - scrollEl.clientWidth;
    var sty = getStyle(scrollEl);
    if (sty) {
        var trimPXStr = function(s) {
            return s.replace(/px/, "");
        };
        wSize = wSize - trimPXStr(sty.borderLeftWidth) - trimPXStr(sty.borderRightWidth);
        hSize = hSize - trimPXStr(sty.borderTopWidth) - trimPXStr(sty.borderBottomWidth);
    }
    document.body.removeChild(scrollEl);
    // Get the scrollbar width
    return [
        wSize,
        hSize
    ];
}
/**
 * get style value of dom element
 * @param dom - target dom
 * @return - an object containing all available style values, an null means not supported
 *  */ export function getStyle(dom) {
    if (!dom) return {};
    // @ts-ignore
    if (!dom.currentStyle && !window.getComputedStyle) return {};
    // @ts-ignore
    return dom.currentStyle ? dom.currentStyle : window.getComputedStyle(dom);
}
/**
 * check if element is visible
 * @param target - an element to be detected or an object that represents location information
 * @param option
 * @param option.fullVisible - false | default is to be completely invisible, and set to true to be invisible if element is partially occluded
 * @param option.wrapEl - By default, the viewport computes visibility through this specified element (viewport is still detected)
 * @param option.offset - Offset of visibility, specifying all directions for numbers, and specific directions for object
 * @return - Whether the overall visibility information and the specified direction does not exceed the visible boundary
 * */ export function checkElementVisible(target) {
    var option = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var _fullVisible = option.fullVisible, fullVisible = _fullVisible === void 0 ? false : _fullVisible, wrapEl = option.wrapEl, _offset = option.offset, offset = _offset === void 0 ? 0 : _offset;
    var ofs = getOffsetObj(offset);
    // 核心是判定视口的可用区域所在的框，再检测元素是否在这个框坐标内
    /** 基础边界(用于窗口) */ var yMinBase = 0;
    var xMinBase = 0;
    var yMaxBase = window.innerHeight;
    var xMaxBase = window.innerWidth;
    /** 有效边界 */ var aYMin = yMinBase;
    var aXMin = xMinBase;
    var aYMax = yMaxBase;
    var aXMax = xMaxBase;
    // 需要同时检测是否超出窗口、所在容器
    if (wrapEl) {
        var ref = wrapEl.getBoundingClientRect(), top = ref.top, left = ref.left, bottom = ref.bottom, right = ref.right;
        var yMin = yMinBase + top;
        var xMin = xMinBase + left;
        var yMax = bottom;
        var xMax = right; // 减去元素右边到视口右边
        // 有效区域左上取最小值，最小不小于0
        // 有效区域右下取最大值，最大不大于窗口对应方向尺寸
        aXMin = clamp(Math.max(xMinBase, xMin), xMinBase, xMaxBase);
        aYMin = clamp(Math.max(yMinBase, yMin), yMinBase, yMaxBase);
        aXMax = clamp(Math.min(xMaxBase, xMax), xMinBase, xMaxBase);
        aYMax = clamp(Math.min(yMaxBase, yMax), yMinBase, yMaxBase);
    }
    var bound = isDom(target) ? target.getBoundingClientRect() : target;
    var ref1 = offsetCalc(bound, ofs), top1 = ref1.top, left1 = ref1.left, bottom1 = ref1.bottom, right1 = ref1.right;
    /** fullVisible检测 */ var topPos = fullVisible ? top1 : bottom1;
    var bottomPos = fullVisible ? bottom1 : top1;
    var leftPos = fullVisible ? left1 : right1;
    var rightPos = fullVisible ? right1 : left1;
    // 指定方向是否包含有效尺寸
    var xFalse = aXMax === aXMin;
    var yFalse = aYMax === aYMin;
    var topVisible = yFalse ? false : topPos >= aYMin;
    var leftVisible = xFalse ? false : leftPos >= aXMin;
    var bottomVisible = yFalse ? false : bottomPos <= aYMax;
    var rightVisible = xFalse ? false : rightPos <= aXMax;
    return {
        visible: topVisible && leftVisible && rightVisible && bottomVisible,
        top: topVisible,
        left: leftVisible,
        right: rightVisible,
        bottom: bottomVisible,
        bound: bound
    };
}
/** 用于checkElementVisible获取offset四个方向的值 */ function getOffsetObj(offset) {
    var ofs = {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    };
    if (!offset) return ofs;
    if (isNumber(offset)) {
        return {
            left: offset,
            top: offset,
            right: offset,
            bottom: offset
        };
    }
    Object.keys(ofs).forEach(function(key) {
        if (isNumber(offset[key])) {
            ofs[key] = offset[key];
        }
    });
    return ofs;
}
/** 用于checkElement，计算offset对象和当前位置对象的最终值 */ function offsetCalc(bound, offset) {
    return {
        top: bound.top - offset.top,
        left: bound.left - offset.left,
        right: bound.right + offset.right,
        bottom: bound.bottom + offset.bottom
    };
}
export function triggerHighlight(t, conf) {
    if (isDom(t)) {
        mountHighlight(t, conf);
    } else {
        var temp = document.querySelectorAll(t);
        if (temp.length) {
            Array.from(temp).forEach(function(item) {
                return mountHighlight(item, conf);
            });
        }
    }
}
var mountHighlightDefaultConf = {
    color: "#1890ff",
    useOutline: true
};
function mountHighlight(target) {
    var conf = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var cf = _object_spread({}, mountHighlightDefaultConf, conf);
    if (cf.useOutline) {
        target.style.outline = "1px auto ".concat(cf.color);
    } else {
        target.style.boxShadow = "0 0 0 4px ".concat(cf.color);
    }
    function clickHandle() {
        if (cf.useOutline) {
            target.style.outline = "";
        } else {
            target.style.boxShadow = "";
        }
        document.removeEventListener("click", clickHandle);
        document.removeEventListener("keydown", clickHandle);
    }
    document.addEventListener("click", clickHandle);
    document.addEventListener("keydown", clickHandle);
}
/**
 * Query the incoming Node for the presence of a specified node in all of its parent nodes
 * @param node - node to be queried
 * @param matcher - matcher, recursively receives the parent node and returns whether it matches
 * @param depth - maximum query depth
 * */ export function getCurrentParent(node, matcher, depth) {
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
export function getScrollParent(ele, getAll) {
    var node = getAll ? [] : null;
    function handle(el) {
        var parent = el.parentNode;
        if (parent) {
            var e = parent;
            var h = e.clientHeight;
            var sH = e.scrollHeight;
            if (sH > h) {
                var isRoot = e === document.documentElement || e === document.body;
                var scrollStatus = hasScroll(e);
                // 为body或doc时，统一取documentElement方便识别，部分浏览器支持body设置document.scrollXxx部分浏览器支持documentElement设置
                var element = isRoot ? document.documentElement : e;
                /* body和html元素不需要检测滚动属性 */ if (isRoot || scrollStatus.x || scrollStatus.y) {
                    if (getAll) {
                        if (isRoot) {
                            node.indexOf(document.documentElement) === -1 && node.push(element);
                        } else {
                            node.push(element);
                        }
                    } else {
                        node = element;
                        return;
                    }
                }
            }
            handle(e);
        } else {
        // 无匹配
        }
    }
    handle(ele);
    return node;
}
/** get doc scroll offset, used to solve the problem of different versions of the browser to get inconsistent */ export function getDocScrollOffset() {
    var doc = document.documentElement;
    var body = document.body;
    return {
        // Math.ceil用于解决高分屏缩放时的滚动位置小数问题
        x: Math.ceil(doc.scrollLeft + body.scrollLeft),
        y: Math.ceil(doc.scrollTop + body.scrollTop)
    };
}
/** set doc scroll offset */ export function setDocScrollOffset() {
    var conf = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (isNumber(conf.x)) {
        // eslint-disable-next-line
        document.body.scrollLeft = document.documentElement.scrollLeft = conf.x;
    }
    if (isNumber(conf.y)) {
        // eslint-disable-next-line
        document.body.scrollTop = document.documentElement.scrollTop = conf.y;
    }
}
/** check whether the dom node is scrollable */ export function hasScroll(el) {
    var x = Math.max(0, el.scrollWidth - el.clientWidth) > 0;
    var y = Math.max(0, el.scrollHeight - el.clientHeight) > 0;
    if (el === document.documentElement || el === document.body) {
    // ...
    } else {
        var ref = getStyle(el), overflowX = ref.overflowX, overflowY = ref.overflowY;
        if (overflowX !== "scroll" && overflowX !== "auto") {
            x = false;
        }
        if (overflowY !== "scroll" && overflowY !== "auto") {
            y = false;
        }
    }
    return {
        x: x,
        y: y
    };
}
