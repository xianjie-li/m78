import React from 'react';

import Tab, { TabItem } from 'm78/tab';
import sty from '@/docs/Navigation/tab/sty.module.scss';
import Select from 'm78/select';

const Play = () => {
  return (
    <div>
      <Select
        placeholder="请输入内容"
        options={[
          {
            value: '选项1',
          },
          {
            value: '选项2',
          },
          {
            value: '选项3',
          },
          {
            value: '选项4',
          },
        ]}
      />
    </div>
  );
};

export default Play;
