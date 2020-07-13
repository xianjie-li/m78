import '@lxjx/fr/esm/popper/style';
import _extends from '@babel/runtime/helpers/extends';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import Portal from '@lxjx/fr/esm/portal';
import React, { useRef, useMemo, useEffect, useImperativeHandle } from 'react';
import { useFn, useFormState, useSelf, useSetState } from '@lxjx/hooks';
import { useSpring, animated, interpolate } from 'react-spring';
import cls from 'classnames';
import { useMeasure, useClickAway, useUpdateEffect } from 'react-use';
import _throttle from 'lodash/throttle';
import { isDom, createRandString, isNumber } from '@lxjx/utils';
import { getFirstScrollParent } from '@lxjx/fr/esm//util';
import { WarningIcon } from '@lxjx/fr/esm/icon';
import Button from '@lxjx/fr/esm/button';

/** 传入dom时原样返回，传入包含dom对象的ref时返回current，否则返回undefined */
function getRefDomOrDom(target) {
  if (!target) return undefined;
  if (isDom(target)) return target;
  if (isDom(target.current)) return target.current;
  return undefined;
}
/** 检测是否为合法的GetPopperMetasBound */

function isPopperMetasBound(arg) {
  if (arg && 'left' in arg && 'top' in arg && 'width' in arg && 'height' in arg) {
    return arg;
  }
}
/** 根据PopperTriggerType获取启用的事件类型 */

function getTriggerType(type) {
  var types = [];

  if (typeof type === 'string') {
    types = [type];
  } else {
    types = type;
  }

  return {
    hover: types.includes('hover'),
    click: types.includes('click'),
    focus: types.includes('focus')
  };
}

/** 用来描述尺寸信息 */

/** 关联的方向，用于帮助猜测下一个Direction的合理位置 */
var relateDirectionMap = {
  topStart: ['top', 'topEnd', 'bottomStart'],
  top: ['topStart', 'topEnd'],
  topEnd: ['top', 'topStart', 'bottomEnd'],
  leftStart: ['left', 'leftEnd', 'bottom'],
  left: ['leftStart', 'left', 'leftEnd', 'bottom'],
  leftEnd: ['left', 'leftStart', 'top'],
  bottomStart: ['bottom', 'bottomEnd', 'topStart'],
  bottom: ['bottomStart', 'bottomEnd'],
  bottomEnd: ['bottom', 'bottomStart', 'topEnd'],
  rightStart: ['right', 'rightEnd', 'bottom'],
  right: ['rightStart', 'rightEnd', 'bottom'],
  rightEnd: ['right', 'rightStart', 'top']
};
var defaultOptions = {
  offset: 0,
  direction: 'top'
};
/**
 * 根据目标元素和气泡元素的尺寸等获取气泡在目标各位置上的位置和可用信息、是否可见、以及推测当前合适的位置
 * @param source - 气泡元素的dom节点或虚拟尺寸信息
 * @param target - 目标元素的dom节点或虚拟位置信息
 * @param options - 一些额外配置
 * @returns - popper在各个方向上的位置信息和可用情况
 * */

