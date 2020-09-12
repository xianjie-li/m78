import 'm78/form/style';
import _extends from '@babel/runtime/helpers/extends';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import React, { createContext, useMemo, useContext, useEffect, useRef, useState } from 'react';
import RForm, { Field, FormProvider, List as List$1, useForm } from 'rc-field-form';
export { FormProvider } from 'rc-field-form';
import List, { Title, SubTitle, Footer } from 'm78/list';
export { Footer, default as List, SubTitle, Title } from 'm78/list';
import Schema from 'async-validator';
import { isArray, isEmpty, createRandString, isFunction } from '@lxjx/utils';
import { useScroll, useFn } from '@lxjx/hooks';
import { getFirstScrollParent, checkElementVisible, triggerHighlight } from 'm78/util';
import cls from 'classnames';
import { createMessagesTemplate } from '@lxjx/validate-tools';
import _toConsumableArray from '@babel/runtime/helpers/toConsumableArray';
import _get from 'lodash/get';
import { useUpdate } from 'react-use';
import _has from 'lodash/has';

/** 从错误字符数组中取第一位 */
function getFirstError(errors) {
  if (!errors) return undefined;
  if (!errors.length) return undefined;
  return errors[0];
}
/** 根据错误字符和是否验证中获取status */

function getStatus(error, loading) {
  var status;
  if (!error) return undefined;

  if (error) {
    status = 'error';
  }

  if (loading) {
    status = 'loading';
  }

  return status;
}
function getFlatRules(props, fullRules) {
  var _props$rules = props.rules,
      _rules = _props$rules === void 0 ? [] : _props$rules,
      enums = props["enum"],
      required = props.required,
      len = props.len,
      max = props.max,
      message = props.message,
      min = props.min,
      pattern = props.pattern,
      transform = props.transform,
      type = props.type,
      validator = props.validator,
      whitespace = props.whitespace;

  var rules = {
    enums: enums,
    required: required,
    len: len,
    max: max,
    message: message,
    min: min,
    pattern: pattern,
    transform: transform,
    type: type,
    whitespace: whitespace
  };

  var nextRule = _toConsumableArray(_rules);

  for (var _i = 0, _Object$entries = Object.entries(rules); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        key = _Object$entries$_i[0],
        val = _Object$entries$_i[1];

    if (val === undefined) {
      delete rules[key];
    }
  }

  if (!isEmpty(rules)) {
    nextRule.unshift(rules);
  }

  if (!isEmpty(fullRules) && props.name) {
    var rule = _get(fullRules, props.name);

    if (rule) {
      if (isArray(rule)) {
        nextRule.push.apply(nextRule, _toConsumableArray(rule));
      } else {
        nextRule.push(rule);
      }
    }
  } // validator需要放到单独的rule中
  // 验证器永远在最后验证，因为可能会是异步验证器


  if (validator !== undefined) {
    nextRule.push({
      validator: validator
    });
  }

  var isRequired = nextRule.some(function (item) {
    return item.required;
  });
  return [nextRule, isRequired];
}
/** 将NamePath转换为字符串 */

function getNameString(name) {
  return isArray(name) ? name.join('-') : name;
}

var context = /*#__PURE__*/createContext({
  form: undefined,
  onChangeTriggers: {},
  disabled: false,
  hideRequiredMark: false,
  id: ''
});
context.displayName = 'm78-form-context';

