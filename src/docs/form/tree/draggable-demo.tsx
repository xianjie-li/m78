import React, { useState } from 'react';
import { Tree } from 'm78/tree';
import mockTreeData from './mockTreeData';

const DraggableDemo = () => {
  const [ds, setDs] = useState(() => mockTreeData(4, 3));

  return (
    <div>
      <Tree
        draggable
        dataSource={ds}
        onDataSourceChange={setDs}
        onDragAccept={(dragEvent, nextDataSource) => {
          console.log(dragEvent, nextDataSource);
        }}
        height={400}
        defaultOpenAll
      />
    </div>
  );
};

export default DraggableDemo;
