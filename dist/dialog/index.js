import 'm78/dialog/style';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import _extends from '@babel/runtime/helpers/extends';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import React from 'react';
import 'm78/base';
import Button from 'm78/button';
import Modal from 'm78/modal';
import { Transition } from '@lxjx/react-transition-spring';
import { config } from 'react-spring';
import { statusIcons, CloseOutlined } from 'm78/icon';
import Spin from 'm78/spin';
import { useFormState } from '@lxjx/hooks';
import cls from 'classnames';
import createRenderApi from '@lxjx/react-render-api';

var DialogBase = function DialogBase(props) {
  var flexBtn = props.flexBtn,
      _props$maxWidth = props.maxWidth,
      maxWidth = _props$maxWidth === void 0 ? 360 : _props$maxWidth,
      footer = props.footer,
      header = props.header,
      _props$title = props.title,
      title = _props$title === void 0 ? '提示' : _props$title,
      _props$close = props.close,
      close = _props$close === void 0 ? false : _props$close,
      _props$confirm = props.confirm,
      confirm = _props$confirm === void 0 ? '确认' : _props$confirm,
      _props$closeIcon = props.closeIcon,
      closeIcon = _props$closeIcon === void 0 ? true : _props$closeIcon,
      _props$loading = props.loading,
      loading = _props$loading === void 0 ? false : _props$loading,
      _props$btns = props.btns,
      btns = _props$btns === void 0 ? [] : _props$btns,
      children = props.children,
      status = props.status,
      contentClassName = props.contentClassName,
      footerClassName = props.footerClassName,
      headerClassName = props.headerClassName,
      className = props.className,
      style = props.style,
      clickAwayClosable = props.clickAwayClosable,
      _props$confirmClose = props.confirmClose,
      confirmClose = _props$confirmClose === void 0 ? true : _props$confirmClose,
      other = _objectWithoutProperties(props, ["flexBtn", "maxWidth", "footer", "header", "title", "close", "confirm", "closeIcon", "loading", "btns", "children", "status", "contentClassName", "footerClassName", "headerClassName", "className", "style", "clickAwayClosable", "confirmClose"]);
  /** 代理defaultShow/show/onChange, 实现对应接口 */


  var _useFormState = useFormState(props, false, {
    defaultValueKey: 'defaultShow',
    triggerKey: 'onChange',
    valueKey: 'show'
  }),
      _useFormState2 = _slicedToArray(_useFormState, 2),
      show = _useFormState2[0],
      setShow = _useFormState2[1];

  function onClose() {
    var _props$onClose;

    var isConfirm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    setShow(false);
    (_props$onClose = props.onClose) === null || _props$onClose === void 0 ? void 0 : _props$onClose.call(props, isConfirm);
  }

  function renderDefaultFooter() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, close && /*#__PURE__*/React.createElement(Button, {
      onClick: function onClick() {
        return onClose();
      }
    }, typeof close === 'string' ? close : '取消'), confirm && /*#__PURE__*/React.createElement(Button, {
      color: "primary",
      onClick: function onClick() {
        confirmClose && onClose(true);
      }
    }, typeof confirm === 'string' ? confirm : '确认'));
  }

  function renderBtns() {
    if (btns.length === 0) return null;
    return btns.map(function (_ref, key) {
      var text = _ref.text,
          btnProps = _objectWithoutProperties(_ref, ["text"]);

      return /*#__PURE__*/React.createElement(Button, _extends({
        key: key
      }, btnProps), text);
    });
  }

  function renderDefault() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: cls('m78-dialog_title', headerClassName)
    }, header || /*#__PURE__*/React.createElement("span", null, title)), /*#__PURE__*/React.createElement("div", {
      className: cls('m78-dialog_cont', contentClassName)
    }, children), /*#__PURE__*/React.createElement("div", {
      className: cls('m78-dialog_footer', footerClassName, {
        __full: flexBtn
      })
    }, footer || renderBtns() || renderDefaultFooter()));
  }

  var StatusIcon = statusIcons[status];
  return /*#__PURE__*/React.createElement(Modal, _extends({}, other, {
    onClose: props.onClose,
    className: cls('m78-dialog m78-scroll-bar', className),
    style: _objectSpread(_objectSpread({}, style), {}, {
      maxWidth: maxWidth
    }),
    clickAwayClosable: loading ? false : clickAwayClosable,
    show: show,
    onChange: function onChange(nShow) {
      return setShow(nShow);
    }
  }), status && /*#__PURE__*/React.createElement("div", {
    className: "m78-dialog_status-warp"
  }, /*#__PURE__*/React.createElement(Transition, {
    className: "m78-dialog_status",
    alpha: false,
    toggle: show,
    type: "slideLeft",
    config: config.slow
  }, /*#__PURE__*/React.createElement(StatusIcon, null))), closeIcon && /*#__PURE__*/React.createElement(Button, {
    icon: true,
    className: "m78-dialog_close-icon",
    onClick: function onClick() {
      return onClose();
    },
    size: "small"
  }, /*#__PURE__*/React.createElement(CloseOutlined, {
    className: "m78-close-icon"
  })), /*#__PURE__*/React.createElement(Spin, {
    full: true,
    show: loading,
    text: "\u8BF7\u7A0D\u540E"
  }), renderDefault());
};

var api = createRenderApi(DialogBase, {
  namespace: 'MODAL'
});

var baseApi = function baseApi(_ref2) {
  var content = _ref2.content,
      other = _objectWithoutProperties(_ref2, ["content"]);

  return api(_objectSpread(_objectSpread({}, other), {}, {
    children: content,
    triggerNode: null
  }));
};

var Dialog = Object.assign(DialogBase, {
  api: baseApi
});

export default Dialog;
