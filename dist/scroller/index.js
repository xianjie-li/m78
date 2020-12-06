import 'm78/scroller/style';
import _defineProperty from '@babel/runtime/helpers/defineProperty';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import React, { useEffect, useRef, useImperativeHandle } from 'react';
import { useSetState, useSelf, useScroll } from '@lxjx/hooks';
import { useSpring, config, animated, to } from 'react-spring';
import cls from 'classnames';
import { WindmillIcon, ErrorIcon } from 'm78/icon';
import Button from 'm78/button';
import { DirectionEnum } from 'm78/types';
import Spin from 'm78/spin';
import { If } from 'm78/fork';
import { Spacer } from 'm78/layout';
import Empty from 'm78/empty';
import Tips from 'm78/tips';
import BackTop from 'm78/back-top';
import _clamp from 'lodash/clamp';
import { decimalPrecision, getScrollBarWidth, isNumber } from '@lxjx/utils';
import { useGesture } from 'react-use-gesture';
import preventTopPullDown from 'prevent-top-pull-down';

var _pullDownText, _pullUpText;

function rubberFactor(overSize, maxSize) {
  var minFactor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var initFactor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var d = initFactor - overSize / maxSize;
  d = Math.max(d, minFactor);
  if (d < 0) d = 0;
  if (d > 1) d = 1;
  return d;
}
/**
 * 根据移动的offset和可移动总量计算出一个合理的旋转角度
 * @param offset - 当前距离
 * @param max - 最大移动距离
 * @param allTurn - 可选值的总圈数
 * */

function offset2Rotate(offset, max) {
  var allTurn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1.5;
  var oMax = Math.min(359, max);
  var times = 360 / oMax;
  var oneTurn = max * times;
  var all = oneTurn * allTurn;
  var current = offset * times * allTurn;
  return Math.min(current, all);
}
/** 表示下拉刷新的所有阶段 */

var PullDownStatus;
/** 表示上拉加载的所有阶段 */

(function (PullDownStatus) {
  PullDownStatus[PullDownStatus["TIP"] = 0] = "TIP";
  PullDownStatus[PullDownStatus["RELEASE_TIP"] = 1] = "RELEASE_TIP";
  PullDownStatus[PullDownStatus["LOADING"] = 2] = "LOADING";
  PullDownStatus[PullDownStatus["ERROR"] = 3] = "ERROR";
  PullDownStatus[PullDownStatus["SUCCESS"] = 4] = "SUCCESS";
})(PullDownStatus || (PullDownStatus = {}));

var PullUpStatus;
/** 下拉刷新各阶段的提示文本 */

(function (PullUpStatus) {
  PullUpStatus[PullUpStatus["TIP"] = 0] = "TIP";
  PullUpStatus[PullUpStatus["LOADING"] = 1] = "LOADING";
  PullUpStatus[PullUpStatus["NOT_DATA"] = 2] = "NOT_DATA";
  PullUpStatus[PullUpStatus["ERROR"] = 3] = "ERROR";
  PullUpStatus[PullUpStatus["SUCCESS"] = 4] = "SUCCESS";
})(PullUpStatus || (PullUpStatus = {}));

var pullDownText = (_pullDownText = {}, _defineProperty(_pullDownText, PullDownStatus.TIP, '下拉刷新'), _defineProperty(_pullDownText, PullDownStatus.RELEASE_TIP, '松开刷新'), _defineProperty(_pullDownText, PullDownStatus.LOADING, '正在刷新'), _defineProperty(_pullDownText, PullDownStatus.ERROR, '刷新失败'), _defineProperty(_pullDownText, PullDownStatus.SUCCESS, '数据已更新'), _pullDownText);
/** 上拉加载各阶段的提示文本 */

var pullUpText = (_pullUpText = {}, _defineProperty(_pullUpText, PullUpStatus.TIP, '上拉加载更多'), _defineProperty(_pullUpText, PullUpStatus.LOADING, '加载中'), _defineProperty(_pullUpText, PullUpStatus.NOT_DATA, '没有更多了'), _defineProperty(_pullUpText, PullUpStatus.ERROR, '加载失败,'), _defineProperty(_pullUpText, PullUpStatus.SUCCESS, '获取到{num}条新数据'), _pullUpText);