function getPopperMetas(source, target, options) {
  var _defaultOptions$optio = _objectSpread(_objectSpread({}, defaultOptions), options),
      wrap = _defaultOptions$optio.wrap,
      offset = _defaultOptions$optio.offset,
      direction = _defaultOptions$optio.direction,
      prevDirection = _defaultOptions$optio.prevDirection;

  var wH = window.innerHeight;
  var wW = window.innerWidth;
  /** 取值, dom > GetPopperMetasBound > 默认(窗口) */

  var wrapB = isDom(wrap) ? wrap.getBoundingClientRect() : wrap || {
    top: 0,
    left: 0,
    width: wW,
    height: wH
  };
  var sourceB = isDom(source) ? source.getBoundingClientRect() : source;
  var targetB = isDom(target) ? target.getBoundingClientRect() : target;
  /* ########## 基础依赖值 ######### */

  /** 目标元素 + 气泡元素的总尺寸 */

  var allHeight = targetB.height + sourceB.height;
  var allWidth = targetB.width + sourceB.width;
  /** 包裹元素距离窗口底部的距离 */

  var WrapOffsetToBottom = wH - wrapB.top - wrapB.height;
  /** 包裹元素距离窗口右边的距离 */

  var WrapOffsetToRight = wW - wrapB.left - wrapB.width;
  /** 气泡元素尺寸减去目标元素尺寸 */

  var targetOverWidth = sourceB.width - targetB.width;
  var targetOverHeight = sourceB.height - targetB.height;
  /** 气泡元素尺寸减去目标元素尺寸的一半 */

  var targetOverWidthHalf = targetOverWidth / 2;
  var targetOverHeightHalf = targetOverHeight / 2;
  /* ######### 联动判断处理 ########## */

  /** 上下基础启用规则 */

  var TBEnableBaseLeft = targetB.left - wrapB.left;
  var TBEnableBaseRight = targetB.left + WrapOffsetToRight + targetB.width;
  /** 启用top、bottom的额外条件 */

  var enableTB =
  /*  */
  TBEnableBaseLeft - targetOverWidthHalf > 0 &&
  /*  */
  TBEnableBaseRight + targetOverWidthHalf < wW;
  /** 启用topStart、bottomStart的额外条件 */

  var enableTEBE =
  /*  */
  TBEnableBaseLeft - targetOverWidth - offset > 0 &&
  /*  */
  TBEnableBaseRight - offset < wW;
  /** 启用topStart、bottomStart的额外条件 */

  var enableTSBS =
  /*  */
  TBEnableBaseLeft + offset > 0 &&
  /*  */
  TBEnableBaseRight + targetOverWidth + offset < wW;
  /** 左右基础启用规则 */

  var LREnableBaseTop = targetB.top - wrapB.top;
  var LREnableBaseBottom = targetB.top + WrapOffsetToBottom + targetB.height;
  /** 启用left、right的额外条件 */

  var enableLR =
  /* 目标顶边距 - 包裹顶边距 > 0 */
  LREnableBaseTop - targetOverHeightHalf > 0 &&
  /* 目标定边距 + 包裹低边距 + 目标高度 < 窗口高 */
  LREnableBaseBottom + targetOverWidthHalf < wH; // 启用leftEnd、rightEnd的额外条件

  var enableLERE =
  /* 目标顶边距 - 包裹顶边距 > 0 */
  LREnableBaseTop - targetOverHeight - offset > 0 &&
  /* 目标定边距 + 包裹低边距 + 目标高度 < 窗口高 */
  LREnableBaseBottom - offset < wH; // 启用leftStart、rightStart的额外条件

  var enableLSRS =
  /* 目标顶边距 - 包裹顶边距 > 0 */
  LREnableBaseTop - offset > 0 &&
  /* 目标定边距 + 包裹低边距 + 目标高度 < 窗口高 */
  LREnableBaseBottom + targetOverHeight - offset < wH;
  /* ########### 基础位置计算 ########## */

  var topBase =
  /* 目标顶边距 - 容器顶边距 > 气泡高度 */
  targetB.top - wrapB.top - offset > sourceB.height &&
  /* 目标顶边距 - 包裹元素底边距 - 窗口高度 */
  targetB.top + WrapOffsetToBottom - wH - offset < 0;
  var bottomBase =
  /* 窗口高 - 目标上边距 - 包裹元素低边距 > 总高度 */
  wH - targetB.top - WrapOffsetToBottom - offset > allHeight &&
  /* 目标上边距 - 包裹元素上边距 + 总高度 */
  targetB.top - wrapB.top + targetB.height + offset > 0;
  var leftBase =
  /*  */
  targetB.left - wrapB.left - offset > sourceB.width &&
  /*  */
  targetB.left + WrapOffsetToRight - offset - wW < 0;
  var rightBase =
  /*  */
  wW - targetB.left - WrapOffsetToRight - offset > allWidth &&
  /*  */
  targetB.left - wrapB.left + targetB.width + offset > 0;
  var winSt = document.documentElement.scrollTop + document.body.scrollTop;
  var winSl = document.documentElement.scrollLeft + document.body.scrollLeft;
  var topYBase = targetB.top - sourceB.height + winSt;
  var bottomYBase = targetB.top + targetB.height + winSt + offset;
  var LeftXBase = targetB.left - sourceB.width + winSl - offset;
  var rightXBase = targetB.left + targetB.width + winSl + offset;
  var rightLeftYBase = targetB.top - (sourceB.height - targetB.height) / 2 + winSt;
  var rightLeftEndYBase = targetB.top + targetB.height - sourceB.height + winSt;
  var topBottomEndYBase = targetB.left + targetB.width - sourceB.width + winSl;
  var topBottomXBase = targetB.left - targetOverWidthHalf + winSl;
  var dMeta = {
    top: {
      safe: topBase && enableTB,
      x: topBottomXBase,
      y: topYBase - offset
    },
    topEnd: {
      safe: topBase && enableTEBE,
      x: topBottomEndYBase,
      y: topYBase - offset
    },
    topStart: {
      safe: topBase && enableTSBS,
      x: targetB.left + winSl,
      y: topYBase - offset
    },
    bottomEnd: {
      safe: bottomBase && enableTEBE,
      x: topBottomEndYBase,
      y: bottomYBase
    },
    bottomStart: {
      safe: bottomBase && enableTSBS,
      x: targetB.left + winSl,
      y: bottomYBase
    },
    bottom: {
      safe: bottomBase && enableTB,
      x: topBottomXBase,
      y: bottomYBase
    },
    left: {
      safe: leftBase && enableLR,
      x: LeftXBase,
      y: rightLeftYBase
    },
    leftStart: {
      safe: leftBase && enableLSRS,
      x: LeftXBase,
      y: targetB.top + winSt
    },
    leftEnd: {
      safe: leftBase && enableLERE,
      x: LeftXBase,
      y: rightLeftEndYBase
    },
    right: {
      safe: rightBase && enableLR,
      x: rightXBase,
      y: rightLeftYBase
    },
    rightStart: {
      safe: rightBase && enableLSRS,
      x: rightXBase,
      y: targetB.top + winSt
    },
    rightEnd: {
      safe: rightBase && enableLERE,
      x: rightXBase,
      y: rightLeftEndYBase
    }
  };
  var current = getPopperDirectionForMeta(dMeta, direction, prevDirection || direction);
  var currentMeta = current[0];
  var currentDirection = current[1];
  var notValidDirection = current[2];
  var cL = currentMeta.x;
  var cT = currentMeta.y;
  var cW = sourceB.width;
  var ch = sourceB.height; // 传递给其他函数来拆分函数

  var passData = {
    targetB: targetB,
    wrapB: wrapB,
    sourceB: sourceB,
    winSt: winSt,
    winSl: winSl,
    offset: offset
  };
  var hidden =
  /* left */
  cL + cW < wrapB.left + winSl ||
  /* top */
  cT + ch < wrapB.top + winSt ||
  /* bottom */
  cT > wrapB.top + wrapB.height + winSt ||
  /* right */
  cL > wrapB.left + wrapB.width + winSl;
  var degrade;

  if (notValidDirection && sourceB.width / wrapB.width > 0.7) {
    degrade = getDegrade(passData);

    if (degrade) {
      currentMeta = {
        x: degrade.x,
        y: degrade.y,
        safe: true,
        arrowX: degrade.arrowX
      };
      currentDirection = degrade.direction;
    }
  }

  return {
    metas: dMeta,
    currentDirection: currentMeta,
    currentDirectionKey: currentDirection,
    visible: !hidden,
    degrade: degrade,
    notValidDirection: notValidDirection
  };
}

