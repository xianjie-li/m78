import React from 'react';

import Empty from '@lxjx/fr/lib/empty';
import '@lxjx/fr/lib/empty/style';

import img from '@/mock/img/1.jpg';
import Config from '@lxjx/fr/lib/config';

const newEmptyNode = <img src={img} alt="" />;

const Demo = () => (
  <div>
    <Config.Provider
      value={{
        emptyNode: newEmptyNode,
      }}
    >
      <Empty desc="暂无数据" size="small">
        一段描述文本...
      </Empty>
      <Empty desc="暂无数据">一段描述文本...</Empty>
      <Empty desc="暂无数据" size="large">
        一段描述文本...
      </Empty>
    </Config.Provider>
  </div>
);

export default Demo;