function useMethods(share) {
  var self = share.self,
      state = share.state,
      setState = share.setState,
      props = share.props,
      setSp = share.setSp,
      setPgSp = share.setPgSp,
      setPullDownSp = share.setPullDownSp,
      rootEl = share.rootEl,
      queue = share.queue;
  var soap = props.soap,
      threshold = props.threshold,
      rubber = props.rubber,
      progressBar = props.progressBar,
      scrollFlag = props.scrollFlag,
      hideScrollbar = props.hideScrollbar;
  /** 根据drag信息设置元素的拖动状态 */

  function setDragPos(_ref) {
    var isVertical = _ref.isVertical,
        dey = _ref.dey,
        dex = _ref.dex,
        touchTop = _ref.touchTop,
        touchLeft = _ref.touchLeft,
        touchBottom = _ref.touchBottom,
        touchRight = _ref.touchRight;
    var cDelta = isVertical ? dey : dex;
    var startTouch = isVertical ? touchTop : touchLeft;
    var endTouch = isVertical ? touchBottom : touchRight;
    var posKey = isVertical ? 'memoY' : 'memoX';
    var spKey = isVertical ? 'y' : 'x';
    /** 橡皮滑动最小开始点 */

    var minRubberFactor = threshold - rubber; // 根据滚动距离和方向等状态设置拖动位置, 并在达到阈值时通过rubberFactor设置橡皮筋效果

    if (startTouch) {
      self[posKey] += cDelta * (self[posKey] > minRubberFactor && cDelta > 0
      /* 只在向下/右滑时 */
      ? rubberFactor(self[posKey] - minRubberFactor, threshold, 0.1, soap) : soap);
      self[posKey] = _clamp(decimalPrecision(self[posKey]), 0, threshold + rubber);
      setSp(_defineProperty({}, spKey, self[posKey]));
    } else if (endTouch) {
      self[posKey] += cDelta * (self[posKey] < -minRubberFactor && cDelta < 0
      /* 只在向上/左滑时 */
      ? rubberFactor(Math.abs(self[posKey]) - minRubberFactor, threshold, 0.1, soap) : soap);
      self[posKey] = _clamp(self[posKey], -threshold - rubber, 0);
      setSp(_defineProperty({}, spKey, self[posKey]));
    }
  }
  /** 容器滚动处理函数 */


  function scrollHandle(meta) {
    var _props$onScroll;

    (_props$onScroll = props.onScroll) === null || _props$onScroll === void 0 ? void 0 : _props$onScroll.call(props, meta);
    refreshProgressBar('x');
    refreshProgressBar('y');
    refreshScrollFlag();
    pullUpHandler(meta);
  }
  /** 如果启用，刷新进度条状态 */


  function refreshProgressBar(type) {
    if (!progressBar) return;
    if (hasProgressCtrl(type)) return;
    var thresholdSize = typeof progressBar === 'number' ? progressBar : 500;
    var meta = share.sHelper.get();
    var current = meta[type];
    var max = meta["".concat(type, "Max")];
    if (max < thresholdSize) return;

    var percentage = _clamp(current / max * 100, 0, 100);

    setPgSp(_defineProperty({}, type, percentage));
  }
  /** 是否手动控制指定轴的滚动条 */


  function hasProgressCtrl(type) {
    if (type === 'x') return props.xProgress !== undefined;
    if (type === 'y') return props.yProgress !== undefined;
  }
  /** 如果启用，刷新标识状态 */


  function refreshScrollFlag() {
    if (!scrollFlag) return;
    var meta = share.sHelper.get();
    var xHas = hasScroll('x');
    var yHas = hasScroll('y'); // 有滚动内容才计算

    if (xHas || yHas) {
      var topFlag = yHas && !meta.touchTop;
      var bottomFlag = yHas && !meta.touchBottom;
      var leftFlag = xHas && !meta.touchLeft;
      var rightFlag = xHas && !meta.touchRight;
      var isAllEqual = topFlag === state.topFlag && leftFlag === state.leftFlag && bottomFlag === state.bottomFlag && rightFlag === state.rightFlag;

      if (!isAllEqual) {
        setState({
          topFlag: topFlag,
          bottomFlag: bottomFlag,
          leftFlag: leftFlag,
          rightFlag: rightFlag
        });
      } // 午滚动内容且包含了flag，全部重置

    } else if (state.topFlag || state.bottomFlag || state.leftFlag || state.rightFlag) {
      setState({
        topFlag: false,
        bottomFlag: false,
        leftFlag: false,
        rightFlag: false
      });
    }
  }
  /** 指定轴是否包含滚动区域 */


  function hasScroll(type) {
    var meta = share.sHelper.get();
    var max = type === 'x' ? meta.xMax : meta.yMax;
    return !!max;
  }
  /** 获取滚动条宽度并设置到state */


  function getScrollWidth() {
    if (!hideScrollbar && !scrollFlag) return;
    var w = getScrollBarWidth(rootEl.current);
    if (!w || w === state.scrollBarWidth) return;
    setState({
      scrollBarWidth: w
    });
  }
  /**
   * 处理下拉刷新逻辑，down表示是否按下
   * @return 可以返回true来在事件绑定器中阻止默认的松开还原操作
   * */


  function pullDownHandler(_ref2) {
    var down = _ref2.down;
    if (!props.onPullDown) return;
    var inThreshold = self.memoY >= threshold; // 正在加载时不走后续逻辑

    if (isPullActioning()) {
      if (isPullDowning()) {
        if (!down) {
          if (inThreshold) {
            pullDownToThreshold();
          } else {
            stopPullDown();
          }
        }
      }

      if (isPullUpIng()) return;
      return true;
    } // 小于触发距离且状态还在松开刷新提示中，将其还原


    if (!inThreshold && state.pullDownStatus === PullDownStatus.RELEASE_TIP) {
      setState({
        pullDownStatus: PullDownStatus.TIP
      });
    } // 按下且已达到触发刷新距离


    if (down && inThreshold && state.pullDownStatus !== PullDownStatus.RELEASE_TIP) {
      setState({
        pullDownStatus: PullDownStatus.RELEASE_TIP
      });
    } // 按下时不走后续逻辑


    if (down) return;
    if (!inThreshold) return;
    triggerPullDown();
    return true;
  }
  /** 触发下拉刷新, 处于任意加载状态时无效 */


  function triggerPullDown() {
    if (isPullDowning() || !props.onPullDown) return;
    setState({
      pullDownStatus: PullDownStatus.LOADING
    });
    pullDownToThreshold();
    setPullDownSp({
      from: {
        r: 0
      },
      to: {
        r: 360
      },
      immediate: false,
      loop: isPullDowning,
      config: {
        duration: 1000
      }
    }); // 还原上拉加载状态、触发上拉加载

    if (props.onPullUp) {
      setState({
        pullUpStatus: PullUpStatus.TIP
      });
    }

    props.onPullDown(triggerPullUp).then(function () {
      state.hasData && setState({
        hasData: false
      });

      if (props.pullDownTips) {
        queue.push({
          message: pullDownText[PullDownStatus.SUCCESS]
        });
      }
    })["catch"](function () {
      if (props.pullDownTips) {
        queue.push({
          message: pullDownText[PullDownStatus.ERROR],
          actions: [{
            text: '重试',
            handler: triggerPullDown
          }]
        });
      }
    })["finally"](function () {
      stopPullDown();
    });
  }
  /** 设置到下拉位置到threshold处 */


  function pullDownToThreshold() {
    setSp({
      y: self.memoY = threshold
    });
  }
  /** 停止下拉并还原动画和状态文本 */


  function stopPullDown() {
    setSp({
      y: self.memoY = 0
    });
    setState({
      pullDownStatus: PullDownStatus.TIP
    });
  }
  /** 根据下拉状态获取当前的下拉文本 */


  function getPullDownText() {
    return pullDownText[state.pullDownStatus] || '';
  }

  function isPullDowning() {
    return state.pullDownStatus === PullDownStatus.LOADING;
  }

  function isPullUpIng() {
    return state.pullUpStatus === PullUpStatus.LOADING;
  }
  /** 正在上拉或下拉操作中 */


  function isPullActioning() {
    return isPullUpIng() || isPullDowning();
  }
  /** 处理上拉加载逻辑 */


  function pullUpHandler(meta) {
    if (!props.onPullUp) return; // 未达到触发距离

    if (meta.y + props.pullUpThreshold < meta.yMax) return; // 不在提示阶段时阻止滚动触发加载(依然可以手动触发)

    if (state.pullUpStatus !== PullUpStatus.TIP) return;
    triggerPullUp();
  }
  /** 获取当前上拉状态的文本 */


  function getPullUpText() {
    return pullUpText[state.pullUpStatus] || '';
  }
  /** 触发上拉加载, 参数见props */


  function triggerPullUp(isRefresh) {
    // 正在进行其他操作/未开启上拉
    if (isPullUpIng() || !props.onPullUp) return;
    setState({
      pullUpStatus: PullUpStatus.LOADING
    });
    props.onPullUp({
      isRefresh: isRefresh
    }).then(function (_ref3) {
      var length = _ref3.length,
          isEmpty = _ref3.isEmpty;

      if (isNumber(length) && length > 0 && state.hasData) {
        queue.push({
          message: pullUpText[PullUpStatus.SUCCESS].replace('{num}', String(length))
        });
      }

      if (isEmpty) {
        setState({
          pullUpStatus: PullUpStatus.NOT_DATA
        });
      } else {
        setState({
          pullUpStatus: PullUpStatus.TIP,
          hasData: true
        });
      }
    })["catch"](function () {
      setState({
        pullUpStatus: PullUpStatus.ERROR
      });
    })["finally"](function () {
      refreshProgressBar('y');
    });
  }
  /** 向前或向后滚动整页 */


  function slide(isPrev) {
    var _share$sHelper$set;

    var isVertical = props.direction === DirectionEnum.vertical;
    var pos = isVertical ? 'y' : 'x';
    var sizeKey = isVertical ? 'height' : 'width';
    var meta = share.sHelper.get();
    var pageSize = meta[sizeKey];

    if (isPrev) {
      pageSize = -pageSize;
    }

    share.sHelper.set((_share$sHelper$set = {}, _defineProperty(_share$sHelper$set, pos, pageSize), _defineProperty(_share$sHelper$set, "raise", true), _share$sHelper$set));
  }

  function slidePrev() {
    slide(true);
  }

  function slideNext() {
    slide();
  }

  return {
    setDragPos: setDragPos,
    scrollHandle: scrollHandle,
    refreshScrollFlag: refreshScrollFlag,
    hasScroll: hasScroll,
    getScrollWidth: getScrollWidth,
    pullDownHandler: pullDownHandler,
    getPullDownText: getPullDownText,
    getPullUpText: getPullUpText,
    isPullUpIng: isPullUpIng,
    triggerPullDown: triggerPullDown,
    triggerPullUp: triggerPullUp,
    slidePrev: slidePrev,
    slideNext: slideNext
  };
}

