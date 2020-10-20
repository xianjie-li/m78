import { Direction } from 'm78/util';
import React from 'react';
import { SpringStartFn } from 'react-spring';
import { useScroll, UseScrollMeta } from '@lxjx/hooks';
import { SetState } from '@lxjx/hooks/dist/type';
import { PullDownStatus, PullUpStatus } from 'm78/scroller';
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

type UseScrollReturns = Omit<ReturnType<typeof useScroll>, 'ref'>;

export interface ScrollerRef extends UseScrollReturns {
  /** 手动触发onPullDown，可用于刷新上拉加载的状态，当正在进行下拉或上拉中的任意操作时，调用无效 */
  triggerPullDown(): void;
  /** 手动触发onPullUp，参数细节见props.onPullUp ，当正在进行下拉或上拉中的任意操作时，调用无效 */
  triggerPullUp(isRefresh?: boolean): void;
  // 向上滚动整页(不需要开启slide)
  slidePrev(): void;
  // 向下滚动整页(不需要开启slide)
  slideNext(): void;
}

export interface ScrollerProps extends ComponentBaseProps {
  /** Direction.vertical | 滚动方向 */
  direction?: Direction;
  /** 内容, 是否可滚动的依据是滚动内容尺寸大于滚动容器尺寸 */
  children?: React.ReactNode;
  /** 滚动时触发 */
  onScroll?: (meta: UseScrollMeta) => void;
  /** 禁止滚动(仍可通过ref api控制滚动) */
  disableScroll?: boolean;

  /* ############# 下拉配置 ############# */

  /** 启用下拉并在触发时通知, 根据Promise的解析结果决定成功或失败 */
  onPullDown?: (triggerPullDown: ScrollerRef['triggerPullUp']) => Promise<void>;
  /** true | 是否在刷新结束后根据结果进行提示 */
  pullDownTips?: boolean;
  /** 自定义下拉指示器 */
  pullDownIndicator?: React.ReactNode;
  /** 完全替换下拉区域的内容, 可以通过threshold调整下拉距离 */
  pullDownNode?: React.ReactNode;

  /* ############# 上拉配置 ############# */

  /**
   * 启用上拉加载并在触发时通知
   * - 如果Promise resolve, 解析包含length和isEmpty的对象，length表示该次请求到的数据总条数，isEmpty表示已无数据可加载
   * - 如果Promise reject, 会发出一个加载失败通知
   * - onPullUp有4 种方式触发，组件初始化时(isRefresh为true)、下拉刷新执行成功时、上拉到触发点时、调用triggerPullUp(组件内/外)
   *
   * 上拉加载与下拉刷新有以下关联行为
   * - 开始刷新时，上拉状态会被还原
   * - 如果列表包含依赖状态，页码、查询等，应在下拉刷新时将其重置
   * */
  onPullUp?: (args: {
    /** 由组件内部触发(点击重试、triggerPullUp(true)、初始化执行)等方式触发, 为true时应该调过增加页码等操作，仅做数据更新 */
    isRefresh?: boolean;
  }) => Promise<{ length?: number; isEmpty: boolean }>;
  /** 当前是否有已加载的数据，一个可选的优化属性, 可以更友好的显示初次加载时的加载、错误、空数据状态显示 */
  hasData?: boolean;
  /** 120 | 触发上拉加载的距离 */
  pullUpThreshold?: number;

  /* ############# 上下拉相关配置 ############# */

  /** 80 | 各方向到达顶部或底部后可拖动的最大距离(不包含rubber产生的额外拖动距离), 此距离也是下拉刷新的触发距离 */
  threshold?: number;
  /** 0.5 | 肥皂力，值越大则越顺滑, 拖动每px移动的距离也更大 */
  soap?: number;
  /** 40 | 触发橡皮筋效果的阈值, 会在 threshold 的 -rubber 位置开始逐渐减小soap, 并在拖动到+rubber位置时完全停止 */
  rubber?: number;

  /* ############# 定制配置 ############# */

  /** 拖动层下层的背景色 */
  bgColor?: string;
  /** 显示滚动进度条, 为number时当可滚动区域大于此值时才出现progressBar, 若传入true，滚动区域大于500时出现进度条 */
  progressBar?: boolean | number;
  /** 0 ~ 1 手动控制x轴进度条进度 */
  xProgress?: number;
  /** 0 ~ 1 手动控制y轴进度条进度 */
  yProgress?: number;
  /** 对应方向包含可滚动区域时显示可滚动阴影标识 */
  scrollFlag?: boolean;
  /** false | 是否显示滚动条 */
  hideScrollbar?: boolean;
  /** true | 在支持::-webkit-scrollbar且非移动端的情况下，使用其定制滚动条 */
  webkitScrollBar?: boolean;
  /** false | 仅在鼠标悬停在滚动容器上时显示webkitScrollBar */
  hoverWebkitScrollBar?: boolean;
  /** 继承配置 */
  // className: string;
  // style: React.CSSProperties;

  /* ############# 扩展 ############# */

  /** TODO: 是否显示返回顶部按钮 */
  // backTop?: boolean;
  /** 滚动容器外层额外的内容, 和滚动提示等组件一级，用于扩展其他滚动配件 */
  extraNode?: React.ReactNode;
}
