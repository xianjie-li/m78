import { useFn, UseScrollMeta } from "@m78/hooks";
import { animated, useSpring } from "react-spring";
import React, { useEffect, useRef } from "react";
import { _ScrollContext } from "./types.js";
import clsx from "clsx";
import clamp from "lodash/clamp.js";
import { Toggle } from "../fork/index.js";
import {
  _BAR_MAX_SIZE_RATIO,
  _BAR_MIN_SIZE_RATIO,
  _RESERVE_BAR_SIZE,
} from "./common.js";
import { FullGestureState, useDrag } from "@use-gesture/react";

/* # # # # # # # # # # # # # # # # #
 * ## 成员
 * - _useBarImpl 实现单个滚动条的逻辑
 * - _useBar 汇总xy轴滚动条并处理两者统一逻辑
 *
 * ## 实现流程
 * 隐藏原生滚动条, 实现自定义滚动条, 操作滚动条时更新容器滚动位置, 容器滚动时更新滚动条位置
 *
 * ## 隐藏原生滚动条
 * 必须节点两个, 一个parent, 一个child, 需要做两类处理, 一类是不占用容器空间的滚动条(macOS), 一类是占用的(windows)
 * - 对于占用空间的滚动条, 需要手动计算容器的 client/offset 尺寸, 并设置为右下偏移
 * - 对于不会占用容器的滚动条, 通过 css 添加一个固定的右/底部偏移即可实现
 * # # # # # # # # # # # # # # # # # */

/** 滚动条实现/汇总 */
export function _useBar(ctx: _ScrollContext) {
  const { state, setState, self, scroller, directionStyle, props, bound } = ctx;

  const yBar = _useBarImpl(ctx, {
    isY: true,
    delayHidden,
  });

  const xBar = _useBarImpl(ctx, {
    isY: false,
    delayHidden,
  });

  /* # # # # # # # # # # # # # # # # #
   * 钩子区
   * # # # # # # # # # # # # # # # # # */

  useEffect(() => {
    if (!props.scrollbar) return;

    const newState: any = {};

    // 滚动条启用状态同步
    const status = getEnableStatus();

    if (
      status.x !== state.enableStatus.x ||
      status.y !== state.enableStatus.y
    ) {
      state.enableStatus = status;
    }

    xBar.refreshScrollPosition();
    yBar.refreshScrollPosition();

    const wrap = ctx.innerWrapRef.current!;

    const barXSize = wrap.offsetWidth - wrap.clientWidth;
    const barYSize = wrap.offsetHeight - wrap.clientHeight;

    newState.xPadding = _RESERVE_BAR_SIZE + barXSize;
    newState.yPadding = _RESERVE_BAR_SIZE + barYSize;

    setState(newState);
  }, [props.direction, bound.width, bound.height, props.scrollbar]);

  /* # # # # # # # # # # # # # # # # #
   * 方法区
   * # # # # # # # # # # # # # # # # # */

  function onScroll(meta: UseScrollMeta) {
    if (!props.scrollbar) return;

    meta.isScrollX && xBar.refreshScrollPosition(meta.x / meta.xMax);
    meta.isScrollY && yBar.refreshScrollPosition(meta.y / meta.yMax);

    // if (!self.delayHiddenLock) {
    let key = "";

    // isScroll不是完全可靠的, 所以这里严格鉴别
    if (meta.isScrollX) key = "x";
    if (meta.isScrollY) key = "y";

    if (key) {
      setState({
        [`${key}Visible`]: true,
      });
    }
    // }

    delayHidden();
  }

  /** 刷新滚动条 */
  function refresh() {
    if (!props.scrollbar) return;

    yBar.refresh();
    xBar.refresh();
  }

  function delayHidden(delay = 800) {
    if (self.delayHiddenLock) return;
    clearTimeout(self.delayHiddenTimer);

    self.delayHiddenTimer = setTimeout(() => {
      setState({
        xVisible: false,
        yVisible: false,
      });
    }, delay);
  }

  /** 检测各轴是否开启了滚动及是否可滚动 */
  function getEnableStatus() {
    const meta = scroller.get();

    return {
      x: !!meta.xMax && directionStyle.overflowX === "scroll",
      y: !!meta.yMax && directionStyle.overflowY === "scroll",
    };
  }

  return {
    refresh,
    onScroll,
    barNode: (
      <>
        {xBar.barNode}
        {yBar.barNode}
      </>
    ),
    /** 设置到滚动容器, 主要用于滚动条占用容器位置的浏览器去掉滚动条位置 */
    offsetStyle: {
      bottom: `-${state.yPadding}px`,
      right: `-${state.xPadding}px`,
    },
  };
}

