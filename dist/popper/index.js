import 'm78/popper/style';
import _extends from '@babel/runtime/helpers/extends';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import React, { useEffect, useMemo, useRef, useImperativeHandle } from 'react';
import Portal from 'm78/portal';
import cls from 'classnames';
import { useFn, getRefDomOrDom, useFormState, useMountExist, useSetState, useSelf } from '@lxjx/hooks';
import { checkElementVisible, isDom, getScrollParent, createRandString } from '@lxjx/utils';
import { useSpring, animated, to } from 'react-spring';
import { useClickAway, useUpdateEffect, useMeasure } from 'react-use';
import { useDelayDerivedToggleStatus } from 'm78/hooks';
import _throttle from 'lodash/throttle';
import { WarningIcon } from 'm78/icon';
import Button from 'm78/button';

var PopperTriggerEnum;

(function (PopperTriggerEnum) {
  PopperTriggerEnum["hover"] = "hover";
  PopperTriggerEnum["click"] = "click";
  PopperTriggerEnum["focus"] = "focus";
  PopperTriggerEnum["subClick"] = "subClick";
})(PopperTriggerEnum || (PopperTriggerEnum = {}));

/** 所有可能出现的方向 */
var PopperDirectionEnum;
/** 所有可能出现的方向 */

(function (PopperDirectionEnum) {
  PopperDirectionEnum["topStart"] = "topStart";
  PopperDirectionEnum["top"] = "top";
  PopperDirectionEnum["topEnd"] = "topEnd";
  PopperDirectionEnum["leftStart"] = "leftStart";
  PopperDirectionEnum["left"] = "left";
  PopperDirectionEnum["leftEnd"] = "leftEnd";
  PopperDirectionEnum["bottomStart"] = "bottomStart";
  PopperDirectionEnum["bottom"] = "bottom";
  PopperDirectionEnum["bottomEnd"] = "bottomEnd";
  PopperDirectionEnum["rightStart"] = "rightStart";
  PopperDirectionEnum["right"] = "right";
  PopperDirectionEnum["rightEnd"] = "rightEnd";
})(PopperDirectionEnum || (PopperDirectionEnum = {}));

/** 绑定事件，由于要支持不同的target类型，所以一律使用原生api进行绑定 */
function useEventBind(share, methods) {
  var props = share.props,
      setShow = share.setShow,
      show = share.show,
      self = share.self,
      state = share.state,
      triggerType = share.triggerType;
  var disabled = props.disabled;
  /** 点击 */

  var clickHandle = useFn(function () {
    if (disabled) return;
    setShow(function (prev) {
      return !prev;
    });
  });
  /** 副键点击 */

  var subClickHandle = useFn(function (e) {
    if (disabled) return;
    e.preventDefault();
    setShow(function (prev) {
      return !prev;
    });
    return false;
  });
  /** 鼠标移入 */

  var mouseEnterHandle = useFn(function () {
    if (disabled) return;
    clearTimeout(self.hideTimer);
    if (show) return; // 延迟显示

    self.showTimer = setTimeout(function () {
      setShow(true);
    }, 80);
  });
  /** 鼠标移出 */

  var mouseLeaveHandle = useFn(function () {
    if (disabled) return;
    clearTimeout(self.showTimer);
    if (!show) return; // 延迟隐藏

    self.hideTimer = setTimeout(function () {
      setShow(false);
    }, 200);
  });
  /** 获得焦点 */

  var focusHandle = useFn(function () {
    if (disabled) return;
    setShow(true);
  });
  /** 失去焦点 */

  var blurHandle = useFn(function () {
    if (disabled) return;
    setShow(false);
  });
  /** 滚动 */

  var scrollHandle = useFn(function () {
    show && methods.refresh();
  }, function (fn) {
    return _throttle(fn, 60, {
      trailing: true,
      leading: false
    });
  }); // target变更， 绑定基础事件

  useEffect(function () {
    if (!state.elTarget && !state.boundTarget) return;
    return eventBind();
  }, [state.elTarget, state.boundTarget]); // 绑定滚动事件

  useEffect(function () {
    if (!state.wrapEl) return;
    var el = state.wrapEl; // 如果是根元素，将事件绑定到window，如果不是根元素，需要其本身和窗口都包含事件

    var isDoc = el === document.documentElement || el === document.body;
    window.addEventListener('scroll', scrollHandle);

    if (!isDoc) {
      el.addEventListener('scroll', scrollHandle);
    }

    return function () {
      window.removeEventListener('scroll', scrollHandle);

      if (!isDoc) {
        el.removeEventListener('scroll', scrollHandle);
      }
    };
  }, [state.wrapEl]);
  /** 绑定事件到elTarget */

  function eventBind() {
    if (!state.elTarget) return;
    var el = state.elTarget;
    var clickEnable = triggerType.click;
    var focusEnable = triggerType.focus;
    var hoverEnable = triggerType.hover;
    var subClick = triggerType.subClick;

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

    if (subClick) {
      el.addEventListener('contextmenu', subClickHandle);
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

      if (subClick) {
        el.removeEventListener('contextmenu', subClickHandle);
      }
    };
  }

  return {
    mouseEnterHandle: mouseEnterHandle,
    mouseLeaveHandle: mouseLeaveHandle
  };
}

