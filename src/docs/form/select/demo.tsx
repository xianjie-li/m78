import Select, { SelectOptionItem } from '@lxjx/fr/lib/select';
import React from 'react';

function fakeOptions(num: number): SelectOptionItem[] {
  return Array.from({ length: num }).map((_, index) => ({
    label: `选项${index}`,
    value: index,
    // disabled: true,
  }));
}

const Demo = () => {
  return (
    <div>
      <div>
        <Select
          options={fakeOptions(300000)}
          multiple
          // showTag={false}
          toolbar
          defaultValue={[1, 4, 5]}
          // defaultValue={1}
          placeholder="请选择..."
          search
          onChange={(value, options) => {
            console.log(111, value, options);
          }}
        />
      </div>
    </div>
  );
};

export default Demo;
