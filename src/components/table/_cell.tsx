import React, { useMemo, useRef } from 'react';
import clsx from 'clsx';
import { getCellProps, getCellSpan } from './_functions';
import { renderCellFork } from './_renders';
import CellEffectBg from './_cell-effect-bg';
import { _TableCellProps, TableMeta } from './_types';

const _Cell = (props: _TableCellProps) => {
  const {
    column,
    isHead = false,
    isFoot = false,
    record,
    treeNode,
    ctx,
    colIndex,
    rowIndex,
  } = props;

  const { fixed, sort } = column;

  // 单元格容器节点
  const elRef = useRef<HTMLTableDataCellElement>(null!);

  // 是否为表格体
  const isBody = !isFoot && !isHead;

  // 表示当前列的meta
  const meta: TableMeta = {
    ctx: ctx.props.ctx,
    column,
    record,
    treeNode,
    colIndex,
    rowIndex,
    isFoot,
    isHead,
    isBody,
  };

  // 单元格的合并数
  const [rowSpan, colSpan] = useMemo(() => getCellSpan(ctx, meta), [
    record,
    column,
    colIndex,
    rowIndex,
  ]);

  // 要为单元格设置的额外props
  const cellProps = useMemo(() => getCellProps(ctx, meta), [column.props, ctx.props.props]);

  return (
    <td
      {...cellProps}
      ref={elRef}
      className={clsx(cellProps?.className, {
        'm78-table_fixed': fixed,
        __effect: sort,
      })}
      style={{
        ...cellProps?.style,
        display: rowSpan === 0 || colSpan === 0 ? 'none' : undefined,
      }}
      rowSpan={rowSpan}
      colSpan={colSpan}
    >
      {renderCellFork(ctx, meta, props)}
      {isBody && <CellEffectBg ctx={ctx} rowInd={rowIndex} />}
    </td>
  );
};

_Cell.displayName = 'TableCell';

export default React.memo(_Cell, (prev, next) => {
  return (
    prev.column === next.column &&
    prev.record === next.record &&
    prev.treeNode === next.treeNode &&
    prev.colIndex === next.colIndex &&
    prev.rowIndex === next.rowIndex &&
    prev.isHead === next.isHead &&
    prev.isFoot === next.isFoot &&
    prev.prefix === next.prefix
  );
});
