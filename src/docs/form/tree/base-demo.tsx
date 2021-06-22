import React, { useState } from 'react';
import dataSource1 from '@/docs/form/tree/ds1';
import { Tree, TreeDataSourceItem } from 'm78/tree';

const BaseDemo = () => {
  const [ds] = useState<TreeDataSourceItem[]>(dataSource1);

  return (
    <div>
      <Tree dataSource={ds} />
    </div>
  );
};

export default BaseDemo;
