import React from 'react';
import { OverlayProps } from 'm78/overlay';

/**
 * # 气泡相比overlay应该多处理哪些东西?
 * 1. 自动定位, 环境处理(滚动, resize等), 防遮挡
 * */

enum BubbleTypeEnum {
  tooltip = 'tooltip',
  popper = 'popper',
  confirm = 'confirm',
}

type BubbleTypeKeys = keyof typeof BubbleTypeEnum;

/** 气泡类型 */
type BubbleType = BubbleTypeKeys | BubbleTypeEnum;

interface BubbleProps {
  children?: OverlayProps['target'];
  /** BubbleTypeEnum.tooltip | 气泡框类型 */
  type?: BubbleType;
  /** 禁用 */
  disabled?: boolean;
  /** 定制气泡样式 */
  customer?: any;

  // ######## popper ########
  /** 标题 */
  title?: React.ReactNode;

  // ######### confirm ########
  // 为confirm类型时, 会扩展onClose
  /** 确认 | 类型为confirm时，确认按钮的文字 */
  confirmText?: React.ReactNode;
  /** 取消 | 类型为confirm时，取消按钮的文字 */
  cancelText?: React.ReactNode;
  /** 设置confirm提示图标 */
  icon?: React.ReactNode;
}
