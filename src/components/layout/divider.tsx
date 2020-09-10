import React from 'react';
import cls from 'classnames';
import { ComponentBaseProps } from '../types/types';

interface DividerProps extends ComponentBaseProps {
  /** false | 设置为垂直分割线 */
  vertical?: boolean;
  /** 100%(横向) / 0.5(纵向) | 分割线尺寸 */
  width?: number;
  /** 0.5(横向) / 1.2em(纵向) | 分割线尺寸 */
  height?: number;
  /** 颜色 */
  color?: string;
  /** 12 | 间距 */
  margin?: number;
}

const Divider = ({ vertical, width, height, color, margin = 12 }: DividerProps) => {
  const marginStr = vertical ? `0 ${margin}px` : `${margin}px 0`;

  return (
    <div
      className={cls('m78-divider', vertical && '__vertical')}
      style={{ width, height, backgroundColor: color, margin: margin ? marginStr : undefined }}
    />
  );
};

export default Divider;
