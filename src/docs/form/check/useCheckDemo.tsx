import React from 'react';

import Check from '@lxjx/fr/lib/check';
import Button from '@lxjx/fr/lib/button';
import { useCheck } from '@lxjx/hooks';

const options = [
  { id: 1, label: '🍉西瓜' },
  { id: 2, label: '🍌香蕉' },
  { id: 3, label: '🍎苹果' },
  { id: 4, label: '🍇葡萄' },
  { id: 5, label: '🍓草莓' },
];

const useCheckDemo = () => {
  const res = useCheck<number, { id: number }>({
    options,
    collector: item => item.id,
  });

  return (
    <div>
      <h3>选择你最爱的水果</h3>
      <Check
        label={res.allChecked ? '取消' : '全选'}
        checked={res.allChecked}
        partial={res.partialChecked}
        onChange={checked => {
          checked ? res.checkAll() : res.unCheckAll();
        }}
      />
      <Button size="small" className="ml-12" onClick={res.toggleAll}>
        反选
      </Button>
      <Button size="small" className="ml-12" onClick={() => res.setChecked([1, 4])}>
        选中1, 4
      </Button>
      <div>
        {options.map(option => (
          <Check
            key={option.id}
            label={option.label}
            disabled={res.isDisabled(option.id)}
            checked={res.isChecked(option.id)}
            onChange={checked => res.setCheckBy(option.id, checked)}
          />
        ))}
      </div>
    </div>
  );
};

export default useCheckDemo;
