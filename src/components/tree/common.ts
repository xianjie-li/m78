import {
  heightLightMatchString,
  isArray,
  isBoolean,
  isTruthyArray,
  isTruthyOrZero,
} from '@lxjx/utils';
import { useMemo } from 'react';
import {
  ToolbarConf,
  TreeBaseMultipleChoiceProps,
  TreeBaseSingleChoiceProps,
  TreeDataSourceItem,
  TreeNode,
  TreeProps,
  TreePropsMultipleChoice,
  TreeValueType,
} from './_types';

export const defaultValueGetter = (item: TreeDataSourceItem) => item.value! || item.label;

export const defaultLabelGetter = (item: TreeDataSourceItem) => item.label!;

export const defaultChildrenGetter = (item: TreeDataSourceItem) => item.children!;

/** 预设尺寸 */
export const sizeMap = {
  default: {
    h: 26,
    identW: 20,
  },
  small: {
    h: 20,
    identW: 16,
  },
  large: {
    h: 36,
    identW: 24,
  },
};

/* 将一个值合并到一个可能存在的数组中，并返回一个新数组，如果两个参数为falsy，返回undefined */
const connectVal2Array = (val: any, array?: any[]) => {
  if (!isArray(array)) return isTruthyOrZero(val) ? [val] : undefined;
  return [...array, val];
};

/**
 * 将OptionsItem[]的每一项转换为treeNode并平铺到数组返回, 同时返回一些实用信息
 * @param optionList - OptionsItem选项组，为空或不存在时返回空数组
 * @param conf
 * @param conf.valueGetter - 获取value的方法
 * @param conf.labelGetter - 获取label的方法
 * @param conf.skipSearchKeySplicing - 关闭关键词拼接，不需要时关闭以提升性能
 * @returns returns
 * @returns returns.list - 平铺的列表
 * @returns returns.expandableList - 所有可展开节点(不包括isLeaf)
 * @returns returns.expandableValues - 所有可展开节点的value(不包括isLeaf)
 * @returns returns.zList - 一个二维数组，第一级中的每一项都是对应索引层级的所有数据
 * @returns returns.zListValues - 一个二维数组，第一级中的每一项都是对应索引层级的所有数据的value
 * @returns returns.disabledValues - 所有禁用项的value
 * @returns returns.disables - 所有禁用项
 * */
