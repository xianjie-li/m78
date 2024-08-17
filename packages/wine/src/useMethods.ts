import _clamp from "lodash/clamp.js";
import { useFn } from "@m78/hooks";
import _throttle from "lodash/throttle.js";
import { isNumber, TupleNumber } from "@m78/utils";
import { WineBound, _WineContext, WineDragPosition } from "./types.js";
import {
  calcAlignment,
  getFullSize,
  getPresetPosition,
  getSizeByState,
  getTipNodeStatus,
  offsetTuple2Obj,
  sizeTuple2Obj,
} from "./common.js";
import { DEFAULT_FULL_LIMIT_BOUND, NO_LIMIT_AREA } from "./consts.js";
import { updateZIndexEvent } from "./event.js";

export function useMethods(context: _WineContext) {
  const {
    state,
    self,
    wrapElRef,
    headerElRef,
    insideState,
    setInsideState,
    spApi,
  } = context;

  /** 更新窗口、bound、warp等信息 (不触发render), 在窗口位置、尺寸等变更完毕后应该调用此方法 */
  function refreshDeps() {
    if (self.unmounted) return;

    const w = wrapElRef.current.offsetWidth;
    const h = wrapElRef.current.offsetHeight;

    const headerW = headerElRef.current.offsetWidth;
    const headerH = headerElRef.current.offsetHeight;

    const winW = window.innerWidth;
    const winH = window.innerHeight;

    self.wrapSize = [w, h];
    self.headerSize = [headerW, headerH];
    self.availableSize = [winW - w, winH - h];
    self.winSize = [winW, winH];
    self.fullSize = getFullSize(state);

    setBound();
  }

  /** 计算并设置bound */
  function setBound() {
    const [availableW, availableH] = self.availableSize;
    const [wrapW, wrapH] = self.wrapSize;

    self.windowBound = {
      left: 0,
      top: 0,
      right: availableW,
      bottom: availableH,
    };

    if (state.bound === WineBound.window) {
      self.bound = self.windowBound;
      return;
    }

    if (state.bound === WineBound.safeArea) {
      const minOffset = sizeTuple2Obj(self.headerSize).h;

      self.bound = {
        left: -wrapW + minOffset,
        top: 0,
        right: availableW + wrapW - minOffset,
        bottom: availableH + wrapH - minOffset,
      };
      return;
    }

    self.bound = NO_LIMIT_AREA;
  }

  /** 设置XY并更新到self中的快捷方式，同时也支持传入其他配置 */
  function setXY(x: number, y: number, extra?: any) {
    self.x = Math.floor(_clamp(x, self.bound.left, self.bound.right));
    self.y = Math.floor(_clamp(y, self.bound.top, self.bound.bottom));

    if (insideState.isFull) {
      setInsideState({
        isFull: false,
      });
    }

    const res = spApi.start({
      x: self.x,
      y: self.y,
      immediate: true,
      default: true,
      ...extra,
    });

    return Promise.all(res);
  }

  /** 根据当前窗口信息和alignment设置窗口位置, 如果包含缓存的窗口信息则使用缓存信息 */
  function resize() {
    let [x, y] = self.memoXY || [];
    let [width, height] = self.memoWrapSize || [];

    const flb = { ...DEFAULT_FULL_LIMIT_BOUND, ...state.limitBound };

    // 没有历史尺寸
    if (!isNumber(width) || !isNumber(height)) {
      const [w, h] = getSizeByState(state);
      width = w;
      height = h;
    }

    // 没有历史位置
    if (!isNumber(x) || !isNumber(y)) {
      const pos = calcAlignment(state.alignment, flb, self);

      x = pos[0];
      y = pos[1];
    }

    /** 防止当前限制影响定位 */
    self.bound = NO_LIMIT_AREA;

    setXY(x, y, {
      width,
      height,
    }).then(() => {
      refreshDeps();
    });
  }

  /** 最大化窗口 */
  function full() {
    if (insideState.isFull) return;

    memoWinState();

    /** 防止当前限制影响定位 */
    self.bound = NO_LIMIT_AREA;

    setXY(
      state.limitBound?.left || DEFAULT_FULL_LIMIT_BOUND.left,
      state.limitBound?.top || DEFAULT_FULL_LIMIT_BOUND.top,
      {
        width: self.fullSize[0],
        height: self.fullSize[1],
      }
    ).then(() => {
      refreshDeps();
      setInsideState({
        isFull: true,
      });
    });
  }

  /** 置顶窗口 */
  function top() {
    updateZIndexEvent.emit(insideState.id);

    if (!insideState.isTop) {
      setInsideState({
        isTop: true,
      });
      state.onActive?.();
    }
  }

  /** 设置到指定的预设位置 */
  function setPresetPosition(pos: WineDragPosition) {
    const flb = { ...DEFAULT_FULL_LIMIT_BOUND, ...state.limitBound };
    self.fullSize;

    const size = getPresetPosition(pos, self.fullSize, flb);

    setXY(size.left, size.top, {
      width: size.width,
      height: size.height,
    }).then(refreshDeps);
  }

  /** 记录创建基础状态，尺寸、位置等，用于还原 */
  function memoWinState() {
    const flb = { ...DEFAULT_FULL_LIMIT_BOUND, ...state.limitBound };

    self.memoWrapSize = self.wrapSize;

    /** 根据fullLimitBound进行修正，防止默认最大化切换为最小化时窗口跳到最左上角 */
    self.memoXY = [Math.max(self.x, flb.left), Math.max(self.y, flb.top)];
  }

  /** 根据光标位置和warp位置来计算光标在wrap上所处位置 */
  function getCursorWrapOffset(xy: TupleNumber) {
    const wrapBound = wrapElRef.current.getBoundingClientRect();
    const cursorXY = offsetTuple2Obj(xy);

    return [cursorXY.x - wrapBound.left, cursorXY.y - wrapBound.top];
  }

  /** 根据当前状态和光标时间状态重新设置提示节点 */
  const refreshTipNode = useFn(
    (xy: TupleNumber, down: boolean) => {
      if (!self.tipNode) return;

      const tipNodeStatus = getTipNodeStatus(
        self.fullSize,
        xy,
        state.limitBound
      );

      if (!down) {
        hideTipNode();

        if (tipNodeStatus) {
          const size = tipNodeStatus;
          setXY(size.left, size.top, {
            width: size.width,
            height: size.height,
          }).then(refreshDeps);
        }

        return;
      }

      if (tipNodeStatus) {
        showTipNode();

        Object.entries(tipNodeStatus).forEach(([key, val]) => {
          if (self.tipNode) {
            const oldVal = self.tipNode.style[key as any];
            const valStr = `${val}px`;

            if (valStr !== oldVal) {
              self.tipNode.style[key as any] = valStr;
            }
          }
        });
      } else {
        hideTipNode();
      }
    },
    (fn) => _throttle(fn, 10)
  );

  /** 隐藏提示节点 */
  function hideTipNode() {
    if (!self.tipNode) return;
    if (self.tipNode.style.visibility !== "hidden") {
      self.tipNode.style.visibility = "hidden";
      self.tipNode.style.opacity = "0";
    }
  }

  /** 显示提示节点 */
  function showTipNode() {
    if (!self.tipNode) return;
    if (self.tipNode.style.visibility !== "visible") {
      self.tipNode.style.visibility = "visible";
      self.tipNode.style.opacity = "1";
    }
  }

  return {
    refreshDeps,
    setXY,
    resize,
    full,
    getCursorWrapOffset,
    top,
    setPresetPosition,
    refreshTipNode,
  };
}

export type _Methods = ReturnType<typeof useMethods>;
