import { iconMap, svgIconMap } from './iconMap';

import { ComponentBasePropsWithAny } from '../types/types';

export type IconTypes = keyof typeof iconMap;

export type SvgIconTypes = keyof typeof svgIconMap;

export interface IconProps extends ComponentBasePropsWithAny {
  /** icon类型 */
  type: IconTypes;
  /** 颜色 */
  color?: string;
  /** 大小通过字号跳转，与{ fontSize: number | string }等效 */
  size?: string | number;
  /** 是否添加旋转动画 */
  spin?: boolean;
}

export interface SvgIconProps extends ComponentBasePropsWithAny {
  /** icon类型 */
  type: SvgIconTypes;
  /** 大小通过字号调整，与{ fontSize: number | string }等效 */
  size?: string | number;
  /** 是否旋转图标 */
  spin?: boolean;
}
