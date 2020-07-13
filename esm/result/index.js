import '@lxjx/fr/esm/result/style';
import React from 'react';
import { statusIcons } from '@lxjx/fr/esm/icon';
import Fork from '@lxjx/fr/esm/fork';
import Portal from '@lxjx/fr/esm/portal';
import { Transition, config } from '@lxjx/react-transition-spring';
import cls from 'classnames';

/* 用于标记哪些Icon.Svg需要添加特殊的status样式 */
var statusResultList = ['notFound', 'serverError', 'notAuth'];

var Result = function Result(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'success' : _ref$type,
      _ref$title = _ref.title,
      title = _ref$title === void 0 ? '操作成功!' : _ref$title,
      desc = _ref.desc,
      children = _ref.children,
      actions = _ref.actions,
      _ref$show = _ref.show,
      show = _ref$show === void 0 ? true : _ref$show,
      _ref$fixed = _ref.fixed,
      fixed = _ref$fixed === void 0 ? false : _ref$fixed;
  var StatusIcon = statusIcons[type];

  function render() {
    return /*#__PURE__*/React.createElement(Transition, {
      type: fixed ? 'zoom' : 'fade',
      toggle: show,
      config: config.stiff,
      mountOnEnter: true,
      unmountOnExit: true,
      className: cls('fr-result', {
        __fixed: fixed
      })
    }, /*#__PURE__*/React.createElement("div", {
      className: "fr-result_cont"
    }, /*#__PURE__*/React.createElement("div", {
      className: cls('fr-result_icon', {
        __waiting: type === 'waiting'
      })
    }, /*#__PURE__*/React.createElement(StatusIcon, {
      type: type,
      className: cls({
        'fr-result_status-img': statusResultList.includes(type)
      })
    })), /*#__PURE__*/React.createElement(Fork.If, {
      when: title
    }, /*#__PURE__*/React.createElement("div", {
      className: "fr-result_title"
    }, title)), /*#__PURE__*/React.createElement(Fork.If, {
      when: !!desc
    }, /*#__PURE__*/React.createElement("div", {
      className: "fr-result_desc"
    }, desc)), /*#__PURE__*/React.createElement(Fork.If, {
      when: !!children
    }, /*#__PURE__*/React.createElement("div", {
      className: "fr-result_extra"
    }, children)), /*#__PURE__*/React.createElement(Fork.If, {
      when: !!actions
    }, /*#__PURE__*/React.createElement("div", {
      className: "fr-result_btns"
    }, actions))));
  }

  return fixed ? /*#__PURE__*/React.createElement(Portal, null, render()) : render();
};

export default Result;
