import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { dumpFn } from "@m78/utils";
import { raf } from "./raf.js";
export var CURVE_EASE = [
    0.25,
    0.1,
    0.25,
    1
];
export var CURVE_LINNER = [
    0,
    0,
    1,
    1
];
export var CURVE_EASE_IN = [
    0.42,
    0,
    1,
    1
];
export var CURVE_EASE_OUT = [
    0,
    0,
    0.58,
    1
];
export var CURVE_EASE_IN_OUT = [
    0.42,
    0,
    0.58,
    1
];
export var CURVE_CIRC_IN = [
    0.6,
    0.04,
    0.98,
    0.34
];
export var CURVE_CIRC_OUT = [
    0.08,
    0.82,
    0.17,
    1
];
export var CURVE_CIRC_IN_OUT = [
    0.79,
    0.14,
    0.15,
    0.86
];
/**
 * 根据传入的持续时间和曲线, 在持续时间内的每一个渲染帧触发onChange并传入当前值(0~1)
 *
 * 可以调用返回的函数来提前结束调用
 *  */ export function curveRun(args) {
    var duration = args.duration, _args_curve = args.curve, curve = _args_curve === void 0 ? CURVE_EASE : _args_curve, onChange = args.onChange, _args_onEnd = args.onEnd, onEnd = _args_onEnd === void 0 ? dumpFn : _args_onEnd;
    var stopFlag = false;
    var stop = function() {
        stopFlag = true;
    };
    if (!duration) {
        onChange(1);
        onEnd();
        return stop;
    }
    var startTime = 0;
    function run(t) {
        if (!startTime) startTime = t;
        var endTime = startTime + duration;
        if (t >= endTime || stopFlag) {
            onChange(1);
            onEnd();
            return;
        }
        var currentTime = t - startTime;
        onChange(cubicBezier.apply(void 0, [
            currentTime / duration
        ].concat(_to_consumable_array(curve))));
        raf(run);
    }
    raf(run);
    return stop;
}
/** 与css三次贝塞尔曲线入参相同的(x1, y1, x2, y2)三次贝塞尔曲线值计算 */ export function cubicBezier(t, x1, y1, x2, y2) {
    if (x1 === 0 && y1 === 0 && x2 === 1 && y2 === 1) {
        return t; // 简单线性贝塞尔曲线
    }
    var x = solveCubicBezier(t, 0, x1, x2, 1);
    return cubicBezierCalc(x, 0, y1, y2, 1);
}
function cubicBezierCalc(t, p0, p1, p2, p3) {
    var oneMinusT = 1 - t;
    return Math.pow(oneMinusT, 3) * p0 + 3 * Math.pow(oneMinusT, 2) * t * p1 + 3 * oneMinusT * Math.pow(t, 2) * p2 + Math.pow(t, 3) * p3;
}
function cubicBezierDerivative(t, p0, p1, p2, p3) {
    var oneMinusT = 1 - t;
    return 3 * Math.pow(oneMinusT, 2) * (p1 - p0) + 6 * oneMinusT * t * (p2 - p1) + 3 * Math.pow(t, 2) * (p3 - p2);
}
function solveCubicBezier(x, p0, p1, p2, p3) {
    var epsilon = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : 1e-6;
    if (x === 0) return 0;
    if (x === 1) return 1;
    var t = x;
    for(var i = 0; i < 10; i++){
        // 最大迭代次数
        var xAtT = cubicBezierCalc(t, p0, p1, p2, p3);
        var dxAtT = cubicBezierDerivative(t, p0, p1, p2, p3);
        if (dxAtT === 0) break; // 避免分母为零
        var dt = (xAtT - x) / dxAtT;
        t -= dt;
        if (Math.abs(dt) < epsilon) break;
    }
    return t;
}
