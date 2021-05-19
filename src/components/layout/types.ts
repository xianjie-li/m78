import React, { ReactElement, ReactNode } from 'react';
import { ComponentBaseProps, ComponentBasePropsWithAny, Size } from 'm78/types';

/*
 * ########################################
 * Flex
 * ########################################
 * */

export interface FlexWrapProps extends ComponentBasePropsWithAny {
  /** 'start' | 主轴对齐方式 */
  mainAlign?: 'center' | 'start' | 'end' | 'around' | 'between' | 'evenly';
  /** 'start' | 交叉轴对齐方式 */
  crossAlign?: 'stretch' | 'start' | 'end' | 'center';
  /** 内容 */
  children: React.ReactNode;
}

export interface FlexProps extends ComponentBasePropsWithAny {
  /** 1 | 弹性系数 */
  flex?: number | string;
  /** 排序 */
  order?: number;
  /** 单独设置在容器交叉轴上的对齐方式  */
  align?: FlexWrapProps['crossAlign'];
  /** 内容 */
  children?: React.ReactNode;
  /** 指向内部包裹dom的ref */
  innerRef?: React.Ref<HTMLDivElement>;
}

/*
 * ########################################
 * MediaQuery
 * ########################################
 * */

/**
 * MediaQuery context结构
 * */
export interface _MediaQueryTypeContext {
  /** 派发通知到所有useMediaQuery.onChange方法 */
  onChange: (size: Size) => void;
  /** useMediaQuery挂载的所有监听函数 */
  changeListeners: Array<(meta: MediaQueryMeta) => void>;
  /** 当前meta信息 */
  meta: MediaQueryMeta | null;
  /** 是否是跟节点，为true是应该监听窗口变更 */
  isRoot?: boolean;
}

/**
 * MediaQuery的所有类型
 * 判断是否在某一类型的方式为 当前宽度大于等于该类型的值且小于下一类型的值
 * */
export enum MediaQueryTypeValues {
  XS = 0,
  SM = 576,
  MD = 768,
  LG = 992,
  XL = 1200,
  XXL = 1600,
}

/**
 * MediaQuery的所有类型
 * 判断是否在某一类型的方式为 当前宽度大于等于该类型的值且小于下一类型的值
 * */
export enum MediaQueryTypeKeys {
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
  XXL = 'xxl',
}

/** 额外配置 */
export interface MediaQueryConf {
  /** 延迟响应变更的时间(ms) */
  debounce?: number;
  /**
   * 'type' | 监听类型
   * - 为type时，只在MediaQueryTypeKey变更时更新, 需要注意的时，此时的width和height值为更新时的快照值, 不应该依赖其进行一些计算操作
   * - 为size时，会在每一次尺寸变更时更新, size模式建议开启debounce, 防止频繁render
   * */
  listenType?: 'type' | 'size';
}

/** MediaQuery 完整元信息 */
export interface MediaQueryMeta {
  /** 当前容器宽度 */
  width: number;
  /** 当前容器高度 */
  height: number;
  /** 当前类型 */
  type: MediaQueryTypeKeys;
  /** 检测是否为指定类型 */
  isXS: () => boolean;
  isSM: () => boolean;
  isMD: () => boolean;
  isLG: () => boolean;
  isXL: () => boolean;
  isXXL: () => boolean;
  /** 当前尺寸是 xs或sm */
  isSmall: () => boolean;
  /** 当前尺寸是 md或lg */
  isMedium: () => boolean;
  /** 当前尺寸大于 lg */
  isLarge: () => boolean;
}

/** 一个以MediaQueryTypeKeys为键，泛型参数为值的对象 */
export interface MediaQueryObject<T = any> {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  xxl?: T;
}

export interface MediaQueryProps extends MediaQueryConf {
  children: (meta: MediaQueryMeta) => ReactElement<any, any> | null;
}

export interface MediaQueryListenerProps {
  onChange: (meta: MediaQueryMeta) => void;
}

/*
 * ########################################
 * Grids
 * ########################################
 * */

/**
 * GridCol的媒体查询配置
 * 所有属性都支持在断点中以对象形式设置，如xs={{ col: 5, move: 2 }}
 * */
export interface GridsColMediaQueryProps extends ComponentBaseProps {
  /** 占用栅格列数 */
  col?: number;
  /** 左侧间隔列 */
  offset?: number;
  /** 向左或向右移动指定列，不会影响原有文档流 */
  move?: number;
  /** 控制顺序 */
  order?: number;
  /** 手动指定该列的flex值 */
  flex?: string | number;
  /** 该项在交叉轴的对齐方式 */
  align?: FlexWrapProps['crossAlign'];
  /** 是否隐藏, 此属性与其他属性的继承顺序是相反的 */
  hidden?: boolean;
}

/** 表示列数或一个GridColMediaQueryProps配置 */
export type GridsColNumberOrMediaQueryProps = number | GridsColMediaQueryProps;

export interface GridsRowProps extends FlexWrapProps {
  /** 间隔 */
  gutter?: number;
  /** true | 是否允许换行 */
  wrap?: boolean;
}

export interface GridsColProps extends GridsColMediaQueryProps, ComponentBasePropsWithAny {
  /** 内容 */
  children?: ReactNode;
  /** 处于特定媒体类型下的配置 */
  xs?: GridsColNumberOrMediaQueryProps;
  sm?: GridsColNumberOrMediaQueryProps;
  md?: GridsColNumberOrMediaQueryProps;
  lg?: GridsColNumberOrMediaQueryProps;
  xl?: GridsColNumberOrMediaQueryProps;
  xxl?: GridsColNumberOrMediaQueryProps;
}

/*
 * ########################################
 * Tile
 * ########################################
 * */

export interface TileProps
  extends Omit<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, 'title'> {
  /** 主要内容 */
  title?: React.ReactNode;
  /** 次要内容 */
  desc?: React.ReactNode;
  /** 前导内容 */
  leading?: React.ReactNode;
  /** 尾随内容 */
  trailing?: React.ReactNode;
  /** 纵轴的对齐方式 */
  crossAlign?: FlexWrapProps['crossAlign'];
  /** 指向内部包裹dom的ref */
  innerRef?: React.Ref<HTMLDivElement>;
}
