import { Direction } from 'm78/util';
import React from 'react';
import { AnyFunction } from '@lxjx/utils';
import { SetUpdateFn } from 'react-spring';
import { useScroll } from '@lxjx/hooks';
import { SetState } from '@lxjx/hooks/dist/type';
import { PullDownStatus } from 'm78/scroller/common';
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
  };
  setState: SetState<Share['state']>;
  self: {
    /** 记录最后一次设置的x轴拖动位置, 拖动松开后重置为0 */
    memoX: number;
    /** 记录最后一次设置的y轴拖动位置, 拖动松开后重置为0 */
    memoY: number;
  };
  /** 设置元素动画 */
  setSp: SetUpdateFn<any>;
  /** 进度条动画 */
  setPgSp: SetUpdateFn<any>;
  /** 额外的设置下拉指示器旋转角度动画(用于下拉已触发时的加载动画) */
  setPullDownSp: SetUpdateFn<any>;
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

  /** 启用下拉并在触发时通过回调通知, 根据Promise的解析结果决定成功或失败 */
  onPullDown?: () => Promise<void>;
  /** 自定义下拉指示器 */
  pullDownIndicator?: React.ReactNode;
  /** 完全替换下拉区域的内容 */
  pullDownNode?: React.ReactNode;
  /**
   * 启用上拉加载并在触发时通过回调通知
   * * 如果Promise resolve且返回了数字, 会以该数字发出一条数据加载条数通知
   * * 如果Promise reject, 会发出一个加载失败通知
   * * onPullUp有三种方式触发，组件初始化时(isRefresh为true)、 上拉到触发点时、调用triggerPullUp
   * */
  onPullUp?: (args: {
    /** 由组件内部触发(点击重试、triggerPullUp(true))等方式触发, 一般用于标记是否应该增加页码 */
    isRefresh?: boolean;
  }) => Promise<void>;
  /** 120 | 触发上拉加载的距离 */
  pullUpThreshold?: number;
  /** 传入此项时，会在数据加载失败时显示`重试`按钮, 并在点击后调用 */
  onRetry?: AnyFunction;

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

  /** 80 | 各方向到达顶部或底部后可拖动的最大距离(不包含rubber产生的额外拖动距离), 此距离也是下拉刷新的触发距离 */
  threshold?: number;
  /** 0.5 | 肥皂力，值越大则越顺滑, 拖动每px移动的距离也更大 */
  soap?: number;
  /** 40 | 触发橡皮筋效果的阈值, 会在 threshold 的 -rubber 位置开始逐渐减小soap, 并在拖动到+rubber位置时完全停止 */
  rubber?: number;
}
