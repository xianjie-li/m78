import React from 'react';
import cls from 'clsx';
import { ComponentBaseProps } from '@lxjx/utils';

interface CenterProps extends ComponentBaseProps {
  /** false | 为true时，将尺寸固定到与父元素一致(需要保证父元素position不是static), 为false时，需要通过className或style执行设置尺寸 */
  attach?: boolean;
  /** 需要居中的单个子元素 */
  children?: React.ReactElement | string;
}

const Center = ({ children, attach, className, style }: CenterProps) => {
  return (
    <div
      className={cls('m78 m78-center', className, style)}
      style={{ position: attach ? 'absolute' : undefined, ...style }}
    >
      {children}
    </div>
  );
};

export default Center;
