import React, { useState } from 'react';
import { Tree, OptionsItem } from 'm78/tree';
import { Spacer } from 'm78/layout';
import mockTreeData from './mockTreeData';

const OpenDemo = () => {
  const [ds] = useState<OptionsItem[]>(() => mockTreeData(2, 2));

  const [opens, setOpens] = useState(['1', '1-1', '1-2']);

  return (
    <div>
      <h3>默认展开</h3>
      <Tree dataSource={ds} defaultOpens={['1', '1-1', '1-2']} />

      <Spacer height={50} />

      <h3>受控展开</h3>
      <Tree dataSource={ds} opens={opens} onOpensChange={setOpens as any} />

      <Spacer height={50} />

      <h3>默认展开全部</h3>
      <Tree dataSource={ds} defaultOpenAll />

      <Spacer height={50} />

      <h3>指定默认展开层级</h3>
      <Tree dataSource={ds} defaultOpenZIndex={1} />
    </div>
  );
};

export default OpenDemo;