/** 检测是否为合法的Bound */

function isPopperBound(arg) {
  return arg && 'left' in arg && 'top' in arg && 'right' in arg && 'bottom' in arg; // return arg && 'left' in arg && 'top' in arg && 'width' in arg && 'height' in arg;
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
    hover: types.includes(PopperTriggerEnum.hover),
    click: types.includes(PopperTriggerEnum.click),
    focus: types.includes(PopperTriggerEnum.focus),
    subClick: type.includes(PopperTriggerEnum.subClick)
  };
}

function Tooltip(props) {
  var content = props.content;
  return /*#__PURE__*/React.createElement("div", {
    className: "m78-popper_content m78-popper_tooltip"
  }, content);
}

function Popper(props) {
  var content = props.content,
      title = props.title;
  return /*#__PURE__*/React.createElement("div", {
    className: "m78-popper_content m78-popper_popper"
  }, title && /*#__PURE__*/React.createElement("div", {
    className: "m78-popper_popper-title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "m78-popper_popper-content"
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
    className: "m78-popper_content m78-popper_confirm"
  }, /*#__PURE__*/React.createElement("span", {
    className: "m78-popper_confirm-icon"
  }, icon || /*#__PURE__*/React.createElement(WarningIcon, null)), /*#__PURE__*/React.createElement("span", null, content), /*#__PURE__*/React.createElement("div", {
    className: "m78-popper_confirm-btns"
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

function useEffects(share, methods) {
  var state = share.state,
      show = share.show,
      triggerType = share.triggerType,
      setShow = share.setShow,
      popperEl = share.popperEl,
      mHeight = share.mHeight,
      mWidth = share.mWidth,
      props = share.props,
      mount = share.mount,
      self = share.self;
  var refresh = methods.refresh;
  /** 点击气泡外位置关闭 */

  useClickAway(popperEl, function (_ref) {
    var _target = _ref.target;

    if (triggerType.subClick && show) {
      setShow(false);
    }

    if (triggerType.click && show) {
      var elTarget = state.elTarget; // 只在点击的不是目标元素时生效

      if (_target && elTarget && elTarget.contains) {
        var isTarget = elTarget.contains(_target);

        if (!isTarget) {
          setShow(false);
        }
      }
    }
  }); // 初始化显示

  useEffect(function () {
    show && refresh(false);
  }, [state.elTarget, state.boundTarget]);
  /** mount进入时刷新 */

  useUpdateEffect(function () {
    if (mount && show) {
      self.lastShow = false; // 强制重置

      setTimeout(refresh, 1);
    }
  }, [mount]); // 显示状态/尺寸变更，刷新气泡

  useUpdateEffect(function () {
    if (!mount) return;
    refresh();
  }, [show]);
  useUpdateEffect(function () {
    show && refresh();
  }, [mWidth, mHeight]); // 获取wrapEl

  useEffect(methods.getWrapEl, [state.elTarget, props.wrapEl]); // 获取target

  useEffect(methods.getTarget, [props.children, props.target]);
}

/**
 * 将PopperDirectionInfo的每个方向进行检测并转换为PopperDirectionInfoWidthVisible，返回转换后的原对象
 * */
function patchVisible(directionInfo, wrapEl) {
  var dv = directionInfo;
  Object.entries(dv).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        item = _ref2[1];

    // 可见信息不能包含滚动位置，手动清除
    var removeScrollOffsetItem = decreaseScrollOffset(item);

    var _checkElementVisible = checkElementVisible(removeScrollOffsetItem, {
      offset: 0,
      wrapEl: wrapEl,
      fullVisible: true
    }),
        visible = _checkElementVisible.visible;

    var _checkElementVisible2 = checkElementVisible(removeScrollOffsetItem, {
      offset: 0,
      wrapEl: wrapEl,
      fullVisible: false
    }),
        fullVisible = _checkElementVisible2.visible;

    dv[key] = _objectSpread(_objectSpread({}, item), {}, {
      visible: visible,
      hidden: !fullVisible
    });
  });
  return dv;
}
/** 将Bound对象的四个方向信息减去对应方向的滚动位置 */

function decreaseScrollOffset(b) {
  var bound = {};
  var st = document.documentElement.scrollTop;
  var sl = document.body.scrollLeft;
  Object.entries(b).forEach(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        key = _ref4[0],
        item = _ref4[1];

    bound[key] = key === 'left' || key === 'right' ? item - sl : item - st;
  });
  return bound;
}

/**
 * 根据popper尺寸，目标的位置信息计算气泡位置
 * @param popperSize - 包含气泡宽高信息的对象
 * @param target - 目标, 可以是描述位置尺寸的Bound对象、dom节点、指向dom节点的ref
 * @param options
 * @param options.offset - 0 | 偏移位置
 * @return - 包含所有方向气泡位置<Bound>的对象, 这些位置对于的是整个页面左上角开始
 * */
function getPopperDirection(popperSize, target) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? 0 : _options$offset;
  var size = popperSize;
  /** 目标元素 */

  var tg;
  var winSt = document.documentElement.scrollTop + document.body.scrollTop;
  var winSl = document.documentElement.scrollLeft + document.body.scrollLeft;

  if (isPopperBound(target)) {
    tg = target;
  } else {
    var domTarget = getRefDomOrDom(target);

    if (domTarget) {
      tg = domTarget.getBoundingClientRect();
    } else {
      // throwError('target resolve error', 'popper');
      return null;
    }
  }
  /** 目标元素的宽 */


  var targetW = tg.right - tg.left;
  /** 目标元素的高 */

  var targetH = tg.bottom - tg.top;
  /** 气泡大于目标元素的宽 */

  var overW = size.width - targetW;
  /** 气泡大于目标元素的高 */

  var overH = size.height - targetH;
  /* ############# 可以在多个反向复用的基准线 ############# */

  /** 顶部基准线, 用于top系位置 */

  var topY = tg.top - size.height + winSt - offset;
  /** 中部基准线, 用于left、right */

  var centerY = tg.top - overH / 2 + winSt;
  /** 底部基准线, 用于left、right */

  var bottomY = tg.bottom + winSt + offset;
  /** 顶部起第二根基准线, 用于leftEnd、rightEnd */

  var topSecondY = tg.bottom - size.height + winSt;
  /** 顶部起第二根基准线, 用于leftStart、rightStart */

  var bottomSecondY = tg.bottom - targetH + winSt;
  /** x轴的左侧基准线, 用于所有left系的左侧 */

  var leftX = tg.left - size.width + winSl - offset;
  /** x轴的左侧第二根基准线, 用于topEnd、bottomEnd */

  var leftSecondX = tg.right - size.width + winSl;
  /** x轴中心基准线，用于 top、bottom */

  var centerX = tg.left - overW / 2 + winSl;
  /** x轴的右侧第二根基准线, 用于topStart、bottomStart */

  var rightSecondX = tg.left + winSl;
  /** x轴的右侧基准线, 用于所有right系的左侧 */

  var rightX = tg.right + winSl + offset;
  return getRBObjForLTObj({
    top: {
      top: topY,
      left: centerX
    },
    topStart: {
      top: topY,
      left: rightSecondX
    },
    topEnd: {
      top: topY,
      left: leftSecondX
    },
    left: {
      top: centerY,
      left: leftX
    },
    leftStart: {
      top: bottomSecondY,
      left: leftX
    },
    leftEnd: {
      top: topSecondY,
      left: leftX
    },
    right: {
      top: centerY,
      left: rightX
    },
    rightStart: {
      top: bottomSecondY,
      left: rightX
    },
    rightEnd: {
      top: topSecondY,
      left: rightX
    },
    bottom: {
      top: bottomY,
      left: centerX
    },
    bottomStart: {
      top: bottomY,
      left: rightSecondX
    },
    bottomEnd: {
      top: bottomY,
      left: leftSecondX
    }
  }, size);
}
/** 将一组包含left、top的方向对象值根据尺寸信息转换为包含left, top, right, bottom的值(改变原对象) */

function getRBObjForLTObj(obj, _ref) {
  var width = _ref.width,
      height = _ref.height;
  var o = {};
  Object.entries(obj).forEach(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        key = _ref3[0],
        item = _ref3[1];

    o[key] = _objectSpread(_objectSpread({}, item), {}, {
      right: item.left + width,
      bottom: item.top + height
    });
  });
  return o;
}

