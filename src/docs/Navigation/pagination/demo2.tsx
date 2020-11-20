import React from 'react';
import Pagination from 'm78/pagination';
import { Divider } from 'm78/layout';

const Demo2 = () => {
  return (
    <div>
      <h3>朴素模式</h3>

      <Pagination total={100} plain />

      <Divider margin={40} />

      <h3>小分页器</h3>
      <Pagination total={100} size="small" />

      <Divider margin={40} />

      <h3>简洁模式</h3>
      <Pagination total={100} simple plain />
      <Pagination total={100} simple />

      <Divider margin={40} />

      <h3>跳页器</h3>
      <Pagination total={1000} jumper />

      <Divider margin={40} />

      <h3>计数器</h3>
      <Pagination total={1000} count />

      <Divider margin={40} />

      <h3>上下页文本</h3>
      <Pagination total={1000} prevText="上一页" nextText="下一页" />
    </div>
  );
};

export default Demo2;
