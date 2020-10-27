import 'm78/back-top/style';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import React, { useRef, useState, useEffect } from 'react';
import Button from 'm78/button';
import { CaretUpOutlined } from 'm78/icon';
import { getRefDomOrDom } from 'm78/util';
import { getFirstScrollParent } from '@lxjx/utils';
import { useFn, useScroll } from '@lxjx/hooks';
import _debounce from 'lodash/debounce';
import { Transition } from '@lxjx/react-transition-spring';
import cls from 'classnames';
import Portal from 'm78/portal';

var BackTop = function BackTop(_ref) {
  var target = _ref.target,
      _ref$debounceTime = _ref.debounceTime,
      debounceTime = _ref$debounceTime === void 0 ? 200 : _ref$debounceTime,
      _ref$threshold = _ref.threshold,
      threshold = _ref$threshold === void 0 ? 500 : _ref$threshold,
      children = _ref.children,
      className = _ref.className,
      style = _ref.style;
  // 包裹元素
  var wrapRef = useRef(null); // 显示隐藏

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      show = _useState2[0],
      setShow = _useState2[1]; // 滚动元素


  var _useState3 = useState(),
      _useState4 = _slicedToArray(_useState3, 2),
      el = _useState4[0],
      setEl = _useState4[1]; // 获取滚动元素


  useEffect(function () {
    var passEl = getRefDomOrDom(target);

    if (passEl) {
      setEl(passEl);
      return;
    }

    var sp = getFirstScrollParent(wrapRef.current);
    setEl(sp);
  }, [target]); // 处理滚动

  var scrollHandler = useFn(function (_ref2) {
    var y = _ref2.y;

    if (y >= threshold) {
      !show && setShow(true);
    } else {
      show && setShow(false);
    }
  }, function (fn) {
    return _debounce(fn, debounceTime);
  });
  var sh = useScroll({
    el: el,
    onScroll: scrollHandler
  }); // 初始化处理

  useEffect(function () {
    if (el) {
      scrollHandler(sh.get());
    }
  }, []);

  function renderMain() {
    return /*#__PURE__*/React.createElement(Transition, {
      toggle: show,
      innerRef: wrapRef,
      className: cls('m78-back-top', className),
      title: "\u8FD4\u56DE\u9876\u90E8",
      type: "slideRight",
      onClick: function onClick() {
        return sh.set({
          y: 0
        });
      },
      style: style
    }, children || /*#__PURE__*/React.createElement(Button, null, /*#__PURE__*/React.createElement(CaretUpOutlined, null)));
  }

  return target ? renderMain() : /*#__PURE__*/React.createElement(Portal, {
    namespace: "back-top"
  }, renderMain());
};

export default BackTop;
