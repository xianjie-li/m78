import { Direction } from 'm78/util';
import React from 'react';
import { AnyFunction } from '@lxjx/utils';
import { SpringStartFn } from 'react-spring';
import { useScroll } from '@lxjx/hooks';
import { SetState } from '@lxjx/hooks/dist/type';
import { PullDownStatus } from 'm78/scroller';
import { PullUpStatus } from 'm78/scroller/common';
import { defaultProps } from './scroller';
import { ComponentBaseProps } from '../types/types';

/** setDragPos依赖的必须参数 */
export interface SetDragPosArg {
  isVertical?: boolean;
  dey: number;
  dex: number;
  touchTop: boolean;
  touchLeft: boolean;
  touchBottom: boolean;
  touchRight: boolean;
}

export interface Share {
  props: typeof defaultProps & ScrollerProps;
  state: {
    /** 当前环境下的滚动条宽度 */
    scrollBarWidth: number;
    /** 是否支持touch事件 */
    hasTouch: boolean;
    /** 各位置的滚动标识 */
    topFlag: boolean;
    rightFlag: boolean;
    bottomFlag: boolean;
    leftFlag: boolean;
    /** 下拉刷新状态 */
    pullDownStatus: PullDownStatus;
    /** 上拉刷新状态 */
    pullUpStatus: PullUpStatus;
  };
  setState: SetState<Share['state']>;
  self: {
    /** 记录最后一次设置的x轴拖动位置, 拖动松开后重置为0 */
    memoX: number;
    /** 记录最后一次设置的y轴拖动位置, 拖动松开后重置为0 */
    memoY: number;
  };
  /** 设置元素动画 */
  setSp: SpringStartFn<any>;
  /** 进度条动画 */
  setPgSp: SpringStartFn<any>;
  /** 额外的设置下拉指示器旋转角度动画(用于下拉已触发时的加载动画) */
  setPullDownSp: SpringStartFn<any>;
  /** 滚动控制器 */
  sHelper: ReturnType<typeof useScroll>;
  /** 根元素ref */
  rootEl: React.MutableRefObject<HTMLDivElement>;
}

export interface ScrollerRef {
  /** 手动触发onPullDown，当正在进行下拉或上拉中的任意操作时，调用无效 */
  triggerPullDown(): void;
  // /** 手动触发onPullUp，当正在进行下拉或上拉中的任意操作时，调用无效 */
  // triggerPullUp(isRefresh?: boolean): void;
  // /** 重置上拉加载, 当没有数据时，上拉加载会被禁用，通过此方法可重新开启 */
  // resetPullUp(): void;
  // /** 滚动到指定位置, 传immediate则跳过动画 */
  // scrollTo(to: number, immediate?: boolean): void;
  // /** 根据当前位置滚动指定距离, 正数或负数, 传immediate则跳过动画  */
  // scrollBy(offset: number, immediate?: boolean): void;
  // /** 滚动到指定元素位置，如果是字符，会调用querySelector进行获取，没有找到时不会执行任何操作 */
  // scrollToElement(el: HTMLElement | string): void;
  // /** 对滚动节点的引用 */
  // el: HTMLDivElement;
}

export interface ScrollerProps extends ComponentBaseProps {
  /** Direction.vertical | 滚动方向 */
  direction?: Direction;
  /** 内容, 是否可滚动的依据是滚动内容尺寸大于滚动容器尺寸 */
  children?: React.ReactNode;

  /* ############# 下拉配置 ############# */

  /** 启用下拉并在触发时通知, 根据Promise的解析结果决定成功或失败 */
  onPullDown?: () => Promise<void>;
  /** true | 是否在刷新结束后根据结果进行提示 */
  pullDownTips?: boolean;
  /** 自定义下拉指示器 */
  pullDownIndicator?: React.ReactNode;
  /** 完全替换下拉区域的内容, 可以通过threshold调整下拉距离 */
  pullDownNode?: React.ReactNode;

  /* ############# 上拉配置 ############# */

  /**
   * 启用上拉加载并在触发时通知
   * - 如果Promise resolve, 解析数字且大于0时，可以继续上拉，无解析或等于0时，设置为无数据状态
   * - 如果Promise reject, 会发出一个加载失败通知
   * - onPullUp有4 种方式触发，组件初始化时(isRefresh为true)、下拉刷新执行成功时、上拉到触发点时、调用triggerPullUp(组件内/外)
   *
   * 上拉加载与下拉刷新有以下关联行为
   * - 下拉刷新成功时，上拉状态会被还原
   * - 如果列表包含依赖状态，页码、查询等，应在下拉刷新时将其重置
   * */
  onPullUp?: (args: {
    /** 由组件内部触发(点击重试、triggerPullUp(true)、初始化执行)等方式触发, 为true时应该调过增加页码等操作，仅做数据更新 */
    isRefresh?: boolean;
  }) => Promise<number | void>;
  /** 当前是否有已加载的数据，一个可选的优化属性, 用于优化数据为空时加载指示器、文本等的显示 */
  hasData?: boolean;
  /** 120 | 触发上拉加载的距离 */
  pullUpThreshold?: number;

  /* ############# 上下拉相关配置 ############# */
  /** 80 | 各方向到达顶部或底部后可拖动的最大距离(不包含rubber产生的额外拖动距离), 此距离也是下拉刷新的触发距离 */
  threshold?: number;

  /** 滚动时触发 */
  onScroll?: () => void;
  /** 是否显示返回顶部按钮 */
  backTop?: boolean;
  /** 提供整页滚动能力 */
  slide?: boolean;
  /** 虚拟滚动 */
  /** 滚动容器下额外的内容 */
  extraNode?: React.ReactNode;

  /** 拖动层下层的背景色 */
  bgColor?: string;
  /** 显示滚动进度条, 为number时当可滚动区域大于此值时才出现progressBar, 若传入true，滚动区域大于500时出现进度条 */
  progressBar?: boolean | number;
  /** 对应方向包含可滚动区域时显示可滚动阴影标识 */
  scrollFlag?: boolean;
  /** false | 是否显示滚动条 */
  hideScrollbar?: boolean;
  /** true | 在支持::-webkit-scrollbar且非移动端的情况下，使用其定制滚动条 */
  webkitScrollBar?: boolean;
  /** false | 仅在鼠标悬停在滚动容器上时显示webkitScrollBar */
  hoverWebkitScrollBar?: boolean;

  /** 0.5 | 肥皂力，值越大则越顺滑, 拖动每px移动的距离也更大 */
  soap?: number;
  /** 40 | 触发橡皮筋效果的阈值, 会在 threshold 的 -rubber 位置开始逐渐减小soap, 并在拖动到+rubber位置时完全停止 */
  rubber?: number;
}
