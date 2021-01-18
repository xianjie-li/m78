import 'm78/image-preview/style';
import _extends from '@babel/runtime/helpers/extends';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import React, { useRef, useEffect } from 'react';
import { useLockBodyScroll, useSelf } from '@lxjx/hooks';
import { useDrag } from 'react-use-gesture';
import { useToggle, useUpdateEffect, useSetState } from 'react-use';
import _clamp from 'lodash/clamp';
import cls from 'classnames';
import Carousel from 'm78/carousel';
import Viewer from 'm78/viewer';
import Picture from 'm78/picture';
import { LeftOutlined, UndoOutlined, RedoOutlined, ZoomInOutlined, ZoomOutOutlined, SyncOutlined, RightOutlined, CloseCircleOutlined } from 'm78/icon';
import { If } from 'm78/fork';
import Portal from 'm78/portal';
import { stopPropagation } from 'm78/util';
import createRenderApi from '@lxjx/react-render-api';
import { Transition } from '@lxjx/react-transition-spring';

/* 禁用内部图片的拖动 */
var disabledDrag = function disabledDrag(event) {
  return event.preventDefault();
};
/* TODO: 添加键盘操作 */


var _ImagePreview = function _ImagePreview(_ref) {
  var _ref$page = _ref.page,
      page = _ref$page === void 0 ? 0 : _ref$page,
      _ref$images = _ref.images,
      images = _ref$images === void 0 ? [] : _ref$images,
      show = _ref.show,
      onClose = _ref.onClose,
      onRemove = _ref.onRemove,
      namespace = _ref.namespace;
  var carousel = useRef(null);
  /* 锁定滚动条 + 防止页面抖动 */

  var _useToggle = useToggle(!!show),
      _useToggle2 = _slicedToArray(_useToggle, 2),
      lock = _useToggle2[0],
      toggleLock = _useToggle2[1];

  useLockBodyScroll(lock);
  useUpdateEffect(function () {
    if (show) toggleLock(true);

    if (!show) {
      setTimeout(function () {
        toggleLock(false);
      }, 300);
    } // eslint-disable-next-line

  }, [show]);
  var self = useSelf({
    /** 存每一个Viewer的实例 */
    viewers: {},
    currentPage: calcPage(page)
  });

  var _useSetState = useSetState({
    disabledPrev: false,
    disabledNext: false,
    zoomIn: false,
    zoomOut: false
  }),
      _useSetState2 = _slicedToArray(_useSetState, 2),
      state = _useSetState2[0],
      setState = _useSetState2[1];

  useEffect(function removeInstance() {
    if (!show) {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      setTimeout(onRemove, 800);
    } // eslint-disable-next-line

  }, [show]);
  useEffect(function initPageChange() {
    carousel.current && carousel.current.goTo(calcPage(page), true); // eslint-disable-next-line
  }, [page]);
  var bindDrag = useDrag(function (_ref2) {
    var timeStamp = _ref2.timeStamp,
        first = _ref2.first,
        last = _ref2.last,
        tap = _ref2.tap,
        memo = _ref2.memo,
        _ref2$movement = _slicedToArray(_ref2.movement, 1),
        x = _ref2$movement[0],
        _ref2$direction = _slicedToArray(_ref2.direction, 1),
        direct = _ref2$direction[0];

    if (tap) {
      close();
    }

    if (last && memo) {
      var isPrev = direct > 0;
      var distanceOver = Math.abs(x) > window.innerWidth / 2; // 滑动距离超过半屏

      var timeOver = timeStamp - memo < 220; // 220ms内

      if (timeOver && distanceOver) {
        isPrev ? prev() : next();
      }

      return undefined;
    }

    if (first) {
      return timeStamp;
    }
  }, {
    filterTaps: true
  });

  function prev() {
    carousel.current.prev();
    calcDisabled();
  }

  function next() {
    carousel.current.next();
    calcDisabled();
  }
  /** 设置旋转 type: 为true时加 否则减 */


  function rotate(type) {
    var _getCurrentViewer = getCurrentViewer(),
        setRotate = _getCurrentViewer.setRotate; // console.log(instance);


    setRotate(type ? 45 : -45);
  }
  /** 设置缩放 type: 为true时加 否则减 */


  function scale(type) {
    var _getCurrentViewer2 = getCurrentViewer(),
        instance = _getCurrentViewer2.instance,
        setScale = _getCurrentViewer2.setScale;

    var diff = type ? 0.5 : -0.5;
    setScale(instance.scale + diff);
    calcDisabled();
  }

  function resetViewer() {
    var _getCurrentViewer3 = getCurrentViewer(),
        reset = _getCurrentViewer3.reset;

    reset();
  }

  function close() {
    onClose && onClose();
  }

  function onChange(currentPage, first) {
    var cViewer = getCurrentViewer();
    if (!cViewer || first) return;
    cViewer.reset();
    self.currentPage = calcPage(currentPage);
  }

  function calcPage(cPage) {
    return _clamp(cPage, 0, images.length - 1);
  }

  function getCurrentViewer() {
    return self.viewers[self.currentPage];
  }
  /** 根据当前值设置按钮的禁用状态 */


  function calcDisabled() {
    var _getCurrentViewer4 = getCurrentViewer(),
        instance = _getCurrentViewer4.instance;

    setState({
      disabledPrev: self.currentPage === 0,
      disabledNext: self.currentPage === images.length - 1,
      zoomIn: instance.scale >= 3,
      zoomOut: instance.scale <= 0.5
    });
  }

  return /*#__PURE__*/React.createElement(Portal, {
    namespace: namespace
  }, /*#__PURE__*/React.createElement(Transition, {
    type: "fade",
    toggle: show && images.length > 0,
    mountOnEnter: true,
    className: "m78-image-preview"
  }, /*#__PURE__*/React.createElement("div", bindDrag(), /*#__PURE__*/React.createElement(Carousel, {
    ref: carousel,
    initPage: page,
    wheel: false,
    drag: false,
    loop: false,
    forceNumberControl: true,
    onChange: onChange
  }, images.map(function (item, key) {
    return /*#__PURE__*/React.createElement("div", {
      key: key,
      className: "m78-image-preview_img-wrap"
    }, /*#__PURE__*/React.createElement(Viewer, {
      ref: function ref(viewer) {
        return self.viewers[key] = viewer;
      }
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(If, {
      when: self.currentPage >= key - 1 && self.currentPage <= key + 1
    }, /*#__PURE__*/React.createElement(Picture, _extends({}, stopPropagation, {
      src: item.img,
      alt: "\u56FE\u7247\u52A0\u8F7D\u5931\u8D25",
      className: "m78-image-preview_img",
      imgProps: {
        onDragStart: disabledDrag
      }
    }))))));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "m78-image-preview_ctrl-bar",
    onClick: stopPropagation.onClick,
    onDragStart: function onDragStart(e) {
      return e.stopPropagation();
    }
  }, /*#__PURE__*/React.createElement(If, {
    when: images.length > 1
  }, /*#__PURE__*/React.createElement("span", {
    className: cls({
      __disabled: state.disabledPrev
    }),
    title: "\u4E0A\u4E00\u5F20",
    onClick: function onClick() {
      return prev();
    }
  }, /*#__PURE__*/React.createElement(LeftOutlined, null))), /*#__PURE__*/React.createElement("span", {
    title: "\u5DE6\u65CB\u8F6C",
    onClick: function onClick() {
      return rotate(false);
    }
  }, /*#__PURE__*/React.createElement(UndoOutlined, null)), /*#__PURE__*/React.createElement("span", {
    title: "\u53F3\u65CB\u8F6C",
    onClick: function onClick() {
      return rotate(true);
    }
  }, /*#__PURE__*/React.createElement(RedoOutlined, null)), /*#__PURE__*/React.createElement("span", {
    className: cls({
      __disabled: state.zoomIn
    }),
    title: "\u653E\u5927",
    onClick: function onClick() {
      return scale(true);
    }
  }, /*#__PURE__*/React.createElement(ZoomInOutlined, null)), /*#__PURE__*/React.createElement("span", {
    className: cls({
      __disabled: state.zoomOut
    }),
    title: "\u7F29\u5C0F",
    onClick: function onClick() {
      return scale(false);
    }
  }, /*#__PURE__*/React.createElement(ZoomOutOutlined, null)), /*#__PURE__*/React.createElement("span", {
    title: "\u91CD\u7F6E",
    onClick: function onClick() {
      return resetViewer();
    }
  }, /*#__PURE__*/React.createElement(SyncOutlined, {
    style: {
      fontSize: 21
    }
  }), ' '), /*#__PURE__*/React.createElement(If, {
    when: images.length > 1
  }, /*#__PURE__*/React.createElement("span", {
    className: cls({
      __disabled: state.disabledNext
    }),
    title: "\u4E0B\u4E00\u5F20",
    onClick: function onClick() {
      return next();
    }
  }, /*#__PURE__*/React.createElement(RightOutlined, null))), /*#__PURE__*/React.createElement("span", {
    title: "\u5173\u95ED",
    onClick: close
  }, /*#__PURE__*/React.createElement(CloseCircleOutlined, null)))));
};

var api = createRenderApi(_ImagePreview, {
  namespace: 'IMAGE_PREVIEW'
});
var ImagePreview = Object.assign(_ImagePreview, {
  api: api
});

export default ImagePreview;
