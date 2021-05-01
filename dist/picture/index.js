import 'm78/picture/style';
import _extends from '@babel/runtime/helpers/extends';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import React, { useRef, useEffect } from 'react';
import { Spin } from 'm78/spin';
import { useSetState } from '@lxjx/hooks';
import cls from 'clsx';
import { m78Config } from 'm78/config';

/* 组件必须有实际的尺寸 */

var Picture = function Picture(_ref) {
  var _ref$src = _ref.src,
      src = _ref$src === void 0 ? '' : _ref$src,
      alt = _ref.alt,
      imgClassName = _ref.imgClassName,
      imgStyle = _ref.imgStyle,
      errorImg = _ref.errorImg,
      errorNode = _ref.errorNode,
      className = _ref.className,
      style = _ref.style,
      imgProps = _ref.imgProps,
      props = _objectWithoutProperties(_ref, ["src", "alt", "imgClassName", "imgStyle", "errorImg", "errorNode", "className", "style", "imgProps"]);

  var wrap = useRef(null);

  var _useSetState = useSetState({
    error: false,
    loading: false,
    style: undefined,
    text: ''
  }),
      _useSetState2 = _slicedToArray(_useSetState, 2),
      state = _useSetState2[0],
      setState = _useSetState2[1];

  var pictureErrorImg = m78Config.useState(function (st) {
    return st.pictureErrorImg;
  });

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
      !_errorImg && placeholderUpdate();
    }

    img.addEventListener('load', load);
    img.addEventListener('error', loadError);
    img.src = src;
    return function () {
      img.removeEventListener('load', load);
      img.removeEventListener('error', loadError);
    }; // eslint-disable-next-line
  }, [src]);
  /** 图片加载错误，更新占位节点样式 */

  function placeholderUpdate() {
    if (!wrap.current) return;
    var wrapW = wrap.current.offsetWidth;
    var wrapH = wrap.current.offsetHeight;
    setState({
      style: {
        width: wrapW,
        height: wrapH,
        fontSize: wrapW / 8
      },
      text: errorNode || "".concat(wrapW, "X").concat(wrapH)
    }); // const canvas = cvs.current;
    //
    // const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    // const fontSize = wrapW / 8;
    //
    // canvas.width = wrapW;
    // canvas.height = wrapH;
    //
    // if (ctx) {
    //   ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
    //   ctx.fillRect(0, 0, wrapW, wrapH);
    //
    //   ctx.font = `${fontSize}px tabular-nums, Microsoft YaHei`;
    //   ctx.fillStyle = '#fff';
    //   ctx.textAlign = 'center';
    //   ctx.textBaseline = 'middle';
    //   ctx.fillText(`${wrapW}X${wrapH}`, wrapW / 2, (wrapH / 2) * 1.04 /* 视觉上更居中 */);
    // }
  }

  return /*#__PURE__*/React.createElement("span", _extends({}, props, {
    ref: wrap,
    className: cls('m78-picture', className),
    style: style
  }), !state.error && /*#__PURE__*/React.createElement("img", _extends({}, imgProps, {
    alt: alt,
    src: src,
    className: imgClassName,
    style: imgStyle
  })), state.error && (_errorImg ? /*#__PURE__*/React.createElement("img", {
    src: _errorImg,
    alt: ""
  }) : /*#__PURE__*/React.createElement("span", {
    style: state.style,
    className: "m78-picture_placeholder"
  }, state.text)), /*#__PURE__*/React.createElement(Spin, {
    loadingDelay: 100,
    show: state.loading,
    full: true,
    text: "\u56FE\u7247\u52A0\u8F7D\u4E2D"
  }));
};

export { Picture };