/** 关联的方向，用于帮助猜测下一个Direction的合理位置 */
var relateDirectionMap = {
  topStart: ['top', 'topEnd', 'bottomStart'],
  top: ['bottom', 'topStart', 'topEnd'],
  topEnd: ['top', 'topStart', 'bottomEnd'],
  leftStart: ['left', 'leftEnd', 'bottom'],
  left: ['right', 'leftStart', 'leftEnd'],
  leftEnd: ['left', 'leftStart', 'top'],
  bottomStart: ['bottom', 'bottomEnd', 'topStart'],
  bottom: ['top', 'bottomStart', 'bottomEnd'],
  bottomEnd: ['bottom', 'bottomStart', 'topEnd'],
  rightStart: ['right', 'rightEnd', 'bottom'],
  right: ['left', 'rightStart', 'rightEnd', 'bottom'],
  rightEnd: ['right', 'rightStart', 'top']
};

/**
 * direction prevDirection directionInfo
 * 选取方向顺序:
 * 前一个方向 ->
 * 指定方向 ->
 * 根据前一个方向获取关联方向 ->
 * 指定方向获取关联方向 ->
 * 关联方向均不可用时, 获取第一个visible方向 ->
 * 无任何visible方向时，获取第一个非hidden方向 ->
 * 使用指定方向
 * */
