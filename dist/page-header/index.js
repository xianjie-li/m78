import 'm78/page-header/style';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftOutlined } from 'm78/icon';
import { Button } from 'm78/button';
import { Divider } from 'm78/layout';
import cls from 'clsx';
import { useMeasure, useFn } from '@lxjx/hooks';

var PageHeader = function PageHeader(_ref) {
  var leading = _ref.leading,
      title = _ref.title,
      desc = _ref.desc,
      centerTitle = _ref.centerTitle,
      backIcon = _ref.backIcon,
      _ref$shadow = _ref.shadow,
      shadow = _ref$shadow === void 0 ? true : _ref$shadow,
      border = _ref.border,
      bottom = _ref.bottom,
      actions = _ref.actions,
      color = _ref.color,
      white = _ref.white,
      onBack = _ref.onBack,
      className = _ref.className,
      style = _ref.style,
      fixed = _ref.fixed;

  // 用于在centerTitle开启时统一两侧宽度
  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      sideW = _useState2[0],
      setSideW = _useState2[1];

  var _useMeasure = useMeasure(),
      _useMeasure2 = _slicedToArray(_useMeasure, 2),
      calcRef = _useMeasure2[0],
      height = _useMeasure2[1].height;

  var leadingEl = useRef(null);
  var actionEl = useRef(null); // 计算两侧宽度

  useEffect(function () {
    if (centerTitle === undefined) return;

    if (centerTitle) {
      var lW = leadingEl.current.offsetWidth;
      var aW = actionEl.current.offsetWidth;
      setSideW(Math.max(lW, aW));
      return;
    }

    setSideW(undefined);
  }, [centerTitle]);
  var backHandle = useFn(function () {
    onBack ? onBack() : history.back();
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, fixed && /*#__PURE__*/React.createElement("div", {
    style: {
      height: height
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: cls('m78-page-header', className, {
      __center: centerTitle,
      __shadow: shadow,
      __border: border,
      __color: color,
      __white: white,
      __fixed: fixed
    }),
    style: _objectSpread(_objectSpread({}, style), {}, {
      backgroundColor: typeof color === 'string' ? color : undefined
    }),
    ref: calcRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "m78-page-header_bar"
  }, /*#__PURE__*/React.createElement("div", {
    ref: leadingEl,
    className: "m78-page-header_leading",
    style: {
      width: sideW
    }
  }, backIcon !== null && /*#__PURE__*/React.createElement(Button, {
    icon: true,
    className: "m78-page-header_back"
  }, backIcon ? /*#__PURE__*/React.cloneElement(backIcon, {
    onClick: backHandle
  }) : /*#__PURE__*/React.createElement(ArrowLeftOutlined, {
    title: "\u8FD4\u56DE",
    onClick: backHandle
  })), leading, (title || desc) && backIcon !== null && !centerTitle && /*#__PURE__*/React.createElement(Divider, {
    height: 18,
    vertical: true,
    color: white ? 'rgba(255,255,255,0.2)' : undefined
  })), /*#__PURE__*/React.createElement("div", {
    className: "m78-page-header_main"
  }, title && /*#__PURE__*/React.createElement("span", {
    className: "m78-page-header_title"
  }, title), /*#__PURE__*/React.createElement("span", {
    className: "m78-page-header_desc"
  }, desc)), /*#__PURE__*/React.createElement("div", {
    ref: actionEl,
    className: "m78-page-header_actions",
    style: {
      width: sideW
    }
  }, actions)), bottom && /*#__PURE__*/React.createElement("div", {
    className: "m78-page-header_bottom"
  }, bottom)));
};

export { PageHeader };
