import React from 'react';

import { useDelayToggle } from '@lxjx/hooks';
import { Transition } from 'm78/transition';

import cls from 'clsx';
import { SpinProps } from './type';

const Spin: React.FC<SpinProps> = ({
  size,
  inline,
  text = '加载中',
  full,
  show = true,
  className,
  loadingDelay = 0,
  ...props
}) => {
  const innerShow = useDelayToggle(show, loadingDelay);

  return (
    <Transition
      {...props}
      show={innerShow}
      type="fade"
      mountOnEnter
      unmountOnExit
      className={cls(className, 'm78 m78-spin', {
        [`__${size}`]: !!size,
        __inline: inline,
        __full: full,
      })}
    >
      <span className="m78-spin_unit-wrap">
        <span className="m78-spin_unit" />
        <span className="m78-spin_unit" />
        <span className="m78-spin_unit" />
        <span className="m78-spin_unit" />
      </span>
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
