import { useRef } from "react";
import {
  useFn,
  useFormState,
  useIsUnmountState,
  useMeasure,
  useSelf,
  useSetState,
} from "@m78/hooks";
import { useSpring } from "react-spring";
import { _useMethods as useMethods } from "./use-methods.js";
import { _useLifeCycle as useLifeCycle } from "./use-life-cycle.js";
import { _useRender as useRender } from "./use-render.js";
import { _OverlayContext, _MergeDefaultProps, OverlayProps } from "./types.js";
import {
  _defaultProps,
  _onTrigger,
  overlayTransitionConfig,
  useEscapeCloseable,
  useOverlaysClickAway,
  useOverlaysMask,
} from "./common.js";
import { isFunction } from "@m78/utils";
import { TriggerEvent } from "@m78/trigger";
import { useTrigger } from "@m78/trigger/react/trigger.js";

/**
 * overlay抽象了所有弹层类组件(modal, drawer, popper等需要的基础能力), 使实现这些组件变得非常的简单
 * */
export function _Overlay(p: OverlayProps) {
  const props = {
    ..._defaultProps,
    ...p,
  } as _MergeDefaultProps;

  const [open, setOpen] = useFormState(props, false, {
    valueKey: "open",
    defaultValueKey: "defaultOpen",
  });

  /** 容器节点ref */
  const containerRef = useRef<HTMLDivElement>(null!);

  /** 组件状态 */
  const [state, setState] = useSetState<_OverlayContext["state"]>({
    lastDirection: props.direction,
    scrollParents: [],
  });

  /** 实例对象 */
  const self = useSelf<_OverlayContext["self"]>({
    lastXY: props.xy,
    lastAlignment: props.alignment,
    lastTarget: props.target,
    lastPosition: [0, 0],
    activeContent: false,
    contentExist: false,
  });

  /** 内容定位动画 */
  const [sp, spApi] = useSpring(() => {
    return {
      to: {
        x: 0,
        y: 0,
        isHidden: true,
      },
      config: overlayTransitionConfig,
    };
  });

  /** arrow定位动画 */
  const [arrowSp, arrowSpApi] = useSpring(() => {
    return {
      to: {
        offset: 30,
      },
    };
  });

  /** 所有启用了mask的overlay */
  const overlaysMask = useOverlaysMask({
    enable: open && props.mask,
  });

  /** 所有启用了clickAwayClosable的overlay */
  const overlaysClickAway = useOverlaysClickAway(
    {
      enable: open && props.clickAwayQueue && props.clickAwayClosable,
    },
    props.clickAwayQueueNameSpace
  );

  /** 所有启用的escapeClosable */
  const escapeCloseable = useEscapeCloseable({
    enable: open && props.escapeClosable,
  });

  /** 给content render和children render的参数 */
  const customRenderMeta = {
    props,
    open: open,
    setOpen,
  };

  const children = props.children;
  const element = isFunction(children) ? children(customRenderMeta) : children;

  /** 尺寸变更时修复位置 */
  const [measure] = useMeasure(containerRef, 200);

  const ctx: _OverlayContext = {
    open: open && !props.disabled,
    setOpen,
    state,
    setState,
    self,
    props,
    containerRef,
    sp,
    spApi,
    arrowSp,
    arrowSpApi,
    overlaysClickAway,
    overlaysMask,
    escapeCloseable,
    measure,
    isUnmount: useIsUnmountState(),
    customRenderMeta,
    trigger: null as any, // set later
    triggerHandle: null as any,
    methods: null as any,
  };

  /** 触发器回调 */
  ctx.triggerHandle = useFn((e: TriggerEvent) => _onTrigger(e, ctx));

  /** 触发器 */
  ctx.trigger = useTrigger({
    element,
    type: props.triggerType,
    onTrigger: ctx.triggerHandle,
    innerRef: props.triggerNodeRef,
  });

  ctx.methods = useMethods(ctx);

  const lifeCycle = useLifeCycle(ctx);

  return useRender(ctx, lifeCycle);
}

_Overlay.displayName = "Overlay";
