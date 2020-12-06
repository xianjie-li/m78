import 'm78/tips/style';
import _extends from '@babel/runtime/helpers/extends';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import React, { useMemo, useEffect } from 'react';
import { useQueue } from '@lxjx/hooks';
import { useTransition, animated } from 'react-spring';
import Button from 'm78/button';
import { getPortalsNode } from '@lxjx/utils';
import { Switch, If } from 'm78/fork';
import cls from 'classnames';
import { useGesture } from 'react-use-gesture';
import ReactDOM from 'react-dom';

var defaultOpt = {
  duration: 1600,
  type: 'card'
};

function Tips(_ref) {
  var _queue$current;

  var queue = _ref.controller;
  var transition = useTransition(queue.current, {
    key: (_queue$current = queue.current) === null || _queue$current === void 0 ? void 0 : _queue$current.id,
    from: {
      y: '-100%',
      x: '-50%',
      opacity: 0
    },
    enter: {
      y: '0%',
      opacity: 1
    },
    leave: {
      y: '-100%',
      opacity: 0
    }
  });
  var hasTouch = useMemo(function () {
    return typeof window !== 'undefined' && 'ontouchstart' in window;
  }, []);
  /** 暂停行为 */

  var bind = useGesture({
    onHover: function onHover(_ref2) {
      var hovering = _ref2.hovering;
      hovering ? queue.manual() : queue.auto();
    },
    onDrag: function onDrag(_ref3) {
      var down = _ref3.down,
          first = _ref3.first,
          last = _ref3.last;

      if (first && down && !queue.isManual) {
        queue.manual();
      }

      if (last && queue.isManual) {
        queue.auto();
      }
    }
  }, {
    drag: {
      filterTaps: true,
      enabled: hasTouch
    }
  });
  return transition(function (style, item) {
    if (!item) return null;
    var hasAction = item.actions && item.actions.length;
    var hasPrev = item.prevable && queue.hasPrev(item.id);
    return /*#__PURE__*/React.createElement(animated.div, _extends({
      className: cls('m78-tips', "__".concat(item.type), item.fitWidth && '__fitWidth', item.global && '__global', (hasAction || hasPrev || item.nextable || item.actionsNode) && '__hasAction'),
      style: _objectSpread({
        width: item.width
      }, style)
    }, bind()), /*#__PURE__*/React.createElement("span", {
      className: "m78-tips_content"
    }, item.message), /*#__PURE__*/React.createElement("span", {
      className: "m78-tips_action"
    }, /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(If, {
      when: item.actionsNode
    }, item.actionsNode), /*#__PURE__*/React.createElement(If, {
      when: hasAction
    }, function () {
      var _item$actions;

      return (_item$actions = item.actions) === null || _item$actions === void 0 ? void 0 : _item$actions.map(function (it, ind) {
        return /*#__PURE__*/React.createElement(Button, {
          key: ind,
          text: true,
          size: "small",
          color: it.color,
          onClick: it.handler
        }, it.text);
      });
    })), /*#__PURE__*/React.createElement(If, {
      when: hasPrev
    }, /*#__PURE__*/React.createElement(Button, {
      text: true,
      size: "small",
      color: "red",
      onClick: queue.prev
    }, "\u4E0A\u4E00\u6761")), /*#__PURE__*/React.createElement(If, {
      when: item.nextable
    }, function () {
      var hasNext = queue.hasNext(item.id);
      return /*#__PURE__*/React.createElement(Button, {
        text: true,
        size: "small",
        color: hasNext ? 'primary' : 'red',
        onClick: queue.next
      }, hasNext ? '下一条' : '关闭');
    })));
  });
}

var useTipsController = function useTipsController(opt) {
  var _ref4 = opt || {},
      list = _ref4.list,
      defaultItemOption = _ref4.defaultItemOption;

  return useQueue({
    list: list,
    defaultItemOption: _objectSpread(_objectSpread({}, defaultOpt), defaultItemOption)
  });
};

function GlobalTips(_ref5) {
  var item = _ref5.item;
  var queue = Tips.useTipsController({
    defaultItemOption: _objectSpread(_objectSpread({}, defaultOpt), {}, {
      fitWidth: true,
      nextable: true,
      global: true
    })
  });
  useEffect(function () {
    if (!item) return;
    queue.push(item);
  }, [item]);
  return /*#__PURE__*/React.createElement(Tips, {
    controller: queue
  });
}

Tips.useTipsController = useTipsController;

/**
 * 推送一条全局消息
 * */
Tips.push = function (opt) {
  ReactDOM.render( /*#__PURE__*/React.createElement(GlobalTips, {
    item: opt
  }), getPortalsNode('global_tips'));
};
/**
 * Tips.push的快捷方式，接收消息和持续时间
 * */


Tips.tip = function (message) {
  var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultOpt.duration;
  Tips.push({
    message: message,
    duration: duration
  });
};

export default Tips;
