import React from 'react';

import Input from '@lxjx/flicker/lib/input';

const Demo = () => {
  return (
    <div>
      <p>
        <Input placeholder="点击输入您的内容..." autoFocus />
      </p>
      <p>
        <Input placeholder="点击输入您的内容..." readOnly defaultValue="这是一段只读内容" />
      </p>
      <p>
        <Input type="text" disabled defaultValue="我被禁用了" />
      </p>
    </div>
  );
};

export default Demo;