function selectDirection(_ref) {
  var direction = _ref.direction,
      prevDirection = _ref.prevDirection,
      directionInfo = _ref.directionInfo;
  // 前一个方向
  var prev = directionInfo[prevDirection];
  if (prev && prev.visible) return [prev, prevDirection]; // 指定方向

  var current = directionInfo[direction];
  if (current && current.visible) return [current, direction]; // 根据前一个方向获取关联方向

  var relates = relateDirectionMap[prevDirection];
  var relateDirection = relates.reduce(function (pr, key) {
    if (directionInfo[key].visible && !pr) {
      return [directionInfo[key], key];
    }

    return pr;
  }, undefined);
  if (relateDirection) return relateDirection; // 指定方向获取关联方向

  var currentRelates = relateDirectionMap[direction];
  var currentRelateDirection = currentRelates.reduce(function (pr, key) {
    if (directionInfo[key].visible && !pr) {
      return [directionInfo[key], key];
    }

    return pr;
  }, undefined);
  if (currentRelateDirection) return currentRelateDirection; // 获取第一个visible方向

  for (var _i = 0, _Object$entries = Object.entries(directionInfo); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        key = _Object$entries$_i[0],
        val = _Object$entries$_i[1];

    if (val.visible) {
      return [val, key];
    }
  }

  var allHidden = true; // eslint-disable-next-line @typescript-eslint/no-unused-vars

  for (var _i2 = 0, _Object$entries2 = Object.entries(directionInfo); _i2 < _Object$entries2.length; _i2++) {
    var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
        _ = _Object$entries2$_i[0],
        _val = _Object$entries2$_i[1];

    if (!_val.hidden) {
      allHidden = false;
      break;
    }
  }

  if (allHidden) return null;
  var subKey = prevDirection || current;
  var substitute = directionInfo[subKey];
  return [substitute, subKey];
}

