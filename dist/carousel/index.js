import 'm78/carousel/style';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import React, { useRef, useState, useEffect, useImperativeHandle } from 'react';
import { useMeasure, useUpdate, useInterval } from 'react-use';
import { useSpring, animated } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import _clamp from 'lodash/clamp';
import cls from 'clsx';
import { dumpFn } from '@lxjx/utils';
import { useSelf } from '@lxjx/hooks';

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
      onWillChange = _ref$onWillChange === void 0 ? dumpFn : _ref$onWillChange,
      _ref$noScale = _ref.noScale,
      noScale = _ref$noScale === void 0 ? false : _ref$noScale,
      _ref$invisibleUnmount = _ref.invisibleUnmount,
      invisibleUnmount = _ref$invisibleUnmount === void 0 ? false : _ref$invisibleUnmount,
      _ref$invisibleHidden = _ref.invisibleHidden,
      invisibleHidden = _ref$invisibleHidden === void 0 ? false : _ref$invisibleHidden,
      noShadow = _ref.noShadow;

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


  var innerWrap = useRef(null);
  var calcNodeRef = useRef(null); // 决定每页的尺寸

  var size = vertical ? height : width; // 当前页码，当为loop时，所有页码的基准值要+1

  var page = useRef(loopValid ? initPage + 1 : initPage);
  var self = useSelf({
    // 为true时，drag的动画设置阶段跳过
    disabledDrag: false
  }); // 切换动画相关

  var _useSpring = useSpring(function () {
    return {
      offset: page.current * size,
      scale: 1,
      config: {
        clamp: true
      },
      reset: false
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
    goTo(page.current, true);
  }, [size]);
  useEffect(function childChange() {
    page.current = loopValid ? initPage + 1 : initPage;
    goTo(page.current, true);
    preventImageDrag();
  }, [children.length]);
  useEffect(function mount() {
    pageChange(page.current, true); // eslint-disable-next-line
  }, []);
  useImperativeHandle(ref, function () {
    return {
      prev: prev,
      next: next,
      goTo: function (_goTo) {
        function goTo(_x, _x2) {
          return _goTo.apply(this, arguments);
        }

        goTo.toString = function () {
          return _goTo.toString();
        };

        return goTo;
      }(function (currentPage, im) {
        goTo(loopValid ? currentPage + 1 : currentPage, im);
      })
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
      var down = _ref2.down,
          _ref2$movement = _slicedToArray(_ref2.movement, 2),
          xMove = _ref2$movement[0],
          yMove = _ref2$movement[1],
          _ref2$direction = _slicedToArray(_ref2.direction, 2),
          xDirect = _ref2$direction[0],
          yDirect = _ref2$direction[1],
          cancel = _ref2.cancel,
          first = _ref2.first;

      var direct = vertical ? yDirect : xDirect;
      var move = vertical ? yMove : xMove;
      var distance = Math.abs(move);
      var aXMove = Math.abs(xMove);
      var aYMove = Math.abs(yMove); // 如果拖动方向明确与滚动反向相反(大于5), 则停止后续事件触发

      if (aYMove > 5 || aXMove > 5) {
        if (!vertical && aYMove > aXMove || vertical && aXMove > aYMove) {
          cancel();
          distance = 0;
          move = 0;
        }
      }

      if (down && distance > size / 2) {
        cancel();
        stopAutoPlay();
        direct < 0 ? next() : prev();
        return;
      }

      var firstLoopHandle = loopValid && first && page.current === 0;
      var lastLoopHandle = loopValid && first && page.current === children.length - 1;
      /* loop 处理 */

      if (firstLoopHandle) {
        loopHandle(children.length - 2);
        return;
      }

      if (lastLoopHandle) {
        loopHandle(1);
        return;
      }

      function loopHandle(nextPage) {
        self.disabledDrag = true;
        var o = page.current * size + spProp.offset.get();
        animate(-(nextPage * size - o));
        page.current = nextPage;
      }

      function animate(cOffset) {
        set({
          offset: cOffset || -(page.current * size + (down ? -move : 0)),
          immediate: !!cOffset || false,
          scale: down ? 1 - distance / size / 2 : 1,
          // 收缩比例为在元素上滚动距离相对于元素本身的比例
          "default": true,
          onRest: function onRest() {
            if (cOffset) {
              self.disabledDrag = false;
            }
          }
        });
      }

      if (self.disabledDrag) return;
      animate();
    },
    onWheel: function onWheel(_ref3) {
      var event = _ref3.event,
          memo = _ref3.memo,
          _ref3$direction = _slicedToArray(_ref3.direction, 2),
          directY = _ref3$direction[1],
          timeStamp = _ref3.timeStamp;

      event === null || event === void 0 ? void 0 : event.preventDefault();
      if (memo) return;
      directY < 0 ? prev() : next();
      stopAutoPlay();
      return timeStamp;
    },
    onHover: function onHover(_ref4) {
      var hovering = _ref4.hovering;
      hovering && stopAutoPlay();
    }
  }, {
    domTarget: innerWrap,
    wheel: {
      enabled: wheel
    },
    drag: {
      enabled: drag
    },
    eventOptions: {
      passive: false
    }
  });
  useEffect(bind, [bind]);
  /** 跳转至上一页 */

  function prev() {
    if (loopValid && page.current === 0) {
      goTo(children.length - 2, true, function () {
        goTo(calcPage(page.current - 1));
      });
      return;
    }

    goTo(calcPage(page.current - 1));
  }
  /** 跳转至下一页 */


  function next() {
    if (loopValid && page.current === children.length - 1) {
      goTo(1, true, function () {
        goTo(calcPage(page.current + 1));
      });
      return;
    }

    goTo(calcPage(page.current + 1));
  }
  /**
   * @description - 跳转到指定页
   * @param currentPage - 待调跳转的页面
   * @param immediate - 跳过动画
   * @param onRest - 动画完成
   * */


  function goTo(currentPage) {
    var immediate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var _onRest = arguments.length > 2 ? arguments[2] : undefined;

    currentPage = calcPage(currentPage);

    if (!immediate && currentPage !== page.current) {
      pageChange(currentPage);
    }

    page.current = currentPage;
    set({
      offset: -(currentPage * size),
      scale: 1,
      immediate: immediate,
      "default": true,
      // 必须要每次都传入防止继承
      onRest: function onRest() {
        _onRest && _onRest();
      }
    });
    update();
  }
  /** 防止上下页超出页码区间 */


  function calcPage(nextPage) {
    return _clamp(nextPage, 0, children.length - 1);
  }
  /** 根据指定页码计算实际页码，用于处理开启loop后页面顺序错乱的问题 */


  function getPageNumber(currentPage) {
    if (!loopValid) {
      return currentPage;
    }

    if (currentPage === 0) return children.length - 3;
    if (currentPage === children.length - 1) return 0;
    return currentPage - 1;
  }

  function pageChange(currentPage, first) {
    if (invisibleUnmount) {
      preventImageDrag();
    }

    onChange && onChange(getPageNumber(currentPage), !!first);
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

  function renderItem(item, i) {
    // 是否需要render，取决于invisibleUnmount和当前页面
    var needMount = true;
    var renderNode = item;

    if (invisibleUnmount || invisibleHidden) {
      var pInd = getPageNumber(page.current); // 启用了loop且为前两页和后两页

      var isLoopAndFirstOrLast = loopValid && (i <= 1 || i >= children.length - 2); // 不在前一页或后一页之间(根据loop状态调整)

      var notBeforeAfterBetween = i < pInd - (loopValid ? 0 : 1) || i > pInd + (loopValid ? 2 : 1);
      var pass = !notBeforeAfterBetween || isLoopAndFirstOrLast;

      if (invisibleUnmount) {
        needMount = pass;
      }

      if (invisibleHidden && !pass && /*#__PURE__*/React.isValidElement(item)) {
        renderNode = /*#__PURE__*/React.cloneElement(item, {
          style: _objectSpread(_objectSpread({}, item.props.style), {}, {
            display: 'none'
          })
        });
      }
    }

    return /*#__PURE__*/React.createElement(animated.div, {
      key: i,
      className: "m78-carousel_item",
      style: {
        height: vertical ? _height : undefined,
        zIndex: page.current === i ? 1 : 0,
        transform: noScale ? undefined : spProp.scale.to(function (_scale) {
          /* 指定当前不参与动画的页 */
          var skip = i < page.current - 1 || i > page.current + 1;
          return "scale(".concat(skip ? 1 : _scale, ")");
        })
      }
    }, needMount && renderNode);
  }
  /** 禁止内部图片拖动 */


  function preventImageDrag() {
    if (!innerWrap.current) return; // /* 解决图片的拖动问题 */

    Array.from(innerWrap.current.querySelectorAll('img')).forEach(function (item) {
      // 直接覆盖item.ondragstart可以省略事件移除步骤
      item.ondragstart = function (e) {
        return e.preventDefault();
      };
    });
  }

  return /*#__PURE__*/React.createElement("div", {
    className: cls('m78-carousel', className, {
      __vertical: vertical,
      __noShadow: noShadow
    }),
    ref: wrapRef,
    style: _objectSpread({
      height: vertical ? _height : 'auto',
      width: _width || 'auto'
    }, style)
  }, /*#__PURE__*/React.createElement("div", {
    ref: calcNodeRef,
    className: "m78-carousel_calc-node"
  }), /*#__PURE__*/React.createElement(animated.div, {
    className: "m78-carousel_wrap",
    ref: innerWrap,
    style: {
      transform: spProp.offset.to(function (_offset) {
        return "translate3d(".concat(vertical ? "0,".concat(_offset, "px") : "".concat(_offset, "px,0"), ",0)");
      })
    }
  }, children.map(renderItem)), control && /*#__PURE__*/React.createElement("div", {
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
        __active: i === getPageNumber(page.current)
      })
    });
  }) : /*#__PURE__*/React.createElement("span", {
    className: "m78-carousel_ctrl-text"
  }, getPageNumber(page.current) + 1, " /", ' ', loopValid ? children.length - 2 : children.length)));
});
Carousel.displayName = 'Carousel';

export { Carousel };
