import { CheckBox } from 'm78/check-box';
import React, { useState, useRef } from 'react';
import { UseCheckReturns } from '@lxjx/hooks';
import { Button } from 'm78/button';

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
      <Button type="button" onClick={() => setVal([1, 4])}>
        set [1, 4]
      </Button>
      <Button type="button" onClick={() => ck.current.toggleAll()}>
        反选
      </Button>
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
