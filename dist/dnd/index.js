import 'm78/dnd/style';
import _toConsumableArray from '@babel/runtime/helpers/toConsumableArray';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import React, { createContext, useMemo, useEffect, useState, useContext, useRef } from 'react';
import { dumpFn, hasScroll, isFunction, checkElementVisible, defer, isObject, isNumber, isBoolean, getScrollParent, createRandString } from '@lxjx/utils';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import { useFn, useSelf, useSetState } from '@lxjx/hooks';
import { throwError } from 'm78/util';
import { useDrag } from 'react-use-gesture';
import _remove from 'lodash/remove';
import { useDelayDerivedToggleStatus } from 'm78/hooks';
import Portal from 'm78/portal';
import _throttle from 'lodash/throttle';

var defaultContext = {
  listeners: [],
  scrollerList: [],
  onStart: dumpFn,
  onMove: dumpFn,
  onAccept: dumpFn
};
var context = /*#__PURE__*/createContext(defaultContext);
context.displayName = 'DNDContext';
var relationContext = /*#__PURE__*/createContext({
  childrens: []
});
relationContext.displayName = 'DNDRelationContext';

var DNDContext = function DNDContext(_ref) {
  var children = _ref.children,
      props = _objectWithoutProperties(_ref, ["children"]);

  var listeners = useMemo(function () {
    return [];
  }, []);
  var scrollerList = useMemo(function () {
    return [];
  }, []);
  var combineValue = useMemo(function () {
    return _objectSpread(_objectSpread({}, defaultContext), {}, {
      listeners: listeners,
      scrollerList: scrollerList
    }, props);
  }, []);
  useMemo(function () {
    // 保持combineValue引用不变
    Object.assign(combineValue, props);
  }, [props]); // 定时清理scrollerList中已被卸载或不可滚动的节点

  useEffect(function () {
    var t = setInterval(function () {
      var newList = scrollerList.filter(function (el) {
        if (!el) return false;
        var hsc = hasScroll(el);
        return !(!hsc.x && !hsc.y);
      });
      scrollerList.splice(0, scrollerList.length);
      scrollerList.push.apply(scrollerList, _toConsumableArray(newList));
    }, 8000);
    return function () {
      return clearInterval(t);
    };
  }, []);
  return /*#__PURE__*/React.createElement(context.Provider, {
    value: combineValue
  }, children);
};

/** 在此比例内的区域视为边缘 */
var edgeRatio = 0.24;
/** 禁止拖动的元素tagName */

var ignoreReg = /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO|VIDEO)$/;
/** 默认props */

var defaultProps = {
  enableDrag: true,
  enableDrop: true
};
/** 当独立配置了enableDrag的某一项时，其他方向的默认值 */

var initEnableDragsDeny = {
  left: false,
  right: false,
  bottom: false,
  top: false,
  center: false,
  regular: true
};
/** 初始状态 */

var initStatus = {
  dragOver: false,
  dragLeft: false,
  dragRight: false,
  dragBottom: false,
  dragTop: false,
  dragCenter: false,
  dragging: false,
  regular: true
};
/** 提到utils */

var raf = function raf(frameRequestCallback) {
  var _raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || // @ts-ignore
  window.mozRequestAnimationFrame || // @ts-ignore
  window.oRequestAnimationFrame || // @ts-ignore
  window.msRequestAnimationFrame || setTimeout;

  return _raf(frameRequestCallback);
};

