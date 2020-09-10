import 'm78/carousel/style';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import React, { useRef, useState, useEffect, useImperativeHandle } from 'react';
import { useMeasure, useUpdate, useInterval } from 'react-use';
import { useSpring, animated } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import _clamp from 'lodash/clamp';
import cls from 'classnames';
import { dumpFn } from '@lxjx/utils';

/** 当开启loop时，将children转换为指定的格式, 第一位和最后一位分别赋值到首尾 */
function loopChildrenHandle(children, loop) {
  if (children.length < 2 || !loop) return [children, false];

  var _child = React.Children.toArray(children);

  _child.push( /*#__PURE__*/React.cloneElement(children[0]));

  _child.unshift( /*#__PURE__*/React.cloneElement(children[children.length - 1]));

  return [_child, true];
}

var Carousel = /*#__PURE__*/React.forwardRef(function (_ref, ref) {
  var _children = _ref.children,
      _ref$vertical = _ref.vertical,
      vertical = _ref$vertical === void 0 ? false : _ref$vertical,
      _height = _ref.height,
      _width = _ref.width,
      _ref$loop = _ref.loop,
      loop = _ref$loop === void 0 ? true : _ref$loop,
      _ref$control = _ref.control,
      control = _ref$control === void 0 ? true : _ref$control,
      _ref$forceNumberContr = _ref.forceNumberControl,
      forceNumberControl = _ref$forceNumberContr === void 0 ? false : _ref$forceNumberContr,
      _ref$initPage = _ref.initPage,
      initPage = _ref$initPage === void 0 ? 0 : _ref$initPage,
      onChange = _ref.onChange,
      _ref$autoplay = _ref.autoplay,
      autoplay = _ref$autoplay === void 0 ? 0 : _ref$autoplay,
      style = _ref.style,
      className = _ref.className,
      _ref$wheel = _ref.wheel,
      wheel = _ref$wheel === void 0 ? true : _ref$wheel,
      _ref$drag = _ref.drag,
      drag = _ref$drag === void 0 ? true : _ref$drag,
      _ref$onWillChange = _ref.onWillChange,
      onWillChange = _ref$onWillChange === void 0 ? dumpFn : _ref$onWillChange;

  // 格式化children为适合loop的格式，后面一律以loopValid决定是否开启了loop
  var _loopChildrenHandle = loopChildrenHandle(_children, loop),
      _loopChildrenHandle2 = _slicedToArray(_loopChildrenHandle, 2),
      children = _loopChildrenHandle2[0],
      loopValid = _loopChildrenHandle2[1]; // 获取包裹元素的尺寸等信息


  var _useMeasure = useMeasure(),
      _useMeasure2 = _slicedToArray(_useMeasure, 2),
      wrapRef = _useMeasure2[0],
      _useMeasure2$ = _useMeasure2[1],
      width = _useMeasure2$.width,
      height = _useMeasure2$.height; // 用于阻止轮播组件内图片的drag操作


  var innerWrap = useRef(null); // 决定每页的尺寸

  var size = vertical ? height : width; // 当前页码，当为loop时，所有页码的基准值要+1

  var page = useRef(loopValid ? initPage + 1 : initPage); // 切换动画相关

  var _useSpring = useSpring(function () {
    return {
      offset: page.current * size,
      scale: 1,
      config: {
        clamp: true
      }
    };
  }),
      _useSpring2 = _slicedToArray(_useSpring, 2),
      spProp = _useSpring2[0],
      set = _useSpring2[1];

  var update = useUpdate(); // 延迟时间，为0时停止

  var _useState = useState(autoplay),
      _useState2 = _slicedToArray(_useState, 2),
      delay = _useState2[0],
      setDelay = _useState2[1]; // 自动轮播计时器


  var autoPlayFlag = useRef();
  _height = _height || 0;
  useEffect(function resize() {
    goTo(page.current, true); // eslint-disable-next-line
  }, [size]);
  useEffect(function childChange() {
    page.current = loopValid ? initPage + 1 : initPage;
    goTo(page.current, true); // /* 解决图片的拖动问题 */
    // Array.from(innerWrap.current.querySelectorAll('img')).forEach(item => {
    //   item.setAttribute('draggable', 'false');
    // });
  }, [children.length]);
  useEffect(function mount() {
    pageChange(page.current, true); // eslint-disable-next-line
  }, []);
  useImperativeHandle(ref, function () {
    return {
      prev: prev,
      next: next,
      goTo: goTo
    };
  });
  useInterval(function autoPlayHandle() {
    next();
  }, delay > 0 ? delay : null);
  var bind = useGesture({
    onDragStart: function onDragStart() {
      onWillChange();
    },
    onWheelStart: function onWheelStart() {
      onWillChange();
    },
    onDrag: function onDrag(_ref2) {
      var event = _ref2.event,
          down = _ref2.down,
          _ref2$movement = _slicedToArray(_ref2.movement, 2),
          xMove = _ref2$movement[0],
          yMove = _ref2$movement[1],
          _ref2$direction = _slicedToArray(_ref2.direction, 2),
          xDirect = _ref2$direction[0],
          yDirect = _ref2$direction[1],
          cancel = _ref2.cancel,
          first = _ref2.first;

      event === null || event === void 0 ? void 0 : event.stopPropagation();
      event === null || event === void 0 ? void 0 : event.preventDefault();
      var move = vertical ? yMove : xMove;
      var distance = Math.abs(move);
      var direct = vertical ? yDirect : xDirect;

      if (down && distance > size / 2) {
        cancel();
        stopAutoPlay();
        direct < 0 ? next() : prev();
      }
      /* loop 处理 */


      if (loopValid && first && page.current === 0) {
        goTo(children.length - 2, true);
      }

      if (loopValid && first && page.current === children.length - 1) {
        goTo(1, true);
      }

      set({
        offset: -(page.current * size + (down ? -move : 0)),
        immediate: false,
        scale: down ? 1 - distance / size / 2 : 1 // 收缩比例为在元素上滚动距离相对于元素本身的比例

      });
    },
    // eslint-disable-next-line
    onWheel: function onWheel(_ref3) {
      var event = _ref3.event,
          memo = _ref3.memo,
          _ref3$direction = _slicedToArray(_ref3.direction, 2),
          directY = _ref3$direction[1],
          time = _ref3.time;

      event === null || event === void 0 ? void 0 : event.preventDefault();
      if (memo) return;
      directY < 0 ? prev() : next();
      stopAutoPlay();
      return time;
    },
    onHover: function onHover(_ref4) {
      var hovering = _ref4.hovering;
      hovering && stopAutoPlay();
    }
  }, {
    domTarget: innerWrap,
    wheel: wheel,
    drag: drag,
    event: {
      passive: false
    }
  });
  useEffect(bind, [bind]);
  /** 跳转至上一页 */

  function prev() {
    if (loopValid && page.current === 0) {
      goTo(children.length - 2, true);
    }

    goTo(calcPage(page.current - 1));
  }
  /** 跳转至下一页 */


  function next() {
    if (loopValid && page.current === children.length - 1) {
      goTo(1, true);
    }

    goTo(calcPage(page.current + 1));
  }
  /**
   * @description - 跳转到指定页
   * @param currentPage - 待调跳转的页面
   * @param immediate - 跳过动画
   * */


  function goTo(currentPage) {
    var immediate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    currentPage = calcPage(currentPage);

    if (!immediate && currentPage !== page.current) {
      pageChange(currentPage);
    }

    page.current = currentPage;
    update();
    set({
      offset: -(currentPage * size),
      immediate: immediate // onFrame(ds) {
      //   console.log(111, ds);
      // },

    });
  }
  /** 防止上下页超出页码区间 */


  function calcPage(nextPage) {
    return _clamp(nextPage, 0, children.length - 1);
  }
  /** 根据指定页码计算实际页码，用于处理开启loop后页面顺序错乱的问题 */


  function getPagenNmber(currentPage) {
    if (!loopValid) {
      return currentPage;
    }

    if (currentPage === 0) return children.length - 3;
    if (currentPage === children.length - 1) return 0;
    return currentPage - 1;
  }

  function pageChange(currentPage, first) {
    onChange && onChange(getPagenNmber(currentPage), !!first);
  }
  /** 暂时关闭自动轮播 */


  function stopAutoPlay() {
    if (autoplay <= 0 || delay <= 0) return;

    if (autoPlayFlag.current) {
      return;
    }

    setDelay(0);
    autoPlayFlag.current = window.setTimeout(function () {
      setDelay(autoplay);
      autoPlayFlag.current = undefined;
      clearTimeout(autoPlayFlag.current);
    }, 4000);
  }

  return /*#__PURE__*/React.createElement("div", {
    className: cls('m78-carousel', className, {
      __vertical: vertical
    }),
    ref: wrapRef,
    style: _objectSpread({
      height: vertical ? _height : 'auto',
      width: _width || 'auto'
    }, style)
  }, /*#__PURE__*/React.createElement(animated.div, {
    className: "m78-carousel_wrap",
    ref: innerWrap,
    style: {
      transform: spProp.offset.interpolate(function (_offset) {
        return "translate3d(".concat(vertical ? "0,".concat(_offset, "px") : "".concat(_offset, "px,0"), ",0)");
      })
    }
  }, children.map(function (item, i) {
    return /*#__PURE__*/React.createElement(animated.div, {
      key: i,
      className: "m78-carousel_item",
      style: {
        zIndex: page.current === i ? 1 : 0,
        transform: spProp.scale.interpolate(function (_scale) {
          /* 指定当前不参与动画的页 */
          var skip = i < page.current - 1 || i > page.current + 1;
          return "scale(".concat(skip ? 1 : _scale, ")");
        })
      }
    }, item);
  })), control && /*#__PURE__*/React.createElement("div", {
    className: "m78-carousel_ctrl m78-stress"
  }, (_children.length < 7 || vertical) && !forceNumberControl ? children.map(function (v, i) {
    var show = loopValid ? i < children.length - 2 : true;
    return show && /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: function onClick() {
        goTo(loopValid ? i + 1 : i);
        stopAutoPlay();
      },
      className: cls('m78-carousel_ctrl-item', {
        __active: i === getPagenNmber(page.current)
      })
    });
  }) : /*#__PURE__*/React.createElement("span", {
    className: "m78-carousel_ctrl-text"
  }, getPagenNmber(page.current) + 1, " /", ' ', loopValid ? children.length - 2 : children.length)));
});

export default Carousel;
