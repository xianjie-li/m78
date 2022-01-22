/**
 * notes:
 * - 位置更新均使用对外暴露的update系列方法
 * - 更新依赖lastXY, lastAlignment, lastTarget, 在执行update前需要主动更新对应值, updateXX系列方法会自动更新这些值, 无序设置
 * - 代码中的简单命名约定 t: 目标节点(即定位目标), c: 内容节点(即overlay容器)
 * */

import { useRef } from 'react';
import { useFormState, useMeasure, useSelf, useSetState } from '@lxjx/hooks';
import { useSpring } from 'react-spring';
import { useTrigger } from 'm78/hooks';
import { _useMethods as useMethods } from './useMethods';
import { _useLifeCycle as useLifeCycle } from './useLifeCycle';
import { _useRender as useRender } from './useRender';
import { _Context, _MergeDefaultProps, OverlayProps } from './types';
import {
  defaultProps,
  onTrigger,
  transitionConfig,
  useOverlaysClickAway,
  useOverlaysMask,
} from './common';

/**
 * overlay抽象了所有弹层类组件(modal, drawer, popper等需要的基础能力), 使实现这些组件变得非常的简单
 * */
export function _Overlay(p: OverlayProps) {
  const props = p as _MergeDefaultProps;

  const [show, setShow] = useFormState(props, false, {
    valueKey: 'show',
    defaultValueKey: 'defaultShow',
  });

  /** 容器节点ref */
  const containerRef = useRef<HTMLDivElement>(null!);

  /** 组件状态 */
  const [state, setState] = useSetState<_Context['state']>({
    lastDirection: props.direction,
    scrollParents: [],
  });

  /** 实例对象 */
  const self = useSelf<_Context['self']>({
    lastXY: props.xy,
    lastAlignment: props.alignment,
    lastTarget: props.target,
    activeContent: false,
  });

  /** 内容定位动画 */
  const [sp, spApi] = useSpring(() => {
    return {
      to: {
        x: 0,
        y: 0,
        isHidden: false,
      },
      config: transitionConfig,
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
    enable: show && props.mask,
  });

  /** 所有启用了clickAwayClosable的overlay */
  const overlaysClickAway = useOverlaysClickAway({
    enable: show && props.clickAwayClosable,
  });

  /** 触发器 */
  const trigger = useTrigger({
    element: props.children,
    type: props.triggerType,
    onTrigger: e => onTrigger(e, setShow, self),
  });

  /** 尺寸变更时修复位置 */
  const [measure] = useMeasure(containerRef, 200);

  const ctx: _Context = {
    show,
    setShow,
    state,
    setState,
    self,
    props,
    containerRef,
    sp,
    spApi,
    arrowSp,
    arrowSpApi,
    trigger,
    overlaysClickAway,
    overlaysMask,
    measure,
  };

  const methods = useMethods(ctx);

  const lifeCycle = useLifeCycle(ctx, methods);

  return useRender(ctx, methods, lifeCycle);
}

_Overlay.defaultProps = defaultProps;
