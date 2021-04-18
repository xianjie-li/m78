import React from 'react';

import Empty from 'm78/empty';

import img from '@/mock/img/1.png';
import m78Seed from 'm78/config';

const newEmptyNode = <img src={img} alt="" />;

m78Seed.setState({
  emptyNode: newEmptyNode,
});

const Demo = () => (
  <div>
    <Empty desc="暂无数据" size="small">
      一段描述文本...
    </Empty>
    <Empty desc="暂无数据">一段描述文本...</Empty>
    <Empty desc="暂无数据" size="large">
      一段描述文本...
    </Empty>
  </div>
);

export default Demo;
