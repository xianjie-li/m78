import 'm78/dates/style';
import moment from 'moment';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import React, { useMemo, useState, useEffect } from 'react';
import { Button } from 'm78/button';
import { Input } from 'm78/input';
import { Modal } from 'm78/modal';
import { Popper } from 'm78/popper';
import { SM, Z_INDEX_MESSAGE } from 'm78/util';
import { useFormState, useScroll, useEffectEqual, useFn, useSetState, useSelf } from '@lxjx/hooks';
import cls from 'clsx';
import _toConsumableArray from '@babel/runtime/helpers/toConsumableArray';
import _defineProperty from '@babel/runtime/helpers/defineProperty';
import { isArray, createRandString, dumpFn } from '@lxjx/utils';
import _debounce from 'lodash/debounce';
import _extends from '@babel/runtime/helpers/extends';
import { useFirstMountState } from 'react-use';
import { useHover } from 'react-use-gesture';

var DateType;
/* 需要同时允许用户传入DateType 或 字面量 */

(function (DateType) {
  DateType["DATE"] = "date";
  DateType["MONTH"] = "month";
  DateType["YEAR"] = "year";
  DateType["TIME"] = "time";
})(DateType || (DateType = {}));

var _formatMap, _placeholderMaps;
var DATE_FORMAT_YEAR = 'YYYY';
var DATE_FORMAT_MONTH = 'YYYY-MM';
var DATE_FORMAT_DATE = 'YYYY-MM-DD';
var DATE_FORMAT_TIME = 'HH:mm:ss';
var DATE_FORMAT_DATE_TIME = "".concat(DATE_FORMAT_DATE, " ").concat(DATE_FORMAT_TIME); // 支持的value解析格式

var DATE_DEFAULT_PARSE = [DATE_FORMAT_DATE_TIME, 'YYYY/MM/DD HH:mm:ss'];
var formatMap = (_formatMap = {}, _defineProperty(_formatMap, DateType.DATE, DATE_FORMAT_DATE), _defineProperty(_formatMap, DateType.MONTH, DATE_FORMAT_MONTH), _defineProperty(_formatMap, DateType.YEAR, DATE_FORMAT_YEAR), _defineProperty(_formatMap, DateType.TIME, DATE_FORMAT_TIME), _formatMap);
var placeholderMaps = (_placeholderMaps = {}, _defineProperty(_placeholderMaps, DateType.YEAR, '年份'), _defineProperty(_placeholderMaps, DateType.MONTH, '月份'), _defineProperty(_placeholderMaps, DateType.DATE, '日期'), _defineProperty(_placeholderMaps, DateType.TIME, '时间'), _placeholderMaps);
/** 根据年、月获取用于显示的moment列表 */

function getDates(year, month) {
  var base = "".concat(year, "-").concat(month);
  var t = moment(base, 'Y-M');
  var moments = [];
  var dayNum = t.daysInMonth();

  for (var i = 0; i < dayNum; i++) {
    moments.push(moment("".concat(base, "-").concat(i + 1), 'Y-M-D'));
  }

  var firstM = moments[0];
  var firstMDay = firstM.day();
  var lastM = moments[moments.length - 1]; // 前补齐

  if (firstMDay !== 1) {
    var _count;

    if (firstMDay === 0) {
      _count = 6;
    } else {
      _count = firstMDay - 1;
    }

    for (var _i = 0; _i < _count; _i++) {
      moments.unshift(firstM.clone().subtract(_i + 1, 'days'));
    }
  } // 后补齐, 共计42天 7 * 6


  var count = 42 - moments.length;

  for (var _i2 = 0; _i2 < count; _i2++) {
    moments.push(lastM.clone().add(_i2 + 1, 'days'));
  }

  return moments;
}
/** 根据年获取用于显示的月moment列表 */

function getMonths(year) {
  var ms = [];

  for (var i = 0; i < 12; i++) {
    ms.push(moment([year, i]));
  }

  return ms;
}
/** 根据年获取与该年相邻的前4年和后7年和对应区间的可读字符 */

function getYears(year) {
  var ms = [];

  for (var i = 0; i < 5; i++) {
    ms.unshift(moment([year - i]));
  }

  for (var _i3 = 1; _i3 < 8; _i3++) {
    ms.push(moment([year + _i3]));
  }

  return [ms, "".concat(year - 4, " ~ ").concat(year + 7)];
}
/** 获取用于渲染的时间列表 */

function getTimes() {
  var time = {
    h: [],
    m: [],
    s: []
  };

  for (var i = 0; i < 24; i++) {
    time.h.push(i);
  }

  for (var _i4 = 0; _i4 < 60; _i4++) {
    time.m.push(_i4);
    time.s.push(_i4);
  }

  return time;
}
function formatDate(m, format) {
  return m.format(format);
}
/** 将一个时间串 HH:mm:ss 以当前日期拼接为一个完整moment对象并返回 */

function concatTimeToMoment(tStr) {
  return moment("".concat(moment().format(DATE_FORMAT_DATE), " ").concat(tStr), DATE_DEFAULT_PARSE);
}
/** 用于将传入的DisabledTime/DisabledTime或数组组成严格化为数组并与内置处理器合并 */

function disabledHandlerFormat(handler, builtIn) {
  if (!handler) return builtIn;
  if (!isArray(handler)) return [].concat(_toConsumableArray(builtIn || []), [handler]);
  if (!handler.length) return builtIn;
  return [].concat(_toConsumableArray(builtIn || []), _toConsumableArray(handler));
}
/** 接收DisabledTime或DisabledDate组成的数组并进行验证，如果有任意一个返回了true则返回true */

function checkDisabled(handler) {
  if (!handler.length) return false;

  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  for (var i = 0; i < handler.length; i++) {
    if (handler[i].apply(handler, args)) {
      return true;
    }
  }

  return false;
}
/** 决定了如何从value字符串中解析cValueMoment/endValueMoment */

