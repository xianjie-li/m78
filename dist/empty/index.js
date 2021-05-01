import 'm78/empty/style';
import _extends from '@babel/runtime/helpers/extends';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import React from 'react';
import { EmptyIcon } from 'm78/icon';
import cls from 'clsx';
import { m78Config } from 'm78/config';

/* 为指定的ReactElement注入m78-empty_icon类 */
function injectIconClassName(el) {
  if (!el) return null;
  return /*#__PURE__*/React.cloneElement(el, {
    className: cls('m78-empty_icon', el.props.className)
  });
}

var Empty = function Empty(_ref) {
  var desc = _ref.desc,
      children = _ref.children,
      size = _ref.size,
      emptyNode = _ref.emptyNode,
      props = _objectWithoutProperties(_ref, ["desc", "children", "size", "emptyNode"]);

  var globalEmptyNode = m78Config.useState(function (state) {
    return state.emptyNode;
  });
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls('m78-empty', size && "__".concat(size), props.className)
  }, props), injectIconClassName(emptyNode) || injectIconClassName(globalEmptyNode) ||
  /*#__PURE__*/
  // <Icon.SvgIcon type="empty" />
  React.createElement(EmptyIcon, {
    className: "m78-empty_icon"
  }), /*#__PURE__*/React.createElement("div", {
    className: "m78-empty_desc"
  }, desc), /*#__PURE__*/React.createElement("div", {
    className: "m78-empty_actions"
  }, children));
};

export { Empty };
