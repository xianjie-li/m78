import React from 'react';

import Input from 'm78/input';

const Demo3 = () => (
  <div>
    <div className="mt-16">
      <Input placeholder="多行输入+最大长度+自动计算高度" textArea maxLength={400} status="error" />
    </div>
    <div className="mt-16">
      <Input placeholder="关闭自动高度" textArea autoSize={false} status="success" />
    </div>
  </div>
);

export default Demo3;
