import RadioBox from '@lxjx/fr/radio-box';
import React, { useState } from 'react';

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
  const [val, setVal] = useState<number>(2);

  return (
    <div>
      <RadioBox name="like" value={val} options={options} onChange={value => setVal(value)} />
      <div className="mt-12">选中值: {val}</div>
    </div>
  );
};

export default Demo;
