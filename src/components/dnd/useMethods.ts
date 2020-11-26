import { useFn } from '@lxjx/hooks';
import { FullGestureState, Handler } from 'react-use-gesture/dist/types';
import { useEffect } from 'react';
import { isNumber } from '@lxjx/utils';
import { ChangeHandle, DNDNode, DragFullEvent, DragPartialEvent, DragStatus, Share } from './types';

import { edgeRatio, initStatus } from './consts';

export function useMethods(share: Share) {
  const { elRef, status, setStatus, self, id, ctx, props, currentNode } = share;

  // 放置目标响应拖动目标的拖动事件
  const changeHandle: ChangeHandle = useFn(dragE => {
    const {
      xy: [x, y],
      down,
    } = dragE;

    const { left, top, right, bottom } = elRef.current.getBoundingClientRect();

    // 尺寸
    const width = right - left;
    const height = bottom - top;

    // 触发边缘放置的偏移距离
    const triggerXOffset = width * edgeRatio;
    const triggerYOffset = height * edgeRatio;

    // 各方向上的拖动状态
    const dragOver = x > left && x < right && y > top && y < bottom;
    const dragTop = dragOver && y < top + triggerYOffset;
    const dragBottom = dragOver && !dragTop && y > bottom - triggerYOffset;

    const nextShouldPass = dragOver && !dragTop && !dragBottom;

    const dragRight = nextShouldPass && x > right - triggerXOffset;
    const dragLeft = nextShouldPass && x < left + triggerXOffset;
    const dragCenter = nextShouldPass && !dragRight && !dragLeft;

    const nextStatus: DragStatus = {
      dragOver,
      dragTop,
      dragBottom,
      dragLeft,
      dragRight,
      dragCenter,
      dragging: status.dragging,
    };

    // 松开时，还原状态、并在处于over状态时触发onSourceAccept
    if (!down) {
      dragOver && props.onSourceAccept?.(getEventObj(dragE, nextStatus) as DragFullEvent);

      // 重置状态
      self.lastOverStatus = false;
      resetCtxCurrents();
      setStatus(initStatus);
      return;
    }

    /** TODO: disabled处理 */
    if (dragOver) {
      // 保存当前放置目标状态
      ctx.currentTarget = currentNode;
      ctx.currentOffsetX = x - left;
      ctx.currentOffsetY = y - top;
      ctx.currentStatus = status;

      // 上一拖动事件已经是over事件时，触发move，否则触发enter
      if (self.lastOverStatus) {
        props.onSourceMove?.(getEventObj(dragE, nextStatus) as DragFullEvent);
      } else {
        props.onSourceEnter?.(getEventObj(dragE, nextStatus) as DragFullEvent);
      }
    } else if (self.lastOverStatus) {
      // 非over且上一次是over状态，则初始化当前的放置目标
      resetCtxCurrents();

      props.onSourceLeave?.(getEventObj(dragE, nextStatus));
    }
    // 保存本次放置状态
    self.lastOverStatus = dragOver;

    // 状态完全相等时不进行更新
    if (
      status.dragOver === dragOver &&
      status.dragTop === dragTop &&
      status.dragBottom === dragBottom &&
      status.dragLeft === dragLeft &&
      status.dragRight === dragRight &&
      status.dragCenter === dragCenter
    ) {
      return;
    }

    setStatus(nextStatus);
  });

  // 将当前实例的监听器推入列表
  useEffect(() => {
    ctx.listeners.push({
      id,
      handler: changeHandle,
    });
  }, []);

  /** 拖动目标拖动事件处理 */
  const dragHandle: Handler<'drag'> = useFn(dragE => {
    const {
      movement: [moveX, moveY],
      down,
      first,
      tap,
      // event,
    } = dragE;

    if (tap) return;

    // event?.preventDefault(); TODO: 检查是否需要

    // 开始
    if (first) {
      clearCloneNode();
      startHandle(dragE);
    }

    // 在listeners移除状态前执行onCancel或onDrop通知
    if (!down) {
      if (ctx.currentTarget) {
        props.onDrop?.(getEventObj(dragE) as DragFullEvent);
      } else {
        props.onCancel?.(getEventObj(dragE));
      }
    }

    // 将拖动操作派发到其他同组DND组件
    ctx.listeners.forEach(cItem => {
      if (cItem.id !== id) cItem.handler(dragE);
    });

    // 派发move事件
    props.onMove?.(getEventObj(dragE));

    // 结束
    if (!down) {
      endHandle(dragE);
      return;
    }

    // 更新拖动元素动画状态
    window.requestAnimationFrame(() => {
      self.cloneNode.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    // console.log(cloneNode.current.getBoundingClientRect());
  });

  /** 开始拖动 */
  function startHandle(dragE: FullGestureState<'drag'>) {
    // 记录拖动目标
    ctx.currentSource = currentNode;

    props.onDrag?.(getEventObj(dragE));

    // 移除克隆拖动元素清理计时器
    clearTimeout(self.clearCloneTimer);

    setStatus({
      dragging: true,
    });

    // 克隆目标，实际拖动的是克隆元素
    self.cloneNode = elRef.current.cloneNode(true) as HTMLElement;

    const { x, y } = elRef.current.getBoundingClientRect();

    // TODO: 拖动动画
    self.cloneNode.style.position = 'fixed';
    self.cloneNode.style.left = `${x}px`;
    self.cloneNode.style.top = `${y}px`;
    self.cloneNode.style.opacity = '0.7';
    self.cloneNode.style.pointerEvents = 'none';
    self.cloneNode.style.zIndex = '10000';

    document.body.appendChild(self.cloneNode);
  }

  /** 结束拖动 */
  function endHandle(dragE: FullGestureState<'drag'>) {
    setStatus(initStatus);

    // TODO: 拖动动画
    if (self.cloneNode) {
      self.cloneNode.style.transition = `0.1s`;
      self.cloneNode.style.transform = `translate(0, 0)`;
    }

    // 预估动画结束时间并进行清理
    self.clearCloneTimer = setTimeout(clearCloneNode, 400);
  }

  /** 清理克隆节点 */
  function clearCloneNode() {
    if (self.cloneNode) {
      const parentNode = self.cloneNode.parentNode;
      parentNode && parentNode.removeChild(self.cloneNode);
    }
  }

  /**
   * 根据当前状态获取事件对象
   * @param dragE - 当前的拖动事件对象
   * @param nextStatus - 声明当前最新的status，如果未传入，会尝试取全局的status状态
   * */
  function getEventObj(
    dragE: FullGestureState<'drag'>,
    nextStatus?: DragStatus,
  ): DragPartialEvent | DragFullEvent {
    const {
      xy: [x, y],
    } = dragE;

    const { currentTarget, currentOffsetX, currentOffsetY, currentStatus } = ctx;

    const e: DragPartialEvent | DragFullEvent = {
      x,
      y,
      source: ctx.currentSource!,
    };

    if (currentTarget) {
      e.target = currentTarget;
    }

    if (isNumber(currentOffsetX) && isNumber(currentOffsetY)) {
      e.offsetX = currentOffsetX;
      e.offsetY = currentOffsetY;
    }

    if (nextStatus || currentStatus) {
      e.status = nextStatus;
    }

    return e;
  }

  /** 重置ctx上放置对象相关的属性 */
  function resetCtxCurrents() {
    ctx.currentTarget = undefined;
    ctx.currentOffsetX = undefined;
    ctx.currentOffsetY = undefined;
    ctx.currentStatus = undefined;
  }

  return {
    changeHandle,
    dragHandle,
  };
}
