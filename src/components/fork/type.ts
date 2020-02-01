import React from 'react';

export interface IfProps {
  /** 任何falsy\truthy值 */
  when?: any;
  /** 待切换的子元素 */
  children?: React.ReactNode;
}

export interface ToggleProps {
  /** 任何falsy\truthy值 */
  when?: any;
  /** 待切换的子元素 */
  children: React.ReactElement;
}

export interface SwitchProps {
  children: React.ReactElement[];
}
