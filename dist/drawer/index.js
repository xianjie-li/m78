import 'm78/drawer/style';
import _extends from '@babel/runtime/helpers/extends';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import _defineProperty from '@babel/runtime/helpers/defineProperty';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import React, { useMemo } from 'react';
import { Modal } from 'm78/modal';
import { Button } from 'm78/button';
import { CloseOutlined } from 'm78/icon';
import { If } from 'm78/fork';
import _capitalize from 'lodash/capitalize';
import cls from 'clsx';
import { useFormState, useSameState } from '@lxjx/hooks';
import { Z_INDEX_DRAWER } from 'm78/util';

var alignmentMap = {
  top: [0, 0],
  right: [1, 0],
  bottom: [0, 1],
  left: [0, 0]
};
var spConfig = {
  clamp: true
};

var Drawer = function Drawer(props) {
  var _props$closeIcon = props.closeIcon,
      closeIcon = _props$closeIcon === void 0 ? false : _props$closeIcon,
      _props$direction = props.direction,
      direction = _props$direction === void 0 ? 'bottom' : _props$direction,
      _props$fullScreen = props.fullScreen,
      fullScreen = _props$fullScreen === void 0 ? false : _props$fullScreen,
      className = props.className,
      style = props.style,
      children = props.children,
      otherProps = _objectWithoutProperties(props, ["closeIcon", "direction", "fullScreen", "className", "style", "children"]);
  /** 代理defaultShow/show/onChange, 实现对应接口 */


  var _useFormState = useFormState(props, false, {
    defaultValueKey: 'defaultShow',
    triggerKey: 'onChange',
    valueKey: 'show'
  }),
      _useFormState2 = _slicedToArray(_useFormState, 2),
      show = _useFormState2[0],
      setShow = _useFormState2[1];

  var _useSameState = useSameState('fr_drawer_metas', {
    enable: show,
    meta: {
      direction: direction
    }
  }),
      _useSameState2 = _slicedToArray(_useSameState, 3),
      ___ = _useSameState2[0],
      instances = _useSameState2[1],
      instanceId = _useSameState2[2]; // 所有方向相同，未启用fullScreen的组件


  var sames = instances.filter(function (item) {
    return item.meta.direction === direction && !fullScreen;
  }); // 该实例后的实例总数

  var afterInstanceLength = useMemo(function () {
    if (!show || !sames.length) return 0;
    var ind = sames.findIndex(function (item) {
      return item.id === instanceId;
    });
    var after = sames.slice(ind + 1);
    return after.length > 0 ? after.length : 0;
  }, [sames, ___]);

  var capDirection = _capitalize(direction);

  var marginType = 'left';

  if (direction === 'bottom' || direction === 'top') {
    marginType = 'top';
  } // 当存在多个drawer时，前一个相对于后一个偏移60px, 不适用于全屏模式


  var offsetStyle = !fullScreen && show && afterInstanceLength > 0 ? _defineProperty({}, "margin".concat(_capitalize(marginType)), direction === 'right' || direction === 'bottom' ? -afterInstanceLength * 50 : afterInstanceLength * 50) : {};

  function onClose() {
    var _props$onClose;

    setShow(false);
    (_props$onClose = props.onClose) === null || _props$onClose === void 0 ? void 0 : _props$onClose.call(props);
  }

  function render() {
    return /*#__PURE__*/React.createElement(Modal, _extends({}, otherProps, {
      namespace: "drawer",
      className: cls('m78-drawer', {
        '__full-screen': fullScreen
      }, direction && !fullScreen && "__".concat(direction), className),
      style: _objectSpread(_objectSpread({}, style), offsetStyle),
      baseZIndex: Z_INDEX_DRAWER,
      show: show,
      onChange: function onChange(nShow) {
        return setShow(nShow);
      },
      animationType: "slide".concat(capDirection) || 'bottom',
      alignment: alignmentMap[direction],
      animationConfig: spConfig,
      alpha: false
    }), /*#__PURE__*/React.createElement(If, {
      when: closeIcon || fullScreen
    }, /*#__PURE__*/React.createElement("div", {
      className: "m78-drawer_close"
    }, /*#__PURE__*/React.createElement(Button, {
      icon: true,
      onClick: onClose,
      size: "small"
    }, /*#__PURE__*/React.createElement(CloseOutlined, {
      className: "m78-close-icon"
    })))), children);
  }

  return render();
};

export { Drawer };
