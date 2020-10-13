import { Direction } from 'm78/util';
import React from 'react';
import { ComponentBaseProps } from '../types/types';

export interface ScrollerProps extends ComponentBaseProps {
  /** 启用下拉刷新并在触发时通过回调通知 */
  onPullDown?: () => void;
  /** 启用上拉加载并在触发时通过回调通知 */
  onPullUp?: () => void;
  /** 滚动时触发 */
  onScroll?: () => void;
  /** false | 是否显示滚动条 */
  hideScrollbar?: () => void;
  /** true | 在支持::-webkit-scrollbar且非移动端的情况下，使用其定制滚动条 */
  webkitScrollBar?: boolean;
  /** 是否显示返回顶部按钮 */
  backTop?: boolean;
  /** 提供整页滚动能力 */
  slide?: boolean;

  /** 方向 */
  direction?: Direction;
  /** 滚动容器下额外的内容 */
  extraNode?: React.ReactNode;
  /** 虚拟滚动 */
  /** 定制上下拉标识器 */
  /** 滚轮增强 */
  /** 无限滚动 */

  /** 显示滚动进度条(可滚动区域大于), 为number时当可滚动区域大于此值时才出现progressBar, 若传入true，滚动区域大于500时出现进度条 */
  progressBar?: boolean | number;
  /** 对应方向包含可滚动区域时显示可滚动阴影标识 */
  scrollFlag?: boolean;

  /** 80 | 各方向到达顶部或底部后可拖动的最大距离(不包含rubber产生的额外拖动距离) */
  threshold?: boolean;
  /** 0.5 | 肥皂力，值越大则越顺滑, 拖动每px移动的距离也更大 */
  soap?: number;
  /** 40 | 触发橡皮筋效果的阈值, 会在 threshold 的 -rubber 位置开始逐渐减小soap, 并在拖动到+rubber位置时完全停止 */
  rubber?: number;
}
