import React from 'react';

import Input from '@lxjx/fr/input';

const Demo2 = () => (
  <div>
    <div className="mt-16">
      <Input placeholder="只能输入整数、浮点数" type="number" />
    </div>
    <div className="mt-16">
      <Input placeholder="只能输入整数" type="integer" />
    </div>
    <div className="mt-16">
      <Input placeholder="只能输入 `A-Za-z0-9_`" type="general" />
    </div>
    <div className="mt-16">
      <Input
        placeholder="不超过11位, 能够正确识别format等额外填入的字符"
        format="phone"
        maxLength={11}
      />
    </div>
    <div className="mt-16">
      <Input placeholder="最小为5，最大为100" min={5} max={100} />
    </div>
  </div>
);

export default Demo2;