function parseValue(_ref) {
  var value = _ref.value,
      type = _ref.type,
      props = _ref.props,
      self = _ref.self;
  if (!value) return;
  var range = props.range;

  if (type === DateType.TIME) {
    if (range) {
      if (!value.length) return;

      var _cValueM = concatTimeToMoment(value[0]);

      _cValueM.isValid() && (self.cValueMoment = _cValueM);

      if (value[1]) {
        var cEValueM = concatTimeToMoment(value[1]);
        cEValueM.isValid() && (self.endValueMoment = cEValueM);
      }

      return;
    }

    var cValueM = concatTimeToMoment(value); // 作为纯时间组件使用

    cValueM.isValid() && (self.cValueMoment = cValueM);
  } else {
    if (range) {
      if (!value.length) return;

      var _cValueM2 = moment(value[0], DATE_DEFAULT_PARSE);

      _cValueM2.isValid() && (self.cValueMoment = _cValueM2);

      if (value[1]) {
        var _cEValueM2 = moment(value[1], DATE_DEFAULT_PARSE);

        _cEValueM2.isValid() && (self.endValueMoment = _cEValueM2);
      }

      return;
    }

    var _cEValueM = moment(value, DATE_DEFAULT_PARSE);

    _cEValueM.isValid() && (self.cValueMoment = _cEValueM);
  }
}
/** 根据大小屏切换选择器的展示方式 */

function pickerTypeWrap(state, setState) {
  return function () {
    var debounceResize = _debounce(function () {
      var isM = window.innerWidth <= SM;

      if (isM !== state.mobile) {
        setState({
          mobile: isM
        });
      }
    }, 400);

    debounceResize();
    window.addEventListener('resize', debounceResize);
    return function () {
      return window.removeEventListener('resize', debounceResize);
    };
  };
}
/** 格式化value到input中用于显示 */

var defaultFormat = function defaultFormat(_ref2) {
  var current = _ref2.current,
      end = _ref2.end,
      type = _ref2.type,
      hasTime = _ref2.hasTime;
  var isDateTime = hasTime && type === DateType.DATE;
  var format = formatMap[type] + (isDateTime ? " ".concat(DATE_FORMAT_TIME) : '');

  if (current && end) {
    return "".concat(current.format(format), " ~ ").concat(end.format(format));
  }

  if (current) {
    return "".concat(current.format(format));
  }

  return '';
};
/** 预设的时间段 */

var timePreset = {
  day: [{}, {
    hour: 23,
    minute: 59,
    second: 59
  }],
  morning: [{
    hour: 8
  }, {
    hour: 11
  }],
  midday: [{
    hour: 11
  }, {
    hour: 13
  }],
  afternoon: [{
    hour: 13
  }, {
    hour: 18
  }],
  evening: [{
    hour: 18
  }, {
    hour: 23
  }]
};

function getSelector(id, key, val) {
  return "".concat(key, "-").concat(val, "-").concat(id);
}

var Time = function Time(props) {
  var _props$hideDisabled = props.hideDisabled,
      hideDisabled = _props$hideDisabled === void 0 ? true : _props$hideDisabled,
      disabledTimeExtra = props.disabledTimeExtra,
      disabledTime = props.disabledTime;
  var id = useMemo(function () {
    return createRandString();
  }, []);
  var times = useMemo(function () {
    return getTimes();
  }, []);
  var firstMount = useFirstMountState(); // const nowTime = useMemo(() => {
  //   const now = moment();
  //   return {
  //     h: now.hour(),
  //     m: now.minute(),
  //     s: now.second(),
  //   };
  // }, []);

  var _useFormState = useFormState(props, undefined),
      _useFormState2 = _slicedToArray(_useFormState, 2),
      value = _useFormState2[0],
      setValue = _useFormState2[1];

  var sc1 = useScroll();
  var sc2 = useScroll();
  var sc3 = useScroll();
  var map = {
    h: {
      sc: sc1,
      unit: '点'
    },
    m: {
      sc: sc2,
      unit: '分'
    },
    s: {
      sc: sc3,
      unit: '秒'
    }
  }; // 滚动到当前选中、存在已选中的禁用时间时，将其更新为该列第一个可用值

  useEffectEqual(function () {
    if (!value) return;

    var newTime = _objectSpread({}, value);

    var hasDisabled = false;
    disabledTime && Object.entries(value).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          t = _ref2[1];

      var k = key;
      var isDisabled = checkDisabled(disabledTime, _objectSpread(_objectSpread({}, value), {}, {
        key: k,
        val: t
      }), disabledTimeExtra);

      if (isDisabled) {
        var currentColumn = times[k]; // 查找该列第一个可用

        var enableVal = currentColumn.find(function (cItem) {
          return !checkDisabled(disabledTime, _objectSpread(_objectSpread({}, value), {}, {
            key: k,
            val: cItem
          }), disabledTimeExtra);
        });

        if (enableVal !== undefined) {
          hasDisabled = true; // 有可替换值才视为禁用

          newTime[k] = enableVal;
        }
      }
    });

    if (hasDisabled) {
      setValue(newTime);
    } // 参数1防止滚动，参数2防止抖动


    patchPosition(true, !firstMount);
  }, [value, disabledTimeExtra]);
  /** 设置指定key的值到value并滚动到其所在位置 */

  function patchValue(key, val, immediate) {
    setValue(function (prev) {
      return _objectSpread(_objectSpread({
        h: 0,
        m: 0,
        s: 0
      }, prev), {}, _defineProperty({}, key, val));
    });
    var cM = map[key];
    setTimeout(function () {
      cM.sc.scrollToElement(".".concat(getSelector(id, key, val)), immediate);
    });
  }
  /** 同步滚动到当前选中位置 */


  function patchPosition() {
    var immediate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    function run() {
      if (!value) return;
      sc1.scrollToElement(".".concat(getSelector(id, 'h', value.h)), immediate);
      sc2.scrollToElement(".".concat(getSelector(id, 'm', value.m)), immediate);
      sc3.scrollToElement(".".concat(getSelector(id, 's', value.s)), immediate);
    }

    timeout ? setTimeout(run)
    /* 设置值后dom可能未更新，在本次loop结束后滚动会更稳 */
    : run();
  }

  function renderColumn(_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        key = _ref4[0],
        _ref4$ = _ref4[1],
        sc = _ref4$.sc,
        unit = _ref4$.unit;

    return /*#__PURE__*/React.createElement("div", {
      className: "m78-dates_picker-column",
      ref: sc.ref,
      key: key
    }, times[key].map(function (item) {
      var selector = getSelector(id, key, item);
      var disabled = disabledTime ? checkDisabled(disabledTime, _objectSpread(_objectSpread({}, value), {}, {
        key: key,
        val: item
      }), disabledTimeExtra) : false;
      /** 禁用并隐藏 */

      if (disabled && hideDisabled) return null;
      return /*#__PURE__*/React.createElement("div", {
        key: item,
        className: cls('m78-dates_picker-time', selector, {
          __active: value && value[key] === item,
          __disabled: disabled
        }),
        onClick: function onClick() {
          if (disabled) return;
          patchValue(key, item);
        }
      }, item, " ", /*#__PURE__*/React.createElement("span", {
        className: "color-second fs-sm"
      }, unit));
    }), /*#__PURE__*/React.createElement("div", {
      className: "m78-dates_picker-time __plain"
    }), /*#__PURE__*/React.createElement("div", {
      className: "m78-dates_picker-time __plain"
    }), /*#__PURE__*/React.createElement("div", {
      className: "m78-dates_picker-time __plain"
    }), /*#__PURE__*/React.createElement("div", {
      className: "m78-dates_picker-time __plain"
    }));
  }

  function renderTimes() {
    return /*#__PURE__*/React.createElement("div", {
      className: "m78-dates_picker-item m78-scroll-bar"
    }, Object.entries(map).map(function (item) {
      return renderColumn(item);
    }));
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "m78-dates_picker"
  }, props.label && /*#__PURE__*/React.createElement("div", {
    className: "m78-dates_picker-item-diver"
  }, props.label), renderTimes());
};