function useLifeCycle(share, methods) {
  var elRef = share.elRef,
      handleRef = share.handleRef,
      state = share.state,
      setState = share.setState,
      ctx = share.ctx,
      id = share.id,
      props = share.props,
      currentNode = share.currentNode,
      relationCtx = share.relationCtx,
      relationCtxValue = share.relationCtxValue,
      self = share.self;
  var enableDrag = props.enableDrag;
  /* 标记组件卸载 */

  useEffect(function () {
    return function () {
      self.ignore = true;
    };
  }, []);
  /* 整理挂载节点、拖动把手节点并设置到state中 */

  useEffect(function () {
    if (!elRef.current) {
      throwError("cannot get drag node, did you forget to pass innerRef? by ".concat(id), 'DND');
    }

    setState({
      nodeEl: elRef.current,
      handleEl: handleRef.current || elRef.current
    }); // methods.setHandlePointer();
  }, [elRef.current, elRef.current]);
  /* 将当前实例的监听器推入列表, 并在卸载时移除 */

  useEffect(function () {
    ctx.listeners.push({
      id: id,
      handler: methods.changeHandle
    });
    return function () {
      _remove(ctx.listeners, function (item) {
        return item.id === id;
      });
    };
  }, []);
  /* 同步relationCtxValue.childrens */

  useEffect(function () {
    var _relationCtx$children;

    // 没有DND父级
    if (!relationCtx.childrens) return; // 将本实例和所有子实例推入父实例childrens中

    var child = [id];

    if (relationCtxValue.childrens.length) {
      child.push.apply(child, _toConsumableArray(relationCtxValue.childrens));
    }

    (_relationCtx$children = relationCtx.childrens).push.apply(_relationCtx$children, child);

    return function () {
      _remove(relationCtx.childrens, function (_id) {
        return child.includes(_id);
      });
    };
  }, []);
  /* 检测滚动父级并同步到检测列表中 */

  useEffect(methods.scrollParentsHandle, [state.nodeEl]);
  /* 绑定拖拽事件 */

  var bind = useDrag(methods.dragHandle, {
    domTarget: state.handleEl,
    filterTaps: true,
    eventOptions: {
      passive: false
    },
    enabled: isFunction(enableDrag) ? enableDrag(currentNode) : enableDrag
  });
  /* 激活事件 */

  useEffect(function () {
    bind();
  }, [bind, state.handleEl]);
}

function useRenders(share) {
  var props = share.props,
      status = share.status,
      self = share.self;
  var dragFeedback = props.dragFeedback;
  /** 自定义dragFeedBack时，延迟到动画结束再将其卸载 */

  var dragging = useDelayDerivedToggleStatus(status.dragging, 300, {
    leading: false,
    trailing: true,
    disabled: !dragFeedback
  });
  /** 渲染用户自定义的dragFeedBack */

  function renderDragFeedback() {
    if (dragging && /*#__PURE__*/React.isValidElement(dragFeedback)) {
      return /*#__PURE__*/React.createElement(Portal, {
        namespace: "DND"
      }, /*#__PURE__*/React.cloneElement(dragFeedback, {
        ref: function ref(node) {
          return self.dragFeedbackEl = node;
        }
      }));
    }

    return null;
  }

  return {
    renderDragFeedback: renderDragFeedback
  };
}

/** 自动滚动加速度，此值越小, 超出时自动滚动的速度越快 */

var AutoScrollDiffSpeed = 20;
/** 在距离边缘此偏移时即开始滚动 */

var AutoScrollOffset = 16;
/** 在多个滚动帮助函数间共享 */

/** 计算元光标和指定元素的覆盖状态 */
function getOverStatus(el, x, y, firstScrollParent) {
  var bound = el.getBoundingClientRect();
  var left = bound.left,
      top = bound.top,
      right = bound.right,
      bottom = bound.bottom; // 尺寸

  var width = right - left;
  var height = bottom - top; // 触发边缘放置的偏移距离

  var triggerXOffset = width * edgeRatio;
  var triggerYOffset = height * edgeRatio; // 元素是否可见，不可见时视为未覆盖

  var visible = true; // 检测元素可见性

  if (firstScrollParent) {
    var vs = checkElementVisible(el, {
      fullVisible: true,
      wrapEl: firstScrollParent
    });
    visible = vs.visible;
  } // 各方向上的拖动状态E


  var dragOver = visible && isBetween(bound, x, y);
  var dragTop = dragOver && y < top + triggerYOffset;
  var dragBottom = dragOver && !dragTop && y > bottom - triggerYOffset;
  var nextShouldPass = dragOver && !dragTop && !dragBottom;
  var dragRight = nextShouldPass && x > right - triggerXOffset;
  var dragLeft = nextShouldPass && x < left + triggerXOffset;
  var dragCenter = nextShouldPass && !dragRight && !dragLeft;
  return {
    dragOver: dragOver,
    dragTop: dragTop,
    dragBottom: dragBottom,
    dragLeft: dragLeft,
    dragRight: dragRight,
    dragCenter: dragCenter,
    left: left,
    top: top
  };
}
/** 判断x, y 是否在指定的DOMRect区间中 */

