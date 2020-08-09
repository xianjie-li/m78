import Select from 'm78/select';
import React, { useState } from 'react';

import { options } from './utils';

const Demo = () => {
  const [opt] = useState(options);

  return (
    <div style={{ maxWidth: 280 }}>
      <h3>尺寸</h3>
      <Select size="small" options={opt} placeholder="请选择" />
      <Select options={opt} placeholder="请选择" className="mt-12" />
      <Select size="large" options={opt} placeholder="请选择" className="mt-12" />

      <h3 className="mt-24">状态</h3>
      <Select status="success" options={opt} placeholder="请选择" />
      <Select status="warning" options={opt} placeholder="请选择" className="mt-12" />
      <Select status="error" options={opt} placeholder="请选择" className="mt-12" />

      <h3 className="mt-24">禁用</h3>
      <Select disabled options={opt} placeholder="请选择" />
      <Select disabledOption={[1, 4, 5]} options={opt} placeholder="请选择" className="mt-12" />

      <h3 className="mt-24">loading</h3>
      <Select loading options={opt} placeholder="请选择" />
      <Select listLoading options={opt} placeholder="请选择" className="mt-12" />
      <Select inputLoading options={opt} placeholder="请选择" className="mt-12" />
      <Select blockLoading options={opt} placeholder="请选择" className="mt-12" />

      <h3 className="mt-24">样式</h3>
      <Select notBorder options={opt} placeholder="请选择" />
      <Select underline options={opt} placeholder="请选择" className="mt-12" />
    </div>
  );
};

export default Demo;
