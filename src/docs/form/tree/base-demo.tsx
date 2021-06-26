import React, { useState } from 'react';
import { Tree, TreeDataSourceItem } from 'm78/tree';
import dataSource1 from './ds1';

const BaseDemo = () => {
  const [ds] = useState<TreeDataSourceItem[]>(dataSource1);

  return (
    <div>
      <Tree dataSource={ds} />
    </div>
  );
};

export default BaseDemo;
