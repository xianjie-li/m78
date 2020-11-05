import React, { useMemo } from 'react';
import { isArray, isTruthyOrZero } from '@lxjx/utils';
import { useCheck } from '@lxjx/hooks';
import { FlatMetas, OptionsItem, Share, TreeProps, TreeValueType } from './types';
import TreeItem from './item';
import { defaultValueGetter, isNonEmptyArray } from './common';
import { useMethods } from './useMethods';

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

/** 将OptionsItem[]的每一项转换为FlatMetas并平铺至目标数组, 关键词 */
function flatTreeData(
  optionList: OptionsItem[],
  conf: {
    valueGetter: NonNullable<TreeProps['valueGetter']>;
  },
) {
  const list: FlatMetas[] = [];
  const { valueGetter } = conf;

  // 将指定的FlatMetas添加到它所有父级的descendants列表中
  function fillParentsDescendants(item: FlatMetas) {
    if (!isNonEmptyArray(item.parents)) return;
    item.parents!.forEach(p => {
      p.descendants && p.descendants.push(item);
      p.descendantsValues && p.descendantsValues.push(item.value);
    });
  }

  // 平铺data树, 获取总层级，所有可展开项id
  function flat(
    target = [] as FlatMetas[],
    optList: OptionsItem[],
    zIndex = 0,
    parent?: FlatMetas,
  ) {
    if (isArray(optList)) {
      const siblings: FlatMetas[] = [];
      const siblingsValues: TreeValueType[] = [];

      optList.forEach((item, index) => {
        const val = valueGetter(item);

        const current: FlatMetas = {
          ...item,
          zIndex,
          values: connectVal2Array(val, parent?.values)! /* value取值方式更换 */,
          indexes: connectVal2Array(index, parent?.indexes)!,
          parents: connectVal2Array(parent, parent?.parents),
          siblings: null!,
          siblingsValues: null!,
          value: val,
          descendants: item.children ? [] : undefined,
          descendantsValues: item.children ? [] : undefined,
        };

        // 添加兄弟节点
        siblings.push(current);
        siblingsValues.push(val);
        current.siblings = siblings;
        current.siblingsValues = siblingsValues;

        // 添加父级节点value
        if (isArray(current.parents)) {
          current.parentsValues = current.parents.map(valueGetter);
        }

        // 添加到所有父节点的子孙列表
        fillParentsDescendants(current);

        target.push(current);

        if (isArray(item.children)) {
          flat(target, item.children, zIndex + 1, current);
        }
      });
    }
  }

  flat(list, optionList);

  console.log(list);

  return list;
}

export const defaultProps = {
  valueGetter: defaultValueGetter,
};

const Tree = (props: Share['props']) => {
  const { valueGetter } = props;

  const list = useMemo(() => {
    return flatTreeData(opt, {
      valueGetter,
    });
  }, []);

  const openCheck = useCheck<string | number, FlatMetas>({
    options: list,
    collector: valueGetter,
  });

  console.log(openCheck, openCheck.checked);

  const share: Share = {
    openCheck,
    props,
  };

  const methods = useMethods(share);

  return (
    <div className="m78-tree __hoverEffect">
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
