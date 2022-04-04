import React from 'react';
import { Tree } from 'm78/tree';
import { Size } from 'm78/common';
import { Spacer } from 'm78/layout';

import dataSource1 from './ds1';

const SizeDemo = () => {
  return (
    <div>
      <h3>小</h3>
      <Tree dataSource={dataSource1} height={300} size={Size.small} defaultOpenAll />

      <Spacer height={50} />

      <h3>默认</h3>
      <Tree dataSource={dataSource1} height={300} defaultOpenAll />

      <Spacer height={50} />

      <h3>大</h3>
      <Tree dataSource={dataSource1} height={300} size={Size.large} defaultOpenAll />
    </div>
  );
};

export default SizeDemo;
