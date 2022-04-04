import React from 'react';
import { Spin } from 'm78/spin';
import { FullSize } from 'm78/common';

const IconDemo = () => (
  <div className="demo">
    <Spin size={FullSize.small} />
    <Spin />
    <Spin size={FullSize.large} />
    <Spin size={FullSize.big} />
  </div>
);

export default IconDemo;
