import { TupleNumber } from "@m78/utils";
import { WineBound } from "./types.js";

/** 无bound限制 */
export const NO_LIMIT_AREA = {
  left: -Infinity,
  right: Infinity,
  top: -Infinity,
  bottom: Infinity,
};

export const DEFAULT_FULL_LIMIT_BOUND = {
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

/** 窗口最小尺寸 */
export const MIN_SIZE = 300;

/** 默认props */
export const DEFAULT_PROPS = {
  alignment: [0.5, 0.5] as TupleNumber,
  sizeRatio: 0.84,
  bound: WineBound.safeArea,
  initFull: false,
  zIndex: 1000,
};

export const OPEN_FALSE_ANIMATION = {
  opacity: 0,
};

export const OPEN_TRUE_ANIMATION = {
  opacity: 1,
};

export const TIP_NODE_KEY = "J__M78__TIP__NODE";

export const NAME_SPACE = "M78__WINE";
