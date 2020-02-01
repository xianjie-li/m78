import React from 'react';
import Spin from '@lxjx/flicker/lib/spin';
import '@lxjx/flicker/lib/spin/style';

const IconDemo = () => {
  return (
    <div className="demo">
      <Spin size="small" />
      <Spin />
      <Spin size="large" />
    </div>
  );
};

export default IconDemo;