/** 所有位置都不存在时，获取一个可用的回退位置 */
function getDegrade(arg) {
  var targetB = arg.targetB,
      wrapB = arg.wrapB,
      sourceB = arg.sourceB,
      winSt = arg.winSt,
      winSl = arg.winSl,
      offset = arg.offset;
  var validArea = {
    top: targetB.top - wrapB.top,
    left: targetB.left - wrapB.left,
    right: wrapB.left + wrapB.width - targetB.left - targetB.width,
    bottom: wrapB.top + wrapB.height - targetB.top - targetB.height
  };
  var xValid = wrapB.width >= sourceB.width;
  var a = wrapB.width - (wrapB.width - targetB.left);
  var b = wrapB.width - targetB.left;
  var c = sourceB.width - b; // const xPos = (wrapB.width - sourceB.width) / 2 + winSl;

  var xPos = a - c - 16 - winSl;
  var arrowX = targetB.left - xPos + targetB.width / 2;

  if (validArea.top - offset >= sourceB.height && xValid) {
    return {
      direction: 'top',
      x: xPos,
      y: targetB.top - sourceB.height - offset + winSt,
      arrowX: arrowX
    };
  }

  if (validArea.bottom + offset >= sourceB.height && xValid) {
    return {
      direction: 'bottom',
      x: xPos,
      y: targetB.top + targetB.height + offset + winSt,
      arrowX: arrowX
    };
  }
}
/**
 * 根据GetBoundMetasReturns和当前位置、前一个位置来从meta中挑选下一个合适的方向, 当返回值3位true时，表示没有可用的位置
 * @param meta - getPopperMetas函数的返回值
 * @param direction - 预设位置, 优先选取
 * @param prevDirection - 表示前一个位置的key
 * */


