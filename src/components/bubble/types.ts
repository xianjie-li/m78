import React from 'react';
import { OverlayProps } from 'm78/overlay';

export enum BubbleTypeEnum {
  tooltip = 'tooltip',
  popper = 'popper',
  confirm = 'confirm',
}

export type BubbleTypeKeys = keyof typeof BubbleTypeEnum;

export type BubbleType = BubbleTypeKeys | BubbleTypeEnum;

/** 应从Overlay中移除的props */
export const omitBubbleOverlayProps = ['xy', 'alignment'] as const;

/** 应从Overlay中移除的props */
export type BubbleOmitOverlayKeys = typeof omitBubbleOverlayProps[number];

export type BubbleOmitOverlayProps = Omit<OverlayProps, BubbleOmitOverlayKeys>;

export interface BubbleProps extends BubbleOmitOverlayProps {
  /** BubbleTypeEnum.tooltip | 气泡类型 */
  type?: BubbleType;
  /** 标题, 仅在popper模式下生效 */
  title?: React.ReactNode;

  /* ###### confirm 特有配置 ###### */
  /** 确认 | 类型为confirm时，确认按钮的文字 */
  confirmText?: React.ReactNode;
  /** 取消 | 类型为confirm时，取消按钮的文字 */
  cancelText?: React.ReactNode;
  /** type为confirm时, 此选项用于设置图标 */
  icon?: React.ReactNode;

  /** 点击确认的回调 */
  onConfirm?(): void;
}
