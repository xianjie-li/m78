import 'm78/ellipsis/style';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import React, { useState, useEffect } from 'react';
import { getStyle } from '@lxjx/utils';
import cls from 'classnames';

function multiLine(line) {
  return {
    WebkitLineClamp: line,
    WebkitBoxOrient: 'vertical',
    display: '-webkit-box'
  };
}

var Ellipsis = function Ellipsis(_ref) {
  var _ref$line = _ref.line,
      line = _ref$line === void 0 ? 1 : _ref$line,
      _ref$forceCompat = _ref.forceCompat,
      forceCompat = _ref$forceCompat === void 0 ? false : _ref$forceCompat,
      _ref$disabled = _ref.disabled,
      disabled = _ref$disabled === void 0 ? false : _ref$disabled,
      className = _ref.className,
      style = _ref.style,
      children = _ref.children;
  var el = React.useRef(null);

  var _useState = useState({
    height: '',
    oneHeight: 0,
    supportLineClamp: 'webkitLineClamp' in document.body.style
  }),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];
  /* 不支持LineClamp 且大于1行; 传force时强制开启 */


  var shouldAddShadow = !state.supportLineClamp && line > 1 || forceCompat;
  /* 非shouldAddShadow且大于1行启用多行省略 */

  var extraStyle = !shouldAddShadow && line > 1 ? multiLine(line) : {};
  useEffect(function () {
    if (!shouldAddShadow) return;
    addShadowBlock(); // eslint-disable-next-line
  }, [shouldAddShadow]);

  function addShadowBlock() {
    var _getStyle = getStyle(el.current),
        lineHeight = _getStyle.lineHeight;

    var calcHeight = "".concat(line, "em"); // 不兼容时使用em进行退级处理

    var oneHeight = 0; // 退级处理

    if (lineHeight) {
      oneHeight = +lineHeight.replace('px', '');
      calcHeight = "".concat(oneHeight * line, "px"); // 总高度 单行高度 + 行数
    }

    setState(function (prev) {
      return {
        height: calcHeight,
        oneHeight: oneHeight,
        supportLineClamp: prev.supportLineClamp
      };
    });
  }

  if (disabled) {
    /* 没有挂载点的话会导致开关后样式不统一 */
    return /*#__PURE__*/React.createElement("div", {
      className: className,
      style: style
    }, children);
  }

  return /*#__PURE__*/React.createElement("div", {
    ref: el,
    className: cls('m78-ellipsis', className, {
      ellipsis: !shouldAddShadow && line === 1
    }),
    style: _objectSpread(_objectSpread({
      maxHeight: state.height || ''
    }, extraStyle), style)
  }, children, shouldAddShadow && /*#__PURE__*/React.createElement("span", {
    className: "m78-ellipsis_shadow",
    style: {
      height: state.oneHeight,
      top: "".concat(state.oneHeight * (line - 1), "px")
    }
  }));
};

export default Ellipsis;
