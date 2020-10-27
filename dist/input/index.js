import 'm78/input/style';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import _toConsumableArray from '@babel/runtime/helpers/toConsumableArray';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import React, { useMemo, useState, useEffect, useRef, useImperativeHandle } from 'react';
import { CloseCircleOutlined, EyeOutlined, EyeInvisibleOutlined, SearchOutlined } from 'm78/icon';
import Spin from 'm78/spin';
import Button from 'm78/button';
import { If } from 'm78/fork';
import { dumpFn, validateFormatString, isNumber, formatString } from '@lxjx/utils';
import cls from 'classnames';
import { useSelf, useFormState, useDerivedStateFromProps } from '@lxjx/hooks';
import { TransitionBase } from '@lxjx/react-transition-spring';
import { useUpdateEffect } from 'react-use';

/* 内置format */
var buildInPattern = {
  phone: {
    delimiter: ' ',
    pattern: '3,4',
    lastRepeat: true
  },
  idCard: {
    delimiter: ' ',
    pattern: '3,3,4',
    lastRepeat: true
  },
  money: {
    delimiter: "'",
    pattern: '5,3',
    lastRepeat: true
  },
  bankCard: {
    delimiter: ' ',
    pattern: '3,4',
    lastRepeat: true
  }
};
/* money format需要单独处理小数点 */

function formatMoney() {
  var moneyStr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var delimiter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "'";
  var dotIndex = moneyStr.indexOf('.');
  if (dotIndex === -1) return moneyStr;
  var first = moneyStr.slice(0, dotIndex - 1); // 移除小数点前一位以及以后所有的delimiter

  var last = moneyStr.slice(dotIndex - 1).replace(new RegExp(delimiter, 'g'), '');
  return first + last;
}
/* 处理 type=number */

function parserNumber() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  value = value.replace(/[^(0-9|.)]/g, ''); // 去首位点

  if (value[0] === '.') {
    value = value.slice(1);
  } // 去1个以上的点


  var matchDot = value.match(/(\.)/g);

  if (matchDot && matchDot.length > 1) {
    var firstDotInd = value.indexOf('.');
    var firstStr = value.slice(0, firstDotInd + 1);
    var lastStr = value.slice(firstDotInd + 1).replace('.', '');
    value = firstStr + lastStr;
  }

  return value;
}
/* 处理 type=integer */

function parserInteger() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return value.replace(/[\D]/g, '');
}
/* 处理 type=general */

function parserGeneral() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return value.replace(/[\W]/g, '');
}
/* 处理 maxLength */

function parserLength() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var maxLength = arguments.length > 1 ? arguments[1] : undefined;
  return value.slice(0, maxLength);
}
/* 处理 min max */

function parserThan() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var num = arguments.length > 1 ? arguments[1] : undefined;
  var isMin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var _num = Number(value);

  if (Number.isNaN(_num)) return value;

  if (isMin && _num < num) {
    return String(num);
  }

  if (!isMin && _num > num) {
    return String(num);
  }

  return value;
}

