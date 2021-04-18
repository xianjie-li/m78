import 'm78/context-menu/style';
import _extends from '@babel/runtime/helpers/extends';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import React, { useState } from 'react';
import Popper, { PopperDirectionEnum } from 'm78/popper';
import { Tile } from 'm78/layout';
import classNames from 'classnames';
import { isFunction } from '@lxjx/utils';

/** 定制popper */
var MenuCustomer = function MenuCustomer(props) {
  var contRender = props.content;
  return /*#__PURE__*/React.createElement("div", {
    onContextMenu: function onContextMenu(e) {
      return e.preventDefault();
    },
    className: classNames('m78-context-menu', props.classNamePassToCustomer, props.stylePassToCustomer),
    onClick: function onClick() {
      return props.setShow(false);
    }
  }, isFunction(contRender) ? contRender(props) : contRender);
};

var ContextMenu = function ContextMenu(_ref) {
  var content = _ref.content,
      customer = _ref.customer,
      className = _ref.className,
      style = _ref.style,
      children = _ref.children;

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      target = _useState2[0],
      setTarget = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      show = _useState4[0],
      setShow = _useState4[1];

  function onContextMenu(e) {
    e.preventDefault();
    setTarget({
      left: e.clientX,
      top: e.clientY,
      right: e.clientX,
      bottom: e.clientY
    });
    !show && setShow(true);
    return false;
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Popper, {
    show: show,
    type: "popper",
    target: target,
    trigger: "subClick",
    direction: PopperDirectionEnum.rightStart,
    offset: 0,
    content: content,
    customer: customer || MenuCustomer,
    onChange: setShow // @ts-ignore 组件内部临时增加的属性
    ,
    classNamePassToCustomer: className // @ts-ignore
    ,
    stylePassToCustomer: style
  }), /*#__PURE__*/React.cloneElement(children, {
    onContextMenu: onContextMenu
  }));
};

var ContextMenuItem = function ContextMenuItem(props) {
  return /*#__PURE__*/React.createElement(Tile, _extends({}, props, {
    className: classNames('m78-context-menu_item', props.className, props.disabled && '__disabled')
  }));
};

ContextMenu.Item = ContextMenuItem;

export default ContextMenu;
export { ContextMenuItem };
