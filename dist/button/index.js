import 'm78/button/style';
import _defineProperty from '@babel/runtime/helpers/defineProperty';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import React, { useMemo } from 'react';
import Spin from 'm78/spin';
import 'm78/base';
import { isArray } from '@lxjx/utils';
import cls from 'classnames';

var ButtonColorEnum;

(function (ButtonColorEnum) {
  ButtonColorEnum["blue"] = "blue";
  ButtonColorEnum["red"] = "red";
  ButtonColorEnum["green"] = "green";
  ButtonColorEnum["yellow"] = "yellow";
  ButtonColorEnum["primary"] = "primary";
})(ButtonColorEnum || (ButtonColorEnum = {}));

var sizeMap = {
  large: 12,
  small: 8,
  mini: 6
};
var matchIcon = /.?(Outlined|Filled|TwoTone|Icon)$/;
/* 该函数用于遍历Button的children，当存在Icon和SvgIcon时(非函数匹配, 函数组件name能就会添加)，为其添加适当边距并返回 */

function formatChildren(children) {
  var offset = 4;

  if (isArray(children)) {
    return children.map(function (child, index) {
      var type = child === null || child === void 0 ? void 0 : child.type;
      var name = '';

      if (type) {
        var _type$render, _type$render2;

        name = ((_type$render = type.render) === null || _type$render === void 0 ? void 0 : _type$render.displayName) || ((_type$render2 = type.render) === null || _type$render2 === void 0 ? void 0 : _type$render2.name) || type.name;
      }
      /* 为满足matchIcon规则的子元素添加边距 */


      if (name && /*#__PURE__*/React.isValidElement(child) && matchIcon.test(name)) {
        var injectStyle = {
          marginLeft: offset,
          marginRight: offset
        };

        if (index === 0) {
          injectStyle = {
            marginRight: offset
          };
        }

        if (index === children.length - 1) {
          injectStyle = {
            marginLeft: offset
          };
        }

        var newStyle = _objectSpread(_objectSpread({}, child.props.style), injectStyle);

        return /*#__PURE__*/React.cloneElement(child, {
          style: newStyle,
          key: index
        });
      }

      return child;
    });
  }

  return children;
}
/*
 * large 38
 * default 30
 * small 26
 * mini 20
 * */


function Button(btnProps) {
  var _cls;

  var _ref = btnProps,
      size = _ref.size,
      color = _ref.color,
      circle = _ref.circle,
      outline = _ref.outline,
      block = _ref.block,
      icon = _ref.icon,
      disabled = _ref.disabled,
      loading = _ref.loading,
      md = _ref.md,
      win = _ref.win,
      children = _ref.children,
      className = _ref.className,
      text = _ref.text,
      href = _ref.href,
      _ref$shadow = _ref.shadow,
      shadow = _ref$shadow === void 0 ? true : _ref$shadow,
      props = _objectWithoutProperties(_ref, ["size", "color", "circle", "outline", "block", "icon", "disabled", "loading", "md", "win", "children", "className", "text", "href", "shadow"]);

  var classNames = cls(className, 'm78-btn', 'm78-effect', (_cls = {}, _defineProperty(_cls, "__".concat(color), color), _defineProperty(_cls, "__".concat(size), size), _defineProperty(_cls, "__circle", circle), _defineProperty(_cls, "__outline", outline), _defineProperty(_cls, "__block", block), _defineProperty(_cls, "__text", text), _defineProperty(_cls, "__icon", icon), _defineProperty(_cls, "__md", md), _defineProperty(_cls, "__win", win), _defineProperty(_cls, "__light", !!color && !text && !icon), _defineProperty(_cls, "__shadow", shadow), _defineProperty(_cls, "__disabled", disabled || loading), _cls));
  var newChildren = useMemo(function () {
    return formatChildren(children);
  }, [children]);
  var isLink = !!href;
  return /*#__PURE__*/React.createElement(href ? 'a' : 'button', _objectSpread(_objectSpread({
    type: isLink ? undefined : 'button',
    // 禁用默认的submit类型
    href: href
  }, props), {}, {
    className: classNames,
    disabled: !!disabled || !!loading
  }), /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spin, {
    style: {
      fontSize: size ? sizeMap[size] : 10,
      color: '#333'
    },
    show: !!loading,
    full: true,
    text: ""
  }), /*#__PURE__*/React.createElement("span", null, newChildren)));
}

export default Button;
export { ButtonColorEnum };
