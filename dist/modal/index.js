import 'm78/modal/style';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import React, { useEffect, useRef, useState } from 'react';
import Portal from 'm78/portal';
import { Z_INDEX_MODAL } from 'm78/util';
import { useClickAway, useUpdateEffect, useMeasure } from 'react-use';
import { config, Transition } from '@lxjx/react-transition-spring';
import { useLockBodyScroll, useFormState, useSameState, useSelf, useRefize } from '@lxjx/hooks';
import { useSpring, animated, interpolate } from 'react-spring';
import cls from 'classnames';
import { useMountInterface, useDelayDerivedToggleStatus } from 'm78/hooks';
import createRenderApi from '@lxjx/react-render-api';
import _debounce from 'lodash/debounce';
import _regeneratorRuntime from '@babel/runtime/regenerator';
import _asyncToGenerator from '@babel/runtime/helpers/asyncToGenerator';
import { getLastXKey, getLastYKey } from 'm78/modal/commons';

function useLifeCycle(share, methods) {
  var props = share.props,
      modalSize = share.modalSize;
  var onRemove = props.onRemove,
      _props$onRemoveDelay = props.onRemoveDelay,
      onRemoveDelay = _props$onRemoveDelay === void 0 ? 800 : _props$onRemoveDelay;

  var _modalSize = _slicedToArray(modalSize, 2),
      width = _modalSize[0],
      height = _modalSize[1]; // 滚动锁定


  useLockBodyScroll(share.lockScroll && share.show); // 无遮罩时，通过ClickAway来触发关闭，需要延迟一定的时间，因为用户设置的Modal开关可能会与ClickAway区域重叠

  useClickAway(share.contRef, function () {
    if (!share.show) return;

    if ( // 可点击关闭 + 无mask
    share.clickAwayClosable && !share.mask || // 应触发点击关闭 + mask未显示
    share.refState.shouldTriggerClose && !share.refState.maskShouldShow) {
      setTimeout(methods.close, 150);
    }
  }); // 用于搭配renderApi使用，在隐藏时通知renderApi进行实例移除

  useUpdateEffect(function () {
    if (!share.show) {
      // if (onClose) {
      //   onClose();
      // }
      if (onRemove) {
        setTimeout(onRemove, onRemoveDelay);
      }
    }
  }, [share.show]); // 容器尺寸改变时，更新Modal位置

  useEffect(function () {
    methods.calcPos();
  }, [width, height]); // 屏幕尺寸改变时，更新Modal位置

  useEffect(function () {
    var handler = _debounce(function () {
      methods.calcPos();
    }, 500);

    window.addEventListener('resize', handler);
    return function () {
      return window.removeEventListener('resize', handler);
    };
  }, []);
}

