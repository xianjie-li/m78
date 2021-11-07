import React, { useState } from 'react';
import { Tree } from 'm78/tree';
import { Spacer } from 'm78/layout';
import mockTreeData from './mockTreeData';

const IndicatorLine = () => {
  const [ds] = useState(() => mockTreeData(2, 5));

  return (
    <div>
      <h3>彩虹缩进线</h3>
      <Tree dataSource={ds} rainbowIndicatorLine height={400} defaultOpenAll />

      <Spacer height={50} />

      <h3>无缩进线</h3>
      <Tree dataSource={ds} indicatorLine={false} height={400} defaultOpenAll />
    </div>
  );
};

export default IndicatorLine;
