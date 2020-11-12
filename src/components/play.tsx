import React, { useState } from 'react';
import Tree from 'm78/tree';
import { SizeEnum } from 'm78/types';
import { OptionsItem } from 'm78/tree/types';
import { getRandRange } from '@lxjx/utils';
import { RightOutlined, FileOutlined } from 'm78/icon';
import Dates from 'm78/dates/Dates';

function mockTreeData(length: number, z: number, label = '选项') {
  const ls: OptionsItem[] = [];

  function gn(list: OptionsItem = [], vp: string, cZInd = 0) {
    Array.from({ length }).forEach((_, index) => {
      const v = vp ? `${vp}-${index + 1}` : String(index + 1);
      const children: OptionsItem[] = [];

      const current: OptionsItem = {
        label: `${label} ${v}`,
        value: v,
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
        size={SizeEnum.large}
        checkable
        defaultValue="1-1-1-1-1-1"
        rainbowIndicatorLine
        onChange={(a, b) => {
          console.log('change', a, b);
        }}
        dataSource={opt}
        height={400}
        icon={<FileOutlined />}
        toolbar
      />
    </div>
  );
};

export default Play;
