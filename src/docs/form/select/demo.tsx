import Select, { SelectOptionItem } from '@lxjx/fr/lib/select';
import Input from '@lxjx/fr/lib/input';
import React, { useState } from 'react';

function fakeOptions(num: number): SelectOptionItem[] {
  return Array.from({ length: num }).map((_, index) => ({
    label: `选项${index}`,
    value: index,
    // disabled: true,
  }));
}

const options = fakeOptions(10);

const Demo = () => {
  const [v, setV] = useState('111');

  return (
    <div>
      <div>
        <Select
          options={options}
          multiple
          // showTag={false}
          toolbar
          defaultValue={[1, 4, 5]}
          // defaultValue={1}
          placeholder="请选择..."
          search
          onChange={(value, opt) => {
            console.log(111, value, opt);
          }}
          disabledOption={[1, 4, 5, 6, 8]}
          // listWidth={200}
        />
      </div>
    </div>
  );
};

export default Demo;
