import React, { useState } from 'react';
import dataSource1 from '@/docs/form/tree/ds1';
import { Tree, OptionsItem } from 'm78/tree';

const SingleCheckDemo = () => {
  const [ds] = useState<OptionsItem[]>(dataSource1);

  const [value, setValue] = useState('Function');

  return (
    <div>
      <h3>当前值: {value}</h3>
      <Tree
        checkable
        value={value}
        onChange={setValue as any} /* 忽略参数2 */
        dataSource={ds}
        defaultOpens={['JS', '基本对象']}
      />
    </div>
  );
};

export default SingleCheckDemo;
