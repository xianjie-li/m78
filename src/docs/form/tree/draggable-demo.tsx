import React, { useState } from 'react';
import { Tree } from 'm78/tree';
import mockTreeData from './mockTreeData';

const DraggableDemo = () => {
  const [ds] = useState(() => mockTreeData(4, 4));

  return (
    <div>
      <Tree draggable dataSource={ds} rainbowIndicatorLine height={400} defaultOpenAll />
    </div>
  );
};

export default DraggableDemo;
