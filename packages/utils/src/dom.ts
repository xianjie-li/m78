import { AnyObject, Bound, BoundSize, TupleNumber } from "./types.js";
import { isDom, isFunction, isNumber } from "./is.js";
import { clamp } from "./number.js";

const portalsID = "J__PORTALS__NODE__";

/**
 * get a dom, multiple calls will return the same dom
 * @param namespace - create a uniq node by namespace
 * @param extraProps - set additional props to dom elements
 * @return - dom
 * */
export const getPortalsNode = (
  namespace?: string,
  extraProps?: AnyObject
): HTMLDivElement => {
  const id =
    portalsID + (namespace ? namespace.toLocaleUpperCase() : "DEFAULT");

  let portalsEl = document.getElementById(id);

  if (!portalsEl) {
    const el = document.createElement("div");

    if (extraProps) {
      for (const [key, val] of Object.entries(extraProps)) {
        el[key] = val;
      }
    }

    el.id = id;

    portalsEl = document.body.appendChild(el);
  }
  return portalsEl as HTMLDivElement;
};

/**
 * get scrollbar width
 * @param className - If the element customizes the scroll bar through css, pass in the class name for customization
 * @return scroll - bar [x, y] width, generally 0 on mobile, unless you customize the scroll bar
 * */
export function getScrollBarWidth(className?: string): TupleNumber {
  // Create the measurement node
  const scrollEl = document.createElement("div");
  if (className) scrollEl.className = className;
  scrollEl.style.overflow = "scroll";
  scrollEl.style.height = "200px";
  scrollEl.style.width = "200px";
  scrollEl.style.border = "2px solid red";

  document.body.appendChild(scrollEl);

  let wSize = scrollEl.offsetWidth - scrollEl.clientWidth;
  let hSize = scrollEl.offsetWidth - scrollEl.clientWidth;

  const sty = getStyle(scrollEl);

  if (sty) {
    const trimPXStr = (s) => s.replace(/px/, "");
    wSize =
      wSize - trimPXStr(sty.borderLeftWidth) - trimPXStr(sty.borderRightWidth);
    hSize =
      hSize - trimPXStr(sty.borderTopWidth) - trimPXStr(sty.borderBottomWidth);
  }

  document.body.removeChild(scrollEl);

  // Get the scrollbar width
  return [wSize, hSize];
}

/**
 * get style value of dom element
 * @param dom - target dom
 * @return - an object containing all available style values, an null means not supported
 *  */
export function getStyle(dom: HTMLElement): Partial<CSSStyleDeclaration> {
  if (!dom) return {};
  // @ts-ignore
  if (!dom.currentStyle && !window.getComputedStyle) return {};
  // @ts-ignore
  return dom.currentStyle ? dom.currentStyle : window.getComputedStyle(dom);
}

