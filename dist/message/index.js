import 'm78/message/style';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import _extends from '@babel/runtime/helpers/extends';
import React, { useState, useEffect } from 'react';
import createRenderApi from '@lxjx/react-render-api';
import _regeneratorRuntime from '@babel/runtime/regenerator';
import _asyncToGenerator from '@babel/runtime/helpers/asyncToGenerator';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import { useSpring, config, animated } from 'react-spring';
import { Portal } from 'm78/portal';
import { statusIcons, CloseOutlined } from 'm78/icon';
import { Spin } from 'm78/spin';
import { If, Toggle } from 'm78/fork';
import { useMeasure } from 'react-use';
import { Transition } from '@lxjx/react-transition-spring';
import cls from 'clsx';
import { useSelf } from '@lxjx/hooks';
import { Button } from 'm78/button';

function MessageWrap(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/React.createElement("div", {
    className: "m78-message"
  }, /*#__PURE__*/React.createElement("div", {
    className: "m78-message_cont"
  }, children));
}

var Message = function Message(_ref2) {
  var content = _ref2.content,
      _ref2$duration = _ref2.duration,
      duration = _ref2$duration === void 0 ? 600 : _ref2$duration,
      _ref2$mask = _ref2.mask,
      mask = _ref2$mask === void 0 ? false : _ref2$mask,
      type = _ref2.type,
      _ref2$loading = _ref2.loading,
      loading = _ref2$loading === void 0 ? false : _ref2$loading,
      hasCancel = _ref2.hasCancel,
      _ref2$show = _ref2.show,
      show = _ref2$show === void 0 ? true : _ref2$show,
      onClose = _ref2.onClose,
      onRemove = _ref2.onRemove,
      _ref2$loadingDelay = _ref2.loadingDelay,
      loadingDelay = _ref2$loadingDelay === void 0 ? 300 : _ref2$loadingDelay;
  var self = useSelf({
    showTimer: null,
    hideTimer: null,
    lastShowTime: 0
  });

  var _useSpring = useSpring(function () {
    return {
      opacity: 0,
      height: 0,
      transform: 'scale3d(0, 0, 0)',
      life: 100,
      config: _objectSpread({}, config.stiff)
    };
  }),
      _useSpring2 = _slicedToArray(_useSpring, 2),
      _useSpring2$ = _useSpring2[0],
      life = _useSpring2$.life,
      springProp = _objectWithoutProperties(_useSpring2$, ["life"]),
      set = _useSpring2[1];

  var _useState = useState(mask),
      _useState2 = _slicedToArray(_useState, 2),
      maskShow = _useState2[0],
      setMaskShow = _useState2[1];

  var _useMeasure = useMeasure(),
      _useMeasure2 = _slicedToArray(_useMeasure, 2),
      bind = _useMeasure2[0],
      height = _useMeasure2[1].height;
  /* 元素显示&隐藏 */


  useEffect(function () {
    if (!show) {
      // 延迟时间未达到loadingDelay时间的话延迟关闭
      var diff = Date.now() - self.lastShowTime; // +300ms的动画补正时间

      self.hideTimer = setTimeout(close, loading && diff > 0 ? diff + loadingDelay + 300 : 0);
      return;
    }

    if (height && show) {
      self.showTimer = setTimeout(function () {
        self.lastShowTime = Date.now();
        set({
          to: function () {
            var _to = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(next) {
              return _regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return next({
                        // height + 内外边距
                        opacity: 1,
                        height: height + (hasCancel ? 60 : 36),
                        life: 100,
                        transform: 'scale3d(1, 1 ,1)'
                      });

                    case 2:
                      _context.next = 4;
                      return next({
                        opacity: 1,
                        life: 0,
                        config: {
                          duration: duration
                        } // 减去初始动画的持续时间

                      });

                    case 4:
                      close();

                    case 5:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee);
            }));

            function to(_x) {
              return _to.apply(this, arguments);
            }

            return to;
          }()
        });
      }, loading ? loadingDelay : 0);
    }

    return function () {
      self.showTimer && clearTimeout(self.showTimer);
      self.hideTimer && clearTimeout(self.hideTimer);
    }; // eslint-disable-next-line
  }, [show, height]);

  function close() {
    set({
      // @ts-ignore
      to: function () {
        var _to2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(next) {
          return _regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  setMaskShow(false);
                  _context2.next = 3;
                  return next({
                    opacity: 0,
                    height: 0,
                    config: config.stiff
                  });

                case 3:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        function to(_x2) {
          return _to2.apply(this, arguments);
        }

        return to;
      }(),
      onRest: function onRest() {
        onRemove && onRemove();
      }
    });
  }

  var StatusIcon = statusIcons[type || 'success'];
  return /*#__PURE__*/React.createElement(animated.div, {
    style: springProp,
    className: "m78-message_item"
  }, /*#__PURE__*/React.createElement(Portal, null, /*#__PURE__*/React.createElement(Transition, {
    className: "m78-mask",
    toggle: maskShow,
    type: "fade",
    mountOnEnter: true,
    unmountOnExit: true
  })), /*#__PURE__*/React.createElement("div", {
    ref: bind,
    className: cls('m78-message_item-cont', {
      __loading: loading,
      __notification: hasCancel
    })
  }, /*#__PURE__*/React.createElement(If, {
    when: hasCancel
  }, function () {
    return /*#__PURE__*/React.createElement(Button, {
      onClick: onClose,
      className: "m78-message_close",
      icon: true,
      size: "small"
    }, /*#__PURE__*/React.createElement(CloseOutlined, {
      className: "m78-close-icon"
    }));
  }), /*#__PURE__*/React.createElement(Toggle, {
    when: type && !loading
  }, /*#__PURE__*/React.createElement("div", {
    className: "m78-message_icon"
  }, /*#__PURE__*/React.createElement(StatusIcon, null))), /*#__PURE__*/React.createElement(If, {
    when: loading
  }, /*#__PURE__*/React.createElement("div", {
    className: "m78-message_loading"
  }, /*#__PURE__*/React.createElement(Spin, {
    show: true,
    text: content
  }))), /*#__PURE__*/React.createElement(If, {
    when: !loading
  }, /*#__PURE__*/React.createElement("span", null, content)), /*#__PURE__*/React.createElement(If, {
    when: !loading && duration < 1000000
  }, function () {
    return /*#__PURE__*/React.createElement(animated.div, {
      style: {
        width: life ? life.to(function (x) {
          return "".concat(x.toFixed(2), "%");
        }) : 0
      },
      className: "m78-message_process"
    });
  })));
};

