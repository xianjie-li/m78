import React from 'react';

import Spin from '@lxjx/flicker/lib/spin';
import '@lxjx/flicker/lib/base';

import cls from 'classnames';

import { ButtonProps } from './type';

const sizeMap = {
  large: 18,
  small: 14,
  mini: 12,
};

const Button: React.FC<ButtonProps> = ({
  size,
  color,
  circle,
  outline,
  block,
  link,
  icon,
  disabled,
  loading,
  md,
  win,
  children,
  className,
  href,
  ...props
}) => {
  const classNames = cls(
    className,
    'fr-btn',
    'fr-effect',
    {
      [`__${color}`]: color,
      [`__${size}`]: size,
      __circle: circle,
      __outline: outline,
      __block: block,
      __link: link,
      __icon: icon,
      __md: md,
      __win: win,
      __light: !!color && !link && !icon, // 当是link/icon按钮时，可以直接使用对于颜色的波纹
      __disabled: disabled || loading,
    },
  );

  return (
    <button
      type="button"
      {...props}
      className={classNames}
      disabled={!!disabled || !!loading}
    >
      {/* eslint-disable-next-line jsx-a11y/anchor-has-content,jsx-a11y/control-has-associated-label */}
      {link && <a className="fr-btn__link" href={href} />}
      <Spin
        style={{ fontSize: size ? sizeMap[size] : 14 }}
        show={!!loading}
        full
        text=""
      />
      <span>{ children }</span>
    </button>
  );
};

export default Button;
