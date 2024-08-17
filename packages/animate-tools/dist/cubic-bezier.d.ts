import { type EmptyFunction } from "@m78/utils";
/** 描述三次贝塞尔曲线中的四个点的数组 */
export type CubicBezierCurve = [number, number, number, number];
export declare const CURVE_EASE: CubicBezierCurve;
export declare const CURVE_LINNER: CubicBezierCurve;
export declare const CURVE_EASE_IN: CubicBezierCurve;
export declare const CURVE_EASE_OUT: CubicBezierCurve;
export declare const CURVE_EASE_IN_OUT: CubicBezierCurve;
export declare const CURVE_CIRC_IN: CubicBezierCurve;
export declare const CURVE_CIRC_OUT: CubicBezierCurve;
export declare const CURVE_CIRC_IN_OUT: CubicBezierCurve;
/**
 * 根据传入的持续时间和曲线, 在持续时间内的每一个渲染帧触发onChange并传入当前值(0~1)
 *
 * 可以调用返回的函数来提前结束调用
 *  */
export declare function curveRun(args: {
    /** 持续时间(ms) */
    duration: number;
    /** CURVE_EASE | 动画曲线 */
    curve?: CubicBezierCurve;
    /** 每一帧进行回调, 并传入当前值 */
    onChange: (value: number) => void;
    /** 执行结束 */
    onEnd?: () => void;
}): EmptyFunction;
/** 与css三次贝塞尔曲线入参相同的(x1, y1, x2, y2)三次贝塞尔曲线值计算 */
export declare function cubicBezier(t: number, x1: number, y1: number, x2: number, y2: number): number;
//# sourceMappingURL=cubic-bezier.d.ts.map