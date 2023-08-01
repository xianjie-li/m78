import { TupleNumber } from "@m78/utils";
import { WineBound } from "./types";
/** 无bound限制 */
export declare const NO_LIMIT_AREA: {
    left: number;
    right: number;
    top: number;
    bottom: number;
};
export declare const DEFAULT_FULL_LIMIT_BOUND: {
    left: number;
    right: number;
    top: number;
    bottom: number;
};
/** 窗口最小尺寸 */
export declare const MIN_SIZE = 300;
/** 默认props */
export declare const DEFAULT_PROPS: {
    alignment: TupleNumber;
    sizeRatio: number;
    bound: WineBound;
    initFull: boolean;
    zIndex: number;
};
export declare const OPEN_FALSE_ANIMATION: {
    opacity: number;
};
export declare const OPEN_TRUE_ANIMATION: {
    opacity: number;
};
export declare const TIP_NODE_KEY = "J__M78__TIP__NODE";
export declare const NAME_SPACE = "M78__WINE";
//# sourceMappingURL=consts.d.ts.map