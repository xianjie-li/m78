import React from 'react';

import Mask from '@lxjx/flicker/lib/mask';
import Icon from '@lxjx/flicker/lib/icon';
import { If } from '@lxjx/flicker/lib/fork';
import { Transition } from '@lxjx/react-transition-spring';

import _capitalize from 'lodash/capitalize';
import cls from 'classnames';

import { DrawerProps } from './type';

const Drawer: React.FC<DrawerProps> = ({
  show = true,
  onClose,
  onRemove,
  hasCloseIcon = false,
  direction = 'bottom',
  fullScreen = false,
  inside = false,
  children,
  className,
  style,
  namespace,
  ...props
}) => {
  function close() {
    onClose && onClose();
  }

  function render() {
    return (
      <Mask namespace={namespace} show={show} onClose={close} onRemove={onRemove} portal={!inside} dark className={cls('fr-drawer_mask', { __inside: inside })}>
        <Transition
          {...props}
          className={cls(
            'fr-drawer',
            direction && !fullScreen && `__${direction}`,
            {
              '__full-screen': fullScreen,
              __inside: inside,
            },
            className,
          )}
          style={style}
          type={`slide${_capitalize(direction)}` as any}
          toggle={show}
          alpha={false}
          mountOnEnter
          reset
        >
          <If when={hasCloseIcon || fullScreen}>
            <Icon className="fr-drawer_close" type="error" onClick={close} />
          </If>
          {children}
        </Transition>
      </Mask>
    );
  }

  return render();
};

export default Drawer;