/** 从结束时间中开始时间之前的所有时间 */
var rangeDisabledBeforeTime = function rangeDisabledBeforeTime(_ref, _ref2) {
  var h = _ref.h,
      m = _ref.m,
      val = _ref.val,
      key = _ref.key;
  var checkedDate = _ref2.checkedDate,
      isRange = _ref2.isRange;

  if (isRange && checkedDate) {
    if (key === 'h' && checkedDate.hour() > val) {
      return true;
    }

    if (key === 'm' && checkedDate.hour() === h) {
      return checkedDate.minute() > val;
    }

    if (key === 's' && checkedDate.hour() === h && checkedDate.minute() === m) {
      return checkedDate.seconds() > val;
    }
  }
};

var _map, _map2, _map3;

var map1 = (_map = {}, _defineProperty(_map, DateType.DATE, 'days'), _defineProperty(_map, DateType.MONTH, 'months'), _defineProperty(_map, DateType.YEAR, 'years'), _map);
var map2 = (_map2 = {}, _defineProperty(_map2, DateType.DATE, 'dates'), _defineProperty(_map2, DateType.MONTH, 'months'), _defineProperty(_map2, DateType.YEAR, 'years'), _map2);
var map3 = (_map3 = {}, _defineProperty(_map3, DateType.DATE, DATE_FORMAT_DATE), _defineProperty(_map3, DateType.MONTH, DATE_FORMAT_MONTH), _defineProperty(_map3, DateType.YEAR, DATE_FORMAT_YEAR), _map3);

var DateItem = function DateItem(_ref) {
  var itemMoment = _ref.itemMoment,
      cm = _ref.currentMoment,
      nowMoment = _ref.nowMoment,
      disabledDate = _ref.disabledDate,
      onCheck = _ref.onCheck,
      checkedMoment = _ref.checkedMoment,
      checkedEndMoment = _ref.checkedEndMoment,
      onCurrentChange = _ref.onCurrentChange,
      tempMoment = _ref.tempMoment,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? DateType.DATE : _ref$type,
      range = _ref.range,
      _ref$onActive = _ref.onActive,
      onActive = _ref$onActive === void 0 ? dumpFn : _ref$onActive,
      startLabel = _ref.startLabel,
      endLabel = _ref.endLabel;

  /** 由于调用频率很高，一定要确保计算都被memo */
  var insideM = useMemo(function () {
    return itemMoment.clone();
  }, [itemMoment]); // 前后一天

  var prev = useMemo(function () {
    return insideM.clone().subtract(1, map1[type]);
  }, [insideM]);
  var last = useMemo(function () {
    return insideM.clone().add(1, map1[type]);
  }, [insideM]);
  /** 是否是当天/月/年 */

  var isSame = useMemo(function () {
    return insideM.isSame(nowMoment, map2[type]);
  }, [insideM]);
  /** 是否在当前月 (只在 type = DATE 时需要) */

  var isCurrentBetween = useMemo(function () {
    return type === DateType.DATE ? insideM.isBetween(cm.clone().startOf('month'), cm.clone().endOf('month'), 'dates', '[]') : false;
  }, [insideM, cm]);
  /** 是否选中 */

  var isChecked = useMemo(function () {
    return checkedMoment ? insideM.isSame(checkedMoment, map2[type]) : false;
  }, [insideM, checkedMoment]);
  /** 是否为范围选中的尾值 */

  var isEndChecked = useMemo(function () {
    return checkedEndMoment ? insideM.isSame(checkedEndMoment, map2[type]) : false;
  }, [insideM, checkedEndMoment]); // 是否是范围选中的两个范围之间

  var isRangeCheckBetween = useMemo(function () {
    if (!range || !checkedMoment) return false;
    if (!checkedEndMoment && !tempMoment) return false;

    if (checkedMoment && checkedEndMoment) {
      return insideM.isBetween(checkedMoment, checkedEndMoment, map2[type]);
    }

    if (tempMoment) {
      var min = moment.min(checkedMoment, tempMoment);
      var max = moment.max(checkedMoment, tempMoment);
      return insideM.isBetween(min, max, map2[type]);
    }

    return false;
  }, [checkedMoment, checkedEndMoment, tempMoment, insideM]);
  var disabledExtra = useMemo(function () {
    return {
      checkedDate: checkedMoment,
      checkedEndDate: checkedEndMoment,
      isRange: range
    };
  }, [checkedMoment, checkedEndMoment]);
  var disables = disabledHandlerFormat(disabledDate);
  var isDisabled = useMemo(function () {
    return !!disables && checkDisabled(disables, insideM, type, disabledExtra);
  }, [insideM, disabledExtra]);
  /** 前后一天/月/年是否被禁用 */

  var prevDisabled = useMemo(function () {
    return !!disables && checkDisabled(disables, prev, type, disabledExtra);
  }, [prev, disabledExtra]);
  var lastDisabled = useMemo(function () {
    return !!disables && checkDisabled(disables, last, type, disabledExtra);
  }, [last, disabledExtra]);
  var isDisabledRange = isDisabled && (prevDisabled || lastDisabled);
  /** 是否是活动时间 */

  var isActiveDate = useMemo(function () {
    if (!range || !tempMoment || !checkedMoment || isDisabled) return false;
    if (checkedMoment && checkedEndMoment) return false;
    return insideM.isSame(tempMoment, map2[type]);
  }, [tempMoment, range]);
  /** 活动时间是否在选中时间之前 */

  var isActiveBeforeChecked = useMemo(function () {
    if (!isActiveDate || !tempMoment) return false;
    return tempMoment.isBefore(checkedMoment);
  }, [isActiveDate]);
  var isActiveSameChecked = useMemo(function () {
    if (!isActiveDate || !tempMoment) return false;
    return tempMoment.isSame(checkedMoment, map2[type]);
  }, [isActiveDate]);
  var bind = useHover(function (_ref2) {
    var hovering = _ref2.hovering;
    onActive(hovering ? insideM.clone() : undefined);
  }, {
    enabled: onActive && range && !checkedEndMoment && !!checkedMoment && !isDisabled
  });
  var onClick = useFn(function () {
    onActive(undefined);
    if (isDisabled) return;

    if (onCheck) {
      onCheck(formatDate(itemMoment, map3[type]), itemMoment.clone());
    }

    if (onCurrentChange && type === DateType.DATE && !isCurrentBetween && !range
    /* range时不需要自动跳上下月 */
    ) {
        onCurrentChange(insideM.clone());
      }
  });

  function renderItemFormat() {
    if (type === DateType.DATE) {
      return insideM.date();
    }

    if (type === DateType.MONTH) {
      return "".concat(insideM.month() + 1, "\u6708");
    }

    if (type === DateType.YEAR) {
      return "".concat(insideM.year(), "\u5E74");
    }

    return '-';
  }

  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls('m78-dates_date-item', {
      __active: isChecked || isEndChecked || isActiveDate,
      __gray: type === DateType.DATE ? !isCurrentBetween : false,
      __focus: isSame,
      __disabled: isDisabled,
      __disabledRange: isDisabledRange,
      __firstRange: isDisabled && !prevDisabled && !isRangeCheckBetween,
      __lastRange: isDisabled && !lastDisabled && !isRangeCheckBetween,
      __yearMonth: type === DateType.MONTH || type === DateType.YEAR,
      __activeRange: isRangeCheckBetween
    }),
    onClick: onClick
  }, bind()), /*#__PURE__*/React.createElement("span", {
    className: "m78-dates_date-item-inner"
  }, range && isChecked && !isEndChecked && /*#__PURE__*/React.createElement("span", {
    className: "m78-dates_tips"
  }, startLabel), range && isEndChecked && /*#__PURE__*/React.createElement("span", {
    className: "m78-dates_tips"
  }, isChecked ? "".concat(startLabel, "/").concat(endLabel) : endLabel), isActiveDate && isActiveSameChecked && /*#__PURE__*/React.createElement("span", {
    className: "m78-dates_tips"
  }, "\u8BBE\u4E3A", startLabel, "/", endLabel), isActiveDate && !isActiveSameChecked && /*#__PURE__*/React.createElement("span", {
    className: "m78-dates_tips"
  }, isActiveBeforeChecked ? "\u8BBE\u4E3A".concat(startLabel) : "\u8BBE\u4E3A".concat(endLabel)), renderItemFormat()));
};

