import { OverlayProps } from 'm78/overlay';

/** 应从Overlay中移除的props */
export const omitContextMenuOverlayProps = [
  'xy',
  'alignment',
  'target',
  'childrenAsTarget',
] as const;

/** 应从Overlay中移除的props */
export type ContextMenuOmitOverlayKeys = typeof omitContextMenuOverlayProps[number];

export type ContextMenuOmitOverlayProps = Omit<OverlayProps, ContextMenuOmitOverlayKeys>;

/**
 * 移除了部分prop的OverlayProps, 并且以下默认值有变更:
 * - mountOnEnter/unmountOnExit 默认为true
 * - direction 默认为OverlayDirectionEnum.rightStart
 * - springProps 默认去除了动画, 可以通过 immediate: false 开启
 * - triggerType [UseTriggerTypeEnum.contextMenu]
 * */
export interface ContextMenuProps extends ContextMenuOmitOverlayProps {}
