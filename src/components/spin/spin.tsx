import React from 'react';

import { WindmillIcon } from '@lxjx/fr/icon';
import { useDelayDerivedToggleStatus } from '@lxjx/fr/hooks';
import { Transition, config } from '@lxjx/react-transition-spring';

import cls from 'classnames';
import { SpinProps } from './type';

const Spin: React.FC<SpinProps> = ({
  size,
  inline,
  text = '加载中',
  full,
  dark,
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
      className={cls(className, 'fr-spin', {
        [`__${size}`]: !!size,
        __inline: inline,
        __full: full,
        __dark: dark,
      })}
    >
      <WindmillIcon className="fr-spin_unit" />
      {text && (
        <span className="fr-spin_text">
          {text}
          <span className="fr-spin_ellipsis" />
        </span>
      )}
    </Transition>
  );
};

export default Spin;
