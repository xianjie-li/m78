import React from 'react';

import { useDelayDerivedToggleStatus } from 'm78/hooks';
import { Transition, config } from '@lxjx/react-transition-spring';

import cls from 'classnames';
import { SpinAnimeEnum, SpinProps } from './type';

const Spin: React.FC<SpinProps> = ({
  size,
  inline,
  text = '加载中',
  full,
  show = true,
  className,
  loadingDelay = 0,
  animeType = SpinAnimeEnum.default,
  ...props
}) => {
  const innerShow = useDelayDerivedToggleStatus(show, loadingDelay);

  return (
    <Transition
      toggle={innerShow}
      type="fade"
      mountOnEnter
      unmountOnExit
      {...props}
      config={config.stiff}
      className={cls(className, 'm78-spin', {
        [`__${size}`]: !!size,
        __inline: inline,
        __full: full,
      })}
    >
      <span className={cls('m78-spin_unit', `__anime${animeType}`)} />
      {text && (
        <span className="m78-spin_text">
          {text}
          <span className="m78-spin_ellipsis" />
        </span>
      )}
    </Transition>
  );
};

export default Spin;
