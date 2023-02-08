import { _Context, ScrollInstance } from "./types.js";
import { _UseBarReturns } from "./use-bar.js";
import { UseScrollMeta, useUpdateEffect } from "@m78/hooks";
import { useEffect, useImperativeHandle, useMemo } from "react";
import { _UseMethodReturns } from "./use-method.js";
import { _UsePullActionsReturns } from "./use-pull-actions.js";
import { isMobileDevice } from "@m78/utils";

export function _useLifeCycle(
  ctx: _Context,
  methods: _UseMethodReturns,
  bar: _UseBarReturns,
  pull: _UsePullActionsReturns
) {
  const { bound, props, setState, scroller } = ctx;

  const instance = useMemo<any>(() => ({}), []);

  /** 更新设备类型 */
  useEffect(() => {
    setState({
      isMobile: isMobileDevice(),
    });
  }, []);

  /** 暴露实例 */
  useImperativeHandle<ScrollInstance, ScrollInstance>(props.instanceRef, () => {
    return Object.assign(instance, scroller, {
      triggerPullDown: pull.onPullDown,
    });
  });

  /**
   * 内容容器尺寸变更
   * - 刷新滚动条
   * */
  useUpdateEffect(() => {
    if (!bound.width && !bound.height) return;
    bar.refresh();
  }, [bound.width, bound.height]);

  /** 滚动总控制 */
  function onScroll(meta: UseScrollMeta) {
    props.onScroll?.(meta);
    bar.onScroll(meta);
    pull.onScroll(meta);

    // 同步需要的meta信息到状态中, setState在值相同时会跳过render, 所以这里不用担心性能
    setState({
      touchTop: meta.touchTop,
      touchBottom: meta.touchBottom,
      touchLeft: meta.touchLeft,
      touchRight: meta.touchRight,
      xMax: meta.xMax,
      yMax: meta.yMax,
    });
  }

  return {
    onScroll,
  };
}
