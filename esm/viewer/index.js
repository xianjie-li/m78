import '@lxjx/fr/esm/viewer/style';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import React, { useRef, useImperativeHandle, useEffect } from 'react';
import { useMeasure } from 'react-use';
import { useSpring, config, animated, interpolate } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import _clamp from 'lodash/clamp';
import { useSelf } from '@lxjx/hooks';

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
      wheel = _ref$wheel === void 0 ? true : _ref$wheel;

  var _useMeasure = useMeasure(),
      _useMeasure2 = _slicedToArray(_useMeasure, 2),
      wrap = _useMeasure2[0],
      _useMeasure2$ = _useMeasure2[1],
      width = _useMeasure2$.width,
      height = _useMeasure2$.height;

  var innerWrap = useRef(null);
  var eventEl = useRef(null);

  var _useSpring = useSpring(function () {
    return initSpring;
  }),
      _useSpring2 = _slicedToArray(_useSpring, 2),
      sp = _useSpring2[0],
      set = _useSpring2[1];

  var self = useSelf(_objectSpread(_objectSpread({}, initSpring), {}, {
    /* 这三个开关只作用于组件内部，不与prop上的同名属性相关, 因为某些情况下需要在不触发组件render的情况下更改状态 */
    drag: true,
    pinch: true,
    wheel: true
  }));
  var scaleMin = scaleBound[0],
      scaleMax = scaleBound[1];
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
          _ref2$delta = _slicedToArray(_ref2.delta, 2),
          offsetX = _ref2$delta[0],
          offsetY = _ref2$delta[1];

      event === null || event === void 0 ? void 0 : event.preventDefault();
      if (!self.drag) return;
      var boundX;
      var boundXMax;
      var boundY;
      var boundYMax;

      if (bound) {
        var boundNode;

        if ('getBoundingClientRect' in bound) {
          boundNode = bound;
        } else {
          boundNode = bound.current;
        }

        var bound1 = boundNode.getBoundingClientRect();
        var bound2 = innerWrap.current.getBoundingClientRect();
        boundY = -(bound2.top - bound1.top);
        boundYMax = -(bound2.bottom - bound1.bottom);
        boundX = -(bound2.left - bound1.left);
        boundXMax = -(bound2.right - bound1.right);
      } else {
        boundXMax = width * self.scale;
        boundX = -boundXMax;
        boundYMax = height * self.scale;
        boundY = -boundYMax;
      }

      self.x = _clamp(self.x + offsetX, boundX, boundXMax);
      self.y = _clamp(self.y + offsetY, boundY, boundYMax);
      set({
        x: self.x,
        y: self.y,
        config: {
          mass: 3,
          tension: 350,
          friction: 40
        }
      });
    },
    onPinchStart: disableDrag,
    onPinchEnd: enableDrag,
    onPinch: function onPinch(_ref3) {
      var _ref3$direction = _slicedToArray(_ref3.direction, 1),
          direct = _ref3$direction[0],
          _ref3$delta = _slicedToArray(_ref3.delta, 2),
          y = _ref3$delta[1];

      self.scale = getScale(direct, 0.06);
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
    enabled: !disabled,
    drag: drag,
    pinch: pinch,
    wheel: wheel,
    domTarget: eventEl,
    event: {
      passive: false
    }
  });
  useEffect(bind, [bind]);

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
  /** 根据传入的缩放比返回一个限定边界的缩放比 */


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

  return /*#__PURE__*/React.createElement("div", {
    ref: wrap,
    className: "fr-viewer",
    id: "t-inner"
  }, /*#__PURE__*/React.createElement("div", {
    ref: innerWrap
  }, ' ', /*#__PURE__*/React.createElement(animated.div, {
    ref: eventEl,
    className: "fr-viewer_cont",
    style: {
      transform: interpolate( //  @ts-ignore
      [sp.x, sp.y, sp.scale, sp.rotateZ], //  @ts-ignore
      function (x, y, scale, rotateZ) {
        return "translate3d(".concat(x, "px, ").concat(y, "px, 0px) scale(").concat(scale, ") rotateZ(").concat(rotateZ, "deg)");
      })
    }
  }, children)));
});

export default Viewer;
