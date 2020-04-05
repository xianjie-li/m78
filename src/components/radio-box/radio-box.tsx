import React, { useState } from 'react';

import { useFormState } from '@lxjx/hooks';

import Check from '@lxjx/fr/lib/check';

import { RadioBoxProps } from './type';

const RadioBox = <Val extends unknown>(props: RadioBoxProps<Val>) => {
  const { options, disabled, name, block, customer } = props;

  const [value, setValue] = useFormState<Val>(props, undefined!);

  return (
    <div className="fr-radio-box">
      {options.map((item, index) => (
        <Check
          key={index}
          type="radio"
          name={name}
          block={block}
          customer={customer}
          label={item.label}
          beforeLabel={item.beforeLabel}
          value={item.value}
          checked={item.value === value}
          disabled={disabled || item.disabled}
          onChange={() => setValue(item.value)}
        />
      ))}
    </div>
  );
};

export default RadioBox;
