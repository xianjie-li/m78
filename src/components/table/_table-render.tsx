import React from 'react';
import clsx from 'clsx';
import { _Context, _TableColumnInside, TableColumnFixed } from './_types';
import { renderColgroup, renderTbody, renderTfoot, renderThead } from './_renders';

interface Props {
  type?: TableColumnFixed;
  isMain?: boolean;
  column: _TableColumnInside[];
  ctx: _Context;
  innerRef?: React.MutableRefObject<HTMLTableElement>;
}

const _TableRender = ({ type, innerRef, ctx, column, isMain }: Props) => {
  return (
    <div className={clsx('m78-table_main', type && `__${type}`)}>
      <table
        ref={innerRef}
        className={isMain ? undefined : clsx('m78-table_fixed-table', type && `__${type}`)}
      >
        {renderColgroup(ctx, column, isMain)}
        {renderThead(ctx, column)}
        {renderTbody(ctx, column, isMain)}
        {renderTfoot(ctx, column)}
      </table>
    </div>
  );
};

export default _TableRender;
