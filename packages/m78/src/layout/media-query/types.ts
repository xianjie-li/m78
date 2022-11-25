import { Size } from "@m78/utils";
import { ReactElement } from "react";

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
  /** 是否是根节点，为true时应该监听窗口变更 */
  isRoot?: boolean;
}

/**
 * MediaQuery的所有类型
 * - 判断是否在某一断点的方式为: 当前断点 <= width < 下一断点
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
 * - 判断是否在某一断点的方式为: 当前断点 <= width < 下一断点
 * */
export enum MediaQueryTypeKeys {
  XS = "xs",
  SM = "sm",
  MD = "md",
  LG = "lg",
  XL = "xl",
  XXL = "xxl",
}

export interface _MediaQueryBaseConf {
  /** 延迟响应变更的时间(ms) */
  debounce?: number;
}

/** 基础外配置 */
export interface MediaQueryConf<Val> extends _MediaQueryBaseConf {
  /**
   * 'type' | 监听类型
   * - 为type时，只在MediaQueryTypeKey变更时更新, 需要注意的时，此时的width和height值为更新时的快照值, 不应该依赖其进行一些计算操作
   * - 为size时，会在每一次尺寸变更时更新, size模式建议开启debounce, 防止频繁render
   * */
  listenType?: "type" | "size";
  /**
   * 为不同的断点设置一个值, 符合当前断点的值会传递给children, 实际使用时不可能为每一个断点都设置值，所有断点遵循一套继承机制，以减少编码量:
   * - 断点会影响其后所有未设置值的断点，比如，设置了xs时, xs之后的所有断点都会继承xs的配置, 如果xs后任意一个断点也设置了值，则后续断点会改为继承该断点
   * */
  xs?: Val;
  sm?: Val;
  md?: Val;
  lg?: Val;
  xl?: Val;
  xxl?: Val;
  /** 默认的断点值继承机制为从左到右，传入此项将其继承顺序颠倒 */
  reverse?: boolean;
}

export interface MediaQueryProps<Val = any> extends MediaQueryConf<Val> {
  /** 接收断点信息并执行渲染的render函数, value为当前命中断点的传入值 */
  children: (meta: MediaQueryMeta, value: Val) => ReactElement<any, any> | null;
}

/** 主要类型, 包含断点的信息和状态 */
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

export interface MediaQueryListenerProps {
  /** 断点变更回调 */
  onChange: (meta: MediaQueryMeta) => void;
}
