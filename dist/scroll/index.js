import 'm78/scroll/style';
import _defineProperty from '@babel/runtime/helpers/defineProperty';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import React, { useEffect, useImperativeHandle, useCallback } from 'react';
import { useGesture } from 'react-use-gesture';
import { useSpring, config, animated, interpolate } from 'react-spring';
import { isNumber } from '@lxjx/utils';
import { Transition } from '@lxjx/react-transition-spring';
import { useScroll, useSelf, useSetState } from '@lxjx/hooks';
import preventTopPullDown from 'prevent-top-pull-down';
import { If, Toggle, Switch } from 'm78/fork';
import Spin from 'm78/spin';
import Empty from 'm78/empty';
import Button from 'm78/button';
import { CaretUpOutlined, WindmillIcon } from 'm78/icon';
import { dumpFn } from 'm78/util';
import _debounce from 'lodash/debounce';
import cls from 'classnames';

var pullDownThreshold = 160; // 触发下拉刷新的阈值

var baseIndicatorPos = 50; // 下拉刷新指示器的基准y轴位置

var pullDownSuccessText = '数据已更新';
var pullDownFailText = '更新数据失败, 请重试!';
var pullUpNoDataText = '没有更多了';
var pullUpLoadMoreText = '加载更多';
var pullUpErrorText = '数据加载失败';
var Scroll = /*#__PURE__*/React.forwardRef(function (_ref, fRef) {
  var children = _ref.children,
      _ref$pullDown = _ref.pullDown,
      pullDown = _ref$pullDown === void 0 ? false : _ref$pullDown,
      _ref$onPullDown = _ref.onPullDown,
      onPullDown = _ref$onPullDown === void 0 ? dumpFn : _ref$onPullDown,
      _ref$pullUp = _ref.pullUp,
      pullUp = _ref$pullUp === void 0 ? false : _ref$pullUp,
      _ref$threshold = _ref.threshold,
      threshold = _ref$threshold === void 0 ? 80 : _ref$threshold,
      _ref$onPullUp = _ref.onPullUp,
      onPullUp = _ref$onPullUp === void 0 ? dumpFn : _ref$onPullUp,
      _ref$onScroll = _ref.onScroll,
      onScroll = _ref$onScroll === void 0 ? dumpFn : _ref$onScroll,
      throttleTime = _ref.throttleTime,
      _ref$hasData = _ref.hasData,
      hasData = _ref$hasData === void 0 ? true : _ref$hasData,
      _ref$backTop = _ref.backTop,
      backTop = _ref$backTop === void 0 ? true : _ref$backTop,
      className = _ref.className,
      style = _ref.style;

  /* 滚动容器 */
  var _useScroll = useScroll({
    onScroll: onScroll,
    throttleTime: throttleTime
  }),
      ref = _useScroll.ref,
      scrollHelps = _objectWithoutProperties(_useScroll, ["ref"]);
  /* 实例属性 */


  var self = useSelf({
    pullDownTimer: 0,
    // 提示框需要延迟关闭，存储timer返回
    pullUpTimer: 0,
    // 提示框需要延迟关闭，存储timer返回
    loadCount: 0,
    // 加载总次数, 每次请求后递增, 在为0时不会渲染"没有数据"节点
    pullUpTriggerFlag: false // 标记用于在同一次进入触底区域只会触发一次touchBottom

  });
  /* 状态 */

  var _useSetState = useSetState({
    pullDownLoading: false,
    // 正在下拉加载中，当处于此状态时无法触发下一次下拉或上拉
    pullDownSuccess: false,
    // 刷新成功时标记
    pullDownFail: false,
    // 刷新失败时标记
    pullUpLoading: false,
    // 正在上拉加载中，当处于此状态时无法触发下一次下拉或上拉
    dataLength: undefined,
    // 是否有更多数据 为0时代表已没有更多
    pullUpHasError: false,
    // 是否有错误
    toTopShow: false
  }),
      _useSetState2 = _slicedToArray(_useSetState, 2),
      state = _useSetState2[0],
      setState = _useSetState2[1];
  /* 下拉刷新提示器控制 */


  var _useSpring = useSpring(function () {
    return {
      y: 0,
      over: 0,
      scroll: 1,
      config: config.stiff
    };
  }),
      _useSpring2 = _slicedToArray(_useSpring, 2),
      spPullDown = _useSpring2[0],
      set = _useSpring2[1];
  /* 进行初始化的pullDown调用 */


  useEffect(function () {
    touchBottom(true); // eslint-disable-next-line
  }, []);
  /* 禁用一些默认事件，如、qq 微信 ios 的顶部下拉 */

  useEffect(function preventDefault() {
    var destroy;

    if (pullDown) {
      destroy = preventTopPullDown(ref.current);
    }

    return function () {
      pullDown && destroy();
    }; // eslint-disable-next-line
  }, [pullDown]);
  /* 标记下拉刷新结束，此函数对外暴露, 由用户触发 */

  var pullDownFinish = function pullDownFinish() {
    var _setState;

    var isSuccess = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    if (!state.pullDownLoading) return; // 未在请求中时忽略

    setState((_setState = {}, _defineProperty(_setState, isSuccess ? 'pullDownSuccess' : 'pullDownFail', true), _defineProperty(_setState, "dataLength", undefined), _defineProperty(_setState, "pullUpHasError", false), _setState));
    scrollHelps.set({
      y: 0
    });
    resetPullDown();
    resetPullDownStatus();
  };
  /* 标记上拉刷新结束，此函数对外暴露, 由用户触发 */


  var pullUpFinish = function pullUpFinish() {
    var dataLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var hasError = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (!state.pullUpLoading || !pullUp) return;
    setState({
      pullUpLoading: false,
      dataLength: hasError ? undefined : dataLength,
      pullUpHasError: hasError
    }); // 有数据则验证还原上拉状态

    if (dataLength && !hasError) {
      autoClosePullUpTips();
    }
  };
  /* 滚动到指定位置 */


  var scrollTo = function scrollTo(to, immediate) {
    scrollHelps.set({
      y: to,
      immediate: immediate
    });
  };
  /* 根据当前位置滚动指定距离 */


  var scrollBy = function scrollBy(offset, immediate) {
    scrollHelps.set({
      y: offset,
      raise: true,
      immediate: immediate
    });
  };
  /* 根据当前位置滚动指定距离 */


  var scrollToElement = function scrollToElement(el) {
    scrollHelps.scrollToElement(el);
  };
  /* ref */


  useImperativeHandle(fRef, function () {
    return {
      pullDownFinish: pullDownFinish,
      triggerPullDown: triggerPullDown,
      pullUpFinish: pullUpFinish,
      resetPullUp: resetPullUp,
      scrollTo: scrollTo,
      scrollBy: scrollBy,
      scrollToElement: scrollToElement,
      triggerPullUp: touchBottom,
      el: ref.current
    };
  });
  /* 控制返回顶部开关 */

  var debounceOnScroll = useCallback(_debounce(function (event) {
    var y = event.offset[1];

    if (y > 800 && !state.toTopShow) {
      setState({
        toTopShow: true
      });
    }

    if (y < 800 && state.toTopShow) {
      setState({
        toTopShow: false
      });
    }
  }, 1000), []);
  var bind = useGesture({
    onDrag: function onDrag(_ref2) {
      var event = _ref2.event,
          down = _ref2.down,
          cancel = _ref2.cancel,
          first = _ref2.first,
          _ref2$movement = _slicedToArray(_ref2.movement, 2),
          moveY = _ref2$movement[1];

      event === null || event === void 0 ? void 0 : event.preventDefault();
      var scrollMeta = scrollHelps.get();
      if (state.pullDownLoading || !pullDown || state.pullUpLoading) return;
      var atTop = scrollMeta.touchTop;
      /* 处理拖动 */

      if (atTop && down) {
        if (first && self.pullDownTimer) {
          // 如果存在time id则清除
          clearTimeout(self.pullDownTimer);
        }

        var over = 0;

        if (moveY > pullDownThreshold) {
          over = (moveY - pullDownThreshold) * 0.8;
          moveY = pullDownThreshold;
        }

        set({
          y: moveY,
          over: over
        });
      }
      /* 处理松开 */


      if (atTop && !down) {
        cancel(); // 大于阈值触发刷新动作

        if (spPullDown.y.getValue() >= pullDownThreshold - 10) {
          // 使用实时值进行判断防止快速滑动导致的误触, -10可以增强体验，因为动画存在一定的延迟
          // if (moveY >= pullDownThreshold) {
          triggerPullDown();
          return;
        }

        set({
          y: 0,
          over: 0
        });
      }
      /* 不在顶部时直接停止drag事件, 处理PC上下拉同时滑动滚动导致的异常 */


      if (!atTop && down) {
        cancel();

        if (spPullDown.y.getValue() !== 0) {
          resetPullDown();
        }
      }
    },
    onScroll: function onScroll(event) {
      var _event$offset = _slicedToArray(event.offset, 2),
          scrollTop = _event$offset[1];

      var _scrollHelps$get = scrollHelps.get(),
          yMax = _scrollHelps$get.yMax;
      /* 过低的throttleTime性能反而会更差，直接视为无节流 */


      backTop && debounceOnScroll(event);
      if (!pullUp) return;
      var elHeight = yMax - threshold;

      if (elHeight - scrollTop <= 0) {
        if (self.pullUpTriggerFlag) return;
        self.pullUpTriggerFlag = true;
        touchBottom();
      } else {
        self.pullUpTriggerFlag = false;
      }
    }
  }, {
    domTarget: ref,
    event: {
      passive: false
    }
  });
  useEffect(bind, [bind]);
  /* ================= 下拉相关 ================== */

  /** 延迟1500ms后还原下拉状态, (更好的视觉效果) */

  function resetPullDownStatus() {
    if (self.pullDownTimer) {
      clearTimeout(self.pullDownTimer);
    }

    self.pullDownTimer = window.setTimeout(function () {
      setState({
        pullDownLoading: false,
        pullDownSuccess: false,
        pullDownFail: false
      });
    }, 1500);
  }
  /** 重置下拉控制器位置 */


  function resetPullDown() {
    set({
      y: 0,
      over: 0
    });
  }
  /** 主动触发下拉 */


  function triggerPullDown() {
    if (state.pullDownLoading || !pullDown || state.pullUpLoading) return; // 回传事件

    onPullDown(pullDownFinish); // 设置状态

    setState({
      pullDownLoading: true,
      pullDownSuccess: false,
      pullDownFail: false
    });
    set({
      y: baseIndicatorPos + 40,
      over: 0
    });
  }
  /* ================= 上拉相关 ================== */

  /** 触底事件 */


  function touchBottom() {
    var skip = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    if (!pullUp || state.dataLength === 0 || state.pullUpHasError || state.pullUpLoading || state.pullDownLoading) return;
    setState({
      pullUpLoading: true,
      pullUpHasError: false,
      dataLength: undefined
    });

    if (self.pullUpTimer) {
      clearTimeout(self.pullUpTimer);
    }

    self.loadCount += 1;
    onPullUp(pullUpFinish, skip);
  }
  /** 1500ms后关闭上拉提示并还原状态 */


  function autoClosePullUpTips() {
    self.pullUpTimer = window.setTimeout(resetPullUp, 1500);
  }

  function resetPullUp() {
    setState({
      dataLength: undefined,
      pullUpHasError: false
    });
  }
  /* 触发onPullUp并且传入 skip: true，提示用户需要进行数据更新 */


  function onReTry() {
    resetPullUp();
    touchBottom(true);
  }

  return /*#__PURE__*/React.createElement("div", {
    className: cls('m78-scroll_wrap', className),
    style: style
  }, /*#__PURE__*/React.createElement(Transition, {
    type: "slideTop",
    toggle: state.pullDownSuccess || state.pullDownFail || !!state.dataLength,
    className: cls('m78-scroll_tips', {
      __fail: state.pullDownFail
    })
  }, /*#__PURE__*/React.createElement(If, {
    when: state.pullDownSuccess
  }, pullDownSuccessText), /*#__PURE__*/React.createElement(If, {
    when: state.pullDownFail
  }, pullDownFailText), /*#__PURE__*/React.createElement(If, {
    when: isNumber(state.dataLength) && state.dataLength > 0
  }, "\u83B7\u53D6\u5230", state.dataLength, "\u6761", self.loadCount === 1 ? '' : '新', "\u6570\u636E")), /*#__PURE__*/React.createElement(Transition, {
    className: "m78-scroll_scroll-top",
    type: "slideRight",
    toggle: state.toTopShow,
    alpha: false
  }, /*#__PURE__*/React.createElement(Button, {
    circle: true,
    onClick: function onClick() {
      scrollTo(0);
    }
  }, /*#__PURE__*/React.createElement(CaretUpOutlined, {
    className: "fs-16 color-second"
  }))), /*#__PURE__*/React.createElement(Toggle, {
    when: pullDown
  }, /*#__PURE__*/React.createElement("div", {
    className: "m78-scroll_pulldown-wrap"
  }, /*#__PURE__*/React.createElement(animated.div, {
    className: "m78-scroll_icon",
    style: {
      transform: interpolate([spPullDown.y, spPullDown.over], function (y, over) {
        return "translateY(".concat(y * 0.8, "px) rotate3d(0,0,1,").concat(-(y * 3 + over), "deg)");
      })
    }
  }, /*#__PURE__*/React.createElement(WindmillIcon, {
    className: cls('m78-svg-icon', {
      __animation: state.pullDownLoading
    })
  })))), /*#__PURE__*/React.createElement(animated.div, {
    ref: ref,
    className: "m78-scroll"
  }, /*#__PURE__*/React.createElement("div", null, children), /*#__PURE__*/React.createElement(If, {
    when: pullUp
  }, /*#__PURE__*/React.createElement(If, {
    when: !hasData
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '26%'
    }
  })), ' ', /*#__PURE__*/React.createElement(If, {
    when: !hasData && self.loadCount !== 0 && !state.pullUpLoading && !state.pullUpHasError
  }, /*#__PURE__*/React.createElement(Empty, {
    desc: "\u6682\u65E0\u6570\u636E",
    size: "large"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "small",
    onClick: onReTry
  }, "\u518D\u8BD5\u8BD5"))), /*#__PURE__*/React.createElement("div", {
    className: "m78-scroll_pullup-wrap"
  }, /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(If, {
    when: state.pullUpLoading
  }, /*#__PURE__*/React.createElement(Spin, {
    size: "small",
    inline: true,
    show: state.pullUpLoading
  })), /*#__PURE__*/React.createElement(If, {
    when: state.pullUpHasError
  }, /*#__PURE__*/React.createElement("span", {
    className: "m78-scroll_tip-base m78-scroll_error"
  }, pullUpErrorText, /*#__PURE__*/React.createElement("span", {
    onClick: onReTry
  }, " \u91CD\u8BD5"))), /*#__PURE__*/React.createElement(If, {
    when: state.dataLength === 0 && hasData
  }, /*#__PURE__*/React.createElement("span", {
    className: "m78-scroll_no-data m78-scroll_tip-base"
  }, pullUpNoDataText)), /*#__PURE__*/React.createElement(If, {
    when: state.dataLength !== 0 && hasData && !state.pullUpLoading && !state.pullDownLoading
  }, /*#__PURE__*/React.createElement("span", {
    className: "m78-scroll_loadmore m78-scroll_tip-base",
    onClick: function onClick() {
      return touchBottom();
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "small"
  }, pullUpLoadMoreText))))))));
});

export default Scroll;
