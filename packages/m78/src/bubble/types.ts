import React from "react";
import { OverlayProps } from "../overlay/index.js";
import { StatusUnion } from "../common/index.js";

export enum BubbleType {
  /** 简单的文本提示 */
  tooltip = "tooltip",
  /** 展示一些稍微复杂内容 */
  popper = "popper",
  /** 进行快捷询问 */
  confirm = "confirm",
}

export type BubbleTypeKeys = keyof typeof BubbleType;

export type BubbleTypeUnion = BubbleTypeKeys | BubbleType;

/** 应从Overlay中移除的props */
export const omitBubbleOverlayProps = ["xy", "alignment"] as const;

/** 应从Overlay中移除的props */
export type BubbleOmitOverlayKeys = typeof omitBubbleOverlayProps[number];

export type BubbleOmitOverlayProps = Omit<OverlayProps, BubbleOmitOverlayKeys>;

export interface BubbleProps extends BubbleOmitOverlayProps {
  /** BubbleType.tooltip | 气泡类型 */
  type?: BubbleTypeUnion;
  /** 标题, 仅在popper模式下生效 */
  title?: React.ReactNode;
  /** 快捷的设置状态图标 */
  status?: StatusUnion;
  /** 手动指定图标, 会替换掉status配置 */
  icon?: React.ReactNode;

  /* ###### confirm 特有配置 ###### */
  /** 确认 | 类型为confirm时，确认按钮的文字 */
  confirmText?: React.ReactNode;
  /** 取消 | 类型为confirm时，取消按钮的文字 */
  cancelText?: React.ReactNode;
  /** 点击确认的回调 */
  onConfirm?(): void;
}
