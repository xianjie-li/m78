import React from 'react';

export interface InputProps extends Omit<React.PropsWithoutRef<JSX.IntrinsicElements['input']>, 'size'> {
  /** 图标和文字的尺寸 */
  size?: 'small' | 'large';
  /** 按下回车的回调，会自动失去焦点 */
  onPressEnter?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
