import { dumpFn, type EmptyFunction } from "@m78/utils";
import { raf } from "./raf.js";

/** 描述三次贝塞尔曲线中的四个点的数组 */
export type CubicBezierCurve = [number, number, number, number];

export const CURVE_EASE: CubicBezierCurve = [0.25, 0.1, 0.25, 1];
export const CURVE_LINNER: CubicBezierCurve = [0, 0, 1, 1];
export const CURVE_EASE_IN: CubicBezierCurve = [0.42, 0, 1, 1];
export const CURVE_EASE_OUT: CubicBezierCurve = [0, 0, 0.58, 1];
export const CURVE_EASE_IN_OUT: CubicBezierCurve = [0.42, 0, 0.58, 1];
export const CURVE_CIRC_IN: CubicBezierCurve = [0.6, 0.04, 0.98, 0.34];
export const CURVE_CIRC_OUT: CubicBezierCurve = [0.08, 0.82, 0.17, 1];
export const CURVE_CIRC_IN_OUT: CubicBezierCurve = [0.79, 0.14, 0.15, 0.86];

/**
 * 根据传入的持续时间和曲线, 在持续时间内的每一个渲染帧触发onChange并传入当前值(0~1)
 *
 * 可以调用返回的函数来提前结束调用
 *  */
export function curveRun(args: {
  /** 持续时间(ms) */
  duration: number;
  /** CURVE_EASE | 动画曲线 */
  curve?: CubicBezierCurve;
  /** 每一帧进行回调, 并传入当前值 */
  onChange: (value: number) => void;
  /** 执行结束 */
  onEnd?: () => void;
}): EmptyFunction {
  const { duration, curve = CURVE_EASE, onChange, onEnd = dumpFn } = args;

  let stopFlag = false;

  const stop = () => {
    stopFlag = true;
  };

  if (!duration) {
    onChange(1);
    onEnd();
    return stop;
  }

  let startTime = 0;

  function run(t: number) {
    if (!startTime) startTime = t;

    const endTime = startTime + duration;

    if (t >= endTime || stopFlag) {
      onChange(1);
      onEnd();
      return;
    }

    const currentTime = t - startTime;
    onChange(cubicBezier(currentTime / duration, ...curve));

    raf(run);
  }

  raf(run);

  return stop;
}

/** 与css三次贝塞尔曲线入参相同的(x1, y1, x2, y2)三次贝塞尔曲线值计算 */
export function cubicBezier(
  t: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  if (x1 === 0 && y1 === 0 && x2 === 1 && y2 === 1) {
    return t; // 简单线性贝塞尔曲线
  }

  const x = solveCubicBezier(t, 0, x1, x2, 1);
  return cubicBezierCalc(x, 0, y1, y2, 1);
}

function cubicBezierCalc(
  t: number,
  p0: number,
  p1: number,
  p2: number,
  p3: number
) {
  const oneMinusT = 1 - t;
  return (
    oneMinusT ** 3 * p0 +
    3 * oneMinusT ** 2 * t * p1 +
    3 * oneMinusT * t ** 2 * p2 +
    t ** 3 * p3
  );
}

function cubicBezierDerivative(
  t: number,
  p0: number,
  p1: number,
  p2: number,
  p3: number
) {
  const oneMinusT = 1 - t;
  return (
    3 * oneMinusT ** 2 * (p1 - p0) +
    6 * oneMinusT * t * (p2 - p1) +
    3 * t ** 2 * (p3 - p2)
  );
}

function solveCubicBezier(
  x: number,
  p0: number,
  p1: number,
  p2: number,
  p3: number,
  epsilon = 1e-6
) {
  if (x === 0) return 0;
  if (x === 1) return 1;

  let t = x;
  for (let i = 0; i < 10; i++) {
    // 最大迭代次数
    const xAtT = cubicBezierCalc(t, p0, p1, p2, p3);
    const dxAtT = cubicBezierDerivative(t, p0, p1, p2, p3);
    if (dxAtT === 0) break; // 避免分母为零
    const dt = (xAtT - x) / dxAtT;
    t -= dt;
    if (Math.abs(dt) < epsilon) break;
  }
  return t;
}
