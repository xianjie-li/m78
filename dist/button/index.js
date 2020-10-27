import 'm78/button/style';
import _extends from '@babel/runtime/helpers/extends';
import _defineProperty from '@babel/runtime/helpers/defineProperty';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import React, { useMemo } from 'react';
import Spin from 'm78/spin';
import 'm78/base';
import { isArray } from '@lxjx/utils';
import cls from 'classnames';

var sizeMap = {
  large: 18,
  small: 14,
  mini: 12
};
var matchIcon = /.?(Outlined|Filled|TwoTone|Icon)$/;
/* 该函数用于遍历Button的children，当存在Icon和SvgIcon时(非函数匹配, 函数组件name能就会添加)，为其添加适当边距并返回 */

function formatChildren(children) {
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
          marginLeft: 8,
          marginRight: 8
        };

        if (index === 0) {
          injectStyle = {
            marginRight: 8
          };
        }

        if (index === children.length - 1) {
          injectStyle = {
            marginLeft: 8
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


var Button = function Button(_ref) {
  var _cls;

  var size = _ref.size,
      color = _ref.color,
      circle = _ref.circle,
      outline = _ref.outline,
      block = _ref.block,
      link = _ref.link,
      icon = _ref.icon,
      disabled = _ref.disabled,
      loading = _ref.loading,
      md = _ref.md,
      win = _ref.win,
      children = _ref.children,
      className = _ref.className,
      href = _ref.href,
      props = _objectWithoutProperties(_ref, ["size", "color", "circle", "outline", "block", "link", "icon", "disabled", "loading", "md", "win", "children", "className", "href"]);

  var classNames = cls(className, 'm78-btn', 'm78-effect', (_cls = {}, _defineProperty(_cls, "__".concat(color), color), _defineProperty(_cls, "__".concat(size), size), _defineProperty(_cls, "__circle", circle), _defineProperty(_cls, "__outline", outline), _defineProperty(_cls, "__block", block), _defineProperty(_cls, "__link", link), _defineProperty(_cls, "__icon", icon), _defineProperty(_cls, "__md", md), _defineProperty(_cls, "__win", win), _defineProperty(_cls, "__light", !!color && !link && !icon), _defineProperty(_cls, "__disabled", disabled || loading), _cls));
  var newChildren = useMemo(function () {
    return formatChildren(children);
  }, [children]);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button"
  }, props, {
    className: classNames,
    disabled: !!disabled || !!loading
  }), link && /*#__PURE__*/React.createElement("a", {
    className: "m78-btn__link",
    href: href
  }), /*#__PURE__*/React.createElement(Spin, {
    style: {
      fontSize: size ? sizeMap[size] : 14,
      color: '#333'
    },
    show: !!loading,
    full: true,
    text: ""
  }), /*#__PURE__*/React.createElement("span", null, newChildren));
};

export default Button;