function useMethods(share) {
  var props = share.props,
      setState = share.setState,
      targetSelector = share.targetSelector,
      state = share.state,
      mount = share.mount,
      popperEl = share.popperEl,
      show = share.show,
      self = share.self,
      set = share.set;
  var target = props.target;
  /** 获取目标元素 */

  function getTarget() {
    // dom类型的target
    var el = getRefDomOrDom(target);

    if (el) {
      setState({
        elTarget: el,
        boundTarget: undefined
      });
      return;
    } // bound类型的target


    if (isPopperBound(target)) {
      setState({
        elTarget: undefined,
        boundTarget: target
      });
      return;
    } // 根据标记targetSelector查到目标元素


    var queryEl = document.querySelector(".".concat(targetSelector));

    if (queryEl) {
      setState({
        elTarget: queryEl,
        boundTarget: undefined
      });
      return;
    }

    setState({
      elTarget: undefined,
      boundTarget: undefined
    });
  }
  /** 根据参数获取wrapEl，如果未获取到递归获取父级可滚动元素 */


  function getWrapEl() {
    var el = getRefDomOrDom(props.wrapEl);

    if (isDom(el)) {
      if (el !== state.wrapEl) {
        setState({
          wrapEl: el
        });
      }

      return;
    }

    if (state.elTarget) {
      var fs = getScrollParent(state.elTarget);

      if (fs && fs !== state.wrapEl) {
        setState({
          wrapEl: fs
        });
      }
    }
  }
  /**
   * 刷新气泡状态，传入false跳过动画
   * */


  var refresh = useFn(function () {
    var animation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    if (!state.elTarget && !state.boundTarget) return;
    if (!mount) return;
    var width = popperEl.current.offsetWidth;
    var height = popperEl.current.offsetHeight; // 获取所有方向气泡位置

    var directionBounds = getPopperDirection({
      width: width,
      height: height
    }, state.elTarget || state.boundTarget, {
      offset: props.offset
    });
    if (!directionBounds) return; // 检测各气泡位置可见性

    var directionInfo = patchVisible(directionBounds, state.wrapEl); // 选择一个合适的当前位置

    var selected = selectDirection({
      direction: props.direction,
      prevDirection: state.direction,
      directionInfo: directionInfo
    });

    if (!selected) {
      self.allHide = true;
      set({
        opacity: 0,
        scale: 0,
        immediate: true
      });
      return;
    }

    var _selected = _slicedToArray(selected, 2),
        direct = _selected[0],
        directionKey = _selected[1]; // 更新方向


    if (directionKey !== state.direction) {
      setState({
        direction: directionKey
      });
    }

    var showConf = {
      xy: [direct.left, direct.top],
      opacity: 1,
      scale: 1
    };
    var hideConf = {
      xy: [direct.left, direct.top],
      opacity: 0,
      scale: 0,
      immediate: self.allHide || !animation
    };

    if (show) {
      if (self.lastShow) {
        set(_objectSpread(_objectSpread({}, showConf), {}, {
          immediate: self.allHide || !animation
        }));
      } else {
        // stop();
        // setTimeout(() => {
        set({
          immediate: self.allHide || !animation,
          from: {
            xy: [direct.left, direct.top],
            opacity: 0,
            scale: 0.7
          },
          to: showConf
        }); // });
      }
    } else {
      set(hideConf);
    }

    self.allHide && (self.allHide = false);
    self.lastShow = show;
  });
  return {
    getTarget: getTarget,
    getWrapEl: getWrapEl,
    refresh: refresh
  };
}

var defaultProps = {
  offset: 12,
  direction: 'top',
  type: 'tooltip',
  trigger: ['hover'],
  mountOnEnter: true,
  unmountOnExit: true,
  disabled: false
};

