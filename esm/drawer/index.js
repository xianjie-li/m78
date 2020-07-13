import '@lxjx/fr/esm/drawer/style';
import _extends from '@babel/runtime/helpers/extends';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import _defineProperty from '@babel/runtime/helpers/defineProperty';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import React from 'react';
import Mask from '@lxjx/fr/esm/mask';
import { CloseCircleOutlined } from '@lxjx/fr/esm/icon';
import { If } from '@lxjx/fr/esm/fork';
import { Transition } from '@lxjx/react-transition-spring';
import _capitalize from 'lodash/capitalize';
import cls from 'classnames';
import { useSameState } from '@lxjx/hooks';

var zIndex = 1400;

var Drawer = function Drawer(_ref) {
  var _ref$show = _ref.show,
      show = _ref$show === void 0 ? true : _ref$show,
      onClose = _ref.onClose,
      onRemove = _ref.onRemove,
      _ref$hasCloseIcon = _ref.hasCloseIcon,
      hasCloseIcon = _ref$hasCloseIcon === void 0 ? false : _ref$hasCloseIcon,
      _ref$direction = _ref.direction,
      direction = _ref$direction === void 0 ? 'bottom' : _ref$direction,
      _ref$fullScreen = _ref.fullScreen,
      fullScreen = _ref$fullScreen === void 0 ? false : _ref$fullScreen,
      _ref$inside = _ref.inside,
      inside = _ref$inside === void 0 ? false : _ref$inside,
      children = _ref.children,
      className = _ref.className,
      style = _ref.style,
      namespace = _ref.namespace,
      props = _objectWithoutProperties(_ref, ["show", "onClose", "onRemove", "hasCloseIcon", "direction", "fullScreen", "inside", "children", "className", "style", "namespace"]);

  var _useSameState = useSameState('fr_drawer_metas', show, {
    direction: direction
  }),
      _useSameState2 = _slicedToArray(_useSameState, 3),
      cIndex = _useSameState2[0],
      instances = _useSameState2[1],
      instanceId = _useSameState2[2];

  var nowZIndex = cIndex === -1 ? zIndex : cIndex + zIndex; // 获取direction相同的实例

  var sameInstances = instances.filter(function (item) {
    return item.meta.direction === direction;
  }); // 当前在sameInstances实例中的位置

  var nowCIndex = sameInstances.findIndex(function (item) {
    return item.id === instanceId;
  }); // 当前实例之后有多少个实例 (总实例数 - 当前实例索引 + 1)

  var afterInstanceLength = sameInstances.length - (nowCIndex + 1); // 当存在多个drawer时，前一个相对于后一个偏移60px, 不适用于全屏模式

  var offsetStyle = fullScreen ? {} : _defineProperty({}, direction, show ? afterInstanceLength * 60 : 0);

  function close() {
    onClose && onClose();
  }

  function render() {
    return /*#__PURE__*/React.createElement(Mask, {
      namespace: namespace,
      show: show,
      visible: cIndex === 0,
      style: {
        zIndex: nowZIndex
      },
      onClose: close,
      onRemove: onRemove,
      portal: !inside,
      dark: true,
      className: cls('fr-drawer_mask', {
        __inside: inside
      })
    }, /*#__PURE__*/React.createElement(Transition, _extends({}, props, {
      className: cls('fr-drawer', direction && !fullScreen && "__".concat(direction), {
        '__full-screen': fullScreen,
        __inside: inside
      }, className),
      style: _objectSpread(_objectSpread({}, offsetStyle), {}, {
        boxShadow: show ? '' : 'none'
      }, style),
      type: "slide".concat(_capitalize(direction)),
      toggle: show,
      alpha: false,
      mountOnEnter: true,
      reset: true
    }), /*#__PURE__*/React.createElement(If, {
      when: hasCloseIcon || fullScreen
    }, /*#__PURE__*/React.createElement(CloseCircleOutlined, {
      className: "fr-drawer_close",
      onClick: close
    })), children));
  }

  return render();
};

export default Drawer;
