import { _Context } from "./types.js";
import { _UseBarReturns } from "./use-bar.js";
import { UseScrollMeta, useUpdateEffect } from "@m78/hooks";
import { useEffect, useImperativeHandle } from "react";
import { _UseMethodReturns } from "./use-method.js";
import { preventTopPull } from "./prevent-top-pull.js";

export function _useLifeCycle(
  ctx: _Context,
  methods: _UseMethodReturns,
  bar: _UseBarReturns
) {
  const { bound, props, setState, scroller } = ctx;

  /** 暴露实例 */
  useImperativeHandle(props.instanceRef, () => {
    return scroller;
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
