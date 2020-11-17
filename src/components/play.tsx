import React from 'react';
import Tree from 'm78/tree';
import { OptionsItem } from 'm78/tree/types';

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

const opt = mockTreeData(5, 5);

const Play = () => {
  return (
    <div>
      <Tree
        multipleCheckable
        defaultValue={['1-1-1-1-1-1']}
        rainbowIndicatorLine
        onChange={(a, b) => {
          console.log('change', a, b);
        }}
        dataSource={opt}
        height={400}
        toolbar
      />
    </div>
  );
};

export default Play;
