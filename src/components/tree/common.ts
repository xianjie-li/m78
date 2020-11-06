import { isArray, isTruthyOrZero } from '@lxjx/utils';
import { FlatMetas, OptionsItem, TreeProps, TreeValueType } from './types';

export const defaultValueGetter = (item: OptionsItem) => item.value!;

export const defaultLabelGetter = (item: OptionsItem) => item.label!;

export function isTruthyArray(arg: any): boolean {
  if (!isArray(arg)) return false;
  return arg.length !== 0;
}

/* 将一个值合并到一个可能存在的数组中，并返回一个新数组，如果两个参数为falsy，返回undefined */
const connectVal2Array = (val: any, array?: any[]) => {
  if (!isArray(array)) return isTruthyOrZero(val) ? [val] : undefined;
  return [...array, val];
};

/**
 * 将OptionsItem[]的每一项转换为FlatMetas并平铺到数组返回, 同时返回一些实用信息 返回禁用项关键词
 * @param optionList - OptionsItem选项组，为空或不存在时返回空数组
 * @param conf
 * @param conf.valueGetter - 获取value的方法
 * @returns returns
 * @returns returns.list - 平铺的列表
 * @returns returns.expandableList - 所有可展开节点(不包括isLeaf)
 * @returns returns.expandableValues - 所有可展开节点的value(不包括isLeaf)
 * @returns returns.zList - 一个二维数组，第一级中的每一项都是对应索引层级的所有数据
 * @returns returns.zListValues - 一个二维数组，第一级中的每一项都是对应索引层级的所有数据的value
 * @returns returns.disabledValues - 所有禁用项的value
 * */
export function flatTreeData(
  optionList: OptionsItem[],
  conf: {
    valueGetter: NonNullable<TreeProps['valueGetter']>;
    labelGetter: NonNullable<TreeProps['labelGetter']>;
  },
) {
  const list: FlatMetas[] = [];
  const expandableList: FlatMetas[] = [];
  const expandableValues: TreeValueType[] = [];
  const disabledValues: TreeValueType[] = [];
  const zList: FlatMetas[][] = [];
  const zListValues: TreeValueType[][] = [];
  const { valueGetter, labelGetter } = conf;

  // 将指定的FlatMetas添加到它所有父级的descendants列表中
  function fillParentsDescendants(item: FlatMetas) {
    if (!isTruthyArray(item.parents)) return;
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
        const label = labelGetter(item);

        const current: FlatMetas = {
          ...item,
          zIndex,
          values: connectVal2Array(val, parent?.values)! /* value取值方式更换 */,
          indexes: connectVal2Array(index, parent?.indexes)!,
          parents: connectVal2Array(parent, parent?.parents),
          siblings: null!,
          siblingsValues: null!,
          value: val,
          label,
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

        // 加到可展开列表
        if (isTruthyArray(current.children)) {
          expandableList.push(current);
          expandableValues.push(current.value);
        }

        // 禁用列表
        if (current.disabled) {
          disabledValues.push(current.value);
        }

        // 层级列表
        if (!zList[zIndex]) {
          zList[zIndex] = [];
          zListValues[zIndex] = [];
        }

        zList[zIndex].push(current);
        zListValues[zIndex].push(current.value);

        if (isArray(item.children)) {
          flat(target, item.children, zIndex + 1, current);
        }
      });
    }
  }

  flat(list, optionList);

  return {
    list,
    expandableList,
    expandableValues,
    zList,
    zListValues,
    disabledValues,
  };
}
