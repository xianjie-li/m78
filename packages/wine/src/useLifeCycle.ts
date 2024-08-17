import { useEffect } from "react";
import { defer } from "@m78/utils";
import { useDrag } from "react-use-gesture";
import { _WineContext, WineDragPosition } from "./types.js";
import { _Methods } from "./useMethods.js";
import { useDragResize } from "./useDragResize.js";
import { OPEN_FALSE_ANIMATION, OPEN_TRUE_ANIMATION } from "./consts.js";
import { updateZIndexEvent } from "./event.js";
import { getTipNode } from "./common.js";

export function useLifeCycle(ctx: _WineContext, methods: _Methods) {
  const { spApi, state, headerElRef, self, setInsideState, insideState } = ctx;
  const { refreshDeps, resize, setXY, full } = methods;

  // 标记销毁
  useEffect(
    () => () => {
      self.unmounted = true;
    },
    []
  );

  // 初始化
  useEffect(() => {
    self.tipNode = getTipNode();

    // none状态下会影响尺寸计算
    Promise.all(
      spApi.start({
        immediate: true,
        display: "block",
      })
    ).then(() => {
      refreshDeps();

      // 防止窗口未设置偏移时抖动
      spApi.start({
        visibility: "visible",
        immediate: true,
      });

      state.initFull ? full() : resize();

      defer(() => {
        setInsideState({
          headerHeight: self.headerSize[1],
        });
      });
    });
  }, []);

  // 窗口尺寸变更时刷新尺寸相关信息
  useEffect(() => {
    window.addEventListener("resize", refreshDeps);

    return () => window.removeEventListener("resize", refreshDeps);
  }, []);

  // 控制开关显示
  useEffect(() => {
    let ignore = false;

    if (state.open) {
      spApi.start({
        immediate: true,
        display: "block",
      });

      Promise.all(spApi.start(OPEN_TRUE_ANIMATION)).then(() => {
        // 动画结束后获取焦点
        ctx.wrapElRef.current && ctx.wrapElRef.current.focus();
      });

      // 置顶
      methods.top();
    } else {
      Promise.all(spApi.start(OPEN_FALSE_ANIMATION)).then(() => {
        if (ignore) return;
        spApi.start({
          immediate: true,
          display: "none",
        });
      });
    }

    return () => {
      ignore = true;
    };
  }, [state.open]);

  // 监听置顶还原
  updateZIndexEvent.useEvent((id) => {
    if (insideState.isTop && id !== insideState.id) {
      setInsideState({
        isTop: false,
      });
    }
  });

  useDrag(
    ({ memo = [], xy, down, delta: [dX, dY], event, tap }) => {
      event.preventDefault();

      if (tap) return;

      /*
       * cursorOffset记录事件开始时相对wrap左上角的位置
       * distance记录移动的总距离
       * */
      const [cursorOffset, distance] = memo;
      const _cursorOffset = cursorOffset || methods.getCursorWrapOffset(xy);

      setXY(xy[0] - _cursorOffset[0], xy[1] - _cursorOffset[1]);

      if (distance && distance > 60) {
        methods.refreshTipNode(xy, down);
      }

      return [_cursorOffset, (distance || 0) + Math.abs(dX) + Math.abs(dY)];
    },
    {
      domTarget: headerElRef,
      filterTaps: true,
      eventOptions: {
        passive: false,
      },
    }
  );

  ctx.dragLineRRef = useDragResize(WineDragPosition.R, ctx, methods);
  ctx.dragLineLRef = useDragResize(WineDragPosition.L, ctx, methods);
  ctx.dragLineBRef = useDragResize(WineDragPosition.B, ctx, methods);
  ctx.dragLineTRef = useDragResize(WineDragPosition.T, ctx, methods);
  ctx.dragLineLTRef = useDragResize(WineDragPosition.LT, ctx, methods);
  ctx.dragLineRTRef = useDragResize(WineDragPosition.RT, ctx, methods);
  ctx.dragLineRBRef = useDragResize(WineDragPosition.RB, ctx, methods);
  ctx.dragLineLBRef = useDragResize(WineDragPosition.LB, ctx, methods);
}
