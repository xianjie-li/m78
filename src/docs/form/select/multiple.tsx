import Select from '@lxjx/fr/select';
import React, { useState } from 'react';

import { options } from './utils';

const Demo2 = () => {
  const [opt] = useState(options);

  return (
    <div style={{ maxWidth: 360 }}>
      <Select
        size="small"
        multiple
        defaultValue={[1, 2]}
        options={opt}
        placeholder="请选择"
        className="mt-12"
      />
      <Select
        multiple
        showTag={false}
        defaultValue={[1, 2]}
        options={opt}
        placeholder="请选择"
        className="mt-12"
      />
    </div>
  );
};

export default Demo2;
