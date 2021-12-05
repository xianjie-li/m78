import React from 'react';
import { Spin } from 'm78/spin';
import 'm78/spin/style';
import { FullSizeEnum } from 'm78/common';

const IconDemo = () => (
  <div className="demo">
    <Spin size={FullSizeEnum.small} />
    <Spin />
    <Spin size={FullSizeEnum.large} />
    <Spin size={FullSizeEnum.big} />
  </div>
);

export default IconDemo;
