import 'm78/viewer/style';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import React, { useRef, useImperativeHandle, useEffect } from 'react';
import { useSpring, config, animated, to } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import _clamp from 'lodash/clamp';
import { useSelf, useSetState } from '@lxjx/hooks';
import { getBoundMeta } from 'm78/viewer/utils';
import cls from 'classnames';

var scaleBound = [0.5, 3];
var initSpring = {
  scale: 1,
  rotateZ: 0,
  x: 0,
  y: 0
};
var Viewer = /*#__PURE__*/React.forwardRef(function (_ref, ref) {
  var children = _ref.children,
      _ref$disabled = _ref.disabled,
      disabled = _ref$disabled === void 0 ? false : _ref$disabled,
      bound = _ref.bound,
      _ref$drag = _ref.drag,
      drag = _ref$drag === void 0 ? true : _ref$drag,
      _ref$pinch = _ref.pinch,
      pinch = _ref$pinch === void 0 ? true : _ref$pinch,
      _ref$wheel = _ref.wheel,
      wheel = _ref$wheel === void 0 ? true : _ref$wheel,
      className = _ref.className,
      style = _ref.style;
  var innerWrap = useRef(null);
  var eventEl = useRef(null);

  var _useSpring = useSpring(function () {
    return initSpring;
  }),
      _useSpring2 = _slicedToArray(_useSpring, 2),
      sp = _useSpring2[0],
      set = _useSpring2[1];

  var self = useSelf(_objectSpread(_objectSpread({}, initSpring), {}, {
    /* 这三个开关只作用于组件内部，不与prop上的同名属性相关, 因为某些情况下需要在不触发组件render的情况下更改状态(提升性能) */
    drag: true,
    pinch: true,
    wheel: true,

    /** 手势结束并重启drag的计时器 */
    pinchTimer: null
  }));
  var scaleMin = scaleBound[0],
      scaleMax = scaleBound[1];

  var _useSetState = useSetState({
    bound: undefined
  }),
      _useSetState2 = _slicedToArray(_useSetState, 2),
      state = _useSetState2[0],
      setState = _useSetState2[1];

  useImperativeHandle(ref, function () {
    return {
      setRotate: setRotate,
      setScale: setScale,
      reset: reset,
      instance: self
    };
  });
  var bind = useGesture({
    onDrag: function onDrag(_ref2) {
      var event = _ref2.event,
          _ref2$movement = _slicedToArray(_ref2.movement, 2),
          offsetX = _ref2$movement[0],
          offsetY = _ref2$movement[1],
          first = _ref2.first;

      event === null || event === void 0 ? void 0 : event.preventDefault();
      if (!self.drag) return;

      if (first) {
        refreshBound();
      }

      self.x = offsetX;
      self.y = offsetY;
      set({
        x: self.x,
        y: self.y,
        config: config["default"]
      });
    },
    onPinchStart: disableDrag,
    onPinchEnd: function onPinchEnd() {
      // 防止pinch结束后收到drag影响移动位置
      clearTimeout(self.pinchTimer);
      self.pinchTimer = setTimeout(function () {
        enableDrag();
      }, 100);
    },
    onPinch: function onPinch(_ref3) {
      var _ref3$direction = _slicedToArray(_ref3.direction, 1),
          direct = _ref3$direction[0],
          _ref3$delta = _slicedToArray(_ref3.delta, 2),
          y = _ref3$delta[1];

      self.scale = getScale(direct, 0.03);
      self.rotateZ += y;
      set({
        rotateZ: self.rotateZ,
        scale: self.scale,
        config: {
          mass: 1,
          tension: 150,
          friction: 17
        }
      });
    },
    onWheelStart: disableDrag,
    onWheelEnd: enableDrag,
    onWheel: function onWheel(_ref4) {
      var event = _ref4.event,
          _ref4$direction = _slicedToArray(_ref4.direction, 2),
          direct = _ref4$direction[1];

      event === null || event === void 0 ? void 0 : event.preventDefault();
      self.scale = getScale(direct, 0.16);
      set({
        scale: self.scale,
        config: config.stiff
      });
    }
  }, {
    domTarget: eventEl,
    enabled: !disabled,
    drag: {
      enabled: drag,
      bounds: state.bound,
      rubberband: true,
      initial: function initial() {
        return [self.x, self.y];
      }
    },
    pinch: {
      enabled: pinch
    },
    wheel: {
      enabled: wheel
    },
    eventOptions: {
      passive: false
    }
  });
  useEffect(bind, [bind]);
  /** 根据缩放方向和缩放值返回一个在合法缩放区域的缩放值 */

  function getScale(direct, value) {
    var diff = direct > 0 ? +value : -value;
    var scale = Math.round((self.scale + diff) * 100) / 100; // 去小数

    scale = _clamp(scale, scaleMin, scaleMax);
    return scale;
  }

  function disableDrag() {
    self.drag = false;
  }

  function enableDrag() {
    self.drag = true;
  }

  function setScale(scale) {
    if (disabled) return;
    self.scale = _clamp(scale, scaleMin, scaleMax);
    set({
      scale: self.scale
    });
  }

  function setRotate(rotate) {
    if (disabled) return;
    set({
      rotateZ: self.rotateZ += rotate,
      config: config.slow
    });
  }

  function reset() {
    if (disabled) return;
    set({
      scale: self.scale = initSpring.scale,
      rotateZ: self.rotateZ = initSpring.rotateZ,
      x: self.x = initSpring.x,
      y: self.y = initSpring.y
    });
  }

  function refreshBound() {
    if (!bound || !innerWrap.current) return;
    var boundNode;

    if ('getBoundingClientRect' in bound) {
      boundNode = bound;
    } else {
      boundNode = bound.current;
    }

    if (!boundNode) return;
    var boundMeta = getBoundMeta(boundNode, innerWrap.current);
    if (boundMeta === state.bound) return;
    setState({
      bound: boundMeta
    });
  }

  return /*#__PURE__*/React.createElement("div", {
    ref: innerWrap,
    className: cls('m78-viewer', className),
    style: style
  }, /*#__PURE__*/React.createElement(animated.div, {
    ref: eventEl,
    className: "m78-viewer_cont",
    style: {
      transform: to([sp.x, sp.y, sp.scale, sp.rotateZ], function (x, y, scale, rotateZ) {
        return "translate3d(".concat(x, "px, ").concat(y, "px, 0px) scale(").concat(scale, ") rotateZ(").concat(rotateZ, "deg)");
      })
    }
  }, children));
});

export default Viewer;
