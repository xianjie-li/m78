import 'm78/check/style';
import _defineProperty from '@babel/runtime/helpers/defineProperty';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import React, { useState } from 'react';
import { If } from 'm78/fork';
import { useFormState } from '@lxjx/hooks';
import cls from 'classnames';

/* 接收<ShareMeta>并生成适合的类名返回 */
function getCheckCls(_ref) {
  var focus = _ref.focus,
      checked = _ref.checked,
      disabled = _ref.disabled;
  return {
    __focus: focus,
    __checked: checked,
    __disabled: disabled
  };
}
/** 内置样式实现 */


var builtIn = {
  radio: function radio(meta) {
    return /*#__PURE__*/React.createElement("span", {
      className: cls('m78-check_base m78-effect __md', getCheckCls(meta))
    }, /*#__PURE__*/React.createElement("span", {
      className: "m78-check_base-main"
    }, /*#__PURE__*/React.createElement("span", {
      className: "m78-check_base-inner"
    })));
  },
  checkbox: function checkbox(meta, _ref2) {
    var partial = _ref2.partial;
    return /*#__PURE__*/React.createElement("span", {
      className: cls('m78-check_base m78-effect __md', '__checkbox', partial && '__partial', getCheckCls(meta))
    }, /*#__PURE__*/React.createElement("span", {
      className: "m78-check_base-main"
    }, /*#__PURE__*/React.createElement("span", {
      className: "m78-check_base-inner"
    })));
  },
  "switch": function _switch(meta, _ref3) {
    var switchOff = _ref3.switchOff,
        switchOn = _ref3.switchOn;
    return /*#__PURE__*/React.createElement("span", {
      className: cls('m78-check_switch', getCheckCls(meta))
    }, /*#__PURE__*/React.createElement("span", {
      className: cls('m78-check_switch-inner m78-effect __md', meta.disabled && '__disabled')
    }, /*#__PURE__*/React.createElement("span", {
      className: "m78-check_switch-handle"
    }, /*#__PURE__*/React.createElement(If, {
      when: switchOff && switchOn
    }, /*#__PURE__*/React.createElement("span", null, meta.checked ? switchOn : switchOff)))));
  }
};

var Check = function Check(_props) {
  var _props$type = _props.type,
      type = _props$type === void 0 ? 'checkbox' : _props$type,
      _props$disabled = _props.disabled,
      disabled = _props$disabled === void 0 ? false : _props$disabled,
      label = _props.label,
      beforeLabel = _props.beforeLabel,
      autoFocus = _props.autoFocus,
      value = _props.value,
      name = _props.name,
      _props$block = _props.block,
      block = _props$block === void 0 ? false : _props$block,
      className = _props.className,
      style = _props.style,
      customer = _props.customer,
      _props$waveWrap = _props.waveWrap,
      waveWrap = _props$waveWrap === void 0 ? true : _props$waveWrap,
      _props$size = _props.size,
      size = _props$size === void 0 ? 'large' : _props$size;

  var _useFormState = useFormState(_props, false, {
    valueKey: 'checked',
    defaultValueKey: 'defaultChecked',
    triggerKey: 'onChange'
  }),
      _useFormState2 = _slicedToArray(_useFormState, 2),
      checked = _useFormState2[0],
      setChecked = _useFormState2[1];

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      focus = _useState2[0],
      setFocus = _useState2[1];

  var renderCustom = customer || builtIn[type];

  function focusHandle() {
    setFocus(true);
  }

  function blurHandle() {
    setFocus(false);
  }

  function mouseUpHandel(e) {
    // 按下空格时设置focus样式
    if (e.keyCode === 0) {
      focusHandle();
    }
  }

  function onChange() {
    setChecked(function (check) {
      return !check;
    }, value);
  }

  var statusCls = _defineProperty({
    __focus: focus,
    __checked: checked,
    __disabled: disabled,
    __block: block
  }, "__".concat(type), true);

  if (!renderCustom) {
    return null;
  }

  return (
    /*#__PURE__*/

    /* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */
    React.createElement("label", {
      className: cls('m78-check', statusCls, className, size && "__".concat(size), {
        '__wave-wrap': waveWrap
      }),
      style: style,
      onKeyPress: mouseUpHandel,
      onClick: blurHandle
    }, /*#__PURE__*/React.createElement(If, {
      when: beforeLabel && !customer
    }, /*#__PURE__*/React.createElement("span", {
      className: "m78-check_label-before"
    }, beforeLabel)), /*#__PURE__*/React.createElement("input", {
      value: String(value || ''),
      onFocus: focusHandle,
      onBlur: blurHandle,
      checked: checked,
      onChange: onChange,
      className: "m78-check_hidden-check",
      type: "checkbox",
      name: name,
      disabled: disabled
      /* eslint-disable-next-line jsx-a11y/no-autofocus */
      ,
      autoFocus: autoFocus
    }), renderCustom && renderCustom({
      focus: focus,
      checked: checked,
      disabled: disabled
    }, _props), /*#__PURE__*/React.createElement(If, {
      when: label && !customer
    }, /*#__PURE__*/React.createElement("span", {
      className: "m78-check_label"
    }, label)))
  );
};

Check.Group = function (_ref4) {
  var children = _ref4.children;
  return /*#__PURE__*/React.createElement("div", {
    className: "m78-check_group"
  }, children);
};

export default Check;