/* ##### 创建api实例 ##### */
var messageApi = createRenderApi(Message, {
  wrap: MessageWrap,
  maxInstance: 7,
  namespace: 'MESSAGE'
});

/** 文本提示 */
var tips = function tips(_ref) {
  var options = _extends({}, _ref);

  return messageApi(_objectSpread(_objectSpread({}, options), {}, {
    hasCancel: false,
    loading: false
  }));
};

/** 加载中提示 */
var loading = function loading() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      options = _extends({}, _ref2);

  return messageApi(_objectSpread(_objectSpread({
    hasCancel: false,
    duration: Infinity
  }, options), {}, {
    loading: true
  }));
};

/** 轻通知，包含的配置项: content, duration, type, mask, singleton, singleton */
var notify = function notify(_ref3) {
  var title = _ref3.title,
      desc = _ref3.desc,
      foot = _ref3.foot,
      content = _ref3.content,
      options = _objectWithoutProperties(_ref3, ["title", "desc", "foot", "content"]);

  return messageApi(_objectSpread(_objectSpread({
    duration: 4000,
    hasCancel: true,
    content: content || /*#__PURE__*/React.createElement("div", {
      className: "m78-message_notification"
    }, title && /*#__PURE__*/React.createElement("div", {
      className: "m78-message_notification_title"
    }, title), desc && /*#__PURE__*/React.createElement("div", {
      className: "m78-message_notification_desc"
    }, desc), foot && /*#__PURE__*/React.createElement("div", {
      className: "m78-message_notification_foot"
    }, foot))
  }, options), {}, {
    loading: false
  }));
};

var message = Object.assign(messageApi, {
  tips: tips,
  loading: loading,
  notify: notify
});

export { loading, message, notify, tips };
