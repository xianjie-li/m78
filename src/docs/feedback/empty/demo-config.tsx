import React from 'react';

import Empty from 'm78/empty';
import 'm78/empty/style';

import img from '@/mock/img/1.png';
import Config from 'm78/config';

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
