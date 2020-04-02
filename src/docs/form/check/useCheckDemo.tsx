import React from 'react';

import Check from '@lxjx/fr/lib/check';
import { useCheck } from '@lxjx/fr/lib/hooks';

const options = [
  { id: 1, label: '🍉西瓜' },
  { id: 2, label: '🍌香蕉' },
  { id: 3, label: '🍎苹果(缺货)', disabled: true },
  { id: 4, label: '🍇葡萄' },
  { id: 5, label: '🍓草莓' },
];

const useCheckDemo = () => {
  const res = useCheck<number, { id: number }>(options, [], item => item.id);

  return (
    <div>
      <h3>选择你最爱的水果</h3>
      <Check
        label={res.allChecked ? '反选' : '全选'}
        checked={res.allChecked}
        partial={res.partialChecked}
        onChange={checked => checked ? res.checkAll() : res.unCheckAll()}
      />
      <div>
        {options.map(option => (
          <Check
            key={option.id}
            label={option.label}
            disabled={option.disabled}
            checked={res.isChecked(option.id)}
            onChange={checked => res.setCheckBy(option.id, checked)}
          />
        ))}
      </div>
    </div>
  )
};

export default useCheckDemo;
