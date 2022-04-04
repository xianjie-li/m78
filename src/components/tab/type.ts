import React from 'react';
import { Position, Size } from 'm78/common';
import { TabItem } from 'm78/tab';
import { useScroll, SetState, FormLike } from '@lxjx/hooks';
import { CarouselRef } from 'm78/carousel';
import { AnyFunction, ComponentBaseProps } from '@lxjx/utils';

export type TabItemElement = React.ReactElement<TabItemProps, typeof TabItem>;

export interface TabProps extends ComponentBaseProps, FormLike<string | number> {
  /** extend(FormLike) | 当前所在选项卡的value */
  // value?: number;
  /** extend(FormLike) | value改变 */
  // onChange?: (value: string | number) => void;
  /** extend(FormLike) | 初始选项卡的value，优先级小于index */
  // defaultValue?: number;
  /** 一组TabItem */
  children?: TabItemElement[] | TabItemElement;
  /** tab的尺寸 */
  size?: Size;
  /** tab的位置 */
  position?: Position;
  /** tab项的每一项平分宽度，如果tab过多不建议开启, position为left和right时无效 */
  flexible?: boolean;
  /** 高度，position为left和right时必传, 横向切换时此配置无效 */
  height?: number | string;
  /** 无限滚动，页面内容过于复杂时不建议开启，因为需要复制页面帮助完成滚动动画 */
  loop?: boolean;
  /** 禁用 */
  disabled?: boolean;
  /** TODO: tab会在即将滚动消失时固定到顶部 */
  // affix?: boolean;
  /** 将不可见的TabItem卸载，只保留空容器(由于存在动画，当前项的前后容器总是会保持装载状态, 启用loop时会有额外规则，见注意事项) */
  invisibleUnmount?: boolean;
  /** TabItem不可见时，将其display设置为node(需要保证每项只包含一个子元素且能够设置style，注意事项与invisibleUnmount一致) */
  invisibleHidden?: boolean;

  /* ======== 样式定制 ======== */
  /** extend(ComponentBaseProps) | 包裹元素的类名 */
  // className?: string;
  /** extend(ComponentBaseProps) | 包裹元素样式 */
  // style?: React.CSSProperties;
  /** 关闭分割线 */
  noSplitLine?: boolean;
  /** 关闭活动线 */
  noActiveLine?: boolean;
}

export interface TabItemProps extends ComponentBaseProps {
  /** tab文本 */
  label: React.ReactNode;
  /** 表示该项的唯一值 */
  value: string | number;
  /** 禁用 */
  disabled?: boolean;
  /** 内容 */
  children?: React.ReactNode;
}

export interface Share {
  /** 是否是纵向 */
  isVertical: boolean;
  /** 内部实例对象 */
  self: {
    /** 动画设置次数，用于某些方法的计量 */
    itemSpringSetCount: number;
    /** 所有tab项的ref */
    tabRefs: HTMLDivElement[];
  };
  /** 内部状态 */
  state: {
    /** 开始侧滚动标记是否启用 */
    startFlag: boolean;
    /** 结束侧滚动标记是否启用 */
    endFlag: boolean;
    /** 是否包含touch时间 */
    hasTouch: boolean;
  };
  /** 设置内部状态 */
  setState: SetState<Share['state']>;
  /** 当前tab索引 */
  val: number | string;
  /** 设置当前tab索引 */
  setVal: (arg: any) => void;
  /** 设置线条动画 */
  set: AnyFunction;
  /** carousel ref */
  carouselRef: React.MutableRefObject<CarouselRef>;
  /** 是否被禁用 */
  disabled?: boolean;
  /** 滚动控制 */
  scroller: ReturnType<typeof useScroll>;
  /** TabItem子项数组 */
  child: TabItemElement[];
  /** 如果每一个TabItem都不包含可渲染的子项则为true */
  hasContent: boolean;
  /** 存放所有TabItem的子项 */
  values: Array<string | number>;
  /** 当前val索引 */
  index: number;
}
