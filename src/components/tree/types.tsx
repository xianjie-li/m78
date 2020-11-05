import { FormLikeWithExtra, UseCheckReturns } from '@lxjx/hooks';
import { DataSourceItem, Size } from 'm78/types';
import React from 'react';
import { defaultProps } from './tree';

/**
 * 拖拽
 * */

/** value允许类型 */
export type TreeValueType = string | number;

export interface TreeProps {
  /** 指定打开节点 (受控) */
  opens?: TreeValueType[];
  /** 指定默认打开节点 (非受控) */
  defaultOpens?: TreeValueType[];
  /** 打开节点变更时触发 */
  onOpensChange?: (nextOpens?: TreeValueType[]) => void;
  /** 默认展开所有节点, (通过api调用?)  */
  defaultOpenAll?: () => void;
  /** 默认展开到第几级, (通过api调用?) */
  defaultOpenZIndex?: number;
  /** 决定如何从选项中拿到value，默认是 item => item.value */
  valueGetter?: (optItem: OptionsItem) => TreeValueType;
  /** 决定如何从选项中拿到label，默认是 item => item.label */
  labelGetter?: (optItem: OptionsItem) => React.ReactNode;
  /** 尺寸 */
  size?: Size;
  /** 是否可进行选择 (使用高亮样式) */
  checkable?: boolean;
  /** 手风琴模式，同级只会有一个节点被展开 */
  accordion?: boolean;
  /** true | 是否开启连接指示线 */
  indicatorLine?: boolean;
  /** 可搜索 */
  search?: boolean;
  /** 禁用 */
  disabled?: boolean;
  /** 操作区内容 */
  actions?: React.ReactNode;
  /** 自定义所有节点的默认前导图标，权重小于option中单独设置的 */
  icon?: React.ReactNode;
  /** 自定义展开标识图标 */
  expansionIcon?: React.ReactNode | ((open?: boolean) => React.ReactNode);
  /** 开启异步加载数据，搭配OptionsItem.isLeaf使用 */
  onLazyLoad?: (opt: FlatMetas) => Promise<OptionsItem>;
}

export interface TreePropsSingleChoice
  extends TreeProps,
    FormLikeWithExtra<TreeValueType, FlatMetas> {}

export interface TreePropsMultipleChoice
  extends TreeProps,
    FormLikeWithExtra<TreeValueType[], FlatMetas[]> {
  /** 是否可多选，checkable开启时生效, 开启后onChange/value/defaultValue变为传递或接受数组 (使用复选框)  */
  multiple?: boolean;
  /** 开启后，父子节点不再强关联(父节点选中时选中所有子节点，子节点全选中时父节点选中) */
  checkStrictly?: boolean;
}

/** dataSource类型 */
export interface OptionsItem extends Partial<DataSourceItem<TreeValueType>> {
  /** 是否禁用 */
  disabled?: boolean;
  /** 子项 */
  children?: OptionsItem[];
  /** 前导图标 */
  icon?: React.ReactNode;
  /**
   * 是否为叶子节点
   * - 设置onLazyLoad异步加载数据后，所有项都会显示展开图标，如果项被指定为叶子节点，则视为无下级且不显示展开图标
   * - 传入onLazyLoad时生效
   * */
  isLeaf?: boolean;
  /** 在需要自行指定value或label的key时使用 */
  [key: string]: any;
}

export interface FlatMetas extends OptionsItem {
  /** 通过flatTreeData确保存在 */
  value: TreeValueType;
  /** 当前层级 */
  zIndex: number;
  /** 所有父级节点 */
  parents?: FlatMetas[];
  /** 所有父级节点的value */
  parentsValues?: TreeValueType[];
  /** 所有兄弟节点 */
  siblings: FlatMetas[];
  /** 所有兄弟节点的value */
  siblingsValues: TreeValueType[];
  /** 所有子孙节点 */
  descendants?: FlatMetas[];
  /** 所有子孙节点的value */
  descendantsValues?: TreeValueType[];
  /** 从第一级到当前级的value */
  values: (string | number)[];
  /** 从第一级到当前级的索引 */
  indexes: number[];
}

export interface Share {
  openCheck: UseCheckReturns<string | number, FlatMetas>;
  props: TreeProps & typeof defaultProps;
}
