import React from 'react';
import { Row } from 'm78/layout';
import cls from 'classnames';
import { TileProps } from './types';

const Tile = ({ className, title, desc, leading, trailing, crossAlign, ...ppp }: TileProps) => {
  return (
    <Row {...ppp} className={cls('m78-tile', className)} crossAlign={crossAlign}>
      {leading && <div className="m78-tile_leading">{leading}</div>}
      <div className="m78-tile_main">
        {title && <div className="m78-tile_title">{title}</div>}
        {desc && <div className="m78-tile_desc">{desc}</div>}
      </div>
      {trailing && <div className="m78-tile_trailing">{trailing}</div>}
    </Row>
  );
};

export default Tile;