/**  渲染选择结果 */

function staticRenderCheckedValue(_ref, _ref2) {
  var self = _ref.self,
      hasTime = _ref.hasTime,
      type = _ref.type,
      value = _ref.value,
      props = _ref.props;
  var toTime = _ref2.toTime;

  if (!value) {
    return /*#__PURE__*/React.createElement("div", null, "\u8BF7\u9009\u62E9", placeholderMaps[type]);
  }

  var range = props.range;
  var startLabel = range && /*#__PURE__*/React.createElement("span", {
    className: "color-second"
  }, props.startLabel, ": ");
  var endLabel = range && /*#__PURE__*/React.createElement("span", {
    className: "color-second"
  }, props.endLabel, ": ");
  var tipsNode = /*#__PURE__*/React.createElement("span", null, "\u8BF7\u9009\u62E9", !range && placeholderMaps[type]);

  function renderDateItem(mmt, label) {
    return /*#__PURE__*/React.createElement("div", null, label, mmt ? /*#__PURE__*/React.createElement("span", null, mmt.format(DATE_FORMAT_DATE)) : tipsNode, mmt && hasTime && /*#__PURE__*/React.createElement("span", {
      onClick: toTime,
      className: "color-primary m78-dates_time m78-dates_effect-text",
      title: "\u70B9\u51FB\u9009\u62E9"
    }, mmt.format(DATE_FORMAT_TIME)));
  }

  var renderHelper = function renderHelper(mmt, label, format, unit) {
    return /*#__PURE__*/React.createElement("div", null, label, mmt ? /*#__PURE__*/React.createElement("span", null, mmt.format(format), unit) : tipsNode);
  };

  function commonRender(format, unit) {
    return /*#__PURE__*/React.createElement("div", null, (range || self.cValueMoment) && renderHelper(self.cValueMoment, startLabel, format, unit), range && renderHelper(self.endValueMoment, endLabel, format, unit));
  }

  if (type === DateType.DATE) {
    return /*#__PURE__*/React.createElement("div", null, renderDateItem(self.cValueMoment, startLabel), range && renderDateItem(self.endValueMoment, endLabel));
  }

  if (type === DateType.MONTH) {
    return commonRender(DATE_FORMAT_MONTH, '月');
  }

  if (type === DateType.YEAR) {
    return commonRender(DATE_FORMAT_YEAR, '年');
  }

  if (type === DateType.TIME) {
    return commonRender(DATE_FORMAT_TIME);
  }
}
/** 日期选择 */

