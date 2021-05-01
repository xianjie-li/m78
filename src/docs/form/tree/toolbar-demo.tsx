import React from 'react';
import { Tree } from 'm78/tree';
import dataSource1 from '@/docs/form/tree/ds1';

const ToolbarDemo = () => {
  return (
    <div>
      <Tree toolbar multipleCheckable dataSource={dataSource1} height={300} defaultOpenAll />
    </div>
  );
};

export default ToolbarDemo;