function useHooks(methods, share) {
  var setState = share.setState,
      sHelper = share.sHelper,
      self = share.self,
      rootEl = share.rootEl,
      setSp = share.setSp,
      setPgSp = share.setPgSp,
      props = share.props; // 获取滚动条宽度

  useEffect(methods.getScrollWidth, []); // 手动控制进度条宽度

  useEffect(function () {
    var xHas = isNumber(props.xProgress);
    var yHas = isNumber(props.yProgress);
    if (!isNumber(props.xProgress) && !isNumber(props.yProgress)) return;
    var aniTo = {};

    if (xHas) {
      aniTo.x = _clamp(props.xProgress * 100, 0, 100);
    }

    if (yHas) {
      aniTo.y = _clamp(props.yProgress * 100, 0, 100);
    }

    setPgSp(aniTo);
  }, [props.xProgress, props.yProgress]); // 初始化滚动标识

  useEffect(methods.refreshScrollFlag, []); // touch事件监测

  useEffect(function () {
    if (typeof window !== 'undefined' && 'ontouchstart' in window) {
      setState({
        hasTouch: true
      });
    }
  }, []);
  /* 禁用一些默认事件，如、qq 微信 ios 的顶部下拉 */

  useEffect(function () {
    if (props.direction !== DirectionEnum.vertical) {
      return;
    }

    return preventTopPullDown(sHelper.ref.current);
  }, []); // 初始化调用上拉加载

  useEffect(function () {
    methods.triggerPullUp(true);
  }, []); // Drag事件处理

  var bind = useGesture({
    onDrag: function onDrag(_ref) {
      var event = _ref.event,
          _ref$direction = _slicedToArray(_ref.direction, 2),
          dx = _ref$direction[0],
          dy = _ref$direction[1],
          _ref$delta = _slicedToArray(_ref.delta, 2),
          dex = _ref$delta[0],
          dey = _ref$delta[1],
          down = _ref.down;

      var sMeta = sHelper.get();
      var yPrevent = props.direction === DirectionEnum.vertical && (dy > 0 && sMeta.touchTop || dy < 0 && sMeta.touchBottom);
      var xPrevent = props.direction === DirectionEnum.horizontal && (dx > 0 && sMeta.touchLeft || dx < 0 && sMeta.touchRight);
      /* 触边拖动时禁用默认事件 */

      if (yPrevent || xPrevent) {
        if (event) {
          event.cancelable && event.preventDefault();
        }
      }

      var preventDefaultUp = methods.pullDownHandler({
        down: down
      });
      /* 松开时，还原位置 */

      if (!down) {
        // cancel!();
        if (preventDefaultUp) return;
        self.memoX = 0;
        self.memoY = 0;
        setSp({
          y: self.memoY,
          x: self.memoX
        });
        return;
      }
      /* 根据拖动信息设置元素位置 */


      var dragPosArg = {
        dey: dey,
        dex: dex,
        touchBottom: sMeta.touchBottom,
        touchLeft: sMeta.touchLeft,
        touchRight: sMeta.touchRight,
        touchTop: sMeta.touchTop
      };

      if (props.direction === DirectionEnum.vertical) {
        if (sMeta.touchTop || sMeta.touchBottom) {
          methods.setDragPos(_objectSpread({
            isVertical: true
          }, dragPosArg));
        }
      }

      if (props.direction === DirectionEnum.horizontal) {
        if (sMeta.touchLeft || sMeta.touchRight) {
          methods.setDragPos(dragPosArg);
        }
      }
    }
  }, {
    domTarget: rootEl,
    eventOptions: {
      passive: false
    },
    drag: {
      axis: props.direction === DirectionEnum.vertical ? 'y' : 'x',
      filterTaps: true
    }
  });
  useEffect(bind, [bind]);
}