function staticRenderDate(_ref3, _ref4, _ref5) {
  var self = _ref3.self,
      state = _ref3.state,
      nowM = _ref3.nowM,
      props = _ref3.props;
  var onCurrentChange = _ref4.onCurrentChange,
      prevY = _ref4.prevY,
      prev = _ref4.prev,
      toYear = _ref4.toYear,
      toMonth = _ref4.toMonth,
      nextY = _ref4.nextY,
      next = _ref4.next;
  var onCheck = _ref5.onCheck,
      onItemActive = _ref5.onItemActive;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "m78-dates_label"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "m78-dates_arrow",
    title: "\u4E0A\u4E00\u5E74",
    onClick: prevY
  }), /*#__PURE__*/React.createElement("span", {
    className: "m78-dates_arrow __single ml-8",
    title: "\u4E0A\u4E00\u6708",
    onClick: prev
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "m78-dates_effect-text",
    onClick: toYear
  }, state.currentM.year()), "\u5E74", /*#__PURE__*/React.createElement("span", {
    className: "m78-dates_effect-text",
    onClick: toMonth,
    style: {
      marginLeft: 4
    }
  }, state.currentM.month() + 1), "\u6708"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "m78-dates_arrow __reverse __single",
    title: "\u4E0B\u4E00\u6708",
    onClick: next
  }), /*#__PURE__*/React.createElement("span", {
    className: "m78-dates_arrow __reverse ml-8",
    title: "\u4E0B\u4E00\u5E74",
    onClick: nextY
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "m78-dates_date-item __title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "m78-dates_date-item-inner"
  }, "\u4E00")), /*#__PURE__*/React.createElement("div", {
    className: "m78-dates_date-item __title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "m78-dates_date-item-inner"
  }, "\u4E8C")), /*#__PURE__*/React.createElement("div", {
    className: "m78-dates_date-item __title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "m78-dates_date-item-inner"
  }, "\u4E09")), /*#__PURE__*/React.createElement("div", {
    className: "m78-dates_date-item __title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "m78-dates_date-item-inner"
  }, "\u56DB")), /*#__PURE__*/React.createElement("div", {
    className: "m78-dates_date-item __title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "m78-dates_date-item-inner"
  }, "\u4E94")), /*#__PURE__*/React.createElement("div", {
    className: "m78-dates_date-item __title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "m78-dates_date-item-inner"
  }, "\u516D")), /*#__PURE__*/React.createElement("div", {
    className: "m78-dates_date-item __title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "m78-dates_date-item-inner"
  }, "\u65E5"))), /*#__PURE__*/React.createElement("div", {
    className: "m78-dates_list"
  }, getDates(state.currentM.year(), state.currentM.month() + 1).map(function (mm) {
    return /*#__PURE__*/React.createElement(DateItem, {
      disabledDate: props.disabledDate,
      itemMoment: mm,
      currentMoment: state.currentM,
      checkedMoment: self.cValueMoment,
      checkedEndMoment: self.endValueMoment,
      nowMoment: nowM,
      onCheck: onCheck,
      onCurrentChange: onCurrentChange,
      key: mm.format(),
      type: DateType.DATE,
      range: props.range,
      onActive: onItemActive,
      tempMoment: state.tempM,
      startLabel: props.startLabel,
      endLabel: props.endLabel
    });
  })));
}
/** 月份选择 */

function staticRenderMonth(_ref6, _ref7, _ref8) {
  var self = _ref6.self,
      state = _ref6.state,
      nowM = _ref6.nowM,
      props = _ref6.props;
  var prevY = _ref7.prevY,
      toYear = _ref7.toYear,
      nextY = _ref7.nextY;
  var onCheckMonth = _ref8.onCheckMonth,
      onItemActive = _ref8.onItemActive;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "m78-dates_label"
  }, /*#__PURE__*/React.createElement("span", {
    className: "m78-dates_arrow",
    title: "\u4E0A\u4E00\u5E74",
    onClick: prevY
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    className: "m78-dates_effect-text",
    onClick: toYear
  }, state.currentM.year()), "\u5E74"), /*#__PURE__*/React.createElement("span", {
    className: "m78-dates_arrow __reverse",
    title: "\u4E0B\u4E00\u5E74",
    onClick: nextY
  })), /*#__PURE__*/React.createElement("div", {
    className: "m78-dates_list"
  }, getMonths(state.currentM.year()).map(function (mm) {
    return /*#__PURE__*/React.createElement(DateItem, {
      disabledDate: props.disabledDate,
      itemMoment: mm,
      currentMoment: state.currentM,
      checkedMoment: self.cValueMoment,
      checkedEndMoment: self.endValueMoment,
      nowMoment: nowM,
      onCheck: onCheckMonth,
      key: mm.format(),
      type: DateType.MONTH,
      range: props.range,
      onActive: onItemActive,
      tempMoment: state.tempM,
      startLabel: props.startLabel,
      endLabel: props.endLabel
    });
  })));
}
/** 年份选择 */

function staticRenderYear(_ref9, _ref10, _ref11) {
  var self = _ref9.self,
      state = _ref9.state,
      nowM = _ref9.nowM,
      props = _ref9.props;
  var changeDate = _ref10.changeDate;
  var onCheckYear = _ref11.onCheckYear,
      onItemActive = _ref11.onItemActive;

  var _getYears = getYears(state.currentM.year()),
      _getYears2 = _slicedToArray(_getYears, 2),
      list = _getYears2[0],
      str = _getYears2[1];

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "m78-dates_label"
  }, /*#__PURE__*/React.createElement("span", {
    className: "m78-dates_arrow",
    title: "\u524D\u4E00\u7EC4",
    onClick: function onClick() {
      return changeDate(2, 12, 'years');
    }
  }), /*#__PURE__*/React.createElement("span", null, str), /*#__PURE__*/React.createElement("span", {
    className: "m78-dates_arrow __reverse",
    title: "\u540E\u4E00\u7EC4",
    onClick: function onClick() {
      return changeDate(1, 12, 'years');
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "m78-dates_list"
  }, list.map(function (mm) {
    return /*#__PURE__*/React.createElement(DateItem, {
      disabledDate: props.disabledDate,
      itemMoment: mm,
      currentMoment: state.currentM,
      checkedMoment: self.cValueMoment,
      checkedEndMoment: self.endValueMoment,
      nowMoment: nowM,
      onCheck: onCheckYear,
      key: mm.format(),
      type: DateType.YEAR,
      range: props.range,
      onActive: onItemActive,
      tempMoment: state.tempM,
      startLabel: props.startLabel,
      endLabel: props.endLabel
    });
  })));
}
function staticRenderTime(_ref12, _ref13) {
  var props = _ref12.props,
      self = _ref12.self,
      getCurrentTime = _ref12.getCurrentTime;
  var onCheckTime = _ref13.onCheckTime;
  var common = {
    disabledTime: disabledHandlerFormat(props.disabledTime),
    hideDisabled: props.hideDisabledTime,
    disabledTimeExtra: {
      checkedDate: self.cValueMoment,
      checkedEndDate: self.endValueMoment,
      isRange: props.range
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Time, _extends({}, common, {
    value: getCurrentTime(),
    onChange: onCheckTime
  })), props.range && /*#__PURE__*/React.createElement(Time, _extends({}, common, {
    disabledTime: disabledHandlerFormat(props.disabledTime, [rangeDisabledBeforeTime]),
    value: getCurrentTime(true),
    onChange: function onChange(times) {
      return onCheckTime(times, true);
    },
    label: /*#__PURE__*/React.createElement("span", null, "~ \u9009\u62E9\u65F6\u95F4\u8303\u56F4 ~")
  })));
}
function staticRenderTabs(_ref14, _ref15) {
  var self = _ref14.self,
      state = _ref14.state,
      type = _ref14.type,
      hasTime = _ref14.hasTime,
      props = _ref14.props;
  var toYear = _ref15.toYear,
      toMonth = _ref15.toMonth,
      toDate = _ref15.toDate,
      toTime = _ref15.toTime;
  var year = null;
  var month = null;
  var date = null;
  var time = null;

  var renderButton = function renderButton(dType, title, unit, handler) {
    return /*#__PURE__*/React.createElement(Button, {
      size: "small",
      text: true,
      title: title,
      color: state.type === dType ? 'primary' : undefined,
      onClick: handler
    }, unit);
  };

  if (type === DateType.MONTH || type === DateType.DATE) {
    year = renderButton(DateType.YEAR, '选择年份', '年', toYear);
  }

  if (type === DateType.MONTH || type === DateType.DATE) {
    month = renderButton(DateType.MONTH, '选择月份', '月', toMonth);
  }

  if (type === DateType.DATE) {
    date = renderButton(DateType.DATE, '选择日期', '日', toDate);
  }
  /* 选择了时间 且 类型为日期选择器 并且启用了 时间选择 或 类型为时间选择器 */


  if (self.cValueMoment && type === DateType.DATE && hasTime) {
    time = renderButton(DateType.TIME, '选择时间', '时', toTime);
    if (props.range && !self.endValueMoment) time = null;
  }

  return /*#__PURE__*/React.createElement("span", {
    className: "m78-dates_btns"
  }, year, month, date, time);
}
/** 为一个包含 hour minute second 的对象设置空值的默认值 */

