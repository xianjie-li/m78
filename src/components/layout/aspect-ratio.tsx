import React from 'react';
import cls from 'classnames';
import { ComponentBaseProps } from 'm78/types';

interface AspectRatioProps extends ComponentBaseProps {
  /** 1 | 网格项的宽高比 */
  ratio?: number;

  children?: React.ReactNode;
}

const AspectRatio = ({ ratio = 1, children, className, style }: AspectRatioProps) => {
  return (
    <div className={cls('m78-aspect-ratio', className)} style={style}>
      <div className="m78-aspect-ratio_scaffold" style={{ paddingTop: `${ratio * 100}%` }} />
      {children}
    </div>
  );
};

export default AspectRatio;
