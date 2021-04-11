import 'm78/spin/style';
import _extends from '@babel/runtime/helpers/extends';
import _defineProperty from '@babel/runtime/helpers/defineProperty';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import React from 'react';
import { WindmillIcon } from 'm78/icon';
import { useDelayDerivedToggleStatus } from 'm78/hooks';
import { Transition, config } from '@lxjx/react-transition-spring';
import cls from 'classnames';

var Spin = function Spin(_ref) {
  var _cls;

  var size = _ref.size,
      inline = _ref.inline,
      _ref$text = _ref.text,
      text = _ref$text === void 0 ? '加载中' : _ref$text,
      full = _ref.full,
      _ref$show = _ref.show,
      show = _ref$show === void 0 ? true : _ref$show,
      className = _ref.className,
      _ref$loadingDelay = _ref.loadingDelay,
      loadingDelay = _ref$loadingDelay === void 0 ? 0 : _ref$loadingDelay,
      props = _objectWithoutProperties(_ref, ["size", "inline", "text", "full", "show", "className", "loadingDelay"]);

  var innerShow = useDelayDerivedToggleStatus(show, loadingDelay);
  return /*#__PURE__*/React.createElement(Transition, _extends({
    toggle: innerShow,
    type: "fade",
    mountOnEnter: true,
    unmountOnExit: true
  }, props, {
    config: config.stiff,
    className: cls(className, 'm78-spin', (_cls = {}, _defineProperty(_cls, "__".concat(size), !!size), _defineProperty(_cls, "__inline", inline), _defineProperty(_cls, "__full", full), _cls))
  }), /*#__PURE__*/React.createElement(WindmillIcon, {
    className: "m78-spin_unit"
  }), text && /*#__PURE__*/React.createElement("span", {
    className: "m78-spin_text"
  }, text, /*#__PURE__*/React.createElement("span", {
    className: "m78-spin_ellipsis"
  })));
};

export default Spin;