var defaultProps = {
  soap: 0.5,
  threshold: 80,
  rubber: 30,
  hideScrollbar: false,
  webkitScrollBar: true,
  progressBar: false,
  scrollFlag: false,
  direction: DirectionEnum.vertical,
  pullUpThreshold: 120,
  pullDownTips: true
};
var Scroller = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var _ref = props,
      hideScrollbar = _ref.hideScrollbar,
      webkitScrollBar = _ref.webkitScrollBar,
      hoverWebkitScrollBar = _ref.hoverWebkitScrollBar,
      direction = _ref.direction,
      threshold = _ref.threshold,
      rubber = _ref.rubber;
  var queue = Tips.useTipsController({
    defaultItemOption: {
      duration: 1200
    }
  });
  /** 根元素 */

  var rootEl = useRef(null);

  var _useSetState = useSetState({
    scrollBarWidth: 0,
    hasTouch: false,
    topFlag: false,
    rightFlag: false,
    bottomFlag: false,
    leftFlag: false,
    pullDownStatus: PullDownStatus.TIP,
    pullUpStatus: PullUpStatus.TIP,
    hasData: false
  }),
      _useSetState2 = _slicedToArray(_useSetState, 2),
      state = _useSetState2[0],
      setState = _useSetState2[1];

  var self = useSelf({
    memoX: 0,
    memoY: 0,
    upLoadCount: 0
  }); // 拖动元素动画

  var _useSpring = useSpring(function () {
    return {
      y: 0,
      x: 0,
      config: _objectSpread({}, config.stiff)
    };
  }),
      _useSpring2 = _slicedToArray(_useSpring, 2),
      spSty = _useSpring2[0],
      setSp = _useSpring2[1]; // 额外的设置下拉指示器旋转角度动画(用于下拉已触发时的加载动画)


  var _useSpring3 = useSpring(function () {
    return {
      r: 0,
      config: _objectSpread({}, config.stiff)
    };
  }),
      _useSpring4 = _slicedToArray(_useSpring3, 2),
      spPullDownSty = _useSpring4[0],
      setPullDownSp = _useSpring4[1]; // 进度条动画


  var _useSpring5 = useSpring(function () {
    return {
      x: 0,
      y: 0,
      config: {
        clamp: true
      }
    };
  }),
      _useSpring6 = _slicedToArray(_useSpring5, 2),
      spPgSty = _useSpring6[0],
      setPgSp = _useSpring6[1]; // 共享状态


  var share = {
    sHelper: null,
    props: props,
    rootEl: rootEl,
    self: self,
    setPgSp: setPgSp,
    setSp: setSp,
    setState: setState,
    state: state,
    setPullDownSp: setPullDownSp,
    queue: queue
  }; // 方法拆分

  var methods = useMethods(share);
  share.sHelper = useScroll({
    throttleTime: 40,
    onScroll: methods.scrollHandle
  });
  var scrollEl = share.sHelper.ref; // 事件绑定/声明周期

  useHooks(methods, share);
  useImperativeHandle(ref, function () {
    return _objectSpread({
      triggerPullDown: methods.triggerPullDown,
      triggerPullUp: methods.triggerPullUp,
      slideNext: methods.slideNext,
      slidePrev: methods.slidePrev
    }, share.sHelper);
  });
  var hideOffset = hideScrollbar && state.scrollBarWidth && !state.hasTouch ? -state.scrollBarWidth : undefined;
  var isVertical = direction === DirectionEnum.vertical;
  var isPullUpIng = methods.isPullUpIng();

  function renderPullUpRetryBtn() {
    return /*#__PURE__*/React.createElement(Button, {
      size: "small",
      text: true,
      color: "primary",
      onClick: function onClick() {
        return methods.triggerPullUp(true);
      }
    }, "\u91CD\u8BD5");
  }

  return /*#__PURE__*/React.createElement("div", {
    className: cls('m78-scroller', props.className),
    style: _objectSpread({
      backgroundColor: props.bgColor
    }, props.style),
    ref: rootEl
  }, /*#__PURE__*/React.createElement(animated.div, {
    className: "m78-scroller_inner",
    style: {
      transform: to([spSty.x, spSty.y], function (x, y) {
        return "translate3d(".concat(x, "px, ").concat(y, "px, 0)");
      })
    }
  }, props.onPullDown && /*#__PURE__*/React.createElement(animated.div, {
    className: "m78-scroller_pulldown",
    style: {
      padding: props.pullDownNode ? 0 : undefined
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "m78-scroller_pulldown-wrap"
  }, props.pullDownNode || /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(animated.div, {
    className: "m78-scroller_pulldown-icon",
    style: {
      transform: to([spSty.y, spPullDownSty.r], function (y, r) {
        return "rotate3d(0, 0, 1, ".concat(-(offset2Rotate(y, threshold + rubber) + r), "deg)");
      })
    }
  }, props.pullDownIndicator || /*#__PURE__*/React.createElement(WindmillIcon, null)), /*#__PURE__*/React.createElement("span", {
    className: "m78-scroller_pulldown-text"
  }, methods.getPullDownText())))), /*#__PURE__*/React.createElement("div", {
    className: cls('m78-scroller_wrap', {
      'm78-scrollbar': !state.hasTouch && webkitScrollBar,
      __hover: !state.hasTouch && hoverWebkitScrollBar
    }),
    ref: scrollEl,
    style: _defineProperty({
      right: isVertical ? hideOffset : undefined,
      bottom: !isVertical ? hideOffset : undefined
    }, isVertical ? 'overflowY' : 'overflowX', props.disableScroll ? undefined : 'auto')
  }, props.children, props.onPullUp && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(If, {
    when: !state.hasData
  }, /*#__PURE__*/React.createElement(Spacer, {
    height: 100
  }), /*#__PURE__*/React.createElement(If, {
    when: !isPullUpIng && state.pullUpStatus === PullUpStatus.NOT_DATA
  }, /*#__PURE__*/React.createElement(Empty, {
    desc: /*#__PURE__*/React.createElement("span", {
      className: "m78-scroller_empty-nodata"
    }, /*#__PURE__*/React.createElement("span", null, "\u6682\u65E0\u6570\u636E"), renderPullUpRetryBtn())
  })), /*#__PURE__*/React.createElement(If, {
    when: !isPullUpIng && state.pullUpStatus === PullUpStatus.ERROR
  }, /*#__PURE__*/React.createElement(Empty, {
    emptyNode: /*#__PURE__*/React.createElement(ErrorIcon, null),
    desc: /*#__PURE__*/React.createElement("span", {
      className: "m78-scroller_empty-nodata"
    }, /*#__PURE__*/React.createElement("span", null, methods.getPullUpText()), renderPullUpRetryBtn())
  }))), /*#__PURE__*/React.createElement("div", {
    className: "m78-scroller_pullup"
  }, /*#__PURE__*/React.createElement("div", {
    className: "m78-scroller_pullup-wrap"
  }, /*#__PURE__*/React.createElement(If, {
    when: !isPullUpIng && state.hasData
  }, /*#__PURE__*/React.createElement("span", {
    className: "m78-scroller_pullup-text"
  }, /*#__PURE__*/React.createElement("span", null, methods.getPullUpText()), /*#__PURE__*/React.createElement(If, {
    when: state.pullUpStatus === PullUpStatus.ERROR
  }, renderPullUpRetryBtn()))), isPullUpIng && /*#__PURE__*/React.createElement(Spin, {
    inline: true,
    size: "small"
  })))))), /*#__PURE__*/React.createElement(animated.div, {
    style: {
      width: spPgSty.y.to(function (width) {
        return "".concat(width, "%");
      })
    },
    className: "m78-scroller_progress-bar"
  }), /*#__PURE__*/React.createElement(animated.div, {
    style: {
      height: spPgSty.x.to(function (height) {
        return "".concat(height, "%");
      })
    },
    className: "m78-scroller_progress-bar __left"
  }), state.leftFlag && /*#__PURE__*/React.createElement("div", {
    className: "m78-scroller_scroll-flag __start"
  }), state.rightFlag && /*#__PURE__*/React.createElement("div", {
    className: "m78-scroller_scroll-flag",
    style: {
      right: methods.hasScroll('y') && state.scrollBarWidth ? state.scrollBarWidth : undefined
    }
  }), state.topFlag && /*#__PURE__*/React.createElement("div", {
    className: "m78-scroller_scroll-flag __start __isVertical"
  }), state.bottomFlag && /*#__PURE__*/React.createElement("div", {
    className: "m78-scroller_scroll-flag __isVertical",
    style: {
      bottom: methods.hasScroll('x') && state.scrollBarWidth ? state.scrollBarWidth : undefined
    }
  }), /*#__PURE__*/React.createElement(Tips, {
    controller: queue
  }), props.backTop && /*#__PURE__*/React.createElement(BackTop, {
    target: scrollEl,
    style: {
      position: 'absolute',
      right: 28,
      bottom: 38
    }
  }), props.extraNode);
});
Scroller.defaultProps = defaultProps;

export default Scroller;
export { PullDownStatus, PullUpStatus };
