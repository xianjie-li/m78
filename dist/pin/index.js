import 'm78/pin/style';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import React, { useRef, useEffect } from 'react';
import { useSetState, getRefDomOrDom, useScroll, useFn } from '@lxjx/hooks';
import { getFirstScrollParent, checkElementVisible, getStyle } from '@lxjx/utils';
import _debounce from 'lodash/debounce';
import cls from 'classnames';

/** 需要为shadowEl代理的样式key */
var proxyKeys = ['height', 'width', 'position', 'top', 'bottom', 'marginTop', 'marginBottom', 'display'];
/**
 * 指定元素后，在元素滚动范围内生效
 * */

var Pin = function Pin(_ref) {
  var target = _ref.target,
      _ref$offsetTop = _ref.offsetTop,
      offsetTop = _ref$offsetTop === void 0 ? 0 : _ref$offsetTop,
      _ref$offsetBottom = _ref.offsetBottom,
      offsetBottom = _ref$offsetBottom === void 0 ? 0 : _ref$offsetBottom,
      children = _ref.children,
      style = _ref.style,
      className = _ref.className,
      disableBottom = _ref.disableBottom,
      disableTop = _ref.disableTop;

  var _useSetState = useSetState({
    topOver: false,
    bottomOver: false,
    shadowStyle: {},
    targetTopOffset: 0,
    targetBottomOffset: 0
  }),
      _useSetState2 = _slicedToArray(_useSetState, 2),
      state = _useSetState2[0],
      setState = _useSetState2[1]; // pin根元素


  var pinEl = useRef(null); // 固钉到元素当前位置的隐藏节点

  var shadowEl = useRef(null);
  /* ########### hook ########### */
  // 刷新shadowEl的样式

  useEffect(refreshShadowState, [state.el, state.topOver, state.bottomOver]); // 初始化 + shadowEl位置改变时更新固定状态

  useEffect(scrollHandler, [state.shadowStyle]); // 获取dom并设置，初始化位置

  useEffect(function () {
    var dom = getRefDomOrDom(target);

    if (dom) {
      setState({
        el: dom
      });
      return;
    }

    var fs = getFirstScrollParent(pinEl.current);
    /** 有滚动父节点且不为doc对象和body对象 */

    if (fs && fs !== document.documentElement && fs !== document.body) {
      setState({
        el: fs
      });
    }
  }, [target]);
  /* ########### hook END ########### */
  // 处理目标滚动容器

  useScroll({
    el: state.el,
    throttleTime: 5,
    onScroll: scrollHandler
  });
  /* ########### 目标容器不为window时，为window绑定一个600ms的scrollHandler，用于滚动后修正内部容器内的pin ########## */

  var debounceScrollHandler = useFn(function () {
    return scrollHandler();
  }, function (fn) {
    return _debounce(fn, 600);
  });
  useScroll({
    onScroll: function onScroll() {
      if (!state.el) return;
      debounceScrollHandler();
    }
  });
  /* ########### END ########### */

  /** 滚动处理 */

  function scrollHandler() {
    if (!shadowEl.current || !pinEl.current) return;
    var isOver = state.bottomOver || state.topOver;
    var targetEl = isOver ? shadowEl.current : pinEl.current;

    var _checkElementVisible = checkElementVisible(targetEl, {
      fullVisible: true,
      wrapEl: state.el,
      offset: {
        top: offsetTop + 1,
        bottom: offsetBottom + 1
      }
    }),
        topVis = _checkElementVisible.top,
        bottomVis = _checkElementVisible.bottom;

    var top = disableTop ? true : topVis;
    var bottom = disableBottom ? true : bottomVis;

    if (state.el) {
      var _state$el$getBounding = state.el.getBoundingClientRect(),
          tTop = _state$el$getBounding.top,
          tBottom = _state$el$getBounding.bottom;

      var t = tTop;
      var b = window.innerHeight - tBottom;

      if (t !== state.targetTopOffset || b !== state.targetBottomOffset) {
        setState({
          targetBottomOffset: window.innerHeight - tBottom,
          targetTopOffset: tTop
        });
      }
    } // 还原位置


    if (top && bottom && (state.topOver || state.bottomOver)) {
      setState({
        topOver: false,
        bottomOver: false
      });
      return;
    } // 设置固钉


    if (!top && !state.topOver) {
      setState({
        topOver: true,
        bottomOver: false
      });
    } else if (!bottom && !state.bottomOver) {
      setState({
        topOver: false,
        bottomOver: true
      });
    }
  }
  /** 刷新影子节点样式 */


  function refreshShadowState() {
    // 正在固定时不要获取style
    if (state.topOver || state.bottomOver) {
      return;
    }

    var sty = getStyle(pinEl.current); // position为fixed时会定位失败

    if (sty.position === 'fixed') {
      return;
    }

    var styleObj = {};
    proxyKeys.forEach(function (key) {
      return styleObj[key] = sty[key];
    });

    if (styleObj.position === 'fixed') {
      styleObj.position = 'relative';
    }

    setState({
      shadowStyle: styleObj
    });
  }

  var isPin = state.bottomOver || state.topOver;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    ref: shadowEl,
    style: _objectSpread(_objectSpread({}, state.shadowStyle), {}, {
      display: isPin ? undefined : 'none'
    }),
    className: "m78-pin_shadow"
  }), /*#__PURE__*/React.createElement("div", {
    className: cls('m78-pin', className, isPin && '__isPin'),
    ref: pinEl,
    style: _objectSpread(_objectSpread({}, style), {}, {
      position: isPin ? 'fixed' : undefined,
      top: state.topOver ? offsetTop + state.targetTopOffset : undefined,
      bottom: state.bottomOver ? offsetBottom + state.targetBottomOffset : undefined
    })
  }, children));
};

export default Pin;