function isBetween(_ref, x, y) {
  var left = _ref.left,
      top = _ref.top,
      right = _ref.right,
      bottom = _ref.bottom;
  return x > left && x < right && y > top && y < bottom;
}
/**
 * 计算光标在某个元素四个方向的超出值
 * 不包含滚动条的方向返回值始终为0
 * 元素不包含滚动条时无返回
 * 同时只会有一个方向有值
 * */

function getAutoScrollStatus(el, x, y) {
  var si = hasScroll(el);
  if (!si.x && !si.y) return;

  var _el$getBoundingClient = el.getBoundingClientRect(),
      left = _el$getBoundingClient.left,
      top = _el$getBoundingClient.top,
      right = _el$getBoundingClient.right,
      bottom = _el$getBoundingClient.bottom;
  /** 只在drag时触发，所以这里可以安全调用window而不用担心ssr的问题 */
  // 取最小、最大触发位置


  left = Math.max(left, 0);
  top = Math.max(top, 0);
  right = Math.min(right, window.innerWidth);
  bottom = Math.min(bottom, window.innerHeight); // 计算偏移

  left += AutoScrollOffset;
  top += AutoScrollOffset;
  right -= AutoScrollOffset;
  bottom -= AutoScrollOffset;
  var t = 0;
  var r = 0;
  var b = 0;
  var l = 0; // 在y轴范围内

  if (x > left && x < right) {
    if (y < top) {
      t = top - y;
    }

    if (y > bottom) {
      b = y - bottom;
    }
  } // 在x轴范围内


  if (y > top && y < bottom) {
    if (x < left) {
      l = left - x;
    }

    if (x > right) {
      r = x - right;
    }
  }

  return {
    top: si.y ? t : 0,
    bottom: si.y ? b : 0,
    left: si.x ? l : 0,
    right: si.x ? r : 0
  };
}
/**
 * 根据getAutoScrollStatus的返回值滚动元素
 * */

function autoScrollByStatus(el, status, down) {
  // 滚动元素本身是一个非常理想的存储局部滚动状态的对象
  if (!el.ctx) {
    el.ctx = {};
  }

  el.ctx.autoScrollDown = down;
  if (!el || !status) return; // 基础滚动距离

  el.ctx.autoScrollVal = 1;

  if (status.bottom) {
    el.ctx.autoScrollPosKey = 'scrollTop';
    el.ctx.autoScrollType = 1;
    el.ctx.autoScrollVal += status.bottom / AutoScrollDiffSpeed;
  }

  if (status.left) {
    el.ctx.autoScrollPosKey = 'scrollLeft';
    el.ctx.autoScrollType = 2;
    el.ctx.autoScrollVal += status.left / AutoScrollDiffSpeed;
  }

  if (status.top) {
    el.ctx.autoScrollPosKey = 'scrollTop';
    el.ctx.autoScrollType = 2;
    el.ctx.autoScrollVal += status.top / AutoScrollDiffSpeed;
  }

  if (status.right) {
    el.ctx.autoScrollPosKey = 'scrollLeft';
    el.ctx.autoScrollType = 1;
    el.ctx.autoScrollVal += status.right / AutoScrollDiffSpeed;
  } // 根据状态开关滚动动画


  if (!(status.bottom || status.top || status.left || status.right)) {
    el.ctx.autoScrollToggle = false;
  } else {
    if (!el.ctx.autoScrollToggle) {
      autoScroll(el);
    }

    el.ctx.autoScrollToggle = true;
  }
}
/** 根据当前的AutoScrollCtx来自动滚动目标元素 */

