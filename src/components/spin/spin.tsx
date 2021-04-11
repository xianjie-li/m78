import React from 'react';

import { WindmillIcon } from 'm78/icon';
import { useDelayDerivedToggleStatus } from 'm78/hooks';
import { Transition, config } from '@lxjx/react-transition-spring';

import cls from 'classnames';
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
      <WindmillIcon className="m78-spin_unit" />
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
