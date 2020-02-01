import React from 'react';

import { Transition, config } from '@lxjx/react-transition-spring';

import { SpinProps } from './type';

import cls from 'classnames';

const Spin: React.FC<SpinProps> = ({
  size,
  inline,
  text = '加载中',
  full,
  dark,
  show = true,
  className,
  ...props
}) => {
  return (
    <Transition
      toggle={show}
      type="fade"
      mountOnEnter
      unmountOnExit
      {...props}
      config={config.stiff}
      className={cls(
        className,
        'fr-spin',
        {
          [`__${size}`]: !!size,
          __inline: inline,
          __full: full,
          __dark: dark,
        },
      )}
    >
      <div className="fr-spin_circle">
        <span className="fr-spin_circle-item" />
        <span className="fr-spin_circle-item" />
        <span className="fr-spin_circle-item" />
        <span className="fr-spin_circle-item" />
      </div>
      {text && <span className="fr-spin_text">{text}<span className="fr-spin_ellipsis" /></span>}
    </Transition>
  );
};

export default Spin;
