import React, { useMemo } from 'react';
import { useCheck } from '@lxjx/hooks';
import cls from 'classnames';
import { FlatMetas, OptionsItem, Share, TreeProps } from './types';
import TreeItem from './item';
import { defaultLabelGetter, defaultValueGetter, flatTreeData } from './common';
import { useMethods } from './methods';
import { useLifeCycle } from './life-cycle';

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
            children: [
              {
                label: '文件夹1-2-3-1',
                value: '1-2-3-1',
              },
              {
                label: '文件夹1-2-3-2',
                value: '1-2-3-2',
              },
              {
                label: '文件夹1-2-3-3',
                value: '1-2-3-3',
              },
              {
                label: '文件夹1-2-3-4',
                value: '1-2-3-4',
              },
            ],
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

export const defaultProps = {
  valueGetter: defaultValueGetter,
  labelGetter: defaultLabelGetter,
};

const Tree = (props: TreeProps) => {
  const { valueGetter, labelGetter, size } = props as Share['props'];

  const flatMetas = useMemo(() => {
    return flatTreeData(opt, {
      valueGetter,
      labelGetter,
    });
  }, []);

  const { list } = flatMetas;

  const openCheck = useCheck<string | number, FlatMetas>({
    ...props,
    options: list,
    collector: valueGetter,
    triggerKey: 'onOpensChange',
    valueKey: 'opens',
    defaultValueKey: 'defaultOpens',
  });

  const share: Share = {
    openCheck,
    props: props as Share['props'],
    flatMetas,
  };

  const methods = useMethods(share);

  useLifeCycle(share, methods);

  return (
    <div className={cls('m78-tree __hoverEffect', size && `__${size}`)}>
      <div className="m78-tree_nodes">
        {list.map(item => (
          <TreeItem
            open={methods.isOpen(item)}
            data={item}
            key={item.value}
            share={share}
            methods={methods}
          />
        ))}
      </div>
    </div>
  );
};

Tree.defaultProps = defaultProps;

export default Tree;
