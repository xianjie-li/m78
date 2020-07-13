import '@lxjx/fr/esm/empty/style';
import _extends from '@babel/runtime/helpers/extends';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import React from 'react';
import { EmptyIcon } from '@lxjx/fr/esm/icon';
import config from '@lxjx/fr/esm/config';
import cls from 'classnames';

/* 为指定的ReactElement注入fr-empty_icon类 */
function injectIconClassName(el) {
  if (!el) return null;
  return /*#__PURE__*/React.cloneElement(el, {
    className: cls('fr-empty_icon', el.props.className)
  });
}

var Empty = function Empty(_ref) {
  var desc = _ref.desc,
      children = _ref.children,
      size = _ref.size,
      emptyNode = _ref.emptyNode,
      props = _objectWithoutProperties(_ref, ["desc", "children", "size", "emptyNode"]);

  var _config$useConfig = config.useConfig(),
      globalEmptyNode = _config$useConfig.emptyNode;

  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls('fr-empty', size && "__".concat(size), props.className)
  }, props), injectIconClassName(emptyNode) || injectIconClassName(globalEmptyNode) ||
  /*#__PURE__*/
  // <Icon.SvgIcon type="empty" />
  React.createElement(EmptyIcon, {
    className: "fr-empty_icon"
  }), /*#__PURE__*/React.createElement("div", {
    className: "fr-empty_desc"
  }, desc), /*#__PURE__*/React.createElement("div", {
    className: "fr-empty_actions"
  }, children));
};

export default Empty;
