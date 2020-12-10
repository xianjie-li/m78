import React from 'react';
import { Row, FlexWrapProps } from 'm78/layout';
import cls from 'classnames';

/**
 * 传入onClick时, 会附加点击反馈效果
 * */
interface TileProps extends Omit<React.PropsWithoutRef<JSX.IntrinsicElements['div']>, 'title'> {
  /** 主要内容 */
  title?: React.ReactNode;
  /** 次要内容 */
  desc?: React.ReactNode;
  /** 前导内容 */
  leading?: React.ReactNode;
  /** 尾随内容 */
  trailing?: React.ReactNode;
  /** 纵轴的对齐方式 */
  crossAlign?: FlexWrapProps['crossAlign'];
}

const Tile = ({ className, title, desc, leading, trailing, crossAlign, ...ppp }: TileProps) => {
  return (
    <Row {...ppp} className={cls('m78-tile', className)} crossAlign={crossAlign}>
      <div className="m78-tile_leading">{leading}</div>
      <div className="m78-tile_main">
        <div>{title}</div>
        <div>{desc}</div>
      </div>
      <div className="m78-tile_trailing">{trailing}</div>
    </Row>
  );
};

export default Tile;