function getPopperDirectionForMeta(meta, direction, prevDirection) {
  // 当前位置可用时优先选取
  if (meta[direction].safe) {
    return [meta[direction], direction];
  } // 前一位可用时选取


  if (meta[prevDirection].safe) {
    return [meta[prevDirection], prevDirection];
  } // 为top、bottom时优先取方向


  if (direction === 'top' && meta.bottom.safe) {
    return [meta.bottom, 'bottom'];
  }

  if (direction === 'bottom' && meta.top.safe) {
    return [meta.top, 'top'];
  } // 从关联方向中取第一个方向


  var relates = relateDirectionMap[prevDirection];
  var current = relates.reduce(function (prev, key) {
    if (meta[key].safe && !prev) {
      return [meta[key], key];
    }

    return prev;
  }, undefined);

  if (current) {
    return current;
  } // 从可用方向中挑选第一个


  for (var _i = 0, _Object$entries = Object.entries(meta); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        _key = _Object$entries$_i[0],
        val = _Object$entries$_i[1];

    if (val.safe) {
      return [val, _key];
    }
  } // 默认前一个方向


  return [meta[prevDirection], prevDirection, true];
}

function Tooltip(props) {
  var content = props.content;
  return /*#__PURE__*/React.createElement("div", {
    className: "fr-popper_content fr-popper_tooltip"
  }, content);
}

function Popper(props) {
  var content = props.content,
      title = props.title;
  return /*#__PURE__*/React.createElement("div", {
    className: "fr-popper_content fr-popper_popper"
  }, title && /*#__PURE__*/React.createElement("div", {
    className: "fr-popper_popper-title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "fr-popper_popper-content"
  }, content));
}

function Confirm(props) {
  var content = props.content,
      _props$confirmText = props.confirmText,
      confirmText = _props$confirmText === void 0 ? '确认' : _props$confirmText,
      _props$cancelText = props.cancelText,
      cancelText = _props$cancelText === void 0 ? '取消' : _props$cancelText,
      setShow = props.setShow,
      onConfirm = props.onConfirm,
      disabled = props.disabled,
      icon = props.icon;
  var closeHandle = useFn(function () {
    setShow(false);
  });
  var confirmHandle = useFn(function () {
    onConfirm === null || onConfirm === void 0 ? void 0 : onConfirm();
    setShow(false);
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "fr-popper_content fr-popper_confirm"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fr-popper_confirm-icon"
  }, icon || /*#__PURE__*/React.createElement(WarningIcon, null)), /*#__PURE__*/React.createElement("span", null, content), /*#__PURE__*/React.createElement("div", {
    className: "fr-popper_confirm-btns"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "small",
    onClick: closeHandle
  }, cancelText), /*#__PURE__*/React.createElement(Button, {
    disabled: disabled,
    size: "small",
    color: "primary",
    onClick: confirmHandle
  }, confirmText)));
}

var buildInComponent = {
  tooltip: Tooltip,
  popper: Popper,
  confirm: Confirm
};

