import '@lxjx/fr/esm/action-sheet/style';
import createRenderApi from '@lxjx/react-render-api';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import React from 'react';
import Drawer from '@lxjx/fr/esm/drawer';
import Button from '@lxjx/fr/esm/button';
import { If } from '@lxjx/fr/esm/fork';
import { useFormState } from '@lxjx/hooks';
import cls from 'classnames';

var ActionSheet = function ActionSheet(props) {
  var show = props.show,
      onClose = props.onClose,
      onRemove = props.onRemove,
      options = props.options,
      title = props.title,
      _props$isConfirm = props.isConfirm,
      isConfirm = _props$isConfirm === void 0 ? true : _props$isConfirm,
      onConfirm = props.onConfirm,
      children = props.children,
      _props$confirmText = props.confirmText,
      confirmText = _props$confirmText === void 0 ? '确认' : _props$confirmText,
      namespace = props.namespace;

  var _useFormState = useFormState(props, undefined),
      _useFormState2 = _slicedToArray(_useFormState, 2),
      state = _useFormState2[0],
      setState = _useFormState2[1];

  function close() {
    onClose && onClose();
  }

  function renderItems() {
    return options.map(function (v) {
      return /*#__PURE__*/React.createElement("div", {
        key: v.id,
        onClick: function onClick() {
          if (v.disabled) return;
          !isConfirm && close();
          if (state && v.id === state.id) return;
          setState(v);
        },
        className: cls('fr-action-sheet_item fr-effect fr-hb-t __md', {
          __active: v.highlight,
          __confirm: isConfirm,
          __disabled: v.disabled
        })
      }, /*#__PURE__*/React.createElement("div", {
        className: cls(isConfirm && 'tl')
      }, /*#__PURE__*/React.createElement("div", null, v.name), /*#__PURE__*/React.createElement(If, {
        when: v.desc
      }, /*#__PURE__*/React.createElement("div", {
        className: "fr-action-sheet_desc"
      }, v.desc))), /*#__PURE__*/React.createElement(If, {
        when: isConfirm
      }, /*#__PURE__*/React.createElement("span", {
        className: "fr-action-sheet_check"
      }, /*#__PURE__*/React.createElement("input", {
        type: "checkbox",
        checked: !!(state && state.id === v.id),
        onChange: function onChange() {
          return false;
        },
        disabled: v.disabled
      }))));
    });
  }

  return /*#__PURE__*/React.createElement(Drawer, {
    namespace: namespace,
    className: "fr-action-sheet_wrap",
    show: show,
    onRemove: onRemove,
    onClose: close,
    style: {
      boxShadow: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: cls('fr-action-sheet', {
      __custom: !!children
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: "fr-action-sheet_item fr-effect __md __title __disabled"
  }, /*#__PURE__*/React.createElement(If, {
    when: isConfirm
  }, /*#__PURE__*/React.createElement(Button, {
    className: "fr-action-sheet_confirm",
    onClick: onClose,
    link: true,
    color: "red"
  }, "\u53D6\u6D88")), /*#__PURE__*/React.createElement("div", null, title), /*#__PURE__*/React.createElement(If, {
    when: isConfirm
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: function onClick() {
      close();
      onConfirm && onConfirm(state);
    },
    className: "fr-action-sheet_confirm",
    color: "blue"
  }, confirmText))), /*#__PURE__*/React.createElement("div", {
    className: "fr-action-sheet_item-cont"
  }, children || renderItems()), /*#__PURE__*/React.createElement(If, {
    when: !isConfirm
  }, /*#__PURE__*/React.createElement("div", {
    className: "fr-action-sheet_item fr-effect fr-hb-t __md __cancel",
    onClick: onClose
  }, "\u53D6\u6D88"))));
};

var actionSheetApi = createRenderApi(ActionSheet, {
  namespace: 'ACTION_SHEET'
});
var ActionSheet$1 = Object.assign(ActionSheet, {
  api: actionSheetApi
});

export default ActionSheet$1;
