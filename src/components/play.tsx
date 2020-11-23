import React, { useState } from 'react';
import Tree, { OptionsItem, DataSourceUtils } from 'm78/tree';
import { delay, getRandRange } from '@lxjx/utils';

function mockTreeData(length: number, z: number, label = '选项') {
  const ls: OptionsItem[] = [];

  function gn(list: OptionsItem = [], vp: string, cZInd = 0) {
    Array.from({ length }).forEach((_, index) => {
      const v = vp ? `${vp}-${index + 1}` : String(index + 1);
      const children: OptionsItem[] = [];

      const current: OptionsItem = {
        label: `${label} ${v}`,
        value: v,
        children: Math.random() > 0.5 ? [] : undefined,
      };

      list.push(current);

      if (cZInd !== z) {
        current.children = children;
        gn(children, v, cZInd + 1);
      }
    });
  }

  gn(ls, '');

  return ls;
}

const opt = mockTreeData(3, 3);

const dsList: OptionsItem[] = [
  {
    label: '选项1',
    children: [
      {
        label: '选项1-1',
      },
      {
        label: '选项1-2',
        isLeaf: true,
      },
    ],
  },
  {
    label: '选项2',
  },
  {
    label: '选项3',
    children: [],
  },
];

const du = new DataSourceUtils(dsList);

console.log(du.getTargetByIndexes([0, 2]));

const generateChildren = (pLabel = '') => {
  const length = getRandRange(0, 5);

  return Array.from({ length }).map((_, ind) => ({
    label: `${pLabel}-${ind + 1}`,
    isLeaf: Math.random() > 0.3,
  }));
};

const Play = () => {
  const [ds, setDs] = useState(opt);

  return (
    <div>
      <Tree
        draggable
        multipleCheckable
        rainbowIndicatorLine
        height={400}
        toolbar
        dataSource={ds}
        defaultOpenAll
        onDataSourceChange={_ds => {
          setDs(_ds);
        }}
      />
    </div>
  );
};

export default Play;
