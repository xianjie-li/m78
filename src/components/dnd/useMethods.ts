import { useFn } from '@lxjx/hooks';
import { FullGestureState, Handler } from 'react-use-gesture/dist/types';
import { useEffect, useState } from 'react';
import _throttle from 'lodash/throttle';
import { defer, getScrollParent, isBoolean, isFunction, isNumber, isObject } from '@lxjx/utils';
import {
  allPropertyIsEqual,
  allPropertyHasTrue,
  isIgnoreEl,
  getOverStatus,
  isBetween,
  getAutoScrollStatus,
  autoScrollByStatus,
  allPropertyAllTrue,
} from './common';
import {
  ChangeHandle,
  DragFullEvent,
  DragPartialEvent,
  DragStatus,
  Share,
  EnableInfos,
} from './types';

import { initEnableDragsPass, initStatus, initEnableDragsDeny } from './consts';

export function useMethods(share: Share) {
  const {
    state,
    status,
    setStatus,
    self,
    id,
    ctx,
    props,
    currentNode,
    relationCtx,
    relationCtxValue,
  } = share;
  const { enableDrop, dragFeedbackStyle, ignoreElFilter } = props;

  // 对于非函数的enable配置，加载时获取一次初始值, 后面可以直接都是用本次获取
  const [enableDropInfo, setEnableDropInfo] = useState(formatEnableDrag);

  // 变更且启用配置非函数时时重新获取
  useEffect(() => {
    if (!isFunction(enableDrop)) {
      setEnableDropInfo(formatEnableDrag());
    }
  }, [enableDrop]);

  // 放置目标响应拖动目标的拖动事件
  const changeHandle: ChangeHandle = useFn(
    (dragE, isCancel) => {
      const { lockDropID } = self;

      const {
        xy: [x, y],
        down,
      } = dragE;

      const enableDropIsFn = isFunction(enableDrop);

      // 如果enableDrop为函数，则需要在每次执行时判断
      const _enableDropInfo = isFunction(enableDrop) ? formatEnableDrag() : enableDropInfo;

      // 如果前后两次的启用状态不同，则更新
      if (enableDropIsFn) {
        if (down) {
          // 如果禁用状态与当前保存的不一致则同步
          if (!allPropertyIsEqual(enableDropInfo, _enableDropInfo)) {
            setEnableDropInfo(_enableDropInfo);
          }
          // 松开且不可用时，还原配置
        } else if (!_enableDropInfo.enable) {
          setEnableDropInfo(formatEnableDrag(true));
        }
      }

      if (self.lockDrop) return;
      if (!state.nodeEl) return;
      if (!_enableDropInfo.enable) return;

      const { dragOver, left, top, ...otherS } = getOverStatus(
        state.nodeEl,
        x,
        y,
        self.firstScrollParent,
      );

      const nextStatus: DragStatus = {
        dragOver: dragOver /* && _enableDropInfo.all */ && !isCancel,
        dragTop: _enableDropInfo.top && otherS.dragTop,
        dragBottom: _enableDropInfo.bottom && otherS.dragBottom,
        dragLeft: _enableDropInfo.left && otherS.dragLeft,
        dragRight: _enableDropInfo.right && otherS.dragRight,
        dragCenter: _enableDropInfo.center && otherS.dragCenter,
        dragging: status.dragging,
        regular: true,
      };

      if (
        (_enableDropInfo.all &&
          nextStatus.dragOver) /* 开启全部时，dragOver为true即视为非常规状态 */ ||
        nextStatus.dragTop ||
        nextStatus.dragBottom ||
        nextStatus.dragLeft ||
        nextStatus.dragRight ||
        nextStatus.dragCenter ||
        nextStatus.dragging
      ) {
        nextStatus.regular = false;
      }

      // 处理父子级关联锁定
      if (dragOver) {
        relationCtx.onLockDrop?.(); // 清空所有父级的lockDropID

        if (relationCtx.onLockChange && !lockDropID) {
          defer(() => {
            relationCtx.onLockDrop?.(); // 清空所有父级的lockDropID

            self.lockDropID = id;
            // 无已设置的lockDropID且父级传入了isLock, 将其标记为锁定
            relationCtx.onLockChange?.(true);
          });
        }
      } else if (lockDropID) {
        self.lockDropID = null;
        relationCtx.onLockChange?.(false);
      }

      const { dragOver: _, regular: __, ...willChecks } = nextStatus;

      // 是否有任意一个真实可用的位置被激活
      const hasOver = _enableDropInfo.all ? dragOver : allPropertyHasTrue(willChecks);

      // 松开时，还原状态、并在处于over状态时触发onSourceAccept
      if (!down && self.lastOverStatus) {
        if (!isCancel && hasOver) {
          const acceptE = getEventObj(dragE, nextStatus) as DragFullEvent;
          defer(() => {
            props.onSourceAccept?.(acceptE);
            ctx.onAccept(acceptE);
          });
        }

        // 重置状态
        self.lastOverStatus = false;
        resetCtxCurrents();
        setStatus(initStatus);
        return;
      }

      if (hasOver) {
        // 保存当前放置目标状态
        ctx.currentTarget = currentNode;
        ctx.currentOffsetX = x - left;
        ctx.currentOffsetY = y - top;
        ctx.currentStatus = status;

        if (!isCancel) {
          // 上一拖动事件已经是over事件时，触发move，否则触发enter
          if (self.lastOverStatus) {
            props.onSourceMove?.(getEventObj(dragE, nextStatus) as DragFullEvent);
          } else {
            props.onSourceEnter?.(getEventObj(dragE, nextStatus) as DragFullEvent);
          }
        }
      } else if (self.lastOverStatus) {
        // 非over且上一次是over状态，则初始化当前的放置目标
        resetCtxCurrents();

        if (!isCancel) {
          props.onSourceLeave?.(getEventObj(dragE, nextStatus));
        }
      }

      // 保存本次放置状态
      self.lastOverStatus = hasOver /* dragOver */;

      // 状态完全相等时不进行更新
      if (allPropertyIsEqual(status, nextStatus)) return;

      setStatus(nextStatus);
    },
    // 减少执行次数
    fn => _throttle(fn, 60, { trailing: true }),
  );

  /** 拖动目标拖动事件处理 */
  const dragHandle: Handler<'drag'> = useFn(dragE => {
    const {
      movement: [moveX, moveY],
      xy: [x, y],
      down,
      first,
      tap,
      memo,
      event,
      cancel,
    } = dragE;

    let isDrop = false;

    if (tap) return;

    if (first && isIgnoreEl(event, ignoreElFilter)) {
      cancel?.();
      return;
    }

    event?.preventDefault();

    // 开始
    if (first) {
      clearCloneNode();
      startHandle(dragE);
    }

    if (!down) {
      props.onDrop?.(getEventObj(dragE));

      if (ctx.currentTarget) {
        isDrop = true;
      }
    }

    const domRect = state.nodeEl.getBoundingClientRect();

    const isOverBetween = isBetween(domRect, x, y);

    self.lastIsOverBetween = true;

    /**
     * xy在元素范围外一定距离, 距离越远移动越快
     * 元素在窗口外时，最小值取0 最大值取窗口尺寸
     * */
    ctx.scrollerList.forEach(ele => {
      autoScrollByStatus(ele, getAutoScrollStatus(ele, x, y), down);
    });

    // 仅在不处于拖动元素顶部或松开时通知拖动，如果从非拖动元素区域移动到拖动元素区域也需要更新
    if (!isOverBetween || !down || self.lastIsOverBetween) {
      const childAndSelf = [...relationCtxValue.childrens, id];

      // 将拖动操作派发到其他同组DND组件
      ctx.listeners.forEach(cItem => {
        if (!childAndSelf.includes(cItem.id)) cItem.handler(dragE, isOverBetween);
      });
    }

    if (isOverBetween) {
      isDrop = false;
    }

    const moveE = getEventObj(dragE);

    // 派发move事件
    props.onMove?.(moveE);
    ctx.onMove(moveE);

    // 结束
    if (!down) {
      endHandle(isDrop);
      return;
    }

    // 更新拖动元素动画状态
    const dragFeedback = getDragFeedbackNode();

    if (dragFeedback) {
      // 第一次获取到dragFeedback, 添加初始化样式
      if (!memo) {
        initDragFeedbackNode(dragE);
      }

      dragFeedback.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    }

    // 标记用于判断dragFeedback是否是第一次获取
    return dragFeedback;
  });

  /** 开始拖动 */
  function startHandle(dragE: FullGestureState<'drag'>) {
    // 记录拖动目标
    ctx.currentSource = currentNode;

    const e = getEventObj(dragE);

    props.onDrag?.(e);

    ctx.onStart(e);

    // 移除克隆拖动元素清理计时器
    clearTimeout(self.clearCloneTimer);

    // 延迟一段时间执行，防止克隆节点获取到用户根据拖动状态更改过的节点
    defer(() => {
      setStatus({
        dragging: true,
        regular: false,
      });
    });
  }

  /** 结束拖动 */
  function endHandle(isDrop: boolean) {
    if (!self.ignore) {
      setStatus(initStatus);
    }

    if (self.dragFeedbackEl) {
      if (isDrop) {
        self.dragFeedbackEl.style.display = 'none';
      } else {
        const { left, top } = state.nodeEl.getBoundingClientRect();
        // 修正位置
        self.dragFeedbackEl.style.top = `${top}px`;
        self.dragFeedbackEl.style.left = `${left}px`;
        // 还原
        self.dragFeedbackEl.style.transition = `0.3s ease-in-out`;
        self.dragFeedbackEl.style.opacity = '0.3';
        self.dragFeedbackEl.style.transform = `translate3d(0, 0, 0)`;
      }
    }

    // 预估动画结束时间并进行清理
    self.clearCloneTimer = setTimeout(clearCloneNode, 300);
  }

  /** 返回当前的拖动反馈元素，自定义dragFeedback时，拖动开始到元素渲染完成期间可能会返回null，需要做空值处理 */
  function getDragFeedbackNode() {
    if (!props.dragFeedback && !self.dragFeedbackEl) {
      self.dragFeedbackEl = state.nodeEl.cloneNode(true) as HTMLElement;
      document.body.appendChild(self.dragFeedbackEl);
    }

    return self.dragFeedbackEl;
  }

  /** 初始化拖动反馈节点的样式/位置等 */
  function initDragFeedbackNode(dragE: FullGestureState<'drag'>) {
    // 克隆目标，实际拖动的是克隆元素
    const dragFeedback = getDragFeedbackNode();

    if (dragFeedback) {
      let { x, y } = state.nodeEl.getBoundingClientRect();
      const { width, height } = dragFeedback.getBoundingClientRect();

      if (props.dragFeedback) {
        x = dragE.xy[0] - width / 2;
        y = dragE.xy[1] - height / 2;
      }

      dragFeedback.className += ' m78-dnd_drag-node';

      // 可覆盖的基础样式
      dragFeedback.style.opacity = '0.4';
      dragFeedback.style.cursor = 'grabbing';

      if (isObject(dragFeedbackStyle)) {
        Object.entries(dragFeedbackStyle).forEach(([key, sty]) => {
          dragFeedback.style[key as any] = sty;
        });
      }

      // 不可覆盖的基础样式
      dragFeedback.style.transition = 'none'; // 放置添加过渡
      dragFeedback.style.left = `${x}px`;
      dragFeedback.style.top = `${y}px`;
      dragFeedback.style.width = `${state.nodeEl.offsetWidth}px`;
      dragFeedback.style.height = `${state.nodeEl.offsetHeight}px`;
    }
  }

  /** 存在克隆节点时将其清除 */
  function clearCloneNode() {
    if (!props.dragFeedback && self.dragFeedbackEl) {
      const parentNode = self.dragFeedbackEl.parentNode;
      parentNode && parentNode.removeChild(self.dragFeedbackEl);
      self.dragFeedbackEl = null;
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

  /** 根据配置获取对象形式的enableDrag, 传入isClean时会不传递ctx.currentXX来从enableDrop中获取初始化值 */
  function formatEnableDrag(isClean = false): EnableInfos {
    const enable = enableDrop;
    let posInfos: any = enable;

    if (isFunction(enable)) {
      posInfos = isClean
        ? enable(currentNode)
        : enable(currentNode, ctx.currentSource, ctx.currentTarget);
    }

    if (isBoolean(posInfos)) {
      return {
        ...(enable ? initEnableDragsPass : initEnableDragsDeny),
        enable: posInfos,
        all: posInfos,
      };
    }

    posInfos = {
      ...initEnableDragsDeny,
      ...posInfos,
    };

    posInfos.enable = allPropertyHasTrue(posInfos);
    posInfos.all = allPropertyAllTrue(posInfos);

    return posInfos;
  }

  /** 获取所有滚动父级 */
  function scrollParentsHandle() {
    if (!state.nodeEl) return;
    const sps = getScrollParent(state.nodeEl, true);
    if (!sps.length) return;

    // 保存第一个滚动父级，用于计算DND可见性
    self.firstScrollParent = sps[0];

    sps.forEach(sp => {
      const indOf = ctx.scrollerList.indexOf(sp);

      if (indOf === -1) {
        ctx.scrollerList.push(sp);
      }
    });
  }

  return {
    changeHandle,
    scrollParentsHandle,
    dragHandle,
    enableDropInfo,
  };
}

export type UseMethodsReturns = ReturnType<typeof useMethods>;
