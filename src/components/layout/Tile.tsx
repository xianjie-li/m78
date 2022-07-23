import React, { useMemo } from 'react';
import { Row } from 'm78/layout';
import cls from 'clsx';
import { TileProps } from './types';
import { isTruthyOrZero } from '@lxjx/utils';

const Tile = ({
  className,
  title,
  desc,
  leading,
  trailing,
  crossAlign,
  innerRef,
  overflowVisible,
  children,
  ...ppp
}: TileProps) => {
  const _title = useMemo(() => {
    if (isTruthyOrZero(title)) return title;
    return children;
  }, [title, children]);

  return (
    <Row
      {...ppp}
      innerRef={innerRef}
      className={cls('m78 m78-tile', className)}
      crossAlign={crossAlign}
    >
      {leading && <div className="m78-tile_leading">{leading}</div>}
      <div className="m78-tile_main" style={{ overflow: overflowVisible ? undefined : 'hidden' }}>
        {_title && <div className="m78-tile_title">{_title}</div>}
        {desc && <div className="m78-tile_desc">{desc}</div>}
      </div>
      {trailing && <div className="m78-tile_trailing">{trailing}</div>}
    </Row>
  );
};

export default Tile;
