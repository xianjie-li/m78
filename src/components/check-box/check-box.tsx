import React, { useMemo, useImperativeHandle } from 'react';

import { useCheck, UseCheckReturns } from '@lxjx/hooks';

import { Check } from 'm78/check';

import { CheckBoxProps } from './type';

const CheckBox = React.forwardRef<UseCheckReturns<any, any>, CheckBoxProps<any>>(
  <Val extends unknown>(props: CheckBoxProps<Val>, ref: any) => {
    const { options, disabled, name, block, customer, waveWrap, size } = props;

    const disables = useMemo(
      () =>
        options.reduce((p, i) => {
          if (i.disabled) {
            p.push(i.value);
          }
          return p;
        }, [] as any),
      [options],
    );

    const ck = useCheck<Val, CheckBoxProps<Val>['options'][0]>({
      ...props,
      collector: item => item.value,
      disables,
    });

    useImperativeHandle(ref, () => ck);

    return (
      <div className="m78 m78-radio-box m78-check_group">
        {options.map((item, index) => (
          <Check<Val>
            key={index}
            type="checkbox"
            name={name}
            block={block}
            customer={customer}
            label={item.label}
            beforeLabel={item.beforeLabel}
            value={item.value}
            checked={ck.checked.includes(item.value)}
            disabled={disabled || item.disabled}
            onChange={(check, value) => ck.setCheckBy(value, check)}
            waveWrap={waveWrap}
            size={size}
          />
        ))}
      </div>
    );
  },
);

export default CheckBox;
