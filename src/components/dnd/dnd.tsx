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

/**
 * 与其他DND库的有所不同:
 *  - 基于元素位置的拖动, 放置时，可以识别放置的具体位置如上、右、下、左、中, 以此实现更为精细的拖放控制
 *  - 无入侵, 你可以在不更改现有dom结构的前提下增加拖动行为
 *  - 启发式的拖动组件，与传统的DND库(Draggable/Droppable)有所不同，此库通过一个单一的`<DND />`组件来完成拖动/放置操作，因为很多时候元素可能即是拖动目标、也是放置目标
 *  - 同时支持移动、pc
 *
 * 基本演示
 *    一个基础的多方向拖动示例:
 *      - 通过`DNDContext`将`DND`组件分组(可选但推荐，无分组的`DND`状态会管理在一组默认状态中, 通常`DND`不需要接收事件，而是直接使用`DNDContext`来进行事件管理)
 *      - 通过enableDrop选择要启用的反向
 *      - 根据render children接收的状态来调整盒子拖放元素内容、绑定拖放节点
 *      - 作为拖动元素时，`DND`会触发拖动目标相关的事件，作为放置目标时，`DND`会触发放置目标相关的事件
 * 各种状态的使用演示/内置简单样式
 * 网格demo - 方向演示
 * 看板 - 多列拖动
 * 网格拖动动画demo - 如何添加动画完全基于你的想象力，基于绝对定位布局的动画

 * 禁用 - 禁止拖动、禁止防止
 * 自动滚动


 * 自定义拖动把手
 * 自定义拖拽物/ 简单定制、节点定制
 * 持久化变更
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
