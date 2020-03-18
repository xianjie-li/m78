import React from 'react';

import Input from '@lxjx/fr/lib/input';

const Demo3 = () => {
  return (
    <div>
      <div className="mt-16">
        <Input placeholder="适合多行文本输入" textArea maxLength={400} status="error" />
      </div>
      <div className="mt-16">
        <Input placeholder="关闭自动高度" textArea autoSize={false} status="success" />
      </div>
    </div>
  );
};

export default Demo3;