var timePresetHelper = function timePresetHelper(t) {
  var defaultTime = {
    hour: 0,
    minute: 0,
    second: 0
  };
  return _objectSpread(_objectSpread({}, defaultTime), t);
};

var renderPresetDates = function renderPresetDates(_ref16) {
  var type = _ref16.type,
      hasTime = _ref16.hasTime,
      setValue = _ref16.setValue,
      props = _ref16.props;
  var baseProps = {
    size: 'small',
    text: true,
    color: 'primary'
  }; // 设为当前

  var setCurrent = function setCurrent(format) {
    var now = moment();
    setValue(now.format(format), now);
  }; // 设置年月日时的范围


  var setCurrentRange = function setCurrentRange(format, setType) {
    var now = moment();
    var end = moment();
    now.set(timePresetHelper());
    end.set(timePreset.day[1]);

    if (setType) {
      now.startOf(setType);
      end.endOf(setType);
    }

    setValue([now.format(format), end.format(format)], [now, end]);
  }; // 设置时间范围


  var setCurrentTimeRange = function setCurrentTimeRange(setType) {
    var now = moment();
    var end = moment();
    var p = timePreset[setType] || timePreset.day;
    now.set(timePresetHelper(p[0]));
    end.set(timePresetHelper(p[1]));
    setValue([now.format(DATE_FORMAT_TIME), end.format(DATE_FORMAT_TIME)], [now, end]);
  };

  var simpleHelper = function simpleHelper(label, handler) {
    return /*#__PURE__*/React.createElement(Button, _objectSpread(_objectSpread({}, baseProps), {}, {
      onClick: handler
    }), label);
  };

  if (props.range) {
    if (type === DateType.TIME) {
      return /*#__PURE__*/React.createElement(React.Fragment, null, simpleHelper('全天', function () {
        return setCurrentTimeRange('day');
      }), simpleHelper('早', function () {
        return setCurrentTimeRange('morning');
      }), simpleHelper('中', function () {
        return setCurrentTimeRange('midday');
      }), simpleHelper('午', function () {
        return setCurrentTimeRange('afternoon');
      }), simpleHelper('晚', function () {
        return setCurrentTimeRange('evening');
      }));
    }

    if (type === DateType.DATE) {
      return /*#__PURE__*/React.createElement(React.Fragment, null, simpleHelper(hasTime ? '全天' : '今天', function () {
        return setCurrentRange(hasTime ? DATE_FORMAT_DATE_TIME : DATE_FORMAT_DATE);
      }), simpleHelper('本周', function () {
        return setCurrentRange(hasTime ? DATE_FORMAT_DATE_TIME : DATE_FORMAT_DATE, 'week');
      }), simpleHelper('本月', function () {
        return setCurrentRange(hasTime ? DATE_FORMAT_DATE_TIME : DATE_FORMAT_DATE, 'month');
      }));
    }

    return;
  }

  if (type === DateType.TIME) {
    return simpleHelper('现在', function () {
      return setCurrent(DATE_FORMAT_TIME);
    });
  }

  if (type === DateType.DATE) {
    return simpleHelper('今天', function () {
      return setCurrent(hasTime ? DATE_FORMAT_DATE_TIME : DATE_FORMAT_DATE);
    });
  }

  if (type === DateType.MONTH) {
    return simpleHelper('本月', function () {
      return setCurrent(DATE_FORMAT_MONTH);
    });
  }

  if (type === DateType.YEAR) {
    return simpleHelper('今年', function () {
      return setCurrent(DATE_FORMAT_YEAR);
    });
  }
};

/** 获取更新当前选择器数据和位置的一些操作函数 */

function useDateUIController(_ref) {
  var state = _ref.state,
      setState = _ref.setState;

  /** 在当前月份上增加或减少指定天数并更新currentM */
  function changeDate(cType) {
    var number = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var dateType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'months';
    var map = {
      1: 'add',
      2: 'subtract'
    };
    var nMm = state.currentM.clone();
    nMm[map[cType]](number, dateType);
    setState({
      currentM: nMm
    });
  }
  /** 切换 到上一月 */


  var prev = useFn(function () {
    changeDate(2);
  });
  /** 切换 到下一月 */

  var next = useFn(function () {
    changeDate(1);
  });
  /** 切换 到上一年 */

  var prevY = useFn(function () {
    changeDate(2, 1, 'years');
  });
  /** 切换 到下一年 */

  var nextY = useFn(function () {
    changeDate(1, 1, 'years');
  });
  /** 接收来自DateItem的通知并更新currentM */

  var onCurrentChange = useFn(function (mmt) {
    setState({
      currentM: mmt
    });
  });
  var toYear = useFn(function () {
    setState({
      type: DateType.YEAR
    });
  });
  var toMonth = useFn(function () {
    setState({
      type: DateType.MONTH
    });
  });
  var toDate = useFn(function () {
    setState({
      type: DateType.DATE
    });
  });
  var toTime = useFn(function () {
    setState({
      type: DateType.TIME
    });
  });
  return {
    changeDate: changeDate,
    prev: prev,
    next: next,
    prevY: prevY,
    nextY: nextY,
    onCurrentChange: onCurrentChange,
    toYear: toYear,
    toMonth: toMonth,
    toDate: toDate,
    toTime: toTime
  };
}
/** 外部化的一些事件处理器 */

