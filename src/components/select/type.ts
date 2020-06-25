import React from 'react';
import { FormLikeWithExtra } from '@lxjx/hooks';
import { ComponentBaseProps, FullSize, Size } from '../types/types';

export interface SelectOptionItem {
  /** 类目名 */
  label?: string;
  /** 值 */
  value?: any;
  /** 是否禁用 */
  disabled?: boolean;
  /** 特殊的选项类型 */
  type?: 'title' | 'divider';
  /** 前置内容 */
  prefix?: React.ReactNode;
  /** 后置内容 */
  suffix?: React.ReactNode;

  [key: string]: any;
}

export interface SelectProps<ValType, Options = any>
  extends ComponentBaseProps,
    FormLikeWithExtra<ValType, Options> {
  /** [] | 选项数组 */
  options?: SelectOptionItem[];
  /** 输入框默认显示的文本 */
  placeholder?: string;
  /** 'label' | 配置如何从options项中获取选项名 */
  labelKey?: string;
  /** 'value' | 配置如何从options项中获取值 */
  valueKey?: string;
  /** 为列表设置style */
  listStyle?: React.CSSProperties;
  /** 为列表设置className */
  listClassName?: string;
  /** 手动控制显示 */
  show?: boolean;
  /** 是否默认显示 */
  defaultShow?: boolean;
  /** show触发改变, 类似表单控件onChange用法 */
  onShowChange?(show: boolean): void;

  /* ================= 多选 ================ */
  /** false | 开启多选 */
  multiple?: boolean;
  /** true | 当multiple启用时，是否使用tag作为选中项显示 */
  showTag?: boolean;
  /** false | 从选项中隐藏已选中项 */
  hideSelected?: boolean;
  /** 8 | 最大显示的 多选元素/标签 数量 */
  multipleMaxShowLength?: number;
  /**
   * 用于在value中包含options中不存在的值时进行获取
   * eg. 通过value传入了[1, 5, 7], 但是options中不存在value为1, 5的选项，就会通过此方法传入[1, 5]来帮助进行查询并合并选项
   * options中不存在的值不会再已选值中以字符或标签形式显示，直到这些选项被添加
   * 每个不存在的值只会被回传一次
   * */
  notExistValueTrigger?(val: ValType): void;
  /** 定制tag样式 */
  customTag?: SelectCustomTag;
  /** 最大选中条数 */
  maxLength?: number;

  /* ================= 尺寸 ================ */
  /** 列表宽度，默认与输入框等宽 */
  listWidth?: number | string;
  /** 320 | 列表最大高度, 超出时出现滚动条 */
  listMaxHeight?: number | string;
  /** 32 | 虚拟滚动需要确定的高度(px)，如果列表项通过其他配置修改过，通过此项设置修改后的高度 */
  listItemHeight?: number;

  /* ================= 工具栏 ================ */
  /** false | 是否显示toolbar, 单选时无效 */
  toolbar?: boolean;
  /** 定制toolbar的样式, 传入时toolbar默认开启, 不受单选限制。内置toolbar(ReactElement)会作为参数传入 */
  customToolBar?: SelectCustomToolbar;

  /* ================= loading ================ */
  /** 列表/输入框加载状态 */
  loading?: boolean;
  /** 选项列表加载状态 */
  listLoading?: boolean;
  /** 输入框加载状态 */
  inputLoading?: boolean;
  /** 输入框阻断式的加载状态 */
  blockLoading?: boolean;

  /* ================= 搜索 ================ */
  /** 是否开启搜索 */
  search?: boolean;

  /* ================= 态 ================ */
  /** 设置为禁用状态 */
  disabled?: boolean;
  /** 尺寸 */
  size?: FullSize;
}

/** 约定内部选项Item的入参 */
export interface RenderItemData {
  listItemHeight: number | string;
  isChecked(val: any): boolean;
  onCheckItem(val?: any): void;
  options: SelectOptionItem[];
  labelKey: string;
  valueKey: string;
}

export interface SelectCustomTagMeta {
  /** 该标签对应的选项 */
  option: SelectOptionItem;
  /** 标签label */
  label: string;
  /** 删除该值 */
  del(): void;
  /** 该标签在数组中的索引 */
  index: number;
  /** 透传给标签的className，包含size/disabled等用于定制的定制状态类 */
  className?: string;
}

export interface SelectCustomTag {
  (meta: SelectCustomTagMeta, props: SelectProps<any>): React.ReactElement;
}

/** 定制toolbar, node为内置toolbar */
export interface SelectCustomToolbar {
  (node?: React.ReactElement): React.ReactNode;
}
