import 'm78/mask/style';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import React from 'react';
import { useToggle, useUpdateEffect } from 'react-use';
import { useLockBodyScroll } from '@lxjx/hooks';
import { Transition } from '@lxjx/react-transition-spring';
import Portal from 'm78/portal';
import cls from 'classnames';

/**
 *  与RenderApi配合使用, 为弹层类组件提供mask并且支持代理RenderApi的部分操作
 *  mask层和内容是分开渲染的，否则mask的fade动画会影响到内容
 *  mask不会处理内容的动画、显示隐藏等，需要自行实现
 *  透传组件的ReactRenderApiProps到mask，使其能够在合适时机处理api内部方法的调用
 *  */
var Mask = function Mask(_ref) {
  var _ref$mask = _ref.mask,
      mask = _ref$mask === void 0 ? true : _ref$mask,
      _ref$visible = _ref.visible,
      visible = _ref$visible === void 0 ? true : _ref$visible,
      _ref$maskClosable = _ref.maskClosable,
      maskClosable = _ref$maskClosable === void 0 ? true : _ref$maskClosable,
      _ref$show = _ref.show,
      show = _ref$show === void 0 ? false : _ref$show,
      onClose = _ref.onClose,
      onRemove = _ref.onRemove,
      _ref$onRemoveDelay = _ref.onRemoveDelay,
      onRemoveDelay = _ref$onRemoveDelay === void 0 ? 800 : _ref$onRemoveDelay,
      _ref$unlockDelay = _ref.unlockDelay,
      unlockDelay = _ref$unlockDelay === void 0 ? 360 : _ref$unlockDelay,
      _ref$portal = _ref.portal,
      portal = _ref$portal === void 0 ? true : _ref$portal,
      className = _ref.className,
      style = _ref.style,
      children = _ref.children,
      namespace = _ref.namespace,
      dark = _ref.dark;

  var _useToggle = useToggle(show),
      _useToggle2 = _slicedToArray(_useToggle, 2),
      lock = _useToggle2[0],
      toggleLock = _useToggle2[1];

  useLockBodyScroll(lock);
  useUpdateEffect(function removeInstance() {
    if (!show && onRemove) {
      setTimeout(onRemove, onRemoveDelay);
    }

    if (show) toggleLock(true);

    if (!show) {
      setTimeout(function () {
        toggleLock(false);
      }, unlockDelay);
    } // eslint-disable-next-line

  }, [show]);

  function render() {
    return /*#__PURE__*/React.createElement("div", {
      className: cls('m78-mask_wrap', className),
      style: style
    }, mask && /*#__PURE__*/React.createElement("div", {
      className: "m78-mask_inner",
      style: {
        opacity: visible ? 1 : 0
      }
    }, /*#__PURE__*/React.createElement(Transition, {
      onClick: maskClosable ? onClose : undefined,
      toggle: show,
      type: "fade",
      className: cls('m78-mask-node', dark ? 'm78-mask-b' : 'm78-mask'),
      mountOnEnter: true,
      unmountOnExit: true
    })), children);
  }

  return portal ? /*#__PURE__*/React.createElement(Portal, {
    namespace: namespace
  }, render()) : render();
};

export default Mask;