function useHandlers(_ref2, _ref3) {
  var hasTime = _ref2.hasTime,
      setValue = _ref2.setValue,
      getCurrentTime = _ref2.getCurrentTime,
      self = _ref2.self,
      type = _ref2.type,
      state = _ref2.state,
      setState = _ref2.setState,
      nowM = _ref2.nowM,
      props = _ref2.props;
  var toTime = _ref3.toTime;

  function rangeHandler(dString, mmt, format) {
    if (self.cValueMoment && !self.endValueMoment) {
      var min = moment.min(mmt, self.cValueMoment);
      var max = moment.max(mmt, self.cValueMoment);
      self.cValueMoment = min;
      self.endValueMoment = max;
      setValue([min.format(format), max.format(format)], [min, max]);
      return;
    }

    self.endValueMoment = undefined;
    setValue([dString], [mmt]);
  }

  var onShow = useFn(function () {
    return setState({
      show: true
    });
  });
  var onHide = useFn(function () {
    return setState({
      show: false
    });
  });
  /** 选中日期项 */

  var onCheck = useFn(function (dString, mmt) {
    var format = hasTime ? DATE_FORMAT_DATE_TIME : DATE_FORMAT_DATE;
    var nowTime = {
      hour: nowM.hour(),
      minute: nowM.minute(),
      second: nowM.second()
    };

    if (props.range) {
      // 范围选择时，默认设置当前时间
      if (hasTime) {
        mmt.set(nowTime);
      }

      rangeHandler(mmt.format(format), mmt, format);

      if (hasTime && self.cValueMoment && self.endValueMoment) {
        setTimeout(toTime);
      }

      return;
    } // 常规选择且包含时间，设置将已选时间设置到选择的日期上


    if (hasTime) {
      mmt.set(getCurrentTime() || nowTime);
      setValue(mmt.format(format), mmt); // 需要value更新完成后再执行

      setTimeout(toTime);
      return;
    }

    setValue(dString, mmt);
    onHide();
  });
  /** 选中时间, 传入isEnd时设置结束时间 */

  var onCheckTime = useFn(function (_ref4, isEnd) {
    var _self$endValueMoment, _self$cValueMoment, _self$cValueMoment2, _self$endValueMoment2;

    var h = _ref4.h,
        m = _ref4.m,
        s = _ref4.s;
    // 如果是单纯的时间选择，则以当天时间设置moment返回，否则根据已选时间设置
    var cM = isEnd ? (_self$endValueMoment = self.endValueMoment) === null || _self$endValueMoment === void 0 ? void 0 : _self$endValueMoment.clone() : (_self$cValueMoment = self.cValueMoment) === null || _self$cValueMoment === void 0 ? void 0 : _self$cValueMoment.clone(); // 没有已选中时间时取当天

    if (!cM || type === DateType.TIME) cM = nowM.clone(); // 在当前时间的基础上替换时间

    cM.set({
      hour: h,
      minute: m,
      second: s
    });

    if (isEnd) {
      self.endValueMoment = cM;
    } else {
      self.cValueMoment = cM;
    }

    var format = type === DateType.TIME ? DATE_FORMAT_TIME : DATE_FORMAT_DATE_TIME;
    var ds = cM.format(format);

    if (!props.range) {
      setValue(ds, cM);
      return;
    }

    isEnd ? setValue([(_self$cValueMoment2 = self.cValueMoment) === null || _self$cValueMoment2 === void 0 ? void 0 : _self$cValueMoment2.format(format), ds], [self.cValueMoment, cM]) : setValue([ds, (_self$endValueMoment2 = self.endValueMoment) === null || _self$endValueMoment2 === void 0 ? void 0 : _self$endValueMoment2.format(format)], [cM, self.endValueMoment]);
  });
  /** 选中月 */

  var onCheckMonth = useFn(function (dString, mmt) {
    // 选择器类型为月时直接选中，不是则将UI更新到对应的月
    if (type === DateType.MONTH) {
      if (props.range) {
        rangeHandler(dString, mmt, DATE_FORMAT_MONTH);
        return;
      }

      setValue(dString, mmt);
      onHide();
      return;
    }

    var cm = state.currentM.clone();
    cm.year(mmt.year()).month(mmt.month());
    setState({
      currentM: cm,
      type: DateType.DATE
    });
  });
  /** 选中年 */

  var onCheckYear = useFn(function (dString, mmt) {
    // 选择器类型为年时直接选中，不是则将UI更新到对应的月
    if (type === DateType.YEAR) {
      if (props.range) {
        rangeHandler(dString, mmt, DATE_FORMAT_YEAR);
        return;
      }

      setValue(dString, mmt);
      onHide();
      return;
    }

    var cm = state.currentM.clone();
    cm.year(mmt.year());
    setState({
      currentM: cm,
      type: DateType.MONTH
    });
  });
  /** 设置活动状态 */

  var onItemActive = useFn(function (mmt) {
    setState({
      tempM: mmt
    });
  });
  var reset = useFn(function () {
    self.cValueMoment = undefined;
    self.endValueMoment = undefined;
    setState({
      type: type,
      currentM: nowM
    });
    setValue(props.range ? [] : '');
  });
  var onKeyDown = useFn(function (e) {
    if (e.keyCode === 9) {
      setState({
        show: false
      });
    }
  });
  return {
    onCheck: onCheck,
    onCheckTime: onCheckTime,
    onCheckMonth: onCheckMonth,
    onCheckYear: onCheckYear,
    onItemActive: onItemActive,
    onKeyDown: onKeyDown,
    onShow: onShow,
    reset: reset,
    onHide: onHide
  };
}

