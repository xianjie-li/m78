import React from 'react';

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
  ...props
}) => (
  <Transition
    toggle={show}
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
    {/* <div className="fr-spin_circle"> */}
    {/*  <span className="fr-spin_circle-item" /> */}
    {/*  <span className="fr-spin_circle-item" /> */}
    {/*  <span className="fr-spin_circle-item" /> */}
    {/*  <span className="fr-spin_circle-item" /> */}
    {/* </div> */}
    <svg
      className="spinner"
      // width="65px"
      // height="65px"
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="path"
        fill="none"
        strokeWidth="14"
        strokeLinecap="round"
        cx="60"
        cy="60"
        r="46"
      />
    </svg>
    {text && (
      <span className="fr-spin_text">
        {text}
        <span className="fr-spin_ellipsis" />
      </span>
    )}
  </Transition>
);

export default Spin;
