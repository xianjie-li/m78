import React from 'react';
import { OverlayProps } from 'm78/overlay';

/**
 * api用法或类型为tooltip/confirm时, mountOnEnter/unmountOnExit均为true
 * 其他情况使用overlay的默认配置: mountOnEnter: true,  unmountOnExit: false
 *
 * # overlay
 * 核心功能均通过[m78/overlay](/docs/feedback/overlay#bubble)实现, 此组件仅是对气泡易用性的封装, 更多特性请查阅其文档
 *
 * ## 类型
 * 内置了三种显示样式:
 * - tooltip 简单的文本提示
 * - popper 展示一段复杂内容
 * - confirm 进行快捷询问
 *
 * ## 通过api实现单例
 * 组件通过[@m78/renderApi](/docs/ecology/render-api)实现了api用法, 可以借此来实现单例气泡, 如果需要同时渲染大量气泡(比如虚拟列表中), 建议使用
 *
 *
 * */

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
