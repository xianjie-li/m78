import React from 'react';

import cls from 'clsx';
import { isArray } from '@lxjx/utils';
import { AspectRatio } from 'm78/layout';
import { ComponentBaseProps } from 'm78/types';

interface GridProps extends ComponentBaseProps {
  /** 子元素, 必须是一组可以挂在className和style的元素 */
  children: React.ReactElement | React.ReactElement[];
  /** 总列数 */
  count?: number;
  /** 1 | 网格项的宽高比 */
  aspectRatio?: number;
  /** 网格项的高度, 与aspectRatio选用一种 */
  size?: number;
  /** 网格项间的间距, 优先级小于单独设置的 */
  spacing?: number;
  /** 主轴间距 */
  mainSpacing?: number;
  /** 交叉轴间距 */
  crossSpacing?: number;
  /** true | 是否启用边框 */
  border?: boolean;
  /** 框颜色 */
  borderColor?: string;
  /** true | 当最后一行不能填满时，是否以空项占位 */
  complete?: boolean;
  /** 表格项的类名 */
  contClassName?: string;
  /** 表格项的样式 */
  contStyle?: React.CSSProperties;
}

const defaultProps = {
  count: 3,
  children: [] as React.ReactElement[],
  aspectRatio: 1,
  border: true,
  // borderColor: 'rgba(0, 0, 0, 0.15)',
};

const Grid = (props: GridProps & typeof defaultProps) => {
  const {
    count,
    children,
    crossSpacing: cSpacing,
    mainSpacing: mSpacing,
    spacing,
    size,
    aspectRatio,
    complete = true,
    border,
    borderColor,
    className,
    style,
    contClassName,
    contStyle,
  } = props;
  const child: React.ReactElement[] = isArray(children) ? [...children] : [children];
  const originalChild = [...child];

  const crossSpacing = cSpacing || spacing;
  const mainSpacing = mSpacing || spacing;

  const spare = originalChild.length % count;

  const width = 100 / count;

  if (complete && spare !== 0 && count - spare > 0) {
    for (let i = 0; i < count - spare; i++) {
      child.push(<div />);
    }
  }

  return (
    <div className={cls('m78-grid', className)} style={style}>
      {child.map((item, index) => {
        const realIndex = index + 1;
        // 每行最后一个
        const isLast = realIndex % count === 0;
        // 每行第一个
        const isFirst = (realIndex - 1) % count === 0;
        // 第一行
        const firstLine = index < count;
        // 最后一行
        const lastLine = originalChild.length - realIndex < (spare || count);
        // 需要添加主轴space的项
        const hasMainSpace = mainSpacing && !isLast;
        // 除最后一项外主轴每项的间距
        const mainSpace = mainSpacing ? ((count - 1) * mainSpacing) / count : 0;

        return React.createElement(
          size ? 'div' : AspectRatio,
          {
            ratio: aspectRatio,
            key: index,
            style: {
              color: borderColor,
              border: border ? undefined : 'none',
              width: mainSpacing ? `calc(${width}% - ${mainSpace}px)` : `${width}%`,
              height: size || undefined,
              marginBottom: !lastLine && crossSpacing ? crossSpacing : undefined,
              marginRight: hasMainSpace ? mainSpacing : undefined,
            },
            className: cls('m78-grid_item', {
              __topBorder: border && (firstLine || crossSpacing),
              __leftBorder: border && (isFirst || mainSpacing),
            }),
          },
          <div className={cls('m78-grid_cont', contClassName)} style={contStyle}>
            {item}
          </div>,
        );
      })}
    </div>
  );
};

Grid.defaultProps = defaultProps;

export default Grid;
