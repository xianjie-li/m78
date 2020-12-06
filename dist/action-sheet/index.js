import 'm78/action-sheet/style';
import _extends from '@babel/runtime/helpers/extends';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import React from 'react';
import Drawer from 'm78/drawer';
import Check from 'm78/check';
import Button from 'm78/button';
import { If } from 'm78/fork';
import { useFormState } from '@lxjx/hooks';
import cls from 'classnames';
import createRenderApi from '@lxjx/react-render-api';

function _ActionSheet(props) {
  var options = props.options,
      _props$title = props.title,
      title = _props$title === void 0 ? '请选择' : _props$title,
      _props$confirm = props.confirm,
      confirm = _props$confirm === void 0 ? true : _props$confirm,
      other = _objectWithoutProperties(props, ["options", "title", "confirm"]);
  /** 实现value/onChange/defaultValue */


  var _useFormState = useFormState(props, undefined),
      _useFormState2 = _slicedToArray(_useFormState, 2),
      value = _useFormState2[0],
      setValue = _useFormState2[1];
  /** 实现defaultShow/show/onShowChange */


  var _useFormState3 = useFormState(props, false, {
    defaultValueKey: 'defaultShow',
    triggerKey: 'onShowChange',
    valueKey: 'show'
  }),
      _useFormState4 = _slicedToArray(_useFormState3, 2),
      show = _useFormState4[0],
      setShow = _useFormState4[1];

  function close(val, item) {
    var _props$onClose;

    setShow(false);
    (_props$onClose = props.onClose) === null || _props$onClose === void 0 ? void 0 : _props$onClose.call(props, val, item);
  }

  function getCurrentItem(val) {
    return options.find(function (item) {
      return item.value === val;
    });
  }

  function renderItems() {
    return options.map(function (v) {
      return /*#__PURE__*/React.createElement("div", {
        key: v.value,
        onClick: function onClick() {
          if (v.disabled) return; // 直接选中

          !confirm && close(v.value, getCurrentItem(v.value));
          if (value && v.value === value) return;
          setValue(v.value, getCurrentItem(v.value));
        },
        className: cls('m78-action-sheet_item m78-effect m78-hb-t __md', {
          __active: v.value === value,
          __confirm: confirm,
          __disabled: v.disabled,
          __highlight: v.highlight
        })
      }, /*#__PURE__*/React.createElement("div", {
        className: cls(confirm && 'tl')
      }, /*#__PURE__*/React.createElement("div", {
        className: "m78-action-sheet_item-title"
      }, v.label), /*#__PURE__*/React.createElement(If, {
        when: v.desc
      }, /*#__PURE__*/React.createElement("div", {
        className: "m78-action-sheet_desc"
      }, v.desc))), /*#__PURE__*/React.createElement(If, {
        when: confirm
      }, /*#__PURE__*/React.createElement("span", {
        className: "m78-action-sheet_check"
      }, /*#__PURE__*/React.createElement(Check, {
        type: "radio",
        checked: value === v.value,
        disabled: v.disabled
      }))));
    });
  }

  return /*#__PURE__*/React.createElement(Drawer, _extends({
    className: "m78-action-sheet" // @ts-ignore
    ,
    namespace: "ACTION_SHEET"
  }, other, {
    onClose: function onClose() {
      return close();
    },
    onChange: function onChange(nShow) {
      return setShow(nShow);
    },
    show: show
  }), /*#__PURE__*/React.createElement("div", {
    className: "m78-action-sheet_item m78-effect __md __title __disabled"
  }, /*#__PURE__*/React.createElement(If, {
    when: confirm
  }, /*#__PURE__*/React.createElement(Button, {
    className: "m78-action-sheet_confirm",
    onClick: function onClick() {
      return close();
    },
    text: true,
    color: "red"
  }, "\u53D6\u6D88")), /*#__PURE__*/React.createElement("div", null, title), /*#__PURE__*/React.createElement(If, {
    when: confirm
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: function onClick() {
      close(value, getCurrentItem(value));
    },
    className: "m78-action-sheet_confirm",
    color: "primary"
  }, typeof confirm === 'string' ? confirm : '确认'))), /*#__PURE__*/React.createElement("div", {
    className: "m78-action-sheet_item-cont"
  }, renderItems()), /*#__PURE__*/React.createElement(If, {
    when: !confirm
  }, /*#__PURE__*/React.createElement("div", {
    className: "m78-action-sheet_item m78-effect m78-hb-t __md __cancel",
    onClick: function onClick() {
      return close();
    }
  }, "\u53D6\u6D88")));
}

var actionSheetApi = createRenderApi(_ActionSheet, {
  namespace: 'ACTION_SHEET'
});
var ActionSheet = Object.assign(_ActionSheet, {
  api: actionSheetApi
});

export default ActionSheet;