var Item = function Item(props) {
  /** 该字段的唯一id */
  var id = useMemo(function () {
    return createRandString(2);
  }, []);
  /** 根据传入的name生成字符串 */

  var nameString = getNameString(props.name);

  var _useContext = useContext(context),
      form = _useContext.form,
      onChangeTriggers = _useContext.onChangeTriggers,
      contextDisabled = _useContext.disabled,
      formId = _useContext.id,
      fullRules = _useContext.rules;

  var selector = nameString ? "m78-FORM-ITEM-".concat(formId, "-").concat(nameString) : undefined;

  var children = props.children,
      _props$name = props.name,
      name = _props$name === void 0 ? nameString : _props$name,
      style = props.style,
      className = props.className,
      label = props.label,
      extra = props.extra,
      desc = props.desc,
      disabled = props.disabled,
      noStyle = props.noStyle,
      _props$visible = props.visible,
      _visible = _props$visible === void 0 ? true : _props$visible,
      _props$valid = props.valid,
      _valid = _props$valid === void 0 ? true : _props$valid,
      dependencies = props.dependencies,
      required = props.required,
      otherProps = _objectWithoutProperties(props, ["children", "name", "style", "className", "label", "extra", "desc", "disabled", "noStyle", "visible", "valid", "dependencies", "required"]);

  var _getFlatRules = getFlatRules(props, fullRules),
      _getFlatRules2 = _slicedToArray(_getFlatRules, 2),
      rules = _getFlatRules2[0],
      isRequired = _getFlatRules2[1];

  var update = useUpdate();
  var valid = isFunction(_valid) ? _valid(name, form) : _valid; // 由于存在valid属性，Field可能并未被渲染，所以需要在值更新时手动对比dependencies决定是否要更新组件

  useEffect(function () {
    onChangeTriggers[id] = function (changeValue) {
      if (dependencies && dependencies.length && changeValue) {
        var isDepsChange = dependencies.some(function (item) {
          if (isArray(item)) {
            return _has(changeValue, item);
          }

          return item in changeValue;
        });
        isDepsChange && update();
      }
    };

    return function () {
      delete onChangeTriggers[id];
    };
  }, []);

  if (!valid) {
    return null;
  }

  var visible = isFunction(_visible) ? _visible(name, form) : _visible;

  var _style = _objectSpread({
    display: visible ? undefined : 'none'
  }, style);

  var isDisabled = disabled || contextDisabled;
  var title = label || nameString; // 无name时仅作为布局组件使用

  if (!name) {
    return /*#__PURE__*/React.createElement(List.Item, {
      desc: desc,
      extra: extra,
      title: title,
      disabled: isDisabled,
      required: isRequired,
      style: _style,
      className: className
    }, children);
  }
  /** 根据render prop参数渲染children */


  function renderChildren(control, meta, _form) {
    if (isFunction(children)) {
      return children(control, meta, _form);
    }

    if (! /*#__PURE__*/React.isValidElement(children)) {
      return children;
    }

    return /*#__PURE__*/React.cloneElement(children, _objectSpread({
      name: nameString,
      disabled: meta.disabled,
      status: meta.status,
      loading: children.type === 'input' ? undefined : meta.validating
    }, control));
  }

  return /*#__PURE__*/React.createElement(Field, _extends({
    validateFirst: true,
    name: name
  }, otherProps, {
    dependencies: dependencies,
    rules: rules,
    messageVariables: {
      label: label || ''
    }
  }), function (control, meta, _form) {
    var errors = meta.errors,
        validating = meta.validating;
    var errorString = getFirstError(errors);
    var status = getStatus(errorString, validating);

    var customMeta = _objectSpread(_objectSpread({}, meta), {}, {
      disabled: isDisabled,
      required: isRequired,
      status: status,
      errorString: errorString
    });

    var child = renderChildren(control, customMeta, _form);

    if (noStyle) {
      return /*#__PURE__*/React.createElement("div", {
        id: selector,
        className: cls('m78-form_item', className),
        style: _style
      }, /*#__PURE__*/React.createElement("div", null, child), isRequired && /*#__PURE__*/React.createElement("span", {
        className: "m78-list_require m78-form_item-mark",
        title: "\u5FC5\u586B\u9879"
      }, "*"), errorString && /*#__PURE__*/React.createElement("div", {
        className: "m78-form_item-extra"
      }, errorString));
    }

    return /*#__PURE__*/React.createElement(List.Item, {
      id: selector,
      desc: desc,
      extra: extra,
      title: title,
      disabled: isDisabled,
      required: isRequired,
      style: _style,
      className: className,
      footLeft: errorString,
      status: status
    }, child);
  });
};

var msgTpl = createMessagesTemplate({
  hasName: false
  /* nameKey: 'label' */

}); // @ts-ignore

Schema.warning = function () {};

