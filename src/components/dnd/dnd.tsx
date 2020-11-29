import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { createRandString } from '@lxjx/utils';
import { useSelf, useSetState } from '@lxjx/hooks';
import { defaultProps, initStatus } from 'm78/dnd/consts';
import { useLifeCycle } from 'm78/dnd/useLifeCycle';
import { useRenders } from 'm78/dnd/useRenders';
import DNDCtx, { relationContext } from './context';
import { DNDProps, DNDRelationContext, Share } from './types';
import { useMethods } from './useMethods';

const RelationProvider = relationContext.Provider;

/**
 * 与传统DND的区别
 * 同时支持移动、pc
 * 基于元素位置的拖动
 * 启发式的拖动组件
 * 无入侵, 在不更改现有dom结构的前提下增加拖动行为拖动
 *
 *
 * 网格demo
 * 网格拖动动画demo
 * 看板
 * 禁用
 * 多列拖动/列与列之间可拖动
 * 自定义拖拽物
 *
 * 方向演示
 * 各种状态的使用演示
 * 如何添加动画完全基于你的想象力，基于绝对定位布局的动画
 * */

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