var Popper$1 = function Popper(_props) {
  var props = _props;
  var children = props.children,
      type = props.type,
      trigger = props.trigger,
      mountOnEnter = props.mountOnEnter,
      unmountOnExit = props.unmountOnExit,
      instanceRef = props.instanceRef;
  /** 显示状态 */

  var _useFormState = useFormState(props, false, {
    valueKey: 'show',
    defaultValueKey: 'defaultShow'
  }),
      _useFormState2 = _slicedToArray(_useFormState, 2),
      _show = _useFormState2[0],
      setShow = _useFormState2[1];
  /** 防止快速的连续开关和关闭后马上又开启的情况 */


  var show = useDelayDerivedToggleStatus(_show, 40, {
    trailing: true,
    leading: false
  });
  /** 控制渲染状态 */

  var _useMountExist = useMountExist({
    toggle: show,
    mountOnEnter: mountOnEnter,
    unmountOnExit: unmountOnExit,
    exitDelay: 600
  }),
      _useMountExist2 = _slicedToArray(_useMountExist, 1),
      mount = _useMountExist2[0];

  var _useSetState = useSetState({
    direction: props.direction
  }),
      _useSetState2 = _slicedToArray(_useSetState, 2),
      state = _useSetState2[0],
      setState = _useSetState2[1];

  var self = useSelf({
    lastShow: false,
    allHide: false
  });
  /** 唯一id */

  var id = useMemo(function () {
    return createRandString(1);
  }, []);
  /** 启用的事件类型 */

  var triggerType = getTriggerType(trigger);
  /** 气泡包裹元素 */

  var popperEl = useRef(null);
  /** 定制组件类型 */

  var Component = props.customer || buildInComponent[type];
  /** 在未传入target时，用于标识出目标所在元素, 使用选择器是为了和props.target用法兼容, 收束差异性 */

  var targetSelector = "m78-popper_".concat(id);
  /** 监听内容尺寸变更 */

  var _useMeasure = useMeasure(),
      _useMeasure2 = _slicedToArray(_useMeasure, 2),
      measureRef = _useMeasure2[0],
      _useMeasure2$ = _useMeasure2[1],
      mWidth = _useMeasure2$.width,
      mHeight = _useMeasure2$.height;
  /** 动画控制 */


  var _useSpring = useSpring(function () {
    return {
      xy: [0, 0],
      opacity: 0,
      scale: 0,
      config: {
        tension: 280,
        friction: 24
      }
    };
  }),
      _useSpring2 = _slicedToArray(_useSpring, 2),
      spProps = _useSpring2[0],
      set = _useSpring2[1];

  var share = {
    state: state,
    self: self,
    props: props,
    setShow: setShow,
    show: show,
    triggerType: triggerType,
    popperEl: popperEl,
    mWidth: mWidth,
    mHeight: mHeight,
    mount: mount,
    setState: setState,
    targetSelector: targetSelector,
    set: set,
    spProps: spProps
  };
  /* ############ 内部方法 ############ */

  var methods = useMethods(share);
  /** 暴露实例 */

  useImperativeHandle(instanceRef, function () {
    return {
      refresh: methods.refresh
    };
  });
  /**
   * ############## 钩子、监听器 ##############
   * 1. 绑定滚动监听器
   * 2. 点击它处关闭
   * 3. 显示状态、mount、气泡内容改变时刷新气泡状态
   * 4. 初始化显示
   * 5. 获取wrapEl
   * 6. 获取target
   * */

  useEffects(share, methods);
  /* ############ 绑定事件 ############ */

  var handlers = useEventBind(share, methods);
  /** 不为boundTarget类型且传入了children，作为子节点渲染并挂载选择器 */

  function renderChildren() {
    if (!children) return null;
    if (state.boundTarget) return null;
    return /*#__PURE__*/React.cloneElement(children, {
      className: cls(children.props.className, targetSelector)
    });
  }
  /** 气泡内容 */


  function renderPopper() {
    return /*#__PURE__*/React.createElement(Portal, {
      namespace: "popper"
    }, /*#__PURE__*/React.createElement(animated.div, {
      className: cls('m78-popper', state.direction && "__".concat(state.direction), props.className)
      /** 为气泡挂载鼠标事件，用于鼠标在target和气泡间移动时不会关闭 */
      ,
      onMouseEnter: triggerType.hover ? handlers.mouseEnterHandle : undefined,
      onMouseLeave: triggerType.hover ? handlers.mouseLeaveHandle : undefined,
      ref: popperEl,
      style: _objectSpread(_objectSpread({}, props.style), {}, {
        transform: to([spProps.xy, spProps.scale], function (_ref, sc) {
          var _ref2 = _slicedToArray(_ref, 2),
              x = _ref2[0],
              y = _ref2[1];

          /* 使用toFixed防止chrome字体模糊 */
          return "translate3d(".concat(x, "px, ").concat(y, "px, 0) scale3d(").concat(sc, ", ").concat(sc, ", ").concat(sc, ")");
        }),
        opacity: spProps.opacity.to(function (o) {
          return o;
        }),
        // 隐藏
        visibility: spProps.opacity.to(function (o) {
          return o < 0.3 ? 'hidden' : undefined;
        }),
        // 关闭时防止触发事件
        pointerEvents: spProps.opacity.to(function (o) {
          return o < 0.7 ? 'none' : undefined;
        })
      })
    }, /*#__PURE__*/React.createElement("div", {
      ref: measureRef
    }, /*#__PURE__*/React.createElement(Component, _extends({
      show: show,
      setShow: setShow
    }, props)), /*#__PURE__*/React.createElement("span", {
      className: cls('m78-popper_arrow', state.direction && "__".concat(state.direction))
    }))));
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, renderChildren(), mount && renderPopper());
};

Popper$1.defaultProps = defaultProps;

export default Popper$1;
export { PopperDirectionEnum, PopperTriggerEnum };