function autoScroll(el) {
  raf(function () {
    if (el.ctx.autoScrollType === 1) {
      el[el.ctx.autoScrollPosKey] += el.ctx.autoScrollVal; // 处理浏览器兼容

      if (el === document.documentElement) {
        document.body[el.ctx.autoScrollPosKey] += el.ctx.autoScrollVal;
      }
    } else {
      el[el.ctx.autoScrollPosKey] -= el.ctx.autoScrollVal; // 处理浏览器兼容

      if (el === document.documentElement) {
        document.body[el.ctx.autoScrollPosKey] -= el.ctx.autoScrollVal;
      }
    }

    if (!el.ctx.autoScrollDown || !el.ctx.autoScrollToggle) return;
    autoScroll(el);
  });
}
/** 对象是否包含属性值都为true的项 */

function allPropertyHasTrue(obj) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return Object.entries(obj).some(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        _ = _ref3[0],
        _enable = _ref3[1];

    return _enable;
  });
}
/** 左侧对象的所有值是否都与右侧对象相等 */

function allPropertyIsEqual(obj, obj2) {
  return Object.entries(obj).every(function (_ref4) {
    var _ref5 = _slicedToArray(_ref4, 2),
        key = _ref5[0],
        val = _ref5[1];

    return val === obj2[key];
  });
}
/**  根据事件元素类型决定是否禁止拖动 */

function isIgnoreEl(event, ignoreElFilter) {
  var el = event === null || event === void 0 ? void 0 : event.target;
  if (!el) return false;
  var tagName = el.tagName || '';
  if (ignoreReg.test(tagName)) return true;
  var editable = el.getAttribute && el.getAttribute('contenteditable');
  if (editable) return true;

  if (ignoreElFilter) {
    return ignoreElFilter(el);
  }

  return false;
}

