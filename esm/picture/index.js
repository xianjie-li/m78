import '@lxjx/fr/esm/picture/style';
import _extends from '@babel/runtime/helpers/extends';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import React, { useRef, useEffect } from 'react';
import Spin from '@lxjx/fr/esm/spin';
import config from '@lxjx/fr/esm/config';
import { useSetState } from '@lxjx/hooks';
import cls from 'classnames';

var Picture = function Picture(_ref) {
  var _ref$src = _ref.src,
      src = _ref$src === void 0 ? '' : _ref$src,
      alt = _ref.alt,
      imgClassName = _ref.imgClassName,
      imgStyle = _ref.imgStyle,
      errorImg = _ref.errorImg,
      className = _ref.className,
      style = _ref.style,
      imgProps = _ref.imgProps,
      props = _objectWithoutProperties(_ref, ["src", "alt", "imgClassName", "imgStyle", "errorImg", "className", "style", "imgProps"]);

  var wrap = useRef(null);
  var cvs = useRef(null);

  var _useSetState = useSetState({
    error: false,
    loading: false
  }),
      _useSetState2 = _slicedToArray(_useSetState, 2),
      state = _useSetState2[0],
      setState = _useSetState2[1];

  var _config$useConfig = config.useConfig(),
      pictureErrorImg = _config$useConfig.pictureErrorImg;

  var _errorImg = errorImg || pictureErrorImg;

  useEffect(function () {
    setState({
      error: false,
      loading: true
    });
    var img = new Image();

    function load() {
      setState({
        error: false,
        loading: false
      });
    }

    function loadError() {
      setState({
        error: true,
        loading: false
      });
      !_errorImg && canvasSet();
    }

    img.addEventListener('load', load);
    img.addEventListener('error', loadError);
    img.src = src;
    return function () {
      img.removeEventListener('load', load);
      img.removeEventListener('error', loadError);
    }; // eslint-disable-next-line
  }, [src]);
  /** 图片加载错误，更新canvas */

  function canvasSet() {
    if (!wrap.current) return;
    var wrapW = wrap.current.offsetWidth;
    var wrapH = wrap.current.offsetHeight;
    var canvas = cvs.current;
    var ctx = canvas.getContext('2d');
    var fontSize = wrapW / 8;
    canvas.width = wrapW;
    canvas.height = wrapH;

    if (ctx) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
      ctx.fillRect(0, 0, wrapW, wrapH);
      ctx.font = "".concat(fontSize, "px tabular-nums, Microsoft YaHei");
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText("".concat(wrapW, "X").concat(wrapH), wrapW / 2, wrapH / 2 * 1.04
      /* 视觉上更居中 */
      );
    }
  }

  return /*#__PURE__*/React.createElement("span", _extends({}, props, {
    ref: wrap,
    className: cls('fr-picture', className),
    style: style
  }), !state.error && /*#__PURE__*/React.createElement("img", _extends({}, imgProps, {
    alt: alt,
    src: src,
    className: imgClassName,
    style: imgStyle
  })), state.error && (_errorImg ? /*#__PURE__*/React.createElement("img", {
    src: _errorImg,
    alt: ""
  }) : /*#__PURE__*/React.createElement("canvas", {
    ref: cvs
  })), /*#__PURE__*/React.createElement(Spin, {
    show: state.loading,
    full: true,
    text: "\u56FE\u7247\u52A0\u8F7D\u4E2D"
  }));
};

export default Picture;
