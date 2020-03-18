import React from 'react';
import Spin from '@lxjx/fr/lib/spin';
import '@lxjx/fr/lib/spin/style';

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
