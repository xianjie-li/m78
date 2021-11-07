import React, { useState } from 'react';
import { Tree, TreeDataSourceItem } from 'm78/tree';
import { delay, getRandRange } from '@lxjx/utils';

const generateChildren = (pLabel = '') => {
  if (Math.random() > 0.7) return []; // 应包含子项但为空
  const length = getRandRange(1, 5);

  return Array.from({ length }).map((_, ind) => ({
    label: `${pLabel}-${ind + 1}`,
    isLeaf: Math.random() > 0.7, // 明确声明为叶子节点，该节点不可再展开
  }));
};

const DynamicDemo = () => {
  const [ds, setDs] = useState<TreeDataSourceItem[]>([
    {
      label: '节点1',
    },
    {
      label: '节点2',
    },
    {
      label: '节点3',
      // 设置为叶子节点表示该节点不需要动态加载数据
      isLeaf: true,
    },
    {
      label: '节点4',
    },
  ]);

  return (
    <div>
      <Tree
        dataSource={ds}
        // 与其他组件库中的tree组件不同的是，该组件会代理dataSource的变更，在内部处理并更新dataSource，用户只需要接收并同步即可
        onDataSourceChange={setDs as any}
        onLoad={async node => {
          // 模拟请求延迟
          await delay(400);

          return generateChildren(node.origin.label as string);
        }}
        height={400}
        rainbowIndicatorLine
      />
    </div>
  );
};

export default DynamicDemo;
