import { useEffect } from 'react';
import { throwError } from 'm78/util';
import { useDrag } from 'react-use-gesture';
import { isFunction } from '@lxjx/utils';
import _remove from 'lodash/remove';
import { Share } from './types';
import { UseMethodsReturns } from './useMethods';

export function useLifeCycle(share: Share, methods: UseMethodsReturns) {
  const {
    elRef,
    handleRef,
    state,
    setState,
    ctx,
    id,
    props,
    currentNode,
    relationCtx,
    relationCtxValue,
    self,
  } = share;
  const { enableDrag } = props;

  /* 标记组件卸载 */
  useEffect(() => {
    return () => {
      self.ignore = true;
    };
  }, []);

  /* 整理挂载节点、拖动把手节点并设置到state中 */
  useEffect(() => {
    if (!elRef.current) {
      throwError(`cannot get drag node, did you forget to pass innerRef? by ${id}`, 'DND');
    }
    setState({
      nodeEl: elRef.current,
      handleEl: handleRef.current || elRef.current,
    });

    // methods.setHandlePointer();
  }, [elRef.current, elRef.current]);

  /* 将当前实例的监听器推入列表, 并在卸载时移除 */
  useEffect(() => {
    ctx.listeners.push({
      id,
      handler: methods.changeHandle,
    });

    return () => {
      _remove(ctx.listeners, item => item.id === id);
    };
  }, []);

  /* 同步relationCtxValue.childrens */
  useEffect(() => {
    // 没有DND父级
    if (!relationCtx.childrens) return;

    // 将本实例和所有子实例推入父实例childrens中
    const child = [id];

    if (relationCtxValue.childrens.length) {
      child.push(...relationCtxValue.childrens);
    }

    relationCtx.childrens.push(...child);

    return () => {
      _remove(relationCtx.childrens, _id => child.includes(_id));
    };
  }, []);

  /* 检测滚动父级并同步到检测列表中 */
  useEffect(methods.scrollParentsHandle, [state.nodeEl]);

  /* 绑定拖拽事件 */
  const bind = useDrag(methods.dragHandle, {
    domTarget: state.handleEl,
    filterTaps: true,
    eventOptions: {
      passive: false,
    },
    enabled: isFunction(enableDrag) ? enableDrag(currentNode) : enableDrag,
  });

  /* 激活事件 */
  useEffect(() => {
    bind();
  }, [bind, state.handleEl]);
}
