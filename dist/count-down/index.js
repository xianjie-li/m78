import 'm78/count-down/style';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import React, { useRef, useEffect } from 'react';
import { getDateCountDown, dumpFn } from '@lxjx/utils';
import { useSelf } from '@lxjx/hooks';
import cls from 'classnames';

/**
 * 将getDateCountDown返回的时间转换为可读的倒计时字符串
 * @param meta - 与getDateCountDown()返回类型相同
 * @param triggerFinish - 用于帮助调用者停止计时器
 * @return string
 * */
var _format = function _format(meta, triggerFinish) {
  var s1 = meta.textClassName;
  var s2 = meta.timeClassName;

  if (+meta.d > 30) {
    triggerFinish && triggerFinish();
    return "".concat(wTime(meta.d, s2)).concat(wTxt('天后', s1));
  }

  if (meta.timeOut) {
    triggerFinish && triggerFinish();
  }

  return (+meta.d ? wTime(meta.d, s2) + wTxt('天', s1) : '') + wTime(meta.h, s2) + wTxt('时', s1) + wTime(meta.m, s2) + wTxt('分', s1) + wTime(meta.s, s2) + wTxt('秒', s1);
};
/* 快捷设置包装类名 */


function wTime(s, extra) {
  return "<span class=\"".concat(cls('m78-count-down_time', extra), "\">").concat(s, "</span>");
}

function wTxt(s, extra) {
  return "<span class=\"".concat(cls('m78-count-down_text', extra), "\">").concat(s, "</span>");
}

var CountDown = function CountDown(_ref) {
  var date = _ref.date,
      textClassName = _ref.textClassName,
      timeClassName = _ref.timeClassName,
      _ref$format = _ref.format,
      format = _ref$format === void 0 ? _format : _ref$format,
      _ref$onChange = _ref.onChange,
      onChange = _ref$onChange === void 0 ? dumpFn : _ref$onChange,
      _ref$frequency = _ref.frequency,
      frequency = _ref$frequency === void 0 ? 1000 : _ref$frequency,
      className = _ref.className,
      style = _ref.style;
  var ref = useRef(null);
  var self = useSelf({
    timer: 0
  });
  useEffect(function () {
    if (date) {
      timeOutput();
      self.timer = window.setInterval(function () {
        timeOutput();
      }, frequency);
    }

    return function () {
      self.timer && window.clearInterval(self.timer);
    }; // eslint-disable-next-line
  }, [date]);

  function timeOutput() {
    var meta = _objectSpread(_objectSpread({}, getDateCountDown(date)), {}, {
      textClassName: textClassName,
      timeClassName: timeClassName
    });

    onChange(meta);
    ref.current.innerHTML = "".concat(format(meta, function () {
      self.timer && window.clearInterval(self.timer);
    }));
  }

  return /*#__PURE__*/React.createElement("span", {
    className: cls('m78-count-down', className),
    style: style,
    ref: ref
  });
};

export default CountDown;
