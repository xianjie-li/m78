import React from 'react';

import Empty from '@lxjx/fr/lib/empty';
import '@lxjx/fr/lib/empty/style';

import Button from '@lxjx/fr/lib/button';
import '@lxjx/fr/lib/button/style';

import img from '@/mock/img/2.jpg';

const Demo = () => {
  return (
    <div>
      <Empty desc="暂无数据">
        children会在这里渲染
      </Empty>
      <Empty desc="任何可渲染的内容">
        <Button size="small">操作1</Button>
        <Button size="small" color="blue">操作2</Button>
      </Empty>

      <Empty
        desc="暂无数据"
        emptyNode={(
          <img src={img} alt="" />
        )}
      >
        自定义占位图
      </Empty>

      <Empty desc="暂无数据" size="small">
        一段描述文本...
      </Empty>
      <Empty desc="暂无数据">
        一段描述文本...
      </Empty>
      <Empty desc="暂无数据" size="large">
        一段描述文本...
      </Empty>
    </div>
  );
};

export default Demo;
