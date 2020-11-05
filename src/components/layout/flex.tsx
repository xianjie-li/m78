import React from 'react';
import cls from 'classnames';
import { ComponentBasePropsWithAny } from 'm78/types';

interface FlexWrapProps extends ComponentBasePropsWithAny {
  /** 'start' | 主轴对齐方式 */
  mainAlign?: 'center' | 'start' | 'end' | 'around' | 'between' | 'evenly';
  /** 'stretch' | 交叉轴对齐方式 */
  crossAlign?: 'stretch' | 'start' | 'end' | 'center';
  /** 内容 */
  children: React.ReactNode;
}

interface FlexProps extends ComponentBasePropsWithAny {
  /** 1 | 弹性系数 */
  flex?: number | string;
  /** 排序 */
  order?: number;
  /** 单独设置在容器交叉轴上的对齐方式  */
  align?: FlexWrapProps['crossAlign'];
  /** 内容 */
  children?: React.ReactNode;
}

function getClasses(
  mainAlign?: FlexWrapProps['mainAlign'],
  crossAlign?: FlexWrapProps['crossAlign'],
) {
  const styObj: any = {};

  if (mainAlign) {
    styObj[`m78-main-${mainAlign}`] = true;
  }

  if (crossAlign) {
    styObj[`m78-cross-${crossAlign}`] = true;
  }

  return styObj;
}

const Column = ({ children, style, className, mainAlign, crossAlign, ...ppp }: FlexWrapProps) => {
  return (
    <div
      {...ppp}
      className={cls('m78-column', className, getClasses(mainAlign, crossAlign))}
      style={style}
    >
      {children}
    </div>
  );
};

const Row = ({ children, style, className, mainAlign, crossAlign, ...ppp }: FlexWrapProps) => {
  return (
    <div
      {...ppp}
      className={cls('m78-row', className, getClasses(mainAlign, crossAlign))}
      style={style}
    >
      {children}
    </div>
  );
};

const Flex = ({ flex = 1, children, order, style, className, align, ...ppp }: FlexProps) => {
  return (
    <div
      {...ppp}
      className={cls(className, align && `m78-self-${align}`)}
      style={{ flex, order, ...style }}
    >
      {children}
    </div>
  );
};

export { Column, Row, Flex };
