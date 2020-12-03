import React, { useContext, useMemo, useRef } from 'react';
import { createRandString } from '@lxjx/utils';
import { useSelf, useSetState } from '@lxjx/hooks';
import { defaultProps, initStatus } from './consts';
import { useLifeCycle } from './useLifeCycle';
import { useRenders } from './useRenders';
import DNDCtx, { relationContext } from './context';
import { DNDProps, DNDRelationContext, Share } from './types';
import { useMethods } from './useMethods';

const RelationProvider = relationContext.Provider;

function DND<Data = any, TData = Data>(props: DNDProps<Data, TData>) {
  const { children, id: pId } = props;

  /** 该实例的唯一id */
  const id = useMemo(() => pId || createRandString(2), [pId]);

  /** 当前所处的DNDContext */
  const ctx = useContext(DNDCtx);

  /** 控制关系节点锁定的context */
  const relationCtx = useContext(relationContext);

  /** 挂载元素 */
  const elRef = useRef<HTMLElement>(null!);

  /** 拖动把手元素 */
  const handleRef = useRef<HTMLElement>(null!);

  const self = useSelf<Share['self']>({
    dragFeedbackEl: null,
    clearCloneTimer: null,
    lastOverStatus: false,
    ignore: false,
  });

  const [state, setState] = useSetState<Share['state']>({
    nodeEl: null!,
    handleEl: null,
  });

  /** 拖动状态 */
  const [status, setStatus] = useSetState(() => ({ ...initStatus }));

  /** 用于嵌套DND时，子级主动锁定父级 */
  const relationCtxValue: DNDRelationContext = useMemo(
    () => ({
      onLockDrop: () => {
        self.lockDropID = null;

        relationCtx.onLockDrop?.(); // 通知上层节点
      },
      onLockChange: lock => {
        !self.lockDrop && setStatus(initStatus); // 每次触发锁定时重置位置状态

        self.lockDrop = lock;

        relationCtx.onLockChange?.(lock); // 通知上层节点
      },
      childrens: [],
    }),
    [],
  );

  /** 共享状态 */
  const share: Share = {
    elRef,
    handleRef,
    status,
    setStatus,
    props,
    self,
    state,
    setState,
    id,
    ctx,
    relationCtx,
    relationCtxValue,
    currentNode: {
      id,
      data: props.data,
    },
  };

  /* 内部方法、事件处理器 */
  const methods = useMethods(share);

  /* 生命周期 */
  useLifeCycle(share, methods);

  /* 渲染函数 */
  const { renderDragFeedback } = useRenders(share);

  return (
    <RelationProvider value={relationCtxValue}>
      {renderDragFeedback()}
      {children({
        innerRef: elRef,
        handleRef,
        status,
        enables: methods.enableDropInfo,
      })}
    </RelationProvider>
  );
}

DND.defaultProps = defaultProps;

export default DND;
