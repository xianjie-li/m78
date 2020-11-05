import React from 'react';
import { CaretRightOutlined } from 'm78/icon';
import { isArray, isTruthyOrZero } from '@lxjx/utils';
import { If } from 'm78/fork';
import cls from 'classnames';
import { FlatMetas, OptionsItem } from 'm78/tree/types';
import TreeItem from 'm78/tree/item';

const opt: OptionsItem[] = [
  {
    label: '文件夹1',
    value: '1',
    children: [
      {
        label: '文件夹1-1',
        value: '1-1',
      },
      {
        label: '文件夹1-2',
        value: '1-2',
        children: [
          {
            label: '文件夹1-2-1',
            value: '1-2-1',
          },
          {
            label: '文件夹1-2-2',
            value: '1-2-2',
          },
          {
            label: '文件夹1-2-3',
            value: '1-2-3',
          },
          {
            label: '文件夹1-2-4',
            value: '1-2-4',
          },
        ],
      },
      {
        label: '文件夹1-3',
        value: '1-3',
      },
      {
        label: '文件夹1-4',
        value: '1-4',
      },
    ],
  },
  {
    label: '文件夹2',
    value: '2',
  },
  {
    label: '文件夹3',
    value: '3',
    children: [
      {
        label: '文件夹3-1',
        value: '3-1',
      },
      {
        label: '文件夹3-2',
        value: '3-2',
      },
    ],
  },
  {
    label: '文件夹4',
    value: '4',
  },
];

/* 将一个值合并到一个可能存在的数组中，并返回一个新数组，如果两个参数为falsy，返回undefined */
const connectVal2Array = (val: any, array?: any[]) => {
  if (!isArray(array)) return isTruthyOrZero(val) ? [val] : undefined;
  return [...array, val];
};

/** 将OptionsItem[]的每一项转换为FlatMetas并平铺至目标数组 */
function flat(target = [] as FlatMetas[], optList: OptionsItem[], zIndex = 0, parent?: FlatMetas) {
  if (isArray(optList)) {
    const siblings: FlatMetas[] = [];

    optList.forEach((item, index) => {
      const current: FlatMetas = {
        ...item,
        zIndex,
        values: connectVal2Array(item.value, parent?.values)! /* value取值方式更换 */,
        indexes: connectVal2Array(index, parent?.indexes)!,
        parents: connectVal2Array(parent, parent?.parents),
        siblings: null!,
      };

      siblings.push(current);

      current.siblings = siblings;

      target.push(current);

      if (isArray(item.children)) {
        flat(target, item.children, zIndex + 1, current);
      }
    });
  }
}

const list: FlatMetas[] = [];

flat(list, opt);

console.log(list);

const Tree = () => {
  return (
    <div className="m78-tree __hoverEffect">
      <div className="m78-tree_nodes">
        {list.map(item => (
          <TreeItem open data={item} key={item.value} />
        ))}
      </div>
    </div>
  );
};

export default Tree;
