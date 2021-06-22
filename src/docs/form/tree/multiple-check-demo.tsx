import React, { useState } from 'react';
import dataSource1 from '@/docs/form/tree/ds1';
import { Tree, TreeDataSourceItem } from 'm78/tree';

const MultipleCheckDemo = () => {
  const [ds] = useState<TreeDataSourceItem[]>(dataSource1);

  const [value, setValue] = useState(['Function', 'Symbol']);

  return (
    <div>
      <h3>当前值: {value.join(', ')}</h3>
      <Tree
        multipleCheckable
        value={value}
        onChange={setValue as any} /* 忽略参数2 */
        dataSource={ds}
        defaultOpens={['JS', '基本对象']}
      />
    </div>
  );
};

export default MultipleCheckDemo;