var Input = /*#__PURE__*/React.forwardRef(function (_props, ref) {
  var className = _props.className,
      style = _props.style,
      _props$disabled = _props.disabled,
      _disabled = _props$disabled === void 0 ? false : _props$disabled,
      _props$readOnly = _props.readOnly,
      _readOnly = _props$readOnly === void 0 ? false : _props$readOnly,
      _props$loading = _props.loading,
      _loading = _props$loading === void 0 ? false : _props$loading,
      _props$blockLoading = _props.blockLoading,
      _blockLoading = _props$blockLoading === void 0 ? false : _props$blockLoading,
      _props$type = _props.type,
      _type = _props$type === void 0 ? 'text' : _props$type,
      size = _props.size,
      _props$allowClear = _props.allowClear,
      allowClear = _props$allowClear === void 0 ? true : _props$allowClear,
      _props$onFocus = _props.onFocus,
      onFocus = _props$onFocus === void 0 ? dumpFn : _props$onFocus,
      _props$onBlur = _props.onBlur,
      onBlur = _props$onBlur === void 0 ? dumpFn : _props$onBlur,
      _props$onKeyDown = _props.onKeyDown,
      onKeyDown = _props$onKeyDown === void 0 ? dumpFn : _props$onKeyDown,
      _props$onPressEnter = _props.onPressEnter,
      onPressEnter = _props$onPressEnter === void 0 ? dumpFn : _props$onPressEnter,
      _value = _props.value,
      _defaultValue = _props.defaultValue,
      _onChange = _props.onChange,
      status = _props.status,
      notBorder = _props.notBorder,
      underline = _props.underline,
      format = _props.format,
      formatPattern = _props.formatPattern,
      _props$formatDelimite = _props.formatDelimiter,
      formatDelimiter = _props$formatDelimite === void 0 ? ' ' : _props$formatDelimite,
      _props$formatRepeat = _props.formatRepeat,
      formatRepeat = _props$formatRepeat === void 0 ? false : _props$formatRepeat,
      _props$formatLastRepe = _props.formatLastRepeat,
      formatLastRepeat = _props$formatLastRepe === void 0 ? false : _props$formatLastRepe,
      _formatter = _props.formatter,
      _parser = _props.parser,
      maxLength = _props.maxLength,
      min = _props.min,
      max = _props.max,
      _props$search = _props.search,
      search = _props$search === void 0 ? false : _props$search,
      _props$onSearch = _props.onSearch,
      onSearch = _props$onSearch === void 0 ? dumpFn : _props$onSearch,
      prefix = _props.prefix,
      suffix = _props.suffix,
      prefixBtn = _props.prefixBtn,
      suffixBtn = _props.suffixBtn,
      textArea = _props.textArea,
      _props$autoSize = _props.autoSize,
      autoSize = _props$autoSize === void 0 ? true : _props$autoSize,
      _props$charCount = _props.charCount,
      charCount = _props$charCount === void 0 ? false : _props$charCount,
      innerRef = _props.innerRef,
      props = _objectWithoutProperties(_props, ["className", "style", "disabled", "readOnly", "loading", "blockLoading", "type", "size", "allowClear", "onFocus", "onBlur", "onKeyDown", "onPressEnter", "value", "defaultValue", "onChange", "status", "notBorder", "underline", "format", "formatPattern", "formatDelimiter", "formatRepeat", "formatLastRepeat", "formatter", "parser", "maxLength", "min", "max", "search", "onSearch", "prefix", "suffix", "prefixBtn", "suffixBtn", "textArea", "autoSize", "charCount", "innerRef"]); // eslint


  dumpFn(_value, _defaultValue, _onChange);
  /** format相关配置, 不允许改变 */

  var formatArg = useMemo(function () {
    // 有预设优先用预设
    if (format && buildInPattern[format]) {
      var _buildInPattern$forma = buildInPattern[format],
          pattern = _buildInPattern$forma.pattern,
          conf = _objectWithoutProperties(_buildInPattern$forma, ["pattern"]);

      return [pattern, conf];
    }

    if (!formatPattern) return false;
    if (!validateFormatString.test(formatPattern)) return false;
    return [formatPattern, {
      delimiter: formatDelimiter,
      repeat: formatRepeat,
      lastRepeat: formatLastRepeat
    }]; // eslint-disable-next-line
  }, []);
  var self = useSelf({
    /**
     * 当前是否包含混合输入
     * 使用输入法等输入时，每次输入都会触发onChange并且执行格式化方法，通过此参数对值进行延迟设置
     * */
    hasComposing: false
  }); // 对format类型进行缓存
  // eslint-disable-next-line

  var memoFormat = useMemo(function () {
    return format;
  }, []);

  var _useFormState = useFormState(_props, ''),
      _useFormState2 = _slicedToArray(_useFormState, 2),
      value = _useFormState2[0],
      setValue = _useFormState2[1]; // textarea的高度 用于设置了autoSize时动态调整高度


  var _useState = useState(''),
      _useState2 = _slicedToArray(_useState, 2),
      textAreaHeight = _useState2[0],
      setTextAreaHeight = _useState2[1];
  /* 各种态，active和hover通过css处理, 部分状态需要由内部接管方便在用户之外进行一些状态操作 */


  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      focus = _useState4[0],
      setFocus = _useState4[1];

  var _useDerivedStateFromP = useDerivedStateFromProps(_disabled),
      _useDerivedStateFromP2 = _slicedToArray(_useDerivedStateFromP, 1),
      disabled = _useDerivedStateFromP2[0];

  var _useDerivedStateFromP3 = useDerivedStateFromProps(_readOnly),
      _useDerivedStateFromP4 = _slicedToArray(_useDerivedStateFromP3, 1),
      readonly = _useDerivedStateFromP4[0];

  var _useDerivedStateFromP5 = useDerivedStateFromProps(_loading),
      _useDerivedStateFromP6 = _slicedToArray(_useDerivedStateFromP5, 1),
      loading = _useDerivedStateFromP6[0];

  var _useDerivedStateFromP7 = useDerivedStateFromProps(_blockLoading),
      _useDerivedStateFromP8 = _slicedToArray(_useDerivedStateFromP7, 1),
      blockLoading = _useDerivedStateFromP8[0];
  /* 其他 */


  var _useDerivedStateFromP9 = useDerivedStateFromProps(_type),
      _useDerivedStateFromP10 = _slicedToArray(_useDerivedStateFromP9, 2),
      type = _useDerivedStateFromP10[0],
      setType = _useDerivedStateFromP10[1]; // 对一些配置进行type的类型优化


  useEffect(function () {
    if (memoFormat === 'money') {
      setType('number');
    } // eslint-disable-next-line

  }, [memoFormat]);
  /** 输入框类型修正 */

  useEffect(function () {
    if (type !== 'number' && type !== 'integer' && (isNumber(min) || isNumber(max))) {
      setType('number');
    } // eslint-disable-next-line

  }, [min, max]);
  /* 指向input的ref */

  var inputRef = useRef(null);
  var input = innerRef || inputRef;
  /* 对外暴露input ref */

  useImperativeHandle(ref, function () {
    return {
      el: input.current
    };
  });
  /* 实现textarea autoSize */

  var cloneText = useRef();
  /* 实现textarea autoSize */

  useEffect(function () {
    if (textArea && autoSize) {
      cloneText.current = input.current.cloneNode();
      cloneText.current.style.position = 'absolute';
      cloneText.current.style.visibility = 'hidden';
      var parent = input.current.parentNode;

      if (parent) {
        parent.appendChild(cloneText.current);
      }
    } // eslint-disable-next-line

  }, []);
  useUpdateEffect(function () {
    setInputVal(value || '', true);
  }, [value]);

  function focusHandle(e) {
    if (disabled || readonly) return;
    onFocus(e);
    setFocus(true);
  }

  function blurHandle(e) {
    onBlur(e);
    setFocus(false);
  }

  function keyDownHandle(e) {
    onKeyDown(e);

    if (e.keyCode === 13) {
      // input.current.blur();
      searchHandle();
      onPressEnter(e);
    }
  }
  /* 密码 开关 */


  function passwordTypeChange() {
    setType(function (prev) {
      return prev === 'password' ? 'text' : 'password';
    });
  }
  /** 处理input的onChange */


  function changeHandle(_ref) {
    var target = _ref.target;
    var val = target.value; // 设置formatArg后，改变value长度会导致光标移动到输入框末尾，手动将其还原

    var saveSelectInd = target.selectionStart;
    var oldValueLength = target.value.length;

    if (self.hasComposing) {
      return;
    }

    var pValue = parser(val);

    if ('value' in _props) {
      var _props$onChange;

      // 为受控组件时，通过onChange回传
      setInputVal(value, true);
      (_props$onChange = _props.onChange) === null || _props$onChange === void 0 ? void 0 : _props$onChange.call(_props, pValue);
    } else {
      setInputVal(pValue);
    } // 浏览器支持且存在formatArg配置或传入parser时，还原光标位置


    if (typeof saveSelectInd === 'number' && target.setSelectionRange // && (formatArg || typeof _parser === 'function') TODO: 暂时去掉限制, 文本中间输入光标会跳到末尾(Form中使用时)，有时间再研究
    ) {
        setTimeout(function () {
          var diff = target.value.length - oldValueLength; // 基于新值计算差异长度，还原位置需要减去此差值

          target.setSelectionRange(saveSelectInd + diff, saveSelectInd + diff);
        });
      }

    calcTextHeight();
  }
  /* 清空输入框 */


  function clearHandle() {
    setInputVal('');
    setTimeout(function () {
      // 清空后、触发搜索，并且在autoSize启用时时更新高度
      searchHandle();
      calcTextHeight();
    });
    input.current.focus();
  }
  /* 触发搜索 */


  function searchHandle() {
    onSearch(input.current.value);
  }

  function calcTextHeight() {
    if (!textArea || !autoSize || !cloneText.current) return;
    var el = input.current;
    cloneText.current.value = isNumber(maxLength) ? parserLength(el.value, maxLength) : el.value;
    setTextAreaHeight("".concat(cloneText.current.scrollHeight, "px"));
  }
  /* 提交value前的预处理函数 */


  function parser(val) {
    var _formatArg$;

    // 在启用了format时，需要在设置值之前移除掉所有的delimiter
    var newValue = formatArg ? val.replace(new RegExp(formatArg === null || formatArg === void 0 ? void 0 : (_formatArg$ = formatArg[1]) === null || _formatArg$ === void 0 ? void 0 : _formatArg$.delimiter, 'g'), '') : val;

    if (type === 'number') {
      newValue = parserNumber(newValue);
    }

    if (type === 'integer') {
      newValue = parserInteger(newValue);
    }

    if (_type === 'general') {
      newValue = parserGeneral(newValue);
    }

    if (isNumber(maxLength)) {
      newValue = parserLength(newValue, maxLength);
    }

    if (isNumber(min)) {
      newValue = parserThan(newValue, min);
    }

    if (isNumber(max)) {
      newValue = parserThan(newValue, max, false);
    }

    return _parser ? _parser(newValue) : newValue;
  }
  /** 根据type设置input应该使用的type */


  function getRealType(tType) {
    if (tType === 'number' || tType === 'integer') {
      return 'tel';
    }

    return tType;
  }
  /** 将字符值根据配置格式化后返回 */


  function formatVal(val) {
    /* 启用了formatArg时，对其格式化，否则返回原value */
    // eslint-disable-next-line
    var formatValue = formatArg && val
    /* TODO: 验证是否还会破坏热更新 */
    ? formatString.apply(void 0, [val].concat(_toConsumableArray(formatArg))) : val; // 对money类型特殊处理

    if (formatArg && memoFormat === 'money') {
      formatValue = formatMoney(formatValue);
    }
    /* value传入input前进行格式化(在传入了解析parser时才不会影响最终的value结果) */


    return _formatter ? _formatter(formatValue) : formatValue;
  }
  /** 设置input的值 */


  function setInputVal(val, skipSet) {
    !skipSet && setValue(val);
    var fVal = formatVal(val);

    if (fVal !== input.current.value) {
      input.current.value = formatVal(val);
    }
  }

  var isDisabled = disabled || blockLoading;
  var hasClearBtn = allowClear && value && value.length > 3 && !isDisabled && !readonly;
  return /*#__PURE__*/React.createElement("span", {
    className: cls('m78-input_wrap', className, status && "__".concat(status), size && "__".concat(size), {
      '__not-border': !textArea && notBorder,
      __underline: !textArea && underline,
      __focus: focus,
      __disabled: isDisabled,
      __readonly: readonly,
      __matter: format === 'money',
      __textarea: textArea
    }),
    style: style
  }, /*#__PURE__*/React.createElement(If, {
    when: prefixBtn && !textArea
  }, function () {
    return /*#__PURE__*/React.cloneElement(prefixBtn, {
      className: 'm78-input_prefix-btn'
    });
  }), /*#__PURE__*/React.createElement(If, {
    when: prefix && !textArea
  }, /*#__PURE__*/React.createElement("span", {
    className: "m78-input_prefix"
  }, prefix)), /*#__PURE__*/React.createElement(textArea ? 'textarea' : 'input', _objectSpread(_objectSpread({}, props), {}, {
    ref: input,
    className: 'm78-input',
    type: getRealType(type)
    /* 数字输入时，使用tel类型，number类型会导致format异常 */
    ,
    onFocus: focusHandle,
    onBlur: blurHandle,
    onKeyDown: keyDownHandle,
    disabled: isDisabled,
    readOnly: readonly,
    defaultValue: formatVal(value),
    onChange: changeHandle,
    onCompositionStart: function onCompositionStart() {
      self.hasComposing = true;
    },
    onCompositionEnd: function onCompositionEnd(e) {
      self.hasComposing = false;
      changeHandle(e);
    },
    style: textArea ? {
      height: textAreaHeight,
      overflow: autoSize ? 'hidden' : 'auto',
      resize: autoSize ? 'none' : undefined
    } : {}
  })), (loading || blockLoading) && /*#__PURE__*/React.createElement(Spin, {
    className: "m78-input_loading",
    size: "small",
    text: "",
    full: blockLoading
  }), /*#__PURE__*/React.createElement(If, {
    when: hasClearBtn
  }, /*#__PURE__*/React.createElement(CloseCircleOutlined, {
    onClick: clearHandle,
    className: "m78-input_icon m78-input_icon-clear"
  })), /*#__PURE__*/React.createElement(If, {
    when: _type === 'password' && !textArea
  }, type === 'password' ? /*#__PURE__*/React.createElement(EyeOutlined, {
    onClick: passwordTypeChange,
    className: "m78-input_icon"
  }) : /*#__PURE__*/React.createElement(EyeInvisibleOutlined, {
    onClick: passwordTypeChange,
    className: "m78-input_icon"
  })), /*#__PURE__*/React.createElement(If, {
    when: suffix && !textArea
  }, /*#__PURE__*/React.createElement("span", {
    className: "m78-input_suffix"
  }, suffix)), /*#__PURE__*/React.createElement(If, {
    when: (textArea || charCount) && value
  }, function () {
    return /*#__PURE__*/React.createElement("span", {
      className: "m78-input_tip-text"
    }, value.length, maxLength ? "/".concat(maxLength) : '字');
  }), /*#__PURE__*/React.createElement(TransitionBase, {
    style: {
      position: 'relative'
    },
    toggle: search && !!value && !textArea,
    mountOnEnter: true,
    appear: false,
    from: {
      width: 0,
      left: 6
    },
    to: {
      width: 28,
      left: 0
    }
  }, /*#__PURE__*/React.createElement(Button, {
    className: "m78-input_search-icon",
    icon: true,
    win: true,
    size: "small",
    onClick: searchHandle
  }, /*#__PURE__*/React.createElement(SearchOutlined, null))), /*#__PURE__*/React.createElement(If, {
    when: suffixBtn && !textArea
  }, function () {
    return /*#__PURE__*/React.cloneElement(suffixBtn, {
      className: 'm78-input_suffix-btn'
    });
  }));
});
Input.displayName = 'FrInput';

export default Input;
export { formatMoney };
