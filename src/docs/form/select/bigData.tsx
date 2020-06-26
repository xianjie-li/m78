import Select, { mergeOptions } from '@lxjx/fr/lib/select';
import React, { useState } from 'react';

import { fakeOptions } from './utils';

const Demo4 = () => {
  const [opt] = useState(() => fakeOptions(500000));

  return (
    <div style={{ maxWidth: 360 }}>
      同时渲染50万个选项
      <Select search multiple options={opt} placeholder="请选择" />
    </div>
  );
};

export default Demo4;
