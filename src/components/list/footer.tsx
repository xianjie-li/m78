import React from 'react';
import { ComponentBasePropsWithAny } from '@lxjx/utils';

const Footer: React.FC<ComponentBasePropsWithAny> = ({ children, className, ...props }) => (
  <div className={`m78-list_main-footer ${className || ''}`} {...props}>
    {children}
  </div>
);

export default Footer;
