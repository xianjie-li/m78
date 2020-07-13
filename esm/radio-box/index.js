import '@lxjx/fr/esm/check/style';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import React from 'react';
import { useFormState } from '@lxjx/hooks';
import Check from '@lxjx/fr/esm/check';

var RadioBox = function RadioBox(props) {
  var options = props.options,
      disabled = props.disabled,
      name = props.name,
      block = props.block,
      customer = props.customer;

  var _useFormState = useFormState(props, undefined),
      _useFormState2 = _slicedToArray(_useFormState, 2),
      value = _useFormState2[0],
      setValue = _useFormState2[1];

  return /*#__PURE__*/React.createElement("div", {
    className: "fr-radio-box"
  }, options.map(function (item, index) {
    return /*#__PURE__*/React.createElement(Check, {
      key: index,
      type: "radio",
      name: name,
      block: block,
      customer: customer,
      label: item.label,
      beforeLabel: item.beforeLabel,
      value: item.value,
      checked: item.value === value,
      disabled: disabled || item.disabled,
      onChange: function onChange() {
        return setValue(item.value);
      }
    });
  }));
};

export default RadioBox;
