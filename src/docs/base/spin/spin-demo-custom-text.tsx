import React from 'react';
import Spin from '@lxjx/flicker/lib/spin';
import '@lxjx/flicker/lib/spin/style';

const IconDemo = () => {
  return (
    <div className="demo">
      <Spin size="large" text="自定义文本" />
    </div>
  );
};

export default IconDemo;
