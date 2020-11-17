import 'm78/list/style';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import _extends from '@babel/runtime/helpers/extends';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import React, { useContext } from 'react';
import 'm78/base';
import { Switch, If } from 'm78/fork';
import { RightOutlined } from 'm78/icon';
import Ellipsis from 'm78/ellipsis';
import cls from 'classnames';

var Title = function Title(_ref) {
  var title = _ref.title,
      desc = _ref.desc,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, ["title", "desc", "className"]);

  return /*#__PURE__*/React.createElement("h2", _extends({
    className: cls('m78-list_main-title', className)
  }, props), /*#__PURE__*/React.createElement("div", {
    className: "m78-list_main-title-primary"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "m78-list_main-title-second"
  }, desc));
};

var SubTitle = function SubTitle(_ref2) {
  var title = _ref2.title,
      className = _ref2.className,
      props = _objectWithoutProperties(_ref2, ["title", "className"]);

  return /*#__PURE__*/React.createElement("h3", _extends({
    className: cls('m78-list_sub-title', className)
  }, props), title);
};

var Footer = function Footer(_ref) {
  var children = _ref.children,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, ["children", "className"]);

  return /*#__PURE__*/React.createElement("div", _extends({
    className: "m78-list_main-footer ".concat(className || '')
  }, props), children);
};

var Context = /*#__PURE__*/React.createContext({
  form: false,
  column: 0
});

var _List = function _List(_ref) {
  var children = _ref.children,
      _ref$form = _ref.form,
      form = _ref$form === void 0 ? false : _ref$form,
      _ref$notBorder = _ref.notBorder,
      notBorder = _ref$notBorder === void 0 ? false : _ref$notBorder,
      _ref$column = _ref.column,
      column = _ref$column === void 0 ? 1 : _ref$column,
      _ref$layout = _ref.layout,
      layout = _ref$layout === void 0 ? 'vertical' : _ref$layout,
      _ref$fullWidth = _ref.fullWidth,
      fullWidth = _ref$fullWidth === void 0 ? false : _ref$fullWidth,
      _ref$disabled = _ref.disabled,
      disabled = _ref$disabled === void 0 ? false : _ref$disabled,
      className = _ref.className,
      props = _objectWithoutProperties(_ref, ["children", "form", "notBorder", "column", "layout", "fullWidth", "disabled", "className"]);

  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls('m78-list', className, {
      __form: form,
      '__not-border': notBorder,
      __vertical: layout === 'vertical',
      __horizontal: layout === 'horizontal',
      __inline: column > 1,
      '__full-width': fullWidth,
      __disabled: disabled
    })
  }, props), /*#__PURE__*/React.createElement(Context.Provider, {
    value: {
      form: !!form,
      column: column
    }
  }, children));
};

var Item = function Item(_ref2) {
  var left = _ref2.left,
      leftAlign = _ref2.leftAlign,
      title = _ref2.title,
      desc = _ref2.desc,
      extra = _ref2.extra,
      footLeft = _ref2.footLeft,
      footRight = _ref2.footRight,
      arrow = _ref2.arrow,
      effect = _ref2.effect,
      icon = _ref2.icon,
      disabled = _ref2.disabled,
      status = _ref2.status,
      children = _ref2.children,
      required = _ref2.required,
      _ref2$titleEllipsis = _ref2.titleEllipsis,
      titleEllipsis = _ref2$titleEllipsis === void 0 ? 2 : _ref2$titleEllipsis,
      _ref2$descEllipsis = _ref2.descEllipsis,
      descEllipsis = _ref2$descEllipsis === void 0 ? 3 : _ref2$descEllipsis,
      className = _ref2.className,
      style = _ref2.style,
      props = _objectWithoutProperties(_ref2, ["left", "leftAlign", "title", "desc", "extra", "footLeft", "footRight", "arrow", "effect", "icon", "disabled", "status", "children", "required", "titleEllipsis", "descEllipsis", "className", "style"]);

  var _useContext = useContext(Context),
      isForm = _useContext.form,
      column = _useContext.column;
  /* 点击效果出现的条件: 非表单列表、非禁用、带右箭头或带事件 */


  var hasEffect = !isForm && !disabled && (arrow || props.onClick || effect);
  var itemStyle = column > 1 ? {
    width: "".concat(100 / column, "%")
  } : {}; // const StatusIcon = (statusIcons as any)[status!];

  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls('m78-list_item __md', className, status && "__".concat(status), {
      __disabled: disabled,
      'm78-effect': hasEffect
    }),
    style: _objectSpread(_objectSpread({}, itemStyle), style)
  }, props), /*#__PURE__*/React.createElement("div", {
    className: cls('m78-list_left', leftAlign && "__".concat(leftAlign))
  }, left), /*#__PURE__*/React.createElement("div", {
    className: "m78-list_cont"
  }, (!isForm || isForm && title) && /*#__PURE__*/React.createElement("div", {
    className: "m78-list_cont-left"
  }, /*#__PURE__*/React.createElement(Ellipsis, {
    line: titleEllipsis,
    className: cls('m78-list_title')
  }, title, required && /*#__PURE__*/React.createElement("i", {
    className: "m78-list_require",
    title: "\u5FC5\u586B\u9879"
  }, "*")), desc && /*#__PURE__*/React.createElement(Ellipsis, {
    className: cls('m78-list_desc'),
    line: descEllipsis
  }, desc)), isForm && /*#__PURE__*/React.createElement("div", {
    className: "m78-list_cont-right"
  }, children)), /*#__PURE__*/React.createElement("div", {
    className: "m78-list_right"
  }, extra), /*#__PURE__*/React.createElement("div", {
    className: "m78-list_icon"
  }, /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(If, {
    when: icon
  }, icon), /*#__PURE__*/React.createElement(If, {
    when: arrow && !icon
  }, /*#__PURE__*/React.createElement(RightOutlined, null)))), /*#__PURE__*/React.createElement(If, {
    when: isForm && extra
  }, /*#__PURE__*/React.createElement("div", {
    className: "m78-list_extra __gray"
  }, extra)), /*#__PURE__*/React.createElement(If, {
    when: isForm || !!footLeft || !!footRight
  }, /*#__PURE__*/React.createElement("div", {
    className: "m78-list_extra m78-list_foot"
  }, /*#__PURE__*/React.createElement("div", null, footLeft), /*#__PURE__*/React.createElement("div", {
    className: "m78-list_extra-second"
  }, footRight)))); // return React.createElement(
  //   isForm ? 'div' : 'div',
  //   {
  //     className: cls('m78-list_item __md', className, status && `__${status}`, {
  //       __disabled: disabled,
  //       'm78-effect': hasEffect,
  //     }),
  //     style: { ...itemStyle, ...style },
  //     ...props,
  //   },
  //   <>
  //
  //   </>,
  // );
};

var List = Object.assign(_List, {
  Item: Item,
  Title: Title,
  SubTitle: SubTitle,
  Footer: Footer
});

export default List;
export { Footer, Item, SubTitle, Title };
