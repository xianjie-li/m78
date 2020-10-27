import 'm78/check/style';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import React, { useMemo, useImperativeHandle } from 'react';
import { useCheck } from '@lxjx/hooks';
import Check from 'm78/check';

var CheckBox = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var options = props.options,
      disabled = props.disabled,
      name = props.name,
      block = props.block,
      customer = props.customer;
  var disables = useMemo(function () {
    return options.reduce(function (p, i) {
      if (i.disabled) {
        p.push(i.value);
      }

      return p;
    }, []);
  }, [options]);
  var ck = useCheck(_objectSpread(_objectSpread({}, props), {}, {
    collector: function collector(item) {
      return item.value;
    },
    disables: disables
  }));
  useImperativeHandle(ref, function () {
    return ck;
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "m78-radio-box"
  }, options.map(function (item, index) {
    return /*#__PURE__*/React.createElement(Check, {
      key: index,
      type: "checkbox",
      name: name,
      block: block,
      customer: customer,
      label: item.label,
      beforeLabel: item.beforeLabel,
      value: item.value,
      checked: ck.checked.includes(item.value),
      disabled: disabled || item.disabled,
      onChange: function onChange(check, value) {
        return ck.setCheckBy(value, check);
      }
    });
  }));
});

export default CheckBox;