interface _BarImplOption {
  // 控制生成X/Y轴滚动条
  isY: boolean;
  /** 触发滚动条延迟隐藏 */
  delayHidden: (delay?: number) => void;
}

/** 单个滚动条实现, isY用于 */
export function _useBarImpl(
  ctx: _ScrollContext,
  { isY, delayHidden }: _BarImplOption
) {
  const { state, self, scroller, props } = ctx;

  const [sp, api] = useSpring(
    () => ({
      from: {
        /** thumb位置 */
        offset: 0,
        /** thumb在对应轴的尺寸 */
        size: 0,
      },
      config: {
        clamp: true,
      },
    }),
    []
  );

  const barRef = useRef<HTMLDivElement>(null!);

  /* # # # # # # # # # # # # # # # # #
   * 钩子区
   * # # # # # # # # # # # # # # # # # */

  /**
   * thumb拖动
   * */
  const bind = useDrag(onDrag, {
    /** 开始位置 */
    from: () => {
      return isY ? [0, sp.offset.get()] : [sp.offset.get(), 0];
    },
    /** 拖动阈值 */
    bounds: () => {
      const barEl = barRef.current;
      const thumbEl = barEl.childNodes[0] as HTMLElement;

      return {
        top: 0,
        left: 0,
        right: !isY ? barEl.offsetWidth - thumbEl.offsetWidth : 0,
        bottom: isY ? barEl.offsetHeight - thumbEl.offsetHeight : 0,
      };
    },
    preventDefault: true,
  });

  /* # # # # # # # # # # # # # # # # #
   * 方法区
   * # # # # # # # # # # # # # # # # # */

  /** 根据比例设置刷新滚动条位置 */
  function refreshScrollPosition(offsetRatio = 0) {
    if (!props.scrollbar) return;
    offsetRatio = clamp(offsetRatio, 0, 1);

    const wrapEl = ctx.innerWrapRef.current;
    const barEl = barRef.current;

    if (!wrapEl) return;

    const sizeRatio = isY
      ? wrapEl.offsetHeight / wrapEl.scrollHeight
      : wrapEl.offsetWidth / wrapEl.scrollWidth;
    const barSize = isY ? barEl.clientHeight : barEl.clientWidth;

    // 限制thumb的最大尺寸, 看起来会更舒服
    let thumbSize = Math.max(
      Math.min(barSize / _BAR_MAX_SIZE_RATIO, sizeRatio * barSize),
      _BAR_MIN_SIZE_RATIO
    );

    // 防止超出轨道
    if (thumbSize > barSize) thumbSize = barSize;

    api.start({
      offset: offsetRatio * (barSize - thumbSize),
      size: thumbSize,
      immediate: true,
    });
  }

  /** 刷新滚动条, 用于容器尺寸/内容等变更时 */
  function refresh() {
    if (!props.scrollbar) return;

    const offset = sp.offset.get();
    refreshScrollPosition(offset2Ratio(offset));
  }

  /** 拖动thumb */
  function onDrag(e: FullGestureState<"drag">) {
    e.event.stopPropagation();

    /** 锁定自动关闭 防止干扰 */
    if (e.first) {
      onActive();
      self.delayHiddenLock = true;
    }

    /** 触发自动关闭 */
    if (e.last) {
      self.delayHiddenLock = false;
    }

    const offset = isY ? e.offset[1] : e.offset[0];

    scroll(offset2Ratio(offset));

    api.start({
      offset,
      immediate: true,
    });
  }

  /** 根据偏移点相对轨道开始的距离获取该位置的比例 */
  function offset2Ratio(offset: number) {
    const barEl = barRef.current;
    const thumbEl = barEl.childNodes[0] as HTMLElement;

    const thumbSize = isY ? thumbEl.offsetHeight : thumbEl.offsetWidth;

    // 以轨道尺寸减thumb尺寸作为比例计算最大值
    let size = isY ? barEl.offsetHeight : barEl.offsetWidth;
    size -= thumbSize;

    return offset / size;
  }

  /** 滚动到指定比例的位置 */
  function scroll(ratio: number) {
    ratio = clamp(ratio, 0, 1);
    const meta = scroller.get();
    scroller.set({
      immediate: true,
      [isY ? "y" : "x"]: ratio * (isY ? meta.yMax : meta.xMax),
    });
  }

  /** 滚动条处于活动状态, 禁止自动隐藏 */
  const onActive = useFn(() => {
    if (self.delayHiddenLock) return;
    clearTimeout(self.delayHiddenTimer);
  });

  /** 通知滚动条失活 */
  const onUnActive = useFn(() => {
    delayHidden();
  });

  /** 显示滚动条, 并触发延迟自动关闭 */
  const showBar = useFn(() => {
    ctx.setState({
      [`${isY ? "y" : "x"}Visible`]: true,
    });

    delayHidden(1600);
  });

  /** 滚动条thumb点击 */
  const onBarClick = useFn((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    const visible = isY ? state.yVisible : state.xVisible;

    // 隐藏时改为显示滚动条
    if (!visible) {
      showBar();
      refresh();
      return;
    }
  });

  /** 轨道点击, 滚动位置到同比例位置 */
  const onTrackClick = useFn((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    const visible = isY ? state.yVisible : state.xVisible;

    // 隐藏时改为线上滚动条
    if (!visible) {
      showBar();
      refresh();
      return;
    }

    const rect = barRef.current.getBoundingClientRect();

    const size = isY ? barRef.current.offsetHeight : barRef.current.offsetWidth;
    const offset = isY ? e.clientY - rect.top : e.clientX - rect.left;

    // 这里不使用offset2Ratio是为了使定位位置更接近点击的轨道位置的比例
    let ratio = offset / size;
    // 接近两端时直接滚动到底
    if (ratio <= 0.08) ratio = 0;
    if (ratio >= 0.92) ratio = 1;

    scroll(ratio);
  });

  /* # # # # # # # # # # # # # # # # #
   * 计算值
   * # # # # # # # # # # # # # # # # # */

  const isVisible = isY ? state.yVisible : state.xVisible;
  const offsetKey = isY ? "y" : "x";
  const sizeKey = isY ? "height" : "width";

  // 有代码依赖于scroll_bar.childNode[0] 获取thumb元素, 若要改变接口需同步更改对应代码
  const barNode = (
    <Toggle when={isY ? state.enableStatus.y : state.enableStatus.x}>
      <div
        className={clsx("m78-scroll_bar", `__${isY ? "y" : "x"}`)}
        style={{
          opacity: isVisible ? 1 : 0,
        }}
        ref={barRef}
        onTouchMove={onActive}
        onTouchEnd={onUnActive}
        onMouseMove={onActive}
        onMouseLeave={onUnActive}
        onClick={onTrackClick}
      >
        <animated.div
          className="m78-scroll_bar_thumb"
          style={{
            [offsetKey]: sp.offset.to((o) => `${o}px`),
            [sizeKey]: sp.size.to((o) => `${o}px`),
          }}
          onClick={onBarClick}
          {...bind()}
        />
      </div>
    </Toggle>
  );

  return {
    barNode,
    refreshScrollPosition,
    refresh,
  };
}

export type _UseBarReturns = ReturnType<typeof _useBar>;
