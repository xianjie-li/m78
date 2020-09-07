import React from 'react';

import cls from 'classnames';

interface GridProps {
  count: number;
  size: number;
  children: React.ReactElement[];
  crossSpacing?: number;
  mainSpacing?: number;
  aspectRatio?: number;
  borderColor?: string;
  /** 当最后一行不能填满时，是否以空项占位 */
  complete?: boolean;
}

const defaultProps = {
  count: 3,
  children: [],
};

const Grid = (props: GridProps & typeof defaultProps) => {
  const { count, children, crossSpacing = 4, mainSpacing = 4, size = 150 } = props;

  const width = 100 / count;

  const spare = children.length % count;

  console.log(children);

  return (
    <div className="m78-grid">
      {children.map((item, index) => {
        const realIndex = index + 1;
        // 每行最后一个
        const isLast = realIndex % count === 0;
        // 每行第一个
        const isFirst = (realIndex + 1) % count === 0;
        // 第一行
        const firstLine = index < count;
        // 最后一行
        const lastLine = children.length - realIndex < spare;
        // 需要添加主轴space的项
        const hasMainSpace = mainSpacing && !isLast;
        // 除最后一项外主轴每项的间距
        const mainSpace = (count * mainSpacing) / (count - 1);

        return (
          <div
            key={index}
            style={{ width: `${100 / count}%`, height: size }}
            className={cls('m78-grid_item', {
              __rowLast: isLast,
              __lastLine: lastLine,
              // __fullBorder: !firstLine && crossSpacing,
              // __leftBorder:
            })}
          >
            <div className="m78-grid_item-inner">{item}</div>
          </div>
        );
      })}
    </div>
  );
};

Grid.defaultProps = defaultProps;

export default Grid;