function Dates(props) {
  var tProps = props;
  var _tProps$type = tProps.type,
      type = _tProps$type === void 0 ? DateType.DATE : _tProps$type,
      _tProps$hasTime = tProps.hasTime,
      hasTime = _tProps$hasTime === void 0 ? false : _tProps$hasTime,
      range = tProps.range,
      className = tProps.className,
      style = tProps.style,
      disabledPreset = tProps.disabledPreset,
      _tProps$format = tProps.format,
      format = _tProps$format === void 0 ? defaultFormat : _tProps$format,
      size = tProps.size,
      disabled = tProps.disabled,
      _tProps$mode = tProps.mode,
      mode = _tProps$mode === void 0 ? 'select' : _tProps$mode;
  /**  当前时间 */

  var _useState = useState(function () {
    return moment();
  }),
      _useState2 = _slicedToArray(_useState, 1),
      nowM = _useState2[0];

  var _useFormState = useFormState(props, range ? [] : ''),
      _useFormState2 = _slicedToArray(_useFormState, 2),
      value = _useFormState2[0],
      setValue = _useFormState2[1];

  var _useSetState = useSetState({
    /** 实际存储的时间, 控制当前日期显示的位置 */
    currentM: nowM,

    /** 当前参与交互的临时时间，实现预览功能 */
    tempM: undefined,

    /** 控制当前展示的选择器类型 */
    type: type,

    /** 是否显示 */
    show: false,

    /** 是否为移动设备（不严格匹配, 屏幕小于指定物理像素即视为移动设备） */
    mobile: false
  }),
      _useSetState2 = _slicedToArray(_useSetState, 2),
      state = _useSetState2[0],
      setState = _useSetState2[1];

  var self = useSelf({
    /** 指向当前value的moment, 这里才是实际存储value的地方, value相当于此值的时间字符映射 */
    cValueMoment: undefined,

    /** 当是范围选择时，存储结束时间 */
    endValueMoment: undefined
  });
  var share = {
    nowM: nowM,
    state: state,
    setState: setState,
    value: value,
    setValue: setValue,
    self: self,
    hasTime: hasTime,
    getCurrentTime: getCurrentTime,
    type: type,
    props: props
  };
  /** 将value解析到cValueMoment/endValueMoment(useMemo执行时机比effect更快) */

  useMemo(function () {
    return parseValue(share);
  }, [value]);
  /** 控制picker的显示类型, 并在窗口大小变更时更新 */

  useEffect(pickerTypeWrap(state, setState), []);
  /** 外部化一些控制函数 */

  var controllers = useDateUIController(share);
  /** 外部化一处理函数 */

  var handlers = useHandlers(share, controllers);
  /** 根据当前选中事件获取时分秒，未选中时间则取当前时间, 传入getEndTime时获取结束时间 */

  function getCurrentTime(isEnd) {
    var cM = isEnd ? self.endValueMoment : self.cValueMoment;
    if (!cM) return undefined;
    return {
      h: cM.hour(),
      m: cM.minute(),
      s: cM.second()
    };
  }

  var renderCheckedValue = function renderCheckedValue() {
    return staticRenderCheckedValue(share, controllers);
  };

  var renderDate = function renderDate() {
    return staticRenderDate(share, controllers, handlers);
  };

  var renderMonth = function renderMonth() {
    return staticRenderMonth(share, controllers, handlers);
  };

  var renderYear = function renderYear() {
    return staticRenderYear(share, controllers, handlers);
  };

  var renderTime = function renderTime() {
    return staticRenderTime(share, handlers);
  };

  var renderTabs = function renderTabs() {
    return staticRenderTabs(share, controllers);
  };

  function render() {
    if (state.type === DateType.DATE && type === DateType.DATE) return renderDate();
    if (state.type === DateType.MONTH) return renderMonth();
    if (state.type === DateType.YEAR) return renderYear();
    if (state.type === DateType.TIME) return renderTime();
    return null;
  }

  function renderMain() {
    var fullWidth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    return /*#__PURE__*/React.createElement("div", {
      className: cls('m78-dates', className, {
        __time: type === DateType.TIME || state.type === DateType.TIME
      }),
      style: _objectSpread({
        width: fullWidth ? '100%' : undefined
      }, style)
    }, /*#__PURE__*/React.createElement("div", {
      className: "m78-dates_head"
    }, /*#__PURE__*/React.createElement("span", {
      className: "bold"
    }, renderCheckedValue()), renderTabs()), /*#__PURE__*/React.createElement("div", {
      className: "m78-dates_body"
    }, render()), /*#__PURE__*/React.createElement("div", {
      className: "m78-dates_foot"
    }, /*#__PURE__*/React.createElement("span", {
      className: "m78-dates_btns"
    }, !disabledPreset && renderPresetDates(share)), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Button, {
      size: "small",
      text: true,
      onClick: handlers.reset
    }, "\u6E05\u7A7A"), /*#__PURE__*/React.createElement(Button, {
      size: "small",
      color: "primary",
      onClick: function onClick() {
        return setState({
          show: false
        });
      }
    }, "\u5B8C\u6210"))));
  }

  function renderInput() {
    return /*#__PURE__*/React.createElement(Input, {
      className: "m78-dates_inp",
      value: format({
        current: self.cValueMoment,
        end: self.endValueMoment,
        isRange: !!range,
        type: type,
        hasTime: hasTime
      }),
      allowClear: false,
      placeholder: tProps.placeholder || "\u8BF7\u9009\u62E9".concat(placeholderMaps[type]).concat(range ? '范围' : ''),
      onFocus: state.mobile ? undefined : handlers.onShow,
      onClick: handlers.onShow,
      onKeyDown: handlers.onKeyDown,
      readOnly: true,
      size: size,
      disabled: disabled
    });
  }

  function renderTooltip() {
    return /*#__PURE__*/React.createElement(Popper, {
      className: "m78-dates_popper",
      offset: 4,
      content: renderMain(),
      direction: "bottomStart",
      trigger: "click",
      show: state.show,
      type: "popper",
      disabled: disabled,
      unmountOnExit: false,
      onChange: function onChange(_show) {
        setState({
          show: _show
        });
      }
    }, renderInput());
  }
  /** 在小屏设备上使用model开启 */


  function renderModel() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, renderInput(), /*#__PURE__*/React.createElement(Modal, {
      baseZIndex: Z_INDEX_MESSAGE,
      show: state.show,
      style: {
        width: '94%',
        padding: 12
      },
      onClose: handlers.onHide
    }, renderMain(true)));
  }

  if (mode === 'component' || mode === 'calendar') {
    return renderMain(mode === 'calendar');
  }

  return state.mobile ? renderModel() : renderTooltip();
}

Dates.defaultProps = {
  startLabel: '开始',
  endLabel: '结束'
};

moment.locale('zh-cn');

export { DateType, Dates };
