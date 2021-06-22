import React, { useState } from 'react';
import { Tree, TreeDataSourceItem } from 'm78/tree';
import { Button } from 'm78/button';
import { Spacer } from 'm78/layout';
import mockTreeData from './mockTreeData';

function BigDataTreeDemo({
  length,
  z,
  multipleCheckable,
}: {
  length: number;
  z: number;
  multipleCheckable?: boolean;
}) {
  const [ds] = useState<TreeDataSourceItem[]>(() => mockTreeData(length, z));

  return (
    <div>
      <Tree
        multipleCheckable={multipleCheckable}
        dataSource={ds}
        height={400}
        toolbar
        defaultOpenAll
        rainbowIndicatorLine
      />
    </div>
  );
}

const BigData = () => {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  return (
    <div>
      <h3>30万节点数据</h3>
      <Button onClick={() => setOpen1(true)}>加载示例</Button>
      <div className="color-second mtb-8">创建模拟数据和初始化会消耗一定的时间</div>
      {open1 && <BigDataTreeDemo length={8} z={5} />}

      <Spacer height={80} />

      <h3>13万节点数据 + 多选</h3>
      <Button onClick={() => setOpen2(true)}>加载示例</Button>
      <div className="color-second mtb-8">
        多选时，由于需要在选中变化时关联所有父级、子孙级节点的选中，性能会有所下降，关闭此行为能大大提升性能
      </div>
      {open2 && <BigDataTreeDemo length={7} z={5} multipleCheckable />}
    </div>
  );
};

export default BigData;
