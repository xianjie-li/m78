import {
  _Context,
  _PendingItem,
  DNDEnableInfos,
  DNDFullEvent,
  DNDPartialEvent,
} from "./types.js";
import { FullGestureState } from "@use-gesture/react";
import {
  checkElementVisible,
  getScrollParent,
  isDom,
  isFunction,
  isObject,
} from "@m78/utils";
import { useFn } from "@m78/hooks";
import throttle from "lodash/throttle.js";
import isEqual from "lodash/isEqual.js";
import {
  _defaultDNDEnableInfos,
  _defaultDNDStatus,
  _resetEvent,
  _updateEvent,
  _checkIfAcceptable,
  _filterInBoundDNDs,
  _getCurrentTriggerByMultipleTrigger,
  _getAutoScrollStatus,
  _autoScrollByStatus,
  _isIgnoreEl,
  _getObjectByNewValues,
  _groupMap,
} from "./common.js";
import clsx from "clsx";

export function _useMethods(ctx: _Context) {
  const { setState, props, self, dragNodeRef, node } = ctx;
  const { enableDrag } = props;

  /** 更新当前节点的位置等信息到context中 */
  const updateDNDMeta = useFn(() => {
    const el = ctx.dragNodeRef.current;
    if (!el) return;

    const { visible, bound } = checkElementVisible(el, {
      fullVisible: true,
    });

    if (!bound) return;

    const sps = getScrollParent(el, true);

    ctx.group.dndMap[ctx.id] = {
      node: ctx.node,
      visible: visible,
      left: bound.left!,
      right: bound.right!,
      bottom: bound.bottom!,
      top: bound.top!,
      props: ctx.props,
      ctx,
    };

    const scrollParents = ctx.group.scrollParents;

    sps.forEach((sp) => {
      const indOf = scrollParents.indexOf(sp);

      if (indOf === -1) {
        scrollParents.push(sp);
      }
    });
  });

  /** 节流版的updateDNDMeta, 防止高频触发 */
  const throttleUpdateDNDMeta = useFn(updateDNDMeta, (fn) =>
    throttle(fn, 60, { trailing: true })
  );

  /** 拖动处理, 大部分功能的核心实现都在此处 */
  const onDrag = useFn((ev: FullGestureState<"drag">) => {
    const {
      first,
      down,
      xy: [x, y],
      event: e,
      cancel,
      tap,
      memo: forceBreakEvent, // 调用cancel后依然会执行一次, 暂时不清楚是bug还是意料行为
    } = ev;

    if (tap) return;

    // 防止重叠节点一起触发
    e.stopPropagation();

    if (forceBreakEvent) return;

    if (first && _isIgnoreEl(e, props.ignore)) {
      cancel();
      return true;
    }

    const enable = isFunction(enableDrag) ? enableDrag(node) : !!enableDrag;

    if (!enable) {
      cancel();
      return true;
    }

    // 开始拖动时更新所有节点位置信息, 拖动中间歇更新(大部分情况节点位置不会改变, 这样可以节省性能)
    if (first) {
      _updateEvent.emit(false, ctx.props.group);
    } else if (down) {
      _updateEvent.emit(true, ctx.props.group);
    }

    // 拖动目标
    const source = ctx.node;

    // 过滤所有被光标命中的有效节点并在开始拖动时更新所有dnd的enable
    const inBoundList: _PendingItem[] = _filterInBoundDNDs(ctx, first, [x, y]);

    // 基础事件对象
    const event: DNDPartialEvent = {
      source,
      x,
      y,
    };

    // 开始拖动时设置当前拖动节点状态
    if (first) {
      setState({
        status: {
          ..._defaultDNDStatus,
          dragging: true,
          regular: false,
        },
        enables: {
          ...(_getObjectByNewValues(
            _defaultDNDEnableInfos,
            false
          ) as DNDEnableInfos),
        },
      });
    }

    /* # # # # # # # 反馈阶段处理 # # # # # # # */

    // 初始化反馈节点
    if (down) {
      if (!self.feedbackEl) {
        initFeedbackEl();
      }

      if (self.feedbackEl) {
        if (self.feedbackInitOffset) {
          // 已经有偏移信息, 说明已经初始化过
          const [offsetX, offsetY] = self.feedbackInitOffset;
          ctx.feedbackSpApi.set({
            x: x - offsetX,
            y: y - offsetY,
          });
        } else {
          // 因为存在定制feedback节点, 所以需要获取光标到节点的左上角的偏移量比例, 以便在自定义节点上使用同样的比例
          const nodeBound = ctx.dragNodeRef.current!.getBoundingClientRect();
          const feedbackBound = self.feedbackEl!.getBoundingClientRect();
          const offsetX = x - nodeBound.left;
          const offsetY = y - nodeBound.top;
          const ratioX = offsetX / nodeBound.width;
          const ratioY = offsetY / nodeBound.height;

          const oX = feedbackBound.width * ratioX;
          const oY = feedbackBound.height * ratioY;

          ctx.feedbackSpApi.set({
            x: x - oX,
            y: y - oY,
          });

          self.feedbackInitOffset = [oX, oY];
        }
      }
    } else {
      // reset
      self.feedbackInitOffset = undefined;
      if (self.feedbackEl) {
        self.feedbackEl.parentNode!.removeChild(self.feedbackEl);
        self.feedbackEl = undefined;
      }
    }

    /* # # # # # # # 自动滚动 # # # # # # # */
    // xy在元素范围边缘一定距离时, 距离靠近边缘移动越快
    ctx.group.scrollParents.forEach((ele) => {
      _autoScrollByStatus(ele as any, _getAutoScrollStatus(ele, x, y), down);
    });

    /* # # # # # # # 无放置点命中时的处理 # # # # # # # */
    if (!inBoundList.length) {
      if (first) {
        props.onDrag?.(event);
      } else if (down) {
        props.onMove?.(event);
        // 通知其他组件重置状态
        _resetEvent.emit([ctx.id], true);

        if (self.lastEntryDND) {
          self.lastEntryDND.props.onSourceLeave?.(event);
          self.lastEntryDND = undefined;
        }
      } else {
        props.onDrop?.(event);
        // 通知所有组件
        _resetEvent.emit();
        self.lastEntryDND = undefined;
      }
      return;
    }

    /* # # # # # # # 有放置点时的处理 # # # # # # # */
    // 从一组同时命中(如果有多个)的dnd中按照指定规则取出一个作为命中点
    const current: _PendingItem =
      _getCurrentTriggerByMultipleTrigger(inBoundList);

    const { dnd, enables, status } = current;

    self.lastEntryDND = dnd;

    const dndState = dnd.ctx.state;

    event.target = dnd.node;
    event.status = status;

    // drop相关事件触发
    if (!dndState.status.over) {
      // 之前未启用, 触发进入事件
      dnd.props.onSourceEnter?.(event as DNDFullEvent);
    } else if (down) {
      // 已启用且未松开, 触发移动事件
      dnd.props.onSourceMove?.(event as DNDFullEvent);
    } else {
      const isAccept = _checkIfAcceptable(enables, status);

      if (isAccept) {
        // 触发接收事件
        dnd.props.onSourceAccept?.(event as DNDFullEvent);
      }
    }

    // 有命中时的drag出发
    if (first) {
      props.onDrag?.(event);
    } else if (down) {
      props.onMove?.(event);
    } else {
      props.onDrop?.(event);
    }

    // 状态有变时进行更新
    if (
      !isEqual(dndState.enables, enables) ||
      !isEqual(dndState.status, status)
    ) {
      dnd.ctx.setState({
        enables,
        status,
      });
    }

    if (down) {
      // 通知重置
      _resetEvent.emit([ctx.id, dnd.ctx.id], true);
    } else {
      _resetEvent.emit([]);
      self.lastEntryDND = undefined;
    }
  });

  /** 开始拖动时使用, 初始化self.feedbackEl以便使用 */
  function initFeedbackEl() {
    updateFeedbackEl();

    if (!self.feedbackEl) return;

    self.feedbackEl.className = clsx(
      self.feedbackEl.className,
      "m78 m78-dnd_feedback"
    );

    if (isObject(props.feedbackStyle)) {
      Object.entries(props.feedbackStyle).forEach(([key, sty]) => {
        self.feedbackEl!.style[key as any] = sty;
      });
    }
  }

  /** 根据配置和环境获取self.feedback */
  function updateFeedbackEl() {
    if (self.feedbackEl) return;

    // 使用定制节点
    if (props.feedback) {
      const el = props.feedback();
      if (isDom(el)) {
        self.feedbackEl = el;
      }
    }

    if (!self.feedbackEl) {
      // 使用clone节点
      const node = dragNodeRef.current;

      if (node) {
        self.feedbackEl = node.cloneNode(true) as HTMLElement;
        self.feedbackEl.style.width = `${node.offsetWidth}px`;
        self.feedbackEl.style.height = `${node.offsetHeight}px`;
      }
    }

    document.body.appendChild(self.feedbackEl!);
  }

  return {
    onDrag,
    updateDNDMeta,
    throttleUpdateDNDMeta,
  };
}

export type _UseMethodReturns = ReturnType<typeof _useMethods>;
