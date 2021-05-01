import React, { useState } from 'react';
import { Pagination } from 'm78/pagination';
import { Divider } from 'm78/layout';

const Demo = () => {
  const [page, setPage] = useState(3);

  return (
    <div>
      <h3>非受控</h3>
      <Pagination total={40} defaultPage={1} onChange={_page => console.log(_page)} />

      <Divider margin={40} />

      <h3>受控</h3>
      <Pagination total={1000} page={page} onChange={_page => setPage(_page)} />

      <Divider margin={40} />

      <h3>设置每页大小(默认10)</h3>
      <Pagination total={200} pageSize={20} />

      <Divider margin={40} />

      <h3>禁用</h3>
      <Pagination total={1000} disabled />
    </div>
  );
};

export default Demo;