/** ======== fromMouse实现 ======== */
function useFromMouse(share, methods, isFromMouse) {
  var show = share.show,
      mountOnEnter = share.mountOnEnter,
      unmountOnExit = share.unmountOnExit,
      contRef = share.contRef,
      self = share.self,
      animationConfig = share.animationConfig;

  var _useSpring = useSpring(function () {
    return {
      x: 0,
      y: 0,
      scale: 0,
      opacity: 1
    };
  }),
      _useSpring2 = _slicedToArray(_useSpring, 2),
      sp = _useSpring2[0],
      set = _useSpring2[1];
  /** 为animationType = fromMouse 单独实现mountOnEnter、unmountOnExit */


  var _useMountInterface = useMountInterface(show, {
    mountOnEnter: mountOnEnter,
    unmountOnExit: unmountOnExit
  }),
      _useMountInterface2 = _slicedToArray(_useMountInterface, 2),
      mount = _useMountInterface2[0],
      setMount = _useMountInterface2[1];
  /** 用于确保fromMouse的useEffect()能访问到以挂载的contRef.current，类似nextTick */


  var show2 = useDelayDerivedToggleStatus(show, 1, {
    trailing: false,
    leading: true,
    disabled: !isFromMouse
  }); // 通知useMountInterface

  useEffect(function () {
    if (!isFromMouse) return;

    if (show) {
      setMount(true);
    }
  }, [show]); // 处理fromMouse的show change

  useEffect(function () {
    if (!isFromMouse) return;
    if (!contRef.current) return;

    if (show) {
      // 先执行一次计算可以避免错位
      methods.calcPos();
      var pointX = getLastXKey();
      var pointY = getLastYKey();
      self.pointX = pointX;
      self.pointY = pointY; // 缓存最后点击位置

      self.x = pointX || self.px || 0;
      self.y = pointY || self.px || 0; // 计算和缓存起点位置

      self.startXPos = self.x - self.px - contRef.current.offsetWidth / 2;
      self.startYPos = self.y - self.py - contRef.current.offsetHeight / 2; // 是否有最后点击点

      var notPoint = !pointY && !pointX; // 无动画设置起始位置 + 动画到显示位置

      set({
        to: function () {
          var _to = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(next) {
            return _regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return next({
                      x: notPoint ? 0 : self.startXPos,
                      y: notPoint ? -100 : self.startYPos,
                      scale: notPoint ? 1 : 0,
                      opacity: notPoint ? 0 : 1,
                      immediate: true,
                      reset: true
                    });

                  case 2:
                    _context.next = 4;
                    return next({
                      x: 0,
                      y: 0,
                      scale: 1,
                      opacity: 1,
                      immediate: false,
                      config: _objectSpread(_objectSpread({}, animationConfig), {}, {
                        clamp: false
                      }),
                      reset: false
                    });

                  case 4:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          function to(_x) {
            return _to.apply(this, arguments);
          }

          return to;
        }()
      });
    } else {
      // 是否有最后点击点
      var _notPoint = !self.pointY && !self.pointX; // 动画到初始位置


      set({
        x: _notPoint ? 0 : self.startXPos,
        y: _notPoint ? -100 : self.startYPos,
        scale: _notPoint ? 1 : 0,
        opacity: _notPoint ? 0 : 1,
        immediate: false,
        config: _objectSpread(_objectSpread({}, animationConfig), {}, {
          clamp: true
        }),
        reset: false,
        onRest: function onRest() {
          // 通知useMountInterface
          if (!share.refState.show) {
            setMount(false);
          }
        }
      });
      self.x = 0;
      self.y = 0;
    } // eslint-disable-next-line

  }, [show2]);
  return [sp, mount];
}

/** 根据alignment值获取x, y值 */
function calcAlignment(alignment, screenMeta) {
  var _screenMeta = _slicedToArray(screenMeta, 2),
      sW = _screenMeta[0],
      sH = _screenMeta[1];

  var _alignment = _slicedToArray(alignment, 2),
      aX = _alignment[0],
      aY = _alignment[1];

  var x = sW * aX;
  var y = sH * aY;
  return [x, y];
}
var LAST_X_KEY = 'FR_LAST_CLICK_POSITION_X';
var LAST_Y_KEY = 'FR_LAST_CLICK_POSITION_Y';
var timer = null;
/** 保存鼠标最后点击位置 */

function windowClickHandle(e) {
  if (timer) {
    clearTimeout(timer);
  }

  var x = e.x || e.screenX; // screenX会有导航栏高度的偏移

  var y = e.y || e.screenY;
  window[LAST_X_KEY] = x;
  window[LAST_Y_KEY] = y;
  timer = setTimeout(function () {
    window[LAST_X_KEY] = undefined;
    window[LAST_Y_KEY] = undefined;
  }, 500);
}
/**
 * 记录点击位置
 * */


function registerPositionSave() {
  window.removeEventListener('click', windowClickHandle, true); // 启用事件捕获防止某个元素事件冒泡导致事件不触发

  window.addEventListener('click', windowClickHandle, true);
}

function useMethods(share) {
  var instances = share.instances,
      clickAwayClosable = share.clickAwayClosable,
      namespace = share.namespace,
      mask = share.mask,
      show = share.show,
      cIndex = share.cIndex,
      contRef = share.contRef,
      alignment = share.alignment,
      setPos = share.setPos,
      setShow = share.setShow,
      onClose = share.onClose,
      triggerNode = share.triggerNode,
      modalSize = share.modalSize,
      self = share.self;
  /** 从传入的same instance中获取namespace相同的，只有它们才有比较的价值 */

  function realSameInstance(ins) {
    return ins.filter(function (item) {
      return item.meta.namespace = namespace;
    });
  }
  /** 根据该组件所有已渲染实例判断是否应开启mask */


  function maskShouldShow() {
    if (!mask || !show) return false; // 当前实例之前所有实例组成的数组

    var before = instances.slice(0, cIndex); // 在该实例之前是否有任意一个实例包含mask

    var beforeHasMask = realSameInstance(before).some(function (item) {
      return item.meta.mask;
    });
    return !beforeHasMask;
  }
  /** 根据前后实例判断是否需要触发Away点击关闭 */


  function shouldTriggerClose() {
    if (!show || !clickAwayClosable) return false;
    var afterInstance = instances.slice(cIndex + 1);
    var afterHasAwayClosable = realSameInstance(afterInstance).some(function (item) {
      return item.meta.clickAwayClosable;
    });
    return !afterHasAwayClosable;
  }
  /** 屏幕尺寸改变/容器尺寸改变时调用 */


  function calcPos() {
    // useMeasure获取的尺寸是无边框尺寸，这里手动获取带边框等的实际尺寸
    var w = contRef.current ? contRef.current.offsetWidth : modalSize[0];
    var h = contRef.current ? contRef.current.offsetHeight : modalSize[1];
    var screenMeta = [window.innerWidth - w, window.innerHeight - h];
    var pos = calcAlignment(alignment, screenMeta);
    setPos(pos);

    var _pos = _slicedToArray(pos, 2),
        x = _pos[0],
        y = _pos[1];

    self.px = x;
    self.py = y;
  }
  /** 在未被阻止时关闭此Modal */


  function close() {
    if (share.refState.shouldTriggerClose) {
      setShow(false);
      onClose === null || onClose === void 0 ? void 0 : onClose();
    }
  }
  /** 启用Modal */


  function open() {
    setShow(true);
  }
  /** triggerNode事件绑定器 */


  function onTriggerNodeClick(e) {
    var _triggerNode$props, _triggerNode$props$on;

    triggerNode === null || triggerNode === void 0 ? void 0 : (_triggerNode$props = triggerNode.props) === null || _triggerNode$props === void 0 ? void 0 : (_triggerNode$props$on = _triggerNode$props.onClick) === null || _triggerNode$props$on === void 0 ? void 0 : _triggerNode$props$on.call(_triggerNode$props, e);
    share.refState.show ? close() : open();
  }

  return {
    maskShouldShow: maskShouldShow,
    shouldTriggerClose: shouldTriggerClose,
    calcPos: calcPos,
    close: close,
    open: open,
    onTriggerNodeClick: onTriggerNodeClick
  };
}

/** model的默认位置 */

var DEFAULT_ALIGN = [0.5, 0.5];
/* NO-SSR */

registerPositionSave();

var _ModalBase = function _ModalBase(props) {
  var _props$namespace = props.namespace,
      namespace = _props$namespace === void 0 ? 'MODAL' : _props$namespace,
      _props$alignment = props.alignment,
      alignment = _props$alignment === void 0 ? DEFAULT_ALIGN : _props$alignment,
      _props$mask = props.mask,
      mask = _props$mask === void 0 ? true : _props$mask,
      maskClassName = props.maskClassName,
      maskTheme = props.maskTheme,
      _props$animationType = props.animationType,
      animationType = _props$animationType === void 0 ? 'fromMouse' : _props$animationType,
      _props$mountOnEnter = props.mountOnEnter,
      mountOnEnter = _props$mountOnEnter === void 0 ? true : _props$mountOnEnter,
      _props$unmountOnExit = props.unmountOnExit,
      unmountOnExit = _props$unmountOnExit === void 0 ? false : _props$unmountOnExit,
      _props$clickAwayClosa = props.clickAwayClosable,
      clickAwayClosable = _props$clickAwayClosa === void 0 ? true : _props$clickAwayClosa,
      _props$lockScroll = props.lockScroll,
      lockScroll = _props$lockScroll === void 0 ? true : _props$lockScroll,
      className = props.className,
      style = props.style,
      onClose = props.onClose,
      children = props.children,
      triggerNode = props.triggerNode,
      _props$baseZIndex = props.baseZIndex,
      baseZIndex = _props$baseZIndex === void 0 ? Z_INDEX_MODAL : _props$baseZIndex,
      _props$animationConfi = props.animationConfig,
      animationConfig = _props$animationConfi === void 0 ? config.stiff : _props$animationConfi,
      alpha = props.alpha,
      innerRef = props.innerRef;

  var _contRef = useRef(null);
  /** 内容区域容器 */


  var contRef = innerRef || _contRef;
  /** 代理defaultShow/show/onChange, 实现对应接口 */

  var _useFormState = useFormState(props, false, {
    defaultValueKey: 'defaultShow',
    triggerKey: 'onChange',
    valueKey: 'show'
  }),
      _useFormState2 = _slicedToArray(_useFormState, 2),
      show = _useFormState2[0],
      setShow = _useFormState2[1];
  /** 延迟设置为false的show，用于防止组件从实例列表中被生硬的移除(会打乱zIndex/动画状态等 ) */


  var delayShow = useDelayDerivedToggleStatus(show, 200, {
    trailing: true,
    leading: false
  });
  /** 管理所有show为true的Modal组件 */

  var _useSameState = useSameState('fr_modal_metas', {
    enable: delayShow,
    meta: {
      mask: mask,
      clickAwayClosable: clickAwayClosable,
      namespace: namespace
    }
  }),
      _useSameState2 = _slicedToArray(_useSameState, 2),
      cIndex = _useSameState2[0],
      instances = _useSameState2[1];
  /** 当前组件应该显示的zIndex */


  var nowZIndex = cIndex === -1 ? baseZIndex : cIndex + baseZIndex;
  /** 监听容器大小变更 */

  var _useMeasure = useMeasure(),
      _useMeasure2 = _slicedToArray(_useMeasure, 2),
      bind = _useMeasure2[0],
      _useMeasure2$ = _useMeasure2[1],
      width = _useMeasure2$.width,
      height = _useMeasure2$.height;
  /** 内容区域的xy坐标 */


  var _useState = useState([0, 0]),
      _useState2 = _slicedToArray(_useState, 2),
      pos = _useState2[0],
      setPos = _useState2[1];

  var self = useSelf({
    /* ======== 用于fromMouse实现 ========= */

    /** 缓存的鼠标最后点击x、y轴位置 */
    x: 0,
    y: 0,

    /** 缓存的元素位置信息 */
    px: 0,
    py: 0,

    /** 缓存_FR_LAST_CLICK_POSITION_X, 用于无点时特殊设置入场离场动画  */
    pointX: 0,
    pointY: 0,

    /** 缓存动画起始位置，用于离场时作为目标位置 */
    startXPos: 0,
    startYPos: 0
  });
  var share = {
    cIndex: cIndex,
    instances: instances,
    namespace: namespace,
    mask: mask,
    show: show,
    clickAwayClosable: clickAwayClosable,
    contRef: contRef,
    alignment: alignment,
    setPos: setPos,
    refState: null,
    setShow: setShow,
    onClose: onClose,
    triggerNode: triggerNode,
    lockScroll: lockScroll,
    modalSize: [width, height],
    props: props,
    self: self,
    mountOnEnter: mountOnEnter,
    unmountOnExit: unmountOnExit,
    animationConfig: animationConfig
  };
  var methods = useMethods(share);
  useLifeCycle(share, methods);
  /** ref化一些状态，方便读取 */

  share.refState = useRefize({
    show: show,
    maskShouldShow: methods.maskShouldShow(),
    shouldTriggerClose: methods.shouldTriggerClose()
  });
  var isFromMouse = animationType === 'fromMouse';

  var _useFromMouse = useFromMouse(share, methods, isFromMouse),
      _useFromMouse2 = _slicedToArray(_useFromMouse, 2),
      sp = _useFromMouse2[0],
      mount = _useFromMouse2[1];

  function renderCont() {
    if (isFromMouse) {
      return mount && /*#__PURE__*/React.createElement(animated.div, {
        ref: contRef,
        className: cls('m78-modal', className),
        style: _objectSpread(_objectSpread({}, style), {}, {
          left: pos[0],
          top: pos[1],
          zIndex: nowZIndex,
          transform: interpolate( //  @ts-ignore
          [sp.x, sp.y, sp.scale], function (x, y, scale) {
            return "translate3d(".concat(x, "px,").concat(y, "px,0px) scale3d(").concat(scale, ",").concat(scale, ",").concat(scale, ")");
          }),
          //  @ts-ignore
          opacity: sp.opacity
        })
      }, /*#__PURE__*/React.createElement("div", {
        className: "m78-modal_calc-node",
        ref: bind
      }), children);
    }

    return /*#__PURE__*/React.createElement(Transition, {
      toggle: show,
      type: animationType,
      config: animationConfig,
      mountOnEnter: mountOnEnter,
      unmountOnExit: unmountOnExit,
      innerRef: contRef,
      className: cls('m78-modal', className),
      alpha: alpha,
      style: _objectSpread(_objectSpread({}, style), {}, {
        left: pos[0],
        top: pos[1],
        zIndex: nowZIndex
      })
    }, /*#__PURE__*/React.createElement("div", {
      className: "m78-modal_calc-node",
      ref: bind
    }), children);
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, triggerNode && /*#__PURE__*/React.cloneElement(triggerNode, {
    onClick: methods.onTriggerNodeClick
  }), /*#__PURE__*/React.createElement(Portal, {
    namespace: namespace
  }, share.refState.maskShouldShow && mask && /*#__PURE__*/React.createElement(Transition // 有遮罩时点击遮罩来关闭
  , {
    onClick: clickAwayClosable ? methods.close : undefined,
    toggle: show,
    type: "fade",
    mountOnEnter: true,
    unmountOnExit: true,
    className: cls(maskTheme === 'dark' ? 'm78-mask-b' : 'm78-mask', maskClassName),
    style: {
      zIndex: nowZIndex
    },
    reset: true
  }), renderCont()));
};

var api = createRenderApi(_ModalBase, {
  namespace: 'MODAL'
});

var baseApi = function baseApi(_ref) {
  var content = _ref.content,
      other = _objectWithoutProperties(_ref, ["content"]);

  return api(_objectSpread(_objectSpread({}, other), {}, {
    children: content,
    triggerNode: null
  }));
};

var Modal = Object.assign(_ModalBase, {
  api: baseApi
});

export default Modal;
