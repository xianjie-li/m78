import CheckBox from '@lxjx/fr/check-box';
import React, { useState, useRef } from 'react';
import { UseCheckReturns } from '@lxjx/hooks';

const options = [
  {
    label: '🧚‍♂️',
    value: 1,
  },
  {
    label: '🧚‍♀️',
    value: 2,
  },
  {
    label: '🧜‍♀️',
    value: 3,
    disabled: true,
  },
  {
    label: '🧛‍♂️',
    value: 4,
  },
];

const Demo = () => {
  const ck = useRef<UseCheckReturns<number, any>>(null!);
  const [val, setVal] = useState<number[]>([2, 3]);

  return (
    <div>
      <button type="button" onClick={() => setVal([1, 4])}>
        set [1, 4]
      </button>
      <button type="button" onClick={() => ck.current.toggleAll()}>
        反选
      </button>
      <CheckBox
        ref={ck}
        name="like"
        value={val}
        options={options}
        onChange={value => {
          setVal(value);
        }}
      />
      <div className="mt-12">选中值: {val.join(',')}</div>
    </div>
  );
};

export default Demo;