export function flatTreeData(
  optionList: TreeDataSourceItem[],
  conf: {
    valueGetter: NonNullable<TreeProps['valueGetter']>;
    labelGetter: NonNullable<TreeProps['labelGetter']>;
    childrenGetter: NonNullable<TreeProps['childrenGetter']>;
    skipSearchKeySplicing?: boolean;
  },
) {
  const list: TreeNode[] = [];
  const expandableList: TreeNode[] = [];
  const expandableValues: TreeValueType[] = [];
  const disables: TreeNode[] = [];
  const disabledValues: TreeValueType[] = [];
  const zList: TreeNode[][] = [];
  const zListValues: TreeValueType[][] = [];
  const { valueGetter, labelGetter, childrenGetter, skipSearchKeySplicing } = conf;

  // 将指定的TreeNode添加到它所有父级的descendants列表中
  function fillParentsDescendants(item: TreeNode) {
    if (!isTruthyArray(item.parents)) return;
    item.parents!.forEach(p => {
      p.descendants && p.descendants.push(item);
      p.descendantsValues && p.descendantsValues.push(item.value);
      if (!isTruthyArray(item.children)) {
        p.descendantsWithoutTwigValues && p.descendantsWithoutTwigValues.push(item.value);
        p.descendantsWithoutTwig && p.descendantsWithoutTwig.push(item);
      }
    });
  }

  // 平铺data树, 获取总层级，所有可展开项id
  function flat(
    target = [] as TreeNode[],
    optList: TreeDataSourceItem[],
    zIndex = 0,
    parent?: TreeNode,
  ) {
    if (isArray(optList)) {
      const siblings: TreeNode[] = [];
      const siblingsValues: TreeValueType[] = [];

      optList.forEach((item, index) => {
        const val = valueGetter(item);
        const label = labelGetter(item);
        const children = childrenGetter(item);

        const current: TreeNode = {
          // ...item,
          origin: item,
          children,
          zIndex,
          values: connectVal2Array(val, parent?.values)! /* value取值方式更换 */,
          indexes: connectVal2Array(index, parent?.indexes)!,
          parents: connectVal2Array(parent, parent?.parents),
          siblings: null!,
          siblingsValues: null!,
          value: val,
          descendants: children ? [] : undefined,
          descendantsValues: children ? [] : undefined,
          descendantsWithoutTwig: children ? [] : undefined,
          descendantsWithoutTwigValues: children ? [] : undefined,
          fullSearchKey: typeof label === 'string' ? label : '',
          disabledChildren: [],
          disabledChildrenValues: [],
        };

        // 添加兄弟节点
        siblings.push(current);
        siblingsValues.push(val);
        current.siblings = siblings;
        current.siblingsValues = siblingsValues;

        // 添加父级节点value
        if (isArray(current.parents)) {
          current.parentsValues = current.parents.map(it => valueGetter(it.origin));
        }

        // 为父节点添加child
        if (parent) {
          if (!parent.child) parent.child = [];
          parent.child.push(current);
        }

        // 添加到所有父节点的子孙列表
        fillParentsDescendants(current);

        target.push(current);

        // 加到可展开列表
        if (isTruthyArray(children)) {
          expandableList.push(current);
          expandableValues.push(current.value);
        }

        // 禁用列表
        if (current.origin.disabled) {
          disabledValues.push(current.value);
          disables.push(current);

          if (isTruthyArray(current.parents)) {
            current.parents.forEach(p => {
              p.disabledChildren.push(current);
              p.disabledChildrenValues.push(current.value);
            });
          }
        }

        // 层级列表
        if (!zList[zIndex]) {
          zList[zIndex] = [];
          zListValues[zIndex] = [];
        }

        zList[zIndex].push(current);
        zListValues[zIndex].push(current.value);

        // 拼接关键词
        if (!skipSearchKeySplicing && current.fullSearchKey && isTruthyArray(current.parents)) {
          current.parents!.forEach(p => (p.fullSearchKey += current.fullSearchKey));
        }

        if (isArray(children)) {
          flat(target, children, zIndex + 1, current);
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
    disables,
  };
}

export function isMultipleCheck(
  props: TreeBaseSingleChoiceProps | TreeBaseMultipleChoiceProps,
): props is TreePropsMultipleChoice {
  if ('multipleCheckable' in props) {
    return !!props.multipleCheckable;
  }
  return false;
}

export function isCheck(
  props: TreeBaseSingleChoiceProps | TreeBaseMultipleChoiceProps,
): props is TreeBaseSingleChoiceProps {
  if ('checkable' in props) {
    return !!props.checkable;
  }
  return false;
}

/** 单选时包装props以匹配useCheck */
export function useValCheckArgDispose(
  props: TreeBaseSingleChoiceProps | TreeBaseMultipleChoiceProps,
) {
  return useMemo(() => {
    const _p = { ...props };

    if (isCheck(props)) {
      if ('value' in props && props.value !== undefined) {
        _p.value = [props.value];
      }

      if ('defaultValue' in props && props.defaultValue !== undefined) {
        _p.defaultValue = [props.defaultValue];
      }

      _p.onChange = (value: any, extra: any) => {
        props.onChange?.(value[0], extra[0]);
      };

      return _p as TreeBaseMultipleChoiceProps;
    }

    return props as TreeBaseMultipleChoiceProps;
  }, [props]);
}

/** 如果传入值为字符，根据关键词裁剪并高亮字符中的所有字符 */
export function highlightKeyword(label: any, keyword?: string) {
  if (typeof label !== 'string' || !keyword) return '';

  return heightLightMatchString(label, keyword);
}

/** 帮助函数，过滤节点列表中所有包含禁用子项的节点并返回所有可用节点的value数组 */
export function filterIncludeDisableChildNode(ls: TreeNode[]) {
  const next: TreeValueType[] = [];

  ls.forEach(item => {
    if (!item.disabledChildrenValues.length) {
      next.push(item.value);
    }
  });

  return next;
}

/** 根据传入配置获取toolbar实际配置，如果启用会返回各项的启用配置对象 */
export function getToolbarConf(toolbar?: TreeProps['toolbar']) {
  if (!toolbar) return;

  const def: ToolbarConf = {
    check: true,
    fold: true,
    search: true,
    checkCount: true,
  };

  if (isBoolean(toolbar)) return def;

  return {
    ...def,
    ...toolbar,
  };
}

export const defaultProps = {
  valueGetter: defaultValueGetter,
  labelGetter: defaultLabelGetter,
  childrenGetter: defaultChildrenGetter,
  indicatorLine: true,
  checkStrictly: true,
};

export { isTruthyArray };