var MIN_SCALE = 0.86;
var Popper$1 = /*#__PURE__*/React.forwardRef(function (props, fRef) {
  var className = props.className,
      style = props.style,
      children = props.children,
      _props$direction = props.direction,
      direction = _props$direction === void 0 ? 'top' : _props$direction,
      wrapEl = props.wrapEl,
      _props$offset = props.offset,
      offset = _props$offset === void 0 ? 12 : _props$offset,
      target = props.target,
      _props$trigger = props.trigger,
      trigger = _props$trigger === void 0 ? ['hover'] : _props$trigger,
      _props$mountOnEnter = props.mountOnEnter,
      mountOnEnter = _props$mountOnEnter === void 0 ? true : _props$mountOnEnter,
      _props$unmountOnExit = props.unmountOnExit,
      unmountOnExit = _props$unmountOnExit === void 0 ? false : _props$unmountOnExit,
      _props$disabled = props.disabled,
      disabled = _props$disabled === void 0 ? false : _props$disabled,
      _props$type = props.type,
      type = _props$type === void 0 ? 'tooltip' : _props$type,
      customer = props.customer;
  var popperEl = useRef(null);
  var Component = customer || buildInComponent[type];
  var id = useMemo(function () {
    return createRandString(1);
  }, []);
  /** 在未传入target时，用于标识出目标所在元素 */

  var targetSelector = "fr-popper_".concat(id);
  /** 获取启用的事件类型 */

  var triggerType = getTriggerType(trigger);

  var _useFormState = useFormState(props, false, {
    valueKey: 'show',
    defaultValueKey: 'defaultShow'
  }),
      _useFormState2 = _slicedToArray(_useFormState, 2),
      show = _useFormState2[0],
      setShow = _useFormState2[1];

  var self = useSelf({
    // 优化动画
    refreshCount: 0,

    /** 气泡最近一次获取的x轴位置，用于减少更新 */
    lastX: undefined,

    /** 气泡最近一次获取的y轴位置，用于减少更新 */
    lastY: undefined,

    /** 最近一次的可见状态，用于：优化显示效果、提高性能 */
    lastVisible: true,

    /** 最后获取到的气泡宽度 */
    lastPopperW: 0,

    /** 最后获取到的气泡高度 */
    lastPopperH: 0,

    /** 目标元素, 通过props.target或children获取 */
    target: undefined,

    /** 实现延迟隐藏 */
    hideTimer: undefined,

    /** 实现延迟渲染 */
    showTimer: undefined,

    /** 防止show变更和尺寸变更effect重复更新 */
    refreshing: false
  });

  var _useSetState = useSetState({
    /** 气泡所在方向 */
    direction: direction,

    /** 用于修补的箭头位置 */
    arrowX: 0,

    /** content是否渲染，用于实现mountOnEnter、unmountOnExit */
    contentShow: !mountOnEnter || show
  }),
      _useSetState2 = _slicedToArray(_useSetState, 2),
      state = _useSetState2[0],
      setState = _useSetState2[1]; // 监听尺寸变化并更新气泡位置


  var _useMeasure = useMeasure(),
      _useMeasure2 = _slicedToArray(_useMeasure, 2),
      ref = _useMeasure2[0],
      _useMeasure2$ = _useMeasure2[1],
      mWidth = _useMeasure2$.width,
      mHeight = _useMeasure2$.height;

  var showBase = show ? 1 : MIN_SCALE; // click下点击它处关闭气泡

  useClickAway(popperEl, function (_ref) {
    var _target = _ref.target;

    if (triggerType.click && show) {
      var targetEl = self.target;

      if (_target && targetEl && targetEl.contains) {
        var isTarget = targetEl.contains(_target);

        if (!isTarget) {
          setShow(false);
        }
      }
    }
  });

  var _useSpring = useSpring(function () {
    return {
      xy: [0, 0],
      opacity: showBase,
      scale: showBase,
      config: {
        mass: 1,
        tension: 440,
        friction: 22
      }
    };
  }),
      _useSpring2 = _slicedToArray(_useSpring, 2),
      spProps = _useSpring2[0],
      set = _useSpring2[1];
  /** 根据参数设置self.target的值 */


  useEffect(function () {
    setTarget();
  }, [children, target]);
  /** 保存气泡尺寸，由于有缩放动画，直接获取dom信息会出现偏差 */

  useEffect(function () {
    // if (show) {
    if (!popperEl.current) return;
    self.lastPopperW = popperEl.current.offsetWidth;
    self.lastPopperH = popperEl.current.offsetHeight; // }
  });
  var clickHandle = useFn(function () {
    if (disabled) return;
    setShow(function (prev) {
      return !prev;
    });
  });
  var mouseEnterHandle = useFn(function () {
    if (disabled) return;
    clearTimeout(self.hideTimer);
    if (show) return;
    self.showTimer = setTimeout(function () {
      setShow(true);
    }, type === 'tooltip' ? 0 : 80);
  });
  var mouseLeaveHandle = useFn(function () {
    if (disabled) return;
    clearTimeout(self.showTimer);
    if (!show) return;
    self.hideTimer = setTimeout(function () {
      setShow(false);
    }, 300);
  });
  var focusHandle = useFn(function () {
    if (disabled) return;
    setShow(true);
  });
  var blurHandle = useFn(function () {
    if (disabled) return;
    setShow(false);
  });
  /** 绑定事件, 由于需要支持多种target类型，需要直接使用原生api绑定 */

  useEffect(function () {
    if (!self.target) return;
    if (isPopperMetasBound(self.target)) return;
    var el = self.target;
    if (!('addEventListener' in el)) return;
    var clickEnable = triggerType.click;
    var focusEnable = triggerType.focus;
    var hoverEnable = triggerType.hover;

    if (clickEnable) {
      el.addEventListener('click', clickHandle);
    }

    if (hoverEnable) {
      el.addEventListener('mouseenter', mouseEnterHandle);
      el.addEventListener('mouseleave', mouseLeaveHandle);
    }

    if (focusEnable) {
      el.addEventListener('focus', focusHandle);
      el.addEventListener('blur', blurHandle);
    }

    return function () {
      if (clickEnable) {
        el.removeEventListener('click', clickHandle);
      }

      if (hoverEnable) {
        el.removeEventListener('mouseenter', mouseEnterHandle);
        el.removeEventListener('mouseleave', mouseLeaveHandle);
      }

      if (focusEnable) {
        el.removeEventListener('focus', focusHandle);
        el.removeEventListener('blur', blurHandle);
      }
    };
  }, [self.target]);
  /**
   * 更新气泡位置、状态、显示等
   * @param fix - 仅对位置进行更新
   * @param skipTransition - 跳过动画
   * @param forceShow - 强制显示, 不管是否可见、show是否为true
   * */

  var refresh = useFn(function (fix, skipTransition, forceShow) {
    if (!self.target) return;
    if (!isNumber(self.lastPopperW) || !isNumber(self.lastPopperH)) return;

    if (!fix && show && popperEl.current) {
      self.lastPopperW = popperEl.current.offsetWidth;
      self.lastPopperH = popperEl.current.offsetHeight;
    }

    var _getPopperMetas = getPopperMetas({
      width: self.lastPopperW,
      height: self.lastPopperH
    }, self.target, {
      offset: offset,
      wrap: getWrapEl(),
      direction: direction,
      prevDirection: state.direction
    }),
        currentDirection = _getPopperMetas.currentDirection,
        currentDirectionKey = _getPopperMetas.currentDirectionKey,
        visible = _getPopperMetas.visible;

    if (currentDirection && currentDirectionKey) {
      // 方向与上次不同时更新方向
      if (currentDirectionKey !== state.direction) {
        setState({
          direction: currentDirectionKey
        });
      }

      if (currentDirection.arrowX !== state.arrowX) {
        setState({
          arrowX: currentDirection.arrowX
        });
      }

      if (!fix) {
        // 前一次位置与后一次完全相等时跳过
        if (self.lastX === currentDirection.x && self.lastY === currentDirection.y) {
          return;
        } // 前后visible状态均为false时跳过


        if (!self.lastVisible && !visible) {
          self.refreshCount = 0; // 防止初次入场/重入场时气泡不必要的更新动画

          return;
        }
        /**
         * 跳过动画,直接设置为目标状态
         * 1. 由可见状态进入不可见状态
         * */


        if (self.lastVisible && !visible || !self.lastVisible && visible || skipTransition) {
          self.refreshCount = 0;
        }

        self.lastVisible = visible;
        self.lastX = currentDirection.x;
        self.lastY = currentDirection.y;
      }

      var styleShow = visible && show ? 1 : 0;

      if (forceShow) {
        styleShow = 1;
        self.refreshCount = 0;
      }

      var scale = styleShow ? 1 : 0.86;
      set({
        xy: [currentDirection.x, currentDirection.y],
        opacity: fix ? 0 : styleShow,
        scale: fix ? 0.86 : scale,
        immediate: fix || self.refreshCount === 0,
        // @ts-ignore
        onRest: function onRest() {
          // 实现unmountOnExit
          if (!fix && !show && state.contentShow && unmountOnExit) {
            setState({
              contentShow: false
            });
          }
        }
      });
      !fix && self.refreshCount++;
    }
  }, function (f) {
    return _throttle(f, 100);
  });
  var scrollHandle = useFn(function () {
    if (!show) return;
    refresh();
  });
  /** 初始化定位、默认触发气泡更新方式(wrap滚动触发) */

  useEffect(function () {
    refresh();
    var e = getWrapEl() || window;
    e.addEventListener('scroll', scrollHandle);
    return function () {
      e.addEventListener('scroll', scrollHandle);
    };
  }, [wrapEl]);
  /** show变更处理 */

  useUpdateEffect(function () {
    self.refreshing = true; // 实现 mountOnEnter

    if (show && !state.contentShow) {
      setState({
        contentShow: true
      });
    }

    setTimeout(function () {
      // 为true时需要先更新位置，然后刷新动画, 否则会导致入场动画异常
      show && refresh(true);
      self.lastX = 0;
      self.lastY = 0;
      self.lastVisible = true;
      refresh();
      self.refreshing = false;
    });
  }, [show]); // 尺寸变化时更新位置

  useUpdateEffect(function () {
    if (self.refreshing) return;
    if (!state.contentShow) return;
    show && refresh();
  }, [mWidth, mHeight]);
  useImperativeHandle(fRef, function () {
    return {
      refresh: refresh
    };
  }, []);
  /** 获取包含滚动条的父元素或wrapEl */

  function getWrapEl() {
    if (isDom(self.target)) {
      var sp = getFirstScrollParent(self.target);

      if (sp) {
        return sp;
      }
    }

    return getRefDomOrDom(wrapEl);
  }
  /** 根据props.target获取作为目标的GetPopperMetasBound对象或dom元素 */


  function getTarget() {
    // target能正常取到dom元素
    var el = getRefDomOrDom(target);
    if (el) return el; // 是GetPopperMetasBound对象

    var bound = isPopperMetasBound(target);
    if (bound) return bound;
    return undefined;
  }
  /** 根据各种环境参数设置self.target的值, 传入参数时直接以参数作为值 */


  function setTarget(currentTarget) {
    if (currentTarget) {
      self.target = currentTarget;
      return;
    } // props.target能正常取到值


    var _target = getTarget();

    if (_target) {
      self.target = _target;
      return;
    } // 根据标记targetSelector查到目标元素


    var queryEl = document.querySelector(".".concat(targetSelector));

    if (queryEl) {
      self.target = queryEl;
      return;
    }

    self.target = undefined;
  }
  /**
   * children的渲染方式
   * 1. target存在时，不渲染，取target的值
   * 2. children不存在时，不渲染
   * 3. 否则，为其添加一个用于选择器的类名后渲染
   * */


  function renderChildren() {
    if (target) return null;
    if (!children) return null;
    return /*#__PURE__*/React.cloneElement(children, {
      className: cls(children.props.className, targetSelector)
    });
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, renderChildren(), state.contentShow && /*#__PURE__*/React.createElement(Portal, {
    namespace: "popper"
  }, /*#__PURE__*/React.createElement(animated.div, {
    ref: popperEl,
    style: _objectSpread(_objectSpread({}, style), {}, {
      transform: interpolate([spProps.xy, spProps.scale], function (_ref2, sc) {
        var _ref3 = _slicedToArray(_ref2, 2),
            x = _ref3[0],
            y = _ref3[1];

        return (
          /* 使用toFixed防止chrome字体模糊 */
          "translate3d(".concat(x.toFixed(0), "px, ").concat(y.toFixed(0), "px, 0) scale3d(").concat(sc, ", ").concat(sc, ", ").concat(sc, ")")
        );
      }),
      opacity: spProps.opacity.interpolate(function (o) {
        return o;
      }),
      visibility: spProps.opacity.interpolate(function (o) {
        return o === 0 ? 'hidden' : undefined;
      })
    }),
    className: cls('fr-popper', state.direction && "__".concat(state.direction), className),
    onMouseEnter: triggerType.hover ? mouseEnterHandle : undefined,
    onMouseLeave: triggerType.hover ? mouseLeaveHandle : undefined
  }, /*#__PURE__*/React.createElement("div", {
    ref: ref
  }, /*#__PURE__*/React.createElement(Component, _extends({
    show: show,
    setShow: setShow
  }, props)), /*#__PURE__*/React.createElement("span", {
    className: cls('fr-popper_arrow', state.direction && "__".concat(state.direction)),
    style: {
      left: state.arrowX || undefined
    }
  })))));
});

export default Popper$1;
