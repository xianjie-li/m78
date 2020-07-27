import Select, { SelectCustomToolbar } from '@lxjx/fr/select';
import React, { useState } from 'react';

import { options } from './utils';

const MyToolbar: SelectCustomToolbar = node => (
  <div>
    {node}
    <div style={{ padding: '0 12px 8px' }}>🎈✨🎉🎄🎨</div>
  </div>
);

const CustomToolbar = () => {
  const [opt] = useState(options);

  return (
    <div style={{ maxWidth: 360 }}>
      <Select multiple options={opt} placeholder="请选择" customToolBar={MyToolbar} />
    </div>
  );
};

export default CustomToolbar;
