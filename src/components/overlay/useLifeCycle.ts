import { useClickAway, useLockBodyScroll, useUpdateEffect } from '@lxjx/hooks';
import { useEffect, useImperativeHandle, useMemo } from 'react';
import { _Methods } from './useMethods';
import { isBound } from './common';
import { _Context } from './types';

export function _useLifeCycle(ctx: _Context, methods: _Methods) {
  const {
    props,
    setShow,
    show,
    self,
    trigger,
    containerRef,
    overlaysClickAway,
    state,
    measure,
  } = ctx;

  /** 暴露实例 */
  useImperativeHandle(props.instanceRef, () => ({
    updateXY: methods.updateXY,
    updateAlignment: methods.updateAlignment,
    updateTarget: methods.updateTarget,
    update: methods.update,
  }));

  /** 根据xy, alignment, target合成useEffect的更新deps, 减少一些不必要的更新 */
  const updateTargetDeps = useMemo(() => {
    const deps: any[] = [...(props.xy || [0, 0]), ...(props.alignment || [0, 0])];

    // 这里是关键, 防止bound被滥用(直接传入字面量) 导致频繁更新
    if (isBound(props.target)) {
      deps.push(props.target.top, props.target.left, props.target.width, props.target.height);
    } else {
      deps.push(props.target);
    }

    return deps;
  }, [props.xy, props.alignment, props.target, show]);

  /** 滚动条处理 */
  useLockBodyScroll(props.lockScroll && show);

  /** 实现它处点击关闭 */
  useClickAway({
    target: [containerRef, trigger.el!],
    onTrigger: () => {
      if (!show || !props.clickAwayClosable) return;
      if (props.clickAwayQueue && !overlaysClickAway.isLast) return;
      setTimeout(() => {
        setShow(false);
      });
    },
  });

  /** children变更时, 更新 */
  useUpdateEffect(methods.updateChildrenEl, [trigger.el]);

  /** show变更时, 先立即调整位置 */
  useUpdateEffect(() => {
    // 每次出现时将焦点移入组件
    if (show && containerRef.current) {
      containerRef.current.focus();
    }

    methods.update(true);
    clearTimeout(self.shouldCloseTimer);
  }, [show]);

  /** 内容尺寸变更时重新等位 */
  useUpdateEffect(() => {
    if (!measure.width || !measure.height) return;
    methods.update(true);
  }, [measure.width, measure.height, measure.top, measure.left]);

  /** 根据props的位置配置同步 */
  useUpdateEffect(() => {
    self.lastXY = props.xy;
    self.lastAlignment = props.alignment;
    self.lastTarget = props.target;
    // 使用默认顺序更新
    methods.update();
  }, updateTargetDeps);

  /** 滚动/窗口大小改变时更新位置 */
  useEffect(() => {
    const els = [...state.scrollParents, window];

    window.addEventListener('resize', methods.debounceUpdate);

    els.forEach(el => {
      el.addEventListener('scroll', methods.throttleUpdate);
    });

    return () => {
      window.removeEventListener('resize', methods.debounceUpdate);

      els.forEach(el => {
        el.removeEventListener('scroll', methods.throttleUpdate);
      });
    };
  }, [state.scrollParents]);

  /** content对应的dom挂载, 如果启用了unmountOnExit, 此hook会在每次content挂载后执行 */
  const onContentMount = () => {
    methods.update(true);
  };

  /** content对应的dom卸载, 如果启用了unmountOnExit, 此hook会在每次content卸载后执行 */
  const onContentUnmount = () => {
    props.onDispose?.();
  };

  return {
    onContentMount,
    onContentUnmount,
  };
}

export type _LifeCycle = ReturnType<typeof _useLifeCycle>;