function useMethods(share) {
  var state = share.state,
      status = share.status,
      setStatus = share.setStatus,
      self = share.self,
      id = share.id,
      ctx = share.ctx,
      props = share.props,
      currentNode = share.currentNode,
      relationCtx = share.relationCtx,
      relationCtxValue = share.relationCtxValue;
  var enableDrop = props.enableDrop,
      dragFeedbackStyle = props.dragFeedbackStyle,
      ignoreElFilter = props.ignoreElFilter; // 对于非函数的enable配置，加载时获取一次初始值, 后面可以直接都是用本次获取

  var _useState = useState(formatEnableDrag),
      _useState2 = _slicedToArray(_useState, 2),
      enableDropInfo = _useState2[0],
      setEnableDropInfo = _useState2[1]; // 变更且启用配置非函数时时重新获取


  useEffect(function () {
    if (!isFunction(enableDrop)) {
      setEnableDropInfo(formatEnableDrag());
    }
  }, [enableDrop]); // 放置目标响应拖动目标的拖动事件

  var changeHandle = useFn(function (dragE, isCancel) {
    var lockDropID = self.lockDropID;

    var _dragE$xy = _slicedToArray(dragE.xy, 2),
        x = _dragE$xy[0],
        y = _dragE$xy[1],
        down = dragE.down;

    var enableDropIsFn = isFunction(enableDrop); // 如果enableDrop为函数，则需要在每次执行时判断

    var _enableDropInfo = isFunction(enableDrop) ? formatEnableDrag() : enableDropInfo; // 如果前后两次的启用状态不同，则更新


    if (enableDropIsFn) {
      if (down) {
        // 如果禁用状态与当前保存的不一致则同步
        if (!allPropertyIsEqual(enableDropInfo, _enableDropInfo)) {
          setEnableDropInfo(_enableDropInfo);
        } // 松开且不可用时，还原配置

      } else if (!_enableDropInfo.enable) {
        setEnableDropInfo(formatEnableDrag(true));
      }
    }

    if (self.lockDrop) return;
    if (!state.nodeEl) return;
    if (!_enableDropInfo.enable) return;

    var _getOverStatus = getOverStatus(state.nodeEl, x, y, self.firstScrollParent),
        dragOver = _getOverStatus.dragOver,
        left = _getOverStatus.left,
        top = _getOverStatus.top,
        otherS = _objectWithoutProperties(_getOverStatus, ["dragOver", "left", "top"]);

    var nextStatus = {
      dragOver: dragOver && _enableDropInfo.all && !isCancel,
      dragTop: _enableDropInfo.top && otherS.dragTop,
      dragBottom: _enableDropInfo.bottom && otherS.dragBottom,
      dragLeft: _enableDropInfo.left && otherS.dragLeft,
      dragRight: _enableDropInfo.right && otherS.dragRight,
      dragCenter: _enableDropInfo.center && otherS.dragCenter,
      dragging: status.dragging,
      regular: true
    };

    if (nextStatus.dragOver || nextStatus.dragTop || nextStatus.dragBottom || nextStatus.dragLeft || nextStatus.dragRight || nextStatus.dragCenter || nextStatus.dragging) {
      nextStatus.regular = false;
    } // 处理父子级关联锁定


    if (dragOver) {
      var _relationCtx$onLockDr;

      (_relationCtx$onLockDr = relationCtx.onLockDrop) === null || _relationCtx$onLockDr === void 0 ? void 0 : _relationCtx$onLockDr.call(relationCtx); // 清空所有父级的lockDropID

      if (relationCtx.onLockChange && !lockDropID) {
        defer(function () {
          var _relationCtx$onLockDr2, _relationCtx$onLockCh;

          (_relationCtx$onLockDr2 = relationCtx.onLockDrop) === null || _relationCtx$onLockDr2 === void 0 ? void 0 : _relationCtx$onLockDr2.call(relationCtx); // 清空所有父级的lockDropID

          self.lockDropID = id; // 无已设置的lockDropID且父级传入了isLock, 将其标记为锁定

          (_relationCtx$onLockCh = relationCtx.onLockChange) === null || _relationCtx$onLockCh === void 0 ? void 0 : _relationCtx$onLockCh.call(relationCtx, true);
        });
      }
    } else if (lockDropID) {
      var _relationCtx$onLockCh2;

      self.lockDropID = null;
      (_relationCtx$onLockCh2 = relationCtx.onLockChange) === null || _relationCtx$onLockCh2 === void 0 ? void 0 : _relationCtx$onLockCh2.call(relationCtx, false);
    }

    var willChecks = _objectWithoutProperties(nextStatus, ["dragOver", "regular"]); // 是否有任意一个真实可用的位置被激活


    var hasOver = _enableDropInfo.all ? dragOver : allPropertyHasTrue(willChecks); // 松开时，还原状态、并在处于over状态时触发onSourceAccept

    if (!down && self.lastOverStatus) {
      if (!isCancel && hasOver) {
        var acceptE = getEventObj(dragE, nextStatus);
        defer(function () {
          var _props$onSourceAccept;

          (_props$onSourceAccept = props.onSourceAccept) === null || _props$onSourceAccept === void 0 ? void 0 : _props$onSourceAccept.call(props, acceptE);
          ctx.onAccept(acceptE);
        });
      } // 重置状态


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
          var _props$onSourceMove;

          (_props$onSourceMove = props.onSourceMove) === null || _props$onSourceMove === void 0 ? void 0 : _props$onSourceMove.call(props, getEventObj(dragE, nextStatus));
        } else {
          var _props$onSourceEnter;

          (_props$onSourceEnter = props.onSourceEnter) === null || _props$onSourceEnter === void 0 ? void 0 : _props$onSourceEnter.call(props, getEventObj(dragE, nextStatus));
        }
      }
    } else if (self.lastOverStatus) {
      // 非over且上一次是over状态，则初始化当前的放置目标
      resetCtxCurrents();

      if (!isCancel) {
        var _props$onSourceLeave;

        (_props$onSourceLeave = props.onSourceLeave) === null || _props$onSourceLeave === void 0 ? void 0 : _props$onSourceLeave.call(props, getEventObj(dragE, nextStatus));
      }
    } // 保存本次放置状态


    self.lastOverStatus = hasOver
    /* dragOver */
    ; // 状态完全相等时不进行更新

    if (allPropertyIsEqual(status, nextStatus)) return;
    setStatus(nextStatus);
  }, // 减少执行次数
  function (fn) {
    return _throttle(fn, 60, {
      trailing: true
    });
  });
  /** 拖动目标拖动事件处理 */

  var dragHandle = useFn(function (dragE) {
    var _props$onMove;

    var _dragE$movement = _slicedToArray(dragE.movement, 2),
        moveX = _dragE$movement[0],
        moveY = _dragE$movement[1],
        _dragE$xy2 = _slicedToArray(dragE.xy, 2),
        x = _dragE$xy2[0],
        y = _dragE$xy2[1],
        down = dragE.down,
        first = dragE.first,
        tap = dragE.tap,
        memo = dragE.memo,
        event = dragE.event,
        cancel = dragE.cancel;

    var isDrop = false;
    if (tap) return;

    if (isIgnoreEl(event, ignoreElFilter)) {
      cancel === null || cancel === void 0 ? void 0 : cancel();
      return;
    }

    event === null || event === void 0 ? void 0 : event.preventDefault(); // 开始

    if (first) {
      clearCloneNode();
      startHandle(dragE);
    }

    if (!down) {
      var _props$onDrop;

      (_props$onDrop = props.onDrop) === null || _props$onDrop === void 0 ? void 0 : _props$onDrop.call(props, getEventObj(dragE));

      if (ctx.currentTarget) {
        isDrop = true;
      }
    }

    var domRect = state.nodeEl.getBoundingClientRect();
    var isOverBetween = isBetween(domRect, x, y);
    self.lastIsOverBetween = true;
    /**
     * xy在元素范围外一定距离, 距离越远移动越快
     * 元素在窗口外时，最小值取0 最大值取窗口尺寸
     * */

    ctx.scrollerList.forEach(function (ele) {
      autoScrollByStatus(ele, getAutoScrollStatus(ele, x, y), down);
    }); // 仅在不处于拖动元素顶部或松开时通知拖动，如果从非拖动元素区域移动到拖动元素区域也需要更新

    if (!isOverBetween || !down || self.lastIsOverBetween) {
      var childAndSelf = [].concat(_toConsumableArray(relationCtxValue.childrens), [id]); // 将拖动操作派发到其他同组DND组件

      ctx.listeners.forEach(function (cItem) {
        if (!childAndSelf.includes(cItem.id)) cItem.handler(dragE, isOverBetween);
      });
    }

    if (isOverBetween) {
      isDrop = false;
    }

    var moveE = getEventObj(dragE); // 派发move事件

    (_props$onMove = props.onMove) === null || _props$onMove === void 0 ? void 0 : _props$onMove.call(props, moveE);
    ctx.onMove(moveE); // 结束

    if (!down) {
      endHandle(isDrop);
      return;
    } // 更新拖动元素动画状态


    var dragFeedback = getDragFeedbackNode();

    if (dragFeedback) {
      // 第一次获取到dragFeedback, 添加初始化样式
      if (!memo) {
        initDragFeedbackNode(dragE);
      }

      dragFeedback.style.transform = "translate3d(".concat(moveX, "px, ").concat(moveY, "px, 0)");
    } // 标记用于判断dragFeedback是否是第一次获取


    return dragFeedback;
  });
  /** 开始拖动 */

  function startHandle(dragE) {
    var _props$onDrag;

    // 记录拖动目标
    ctx.currentSource = currentNode;
    var e = getEventObj(dragE);
    (_props$onDrag = props.onDrag) === null || _props$onDrag === void 0 ? void 0 : _props$onDrag.call(props, e);
    ctx.onStart(e); // 移除克隆拖动元素清理计时器

    clearTimeout(self.clearCloneTimer); // 延迟一段时间执行，防止克隆节点获取到用户根据拖动状态更改过的节点

    defer(function () {
      setStatus({
        dragging: true,
        regular: false
      });
    });
  }
  /** 结束拖动 */


  function endHandle(isDrop) {
    if (!self.ignore) {
      setStatus(initStatus);
    }

    if (self.dragFeedbackEl) {
      if (isDrop) {
        self.dragFeedbackEl.style.display = 'none';
      } else {
        var _state$nodeEl$getBoun = state.nodeEl.getBoundingClientRect(),
            left = _state$nodeEl$getBoun.left,
            top = _state$nodeEl$getBoun.top; // 修正位置


        self.dragFeedbackEl.style.top = "".concat(top, "px");
        self.dragFeedbackEl.style.left = "".concat(left, "px"); // 还原

        self.dragFeedbackEl.style.transition = "0.3s ease-in-out";
        self.dragFeedbackEl.style.opacity = '0.3';
        self.dragFeedbackEl.style.transform = "translate3d(0, 0, 0)";
      }
    } // 预估动画结束时间并进行清理


    self.clearCloneTimer = setTimeout(clearCloneNode, 300);
  }
  /** 返回当前的拖动反馈元素，自定义dragFeedback时，拖动开始到元素渲染完成期间可能会返回null，需要做空值处理 */


  function getDragFeedbackNode() {
    if (!props.dragFeedback && !self.dragFeedbackEl) {
      self.dragFeedbackEl = state.nodeEl.cloneNode(true);
      document.body.appendChild(self.dragFeedbackEl);
    }

    return self.dragFeedbackEl;
  }
  /** 初始化拖动反馈节点的样式/位置等 */


  function initDragFeedbackNode(dragE) {
    // 克隆目标，实际拖动的是克隆元素
    var dragFeedback = getDragFeedbackNode();

    if (dragFeedback) {
      var _state$nodeEl$getBoun2 = state.nodeEl.getBoundingClientRect(),
          x = _state$nodeEl$getBoun2.x,
          y = _state$nodeEl$getBoun2.y;

      var _dragFeedback$getBoun = dragFeedback.getBoundingClientRect(),
          width = _dragFeedback$getBoun.width,
          height = _dragFeedback$getBoun.height;

      if (props.dragFeedback) {
        x = dragE.xy[0] - width / 2;
        y = dragE.xy[1] - height / 2;
      }

      dragFeedback.className += ' m78-dnd_drag-node'; // 可覆盖的基础样式

      dragFeedback.style.opacity = '0.4';
      dragFeedback.style.cursor = 'grabbing';

      if (isObject(dragFeedbackStyle)) {
        Object.entries(dragFeedbackStyle).forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              key = _ref2[0],
              sty = _ref2[1];

          dragFeedback.style[key] = sty;
        });
      } // 不可覆盖的基础样式


      dragFeedback.style.transition = 'none'; // 放置添加过渡

      dragFeedback.style.left = "".concat(x, "px");
      dragFeedback.style.top = "".concat(y, "px");
      dragFeedback.style.width = "".concat(state.nodeEl.offsetWidth, "px");
      dragFeedback.style.height = "".concat(state.nodeEl.offsetHeight, "px");
    }
  }
  /** 存在克隆节点时将其清除 */


  function clearCloneNode() {
    if (!props.dragFeedback && self.dragFeedbackEl) {
      var parentNode = self.dragFeedbackEl.parentNode;
      parentNode && parentNode.removeChild(self.dragFeedbackEl);
      self.dragFeedbackEl = null;
    }
  }
  /**
   * 根据当前状态获取事件对象
   * @param dragE - 当前的拖动事件对象
   * @param nextStatus - 声明当前最新的status，如果未传入，会尝试取全局的status状态
   * */


  function getEventObj(dragE, nextStatus) {
    var _dragE$xy3 = _slicedToArray(dragE.xy, 2),
        x = _dragE$xy3[0],
        y = _dragE$xy3[1];

    var currentTarget = ctx.currentTarget,
        currentOffsetX = ctx.currentOffsetX,
        currentOffsetY = ctx.currentOffsetY,
        currentStatus = ctx.currentStatus;
    var e = {
      x: x,
      y: y,
      source: ctx.currentSource
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


  function formatEnableDrag() {
    var isClean = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var enable = enableDrop;
    var posInfos = enable;

    if (isFunction(enable)) {
      posInfos = isClean ? enable(currentNode) : enable(currentNode, ctx.currentSource, ctx.currentTarget);
    }

    if (isBoolean(posInfos)) {
      return _objectSpread(_objectSpread({}, initEnableDragsDeny), {}, {
        enable: posInfos,
        all: posInfos
      });
    } // 设置了all时，其他方向都不进行标记


    if (posInfos.all) {
      posInfos = _objectSpread(_objectSpread(_objectSpread({}, posInfos), initEnableDragsDeny), {}, {
        all: true
      });
    } else {
      posInfos = _objectSpread(_objectSpread(_objectSpread({}, initEnableDragsDeny), posInfos), {}, {
        all: false
      });
    }

    return _objectSpread(_objectSpread({}, posInfos), {}, {
      enable: allPropertyHasTrue(posInfos)
    });
  }
  /** 获取所有滚动父级 */


  function scrollParentsHandle() {
    if (!state.nodeEl) return;
    var sps = getScrollParent(state.nodeEl, true);
    if (!sps.length) return; // 保存第一个滚动父级，用于计算DND可见性

    self.firstScrollParent = sps[0];
    sps.forEach(function (sp) {
      var indOf = ctx.scrollerList.indexOf(sp);

      if (indOf === -1) {
        ctx.scrollerList.push(sp);
      }
    });
  }

  return {
    changeHandle: changeHandle,
    scrollParentsHandle: scrollParentsHandle,
    dragHandle: dragHandle,
    enableDropInfo: enableDropInfo
  };
}

var RelationProvider = relationContext.Provider;

function DND(props) {
  var children = props.children,
      pId = props.id;
  /** 该实例的唯一id */

  var id = useMemo(function () {
    return pId || createRandString(2);
  }, [pId]);
  /** 当前所处的DNDContext */

  var ctx = useContext(context);
  /** 控制关系节点锁定的context */

  var relationCtx = useContext(relationContext);
  /** 挂载元素 */

  var elRef = useRef(null);
  /** 拖动把手元素 */

  var handleRef = useRef(null);
  var self = useSelf({
    dragFeedbackEl: null,
    clearCloneTimer: null,
    lastOverStatus: false,
    ignore: false
  });

  var _useSetState = useSetState({
    nodeEl: null,
    handleEl: null
  }),
      _useSetState2 = _slicedToArray(_useSetState, 2),
      state = _useSetState2[0],
      setState = _useSetState2[1];
  /** 拖动状态 */


  var _useSetState3 = useSetState(function () {
    return _objectSpread({}, initStatus);
  }),
      _useSetState4 = _slicedToArray(_useSetState3, 2),
      status = _useSetState4[0],
      setStatus = _useSetState4[1];
  /** 用于嵌套DND时，子级主动锁定父级 */


  var relationCtxValue = useMemo(function () {
    return {
      onLockDrop: function onLockDrop() {
        var _relationCtx$onLockDr;

        self.lockDropID = null;
        (_relationCtx$onLockDr = relationCtx.onLockDrop) === null || _relationCtx$onLockDr === void 0 ? void 0 : _relationCtx$onLockDr.call(relationCtx); // 通知上层节点
      },
      onLockChange: function onLockChange(lock) {
        var _relationCtx$onLockCh;

        !self.lockDrop && setStatus(initStatus); // 每次触发锁定时重置位置状态

        self.lockDrop = lock;
        (_relationCtx$onLockCh = relationCtx.onLockChange) === null || _relationCtx$onLockCh === void 0 ? void 0 : _relationCtx$onLockCh.call(relationCtx, lock); // 通知上层节点
      },
      childrens: []
    };
  }, []);
  /** 共享状态 */

  var share = {
    elRef: elRef,
    handleRef: handleRef,
    status: status,
    setStatus: setStatus,
    props: props,
    self: self,
    state: state,
    setState: setState,
    id: id,
    ctx: ctx,
    relationCtx: relationCtx,
    relationCtxValue: relationCtxValue,
    currentNode: {
      id: id,
      data: props.data
    }
  };
  /* 内部方法、事件处理器 */

  var methods = useMethods(share);
  /* 生命周期 */

  useLifeCycle(share, methods);
  /* 渲染函数 */

  var _useRenders = useRenders(share),
      renderDragFeedback = _useRenders.renderDragFeedback;

  return /*#__PURE__*/React.createElement(RelationProvider, {
    value: relationCtxValue
  }, renderDragFeedback(), children({
    innerRef: elRef,
    handleRef: handleRef,
    status: status,
    enables: methods.enableDropInfo
  }));
}

DND.defaultProps = defaultProps;

export default DND;
export { DNDContext };
