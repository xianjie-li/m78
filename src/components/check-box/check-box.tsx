import React, { useMemo, useImperativeHandle } from 'react';

import { useCheck, UseCheckReturns } from '@lxjx/hooks';

import Check from '@lxjx/fr/lib/check';

import { CheckBoxProps } from './type';

const CheckBox = React.forwardRef<UseCheckReturns<any, any>, CheckBoxProps<any>>(
  <Val extends unknown>(props: CheckBoxProps<Val>, ref: any) => {
    const { options, disabled, name, block, customer } = props;

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
      <div className="fr-radio-box">
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
          />
        ))}
      </div>
    );
  },
);

export default CheckBox;