var BaseForm = function BaseForm(props) {
  var children = props.children,
      style = props.style,
      className = props.className,
      notBorder = props.notBorder,
      layout = props.layout,
      column = props.column,
      fullWidth = props.fullWidth,
      _props$disabled = props.disabled,
      disabled = _props$disabled === void 0 ? false : _props$disabled,
      _form = props.form,
      onValuesChange = props.onValuesChange,
      _props$hideRequiredMa = props.hideRequiredMark,
      hideRequiredMark = _props$hideRequiredMa === void 0 ? false : _props$hideRequiredMa,
      rules = props.rules,
      otherProps = _objectWithoutProperties(props, ["children", "style", "className", "notBorder", "layout", "column", "fullWidth", "disabled", "form", "onValuesChange", "hideRequiredMark", "rules"]);
  /** 该表单的唯一id */


  var id = useMemo(function () {
    return createRandString(2);
  }, []);
  var flagEl = useRef(null);

  var _useForm = useForm(_form),
      _useForm2 = _slicedToArray(_useForm, 1),
      form = _useForm2[0];

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      scrollParent = _useState2[0],
      setScrollParent = _useState2[1];

  var _useScroll = useScroll({
    el: scrollParent,
    offsetX: -(window.innerWidth * 0.3),
    offsetY: -(window.innerHeight * 0.3)
  }),
      scrollToElement = _useScroll.scrollToElement;

  var _useState3 = useState(function () {
    return {
      form: form,
      onChangeTriggers: {},
      disabled: disabled,
      hideRequiredMark: hideRequiredMark,
      id: id,
      rules: rules
    };
  }),
      _useState4 = _slicedToArray(_useState3, 1),
      contextValue = _useState4[0];

  useEffect(function () {
    var el = getFirstScrollParent(flagEl.current);

    if (el) {
      setScrollParent(el);
    }
  }, []); // 由于存在valid属性，Field可能并未被渲染，所以需要在值更新时手动对比dependencies决定是否要更新组件

  var changeHandle = useFn(function () {
    for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
      arg[_key] = arguments[_key];
    }

    onValuesChange === null || onValuesChange === void 0 ? void 0 : onValuesChange.apply(void 0, arg);

    for (var _i = 0, _Object$entries = Object.entries(contextValue.onChangeTriggers); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          trigger = _Object$entries$_i[1];

      isFunction(trigger) && trigger.apply(void 0, arg);
    }
  });
  var finishFailedHandle = useFn(function (arg) {
    var _props$onFinishFailed, _errorFields$;

    var errorFields = arg.errorFields,
        outOfDate = arg.outOfDate;
    (_props$onFinishFailed = props.onFinishFailed) === null || _props$onFinishFailed === void 0 ? void 0 : _props$onFinishFailed.call(props, arg);
    if (outOfDate) return;
    var firstName = errorFields === null || errorFields === void 0 ? void 0 : (_errorFields$ = errorFields[0]) === null || _errorFields$ === void 0 ? void 0 : _errorFields$.name;
    if (!firstName) return;
    var el = document.getElementById("m78-FORM-ITEM-".concat(id, "-").concat(getNameString(firstName)));
    if (!el) return;
    var visible = checkElementVisible(el, {
      wrapEl: scrollParent || undefined,
      fullVisible: true
    });

    if (!visible) {
      triggerHighlight(el);
      scrollToElement(el);
    }
  });
  return /*#__PURE__*/React.createElement(context.Provider, {
    value: _objectSpread(_objectSpread({}, contextValue), {}, {
      rules: rules,
      disabled: disabled,
      hideRequiredMark: hideRequiredMark
    })
  }, /*#__PURE__*/React.createElement(List, {
    form: true,
    style: style,
    className: cls(className, 'm78-form', contextValue.hideRequiredMark && '__hide-required-mark'),
    notBorder: notBorder,
    layout: layout,
    column: column,
    fullWidth: fullWidth,
    disabled: disabled
  }, /*#__PURE__*/React.createElement(RForm, _extends({
    validateMessages: msgTpl
  }, otherProps, {
    onValuesChange: changeHandle,
    form: form,
    onFinishFailed: finishFailedHandle
  }), children), /*#__PURE__*/React.createElement("span", {
    ref: flagEl
  })));
};

var Form = Object.assign(BaseForm, {
  FormProvider: FormProvider,
  Item: Item,
  List: List$1,
  Title: Title,
  SubTitle: SubTitle,
  Footer: Footer
});

export default Form;
export { Item };
