import '@lxjx/fr/esm/modal/style';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import _extends from '@babel/runtime/helpers/extends';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import React, { useMemo } from 'react';
import '@lxjx/fr/esm/base';
import ShowFromMouse from '@lxjx/fr/esm/show-from-mouse';
import Button from '@lxjx/fr/esm/button';
import { Transition } from '@lxjx/react-transition-spring';
import { config } from 'react-spring';
import { statusIcons, CloseOutlined } from '@lxjx/fr/esm/icon';
import Spin from '@lxjx/fr/esm/spin';
import { dumpFn } from '@lxjx/fr/esm/util';
import { useSameState } from '@lxjx/hooks';
import createRenderApi from '@lxjx/react-render-api';
import cls from 'classnames';

var zIndex = 1800;

var _Modal = function _Modal(_ref) {
  var show = _ref.show,
      _ref$onRemove = _ref.onRemove,
      onRemove = _ref$onRemove === void 0 ? dumpFn : _ref$onRemove,
      _ref$onClose = _ref.onClose,
      onClose = _ref$onClose === void 0 ? dumpFn : _ref$onClose,
      flexBtn = _ref.flexBtn,
      _ref$maxWidth = _ref.maxWidth,
      maxWidth = _ref$maxWidth === void 0 ? 360 : _ref$maxWidth,
      footer = _ref.footer,
      header = _ref.header,
      _ref$title = _ref.title,
      title = _ref$title === void 0 ? '提示' : _ref$title,
      _ref$mask = _ref.mask,
      mask = _ref$mask === void 0 ? true : _ref$mask,
      _ref$maskClosable = _ref.maskClosable,
      maskClosable = _ref$maskClosable === void 0 ? true : _ref$maskClosable,
      _ref$onConfirm = _ref.onConfirm,
      onConfirm = _ref$onConfirm === void 0 ? dumpFn : _ref$onConfirm,
      _ref$close = _ref.close,
      close = _ref$close === void 0 ? false : _ref$close,
      _ref$confirm = _ref.confirm,
      confirm = _ref$confirm === void 0 ? '确认' : _ref$confirm,
      _ref$closeIcon = _ref.closeIcon,
      closeIcon = _ref$closeIcon === void 0 ? true : _ref$closeIcon,
      _ref$loading = _ref.loading,
      loading = _ref$loading === void 0 ? false : _ref$loading,
      _ref$btns = _ref.btns,
      btns = _ref$btns === void 0 ? [] : _ref$btns,
      children = _ref.children,
      status = _ref.status,
      contentClassName = _ref.contentClassName,
      footerClassName = _ref.footerClassName,
      headerClassName = _ref.headerClassName,
      className = _ref.className,
      style = _ref.style,
      content = _ref.content,
      namespace = _ref.namespace;

  var _useSameState = useSameState('fr_modal_metas', !!show, {
    mask: mask
  }),
      _useSameState2 = _slicedToArray(_useSameState, 2),
      cIndex = _useSameState2[0],
      instances = _useSameState2[1];

  var nowZIndex = cIndex === -1 ? zIndex : cIndex + zIndex; // 当前实例之前所有实例组成的数组

  var beforeInstance = instances.slice(0, cIndex); // 在该实例之前是否有任意一个实例包含mask

  var beforeHasMask = beforeInstance.some(function (item) {
    return item.meta.mask;
  });
  var dpr = useMemo(function () {
    return window.devicePixelRatio || 1;
  }, []);

  function renderDefaultFooter() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, close && /*#__PURE__*/React.createElement(Button, {
      onClick: function onClick() {
        return onClose();
      }
    }, typeof close === 'string' ? close : '取消'), confirm && /*#__PURE__*/React.createElement(Button, {
      color: "primary",
      onClick: function onClick() {
        return onConfirm();
      }
    }, typeof confirm === 'string' ? confirm : '确认'));
  }

  function renderBtns() {
    if (btns.length === 0) return null;
    return btns.map(function (_ref2, key) {
      var text = _ref2.text,
          btnProps = _objectWithoutProperties(_ref2, ["text"]);

      return /*#__PURE__*/React.createElement(Button, _extends({
        key: key
      }, btnProps), text);
    });
  }

  function renderDefault() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: cls('fr-modal_title', headerClassName)
    }, header || /*#__PURE__*/React.createElement("span", null, title)), /*#__PURE__*/React.createElement("div", {
      className: cls('fr-modal_cont', contentClassName)
    }, children), /*#__PURE__*/React.createElement("div", {
      className: cls('fr-modal_footer', footerClassName, {
        __full: flexBtn
      })
    }, footer || renderBtns() || renderDefaultFooter()));
  }

  var StatusIcon = statusIcons[status];
  return /*#__PURE__*/React.createElement(ShowFromMouse, {
    namespace: namespace,
    mask: mask,
    visible: !beforeHasMask,
    maskClosable: loading ? false : maskClosable,
    style: {
      zIndex: nowZIndex,
      top: cIndex * 20 / dpr,
      left: cIndex * 20 / dpr
    },
    contClassName: cls('fr-modal', className),
    className: "fr-modal_wrap",
    contStyle: _objectSpread(_objectSpread({}, style), {}, {
      maxWidth: maxWidth,
      padding: content ? 0 : ''
    }),
    show: show,
    onRemove: onRemove,
    onClose: onClose
  }, status && /*#__PURE__*/React.createElement("div", {
    className: "fr-modal_status-warp"
  }, /*#__PURE__*/React.createElement(Transition, {
    className: "fr-modal_status",
    alpha: false,
    toggle: show,
    type: "slideLeft",
    config: config.slow
  }, /*#__PURE__*/React.createElement(StatusIcon, null))), closeIcon && /*#__PURE__*/React.createElement(Button, {
    icon: true,
    className: "fr-modal_close-icon",
    onClick: function onClick() {
      return onClose();
    },
    size: "small"
  }, /*#__PURE__*/React.createElement(CloseOutlined, null)), /*#__PURE__*/React.createElement(Spin, {
    full: true,
    show: loading,
    text: "\u8BF7\u7A0D\u540E"
  }), content || renderDefault());
};

var api = createRenderApi(_Modal, {
  namespace: 'MODAL'
});
var Modal = Object.assign(_Modal, {
  api: api
});

export default Modal;