/** inject a css fragment to document */
export function loadStyle(css) {
  if (!css || typeof document === "undefined") {
    return;
  }

  const head = document.head || document.getElementsByTagName("head")[0];
  const style = document.createElement("style");

  head.appendChild(style);

  // @ts-ignore
  if (style.styleSheet) {
    // @ts-ignore
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

export function loadScript(url: string) {
  return new Promise<void>((resolve, reject) => {
    const existingScript = document.body.querySelector(`script[src="${url}"]`);

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = url;
      script.onload = () => resolve();
      script.onerror = reject;

      if (document.head.firstChild) {
        document.head.insertBefore(script, document.head.firstChild);
      } else {
        document.head.appendChild(script);
      }
    }

    if (existingScript) resolve();
  });
}

/**
 * check if element is visible
 * @param target - an element to be detected or an object that represents location information
 * @param option
 * @param option.fullVisible - false | default is to be completely invisible, and set to true to be invisible if element is partially occluded
 * @param option.wrapEl - By default, the viewport computes visibility through this specified element (viewport is still detected)
 * @param option.offset - Offset of visibility, specifying all directions for numbers, and specific directions for object
 * @return - Whether the overall visibility information and the specified direction does not exceed the visible boundary
 * */
export function checkElementVisible(
  target: HTMLElement | Partial<Bound>,
  option: {
    fullVisible?: boolean;
    wrapEl?: HTMLElement;
    offset?: number | Partial<Bound>;
  } = {}
): {
  visible: boolean;
  top: boolean;
  left: boolean;
  right: boolean;
  bottom: boolean;
  bound: Partial<Bound>;
} {
  const { fullVisible = false, wrapEl, offset = 0 } = option;

  const ofs = getOffsetObj(offset);

  // 核心是判定视口的可用区域所在的框，再检测元素是否在这个框坐标内

  /** 基础边界(用于窗口) */
  const yMinBase = 0;
  const xMinBase = 0;
  const yMaxBase = window.innerHeight;
  const xMaxBase = window.innerWidth;

  /** 有效边界 */
  let aYMin = yMinBase;
  let aXMin = xMinBase;
  let aYMax = yMaxBase;
  let aXMax = xMaxBase;

  // 需要同时检测是否超出窗口、所在容器
  if (wrapEl) {
    const { top, left, bottom, right } = wrapEl.getBoundingClientRect();

    const yMin = yMinBase + top;
    const xMin = xMinBase + left;
    const yMax = bottom;
    const xMax = right; // 减去元素右边到视口右边

    // 有效区域左上取最小值，最小不小于0
    // 有效区域右下取最大值，最大不大于窗口对应方向尺寸
    aXMin = clamp(Math.max(xMinBase, xMin), xMinBase, xMaxBase);
    aYMin = clamp(Math.max(yMinBase, yMin), yMinBase, yMaxBase);
    aXMax = clamp(Math.min(xMaxBase, xMax), xMinBase, xMaxBase);
    aYMax = clamp(Math.min(yMaxBase, yMax), yMinBase, yMaxBase);
  }

  const bound = isDom(target) ? target.getBoundingClientRect() : target;

  const { top, left, bottom, right } = offsetCalc(bound, ofs);

  /** fullVisible检测 */
  const topPos = fullVisible ? top : bottom;
  const bottomPos = fullVisible ? bottom : top;
  const leftPos = fullVisible ? left : right;
  const rightPos = fullVisible ? right : left;

  // 指定方向是否包含有效尺寸
  const xFalse = aXMax === aXMin;
  const yFalse = aYMax === aYMin;

  const topVisible = yFalse ? false : topPos >= aYMin;
  const leftVisible = xFalse ? false : leftPos >= aXMin;
  const bottomVisible = yFalse ? false : bottomPos <= aYMax;
  const rightVisible = xFalse ? false : rightPos <= aXMax;

  return {
    visible: topVisible && leftVisible && rightVisible && bottomVisible,
    top: topVisible,
    left: leftVisible,
    right: rightVisible,
    bottom: bottomVisible,
    bound,
  };
}

/** 用于checkElementVisible获取offset四个方向的值 */
function getOffsetObj(offset) {
  const ofs = { left: 0, top: 0, right: 0, bottom: 0 };

  if (!offset) return ofs;

  if (isNumber(offset)) {
    return { left: offset, top: offset, right: offset, bottom: offset };
  }

  Object.keys(ofs).forEach((key) => {
    if (isNumber(offset[key])) {
      ofs[key] = offset[key];
    }
  });

  return ofs;
}

/** 用于checkElement，计算offset对象和当前位置对象的最终值 */
function offsetCalc(bound, offset) {
  return {
    top: bound.top - offset.top,
    left: bound.left - offset.left,
    right: bound.right + offset.right,
    bottom: bound.bottom + offset.bottom,
  };
}

interface TriggerHighlightConf {
  /** #1890ff | line color */
  color?: string;
  /** true | use outline, if false use box-shadow */
  useOutline?: boolean;
}

/**
 * highlight special node (outline or shadow), if node contain (input,select,textarea), will focus them;
 * */
export function triggerHighlight(
  target: HTMLElement,
  TriggerHighlightConf?: TriggerHighlightConf
): void;
export function triggerHighlight(
  selector: string,
  TriggerHighlightConf?: TriggerHighlightConf
): void;
export function triggerHighlight(
  t: string | HTMLElement,
  TriggerHighlightConf?: TriggerHighlightConf
): void;
export function triggerHighlight(t, conf) {
  if (isDom(t)) {
    mountHighlight(t as HTMLElement, conf);
  } else {
    const temp = document.querySelectorAll(t);
    if (temp.length) {
      Array.from(temp).forEach((item) => mountHighlight(item, conf));
    }
  }
}

const mountHighlightDefaultConf = {
  color: "#1890ff",
  useOutline: true,
};

function mountHighlight(target: HTMLElement, conf = {}) {
  const cf = {
    ...mountHighlightDefaultConf,
    ...conf,
  };

  if (cf.useOutline) {
    target.style.outline = `1px auto ${cf.color}`;
  } else {
    target.style.boxShadow = `0 0 0 2px ${cf.color}`;
  }

  let inp: HTMLElement | null;

  if (
    target.tagName === "INPUT" ||
    target.tagName === "SELECT" ||
    target.tagName === "TEXTAREA"
  ) {
    inp = target;
  } else {
    inp = document.querySelector("input,select,textarea");
  }

  if (inp && isFunction(inp.focus)) inp.focus();

  function clearHandle() {
    if (cf.useOutline) {
      target.style.outline = "";
    } else {
      target.style.boxShadow = "";
    }

    document.removeEventListener("mousedown", clearHandle);
    document.removeEventListener("touchstart", clearHandle);
    document.removeEventListener("keydown", clearHandle);
  }

  document.addEventListener("mousedown", clearHandle);
  document.addEventListener("touchstart", clearHandle);
  document.addEventListener("keydown", clearHandle);
}

/**
 * Query the incoming Node for the presence of a specified node in all of its parent nodes
 * @param node - node to be queried
 * @param matcher - matcher, recursively receives the parent node and returns whether it matches
 * @param depth - maximum query depth
 * */
export function getCurrentParent(
  node: Element,
  matcher: (node: Element) => boolean,
  depth?: number
) {
  let hasMatch = false;

  let cDepth = 0;

  function recur(n) {
    if (depth) {
      cDepth++;
      if (cDepth === depth) return;
    }

    if (!n) {
      return;
    }
    const pNode = n.parentNode;

    if (pNode) {
      const res = matcher(pNode);
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

/**
 * Get scrolling parent node, get all scroll parent when pass getAll
 *
 * When setting checkOverflow, will check dom overflow property to be 'auto' or 'scroll', default us true.
 *
 * When setting or getting scrollTop/scrollLeft on document.documentElement and document.body, the performance of different browsers will be inconsistent, so when the scroll element is document.documentElement or document.body, document.documentElement is returned uniformly for easy identification
 * */
export function getScrollParent(
  ele: HTMLElement,
  getAll?: false,
  checkOverflow?: boolean
): HTMLElement | null;
export function getScrollParent(
  ele: HTMLElement,
  getAll?: true,
  checkOverflow?: boolean
): HTMLElement[];
export function getScrollParent(
  ele: HTMLElement,
  getAll?: boolean,
  checkOverflow = true
): any {
  let node: any = getAll ? [] : null;

  function handle(el) {
    const parent = el.parentNode;

    if (parent) {
      const e = parent;
      const h = e.clientHeight;
      const sH = e.scrollHeight;

      if (sH > h) {
        const isRoot = e === document.documentElement || e === document.body;
        const scrollStatus = hasScroll(e, checkOverflow);

        // 为body或doc时，统一取documentElement方便识别，部分浏览器支持body设置document.scrollXxx部分浏览器支持documentElement设置
        const element = isRoot ? document.documentElement : e;

        /* body和html元素不需要检测滚动属性 */
        if (isRoot || scrollStatus.x || scrollStatus.y) {
          if (getAll) {
            if (isRoot) {
              node.indexOf(document.documentElement) === -1 &&
                node.push(element);
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

/** get doc scroll offset, used to solve the problem of different versions of the browser to get inconsistent */
export function getDocScrollOffset() {
  const doc = document.documentElement;
  const body = document.body;

  return {
    // Math.ceil用于解决高分屏缩放时的滚动位置小数问题
    x: Math.ceil(doc.scrollLeft + body.scrollLeft),
    y: Math.ceil(doc.scrollTop + body.scrollTop),
  };
}

/** set doc scroll offset */
export function setDocScrollOffset(conf: { x?: number; y?: number } = {}) {
  if (isNumber(conf.x)) {
    // eslint-disable-next-line
    document.body.scrollLeft = document.documentElement.scrollLeft = conf.x;
  }

  if (isNumber(conf.y)) {
    // eslint-disable-next-line
    document.body.scrollTop = document.documentElement.scrollTop = conf.y;
  }
}

/** check whether the dom node is scrollable, if checkOverflowAttr is true, will check dom overflow property to be 'auto' or 'scroll'. */
export function hasScroll(
  el: HTMLElement,
  checkOverflowAttr = true
): { x: boolean; y: boolean } {
  let x = Math.max(0, el.scrollWidth - el.clientWidth) > 0;
  let y = Math.max(0, el.scrollHeight - el.clientHeight) > 0;

  if (el === document.documentElement || el === document.body) {
    // ...
  } else if (checkOverflowAttr) {
    const { overflowX, overflowY } = getStyle(el);
    if (overflowX !== "scroll" && overflowX !== "auto") {
      x = false;
    }
    if (overflowY !== "scroll" && overflowY !== "auto") {
      y = false;
    }
  }

  return {
    x,
    y,
  };
}

/** Obtaining offsets from different events, Target is a reference node, if omitted, use e.target as the reference node */
export function getEventOffset(
  e: MouseEvent | TouchEvent | PointerEvent,
  target?: HTMLElement | BoundSize
): TupleNumber {
  const touch = (e as TouchEvent).changedTouches;
  let clientX = 0;
  let clientY = 0;

  if (touch) {
    clientX = touch[0].clientX;
    clientY = touch[0].clientY;
  } else {
    clientX = (e as MouseEvent).clientX;
    clientY = (e as MouseEvent).clientY;
  }

  if (!target) target = e.target as HTMLElement | BoundSize;

  const isBound =
    isNumber((target as any).left) && isNumber((target as any).top);

  const { left, top } = isBound
    ? (target as BoundSize)
    : (target as HTMLElement).getBoundingClientRect();
  return [clientX - left, clientY - top];
}

/** Get xy points (clientX/Y) from different events */
export function getEventXY(e: TouchEvent | MouseEvent | PointerEvent) {
  const isTouch = e.type.startsWith("touch");

  let clientX = 0;
  let clientY = 0;

  const mouseEv = e as MouseEvent;
  const touchEv = e as TouchEvent;

  if (isTouch) {
    const point = touchEv.changedTouches[0];
    clientX = point.clientX;
    clientY = point.clientY;
  } else {
    clientX = mouseEv.clientX;
    clientY = mouseEv.clientY;
  }

  return [clientX, clientY, isTouch] as const;
}

/** checkChildren = false | check dom is focus, detected childrens focus when checkChildren is true */
export function isFocus(dom: HTMLElement, checkChildren = false) {
  const activeElement = document.activeElement;

  if (checkChildren) {
    return dom.contains(activeElement);
  } else {
    return dom === activeElement;
  }
}
