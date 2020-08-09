import Select, { SelectCustomTag } from 'm78/select';
import React, { useState } from 'react';

import { options } from './utils';

const MyTag: SelectCustomTag = meta => (
  <span key={meta.key} style={{ border: '1px solid red', padding: '4px 12px' }}>
    {meta.label}
    <strong onClick={meta.del} className="ml-12">
      X
    </strong>
  </span>
);

const CustomTag = () => {
  const [opt] = useState(options);

  return (
    <div style={{ maxWidth: 360 }}>
      <Select multiple options={opt} placeholder="请选择" customTag={MyTag} />
    </div>
  );
};

export default CustomTag;
