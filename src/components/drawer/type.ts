import { OverlayProps } from 'm78/overlay';
import { Position } from 'm78/common';
import React from 'react';

/** 应从Overlay中移除的props */
export const omitDrawerOverlayProps = [
  'xy',
  'alignment',
  'target',
  'childrenAsTarget',
  'offset',
  'direction',
  'arrow',
  'arrowSize',
  'arrowProps',
  'transitionType',
] as const;

/** 应从Overlay中移除的props */
export type DrawerOmitOverlayKeys = typeof omitDrawerOverlayProps[number];

export type DrawerOmitOverlayProps = Omit<OverlayProps, DrawerOmitOverlayKeys>;

export interface DrawerProps extends DrawerOmitOverlayProps {
  /** 'bottom' | 出现位置 */
  position?: Position;
  /** 头部内容, 头部区域会固定在最顶部 */
  header?: React.ReactNode;
}
