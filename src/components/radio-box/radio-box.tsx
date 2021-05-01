import React from 'react';

import { useFormState } from '@lxjx/hooks';

import { Check } from 'm78/check';

import { RadioBoxProps } from './type';

const RadioBox = <Val extends unknown>(props: RadioBoxProps<Val>) => {
  const { options, disabled, name, block, customer, waveWrap, size } = props;

  const [value, setValue] = useFormState<Val>(props, undefined!);

  return (
    <div className="m78-radio-box m78-check_group">
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
          waveWrap={waveWrap}
          size={size}
        />
      ))}
    </div>
  );
};

export default RadioBox;
