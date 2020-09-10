import React from 'react';
import { IfProps, ToggleProps, SwitchProps, ForkProps } from './type';
declare const Fork: React.FC<ForkProps>;
declare const If: React.FC<IfProps>;
/**
 * 显示或隐藏内容(!必须确保子只有一个子元素并且包含包裹元素（即不能为纯文本），用于挂载display: 'none')
 *  */
declare const Toggle: React.FC<ToggleProps>;
declare const Switch: React.FC<SwitchProps>;
export { If, Switch, Toggle };
export default Fork;
