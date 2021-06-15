import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { AnyObject, isTruthyOrZero } from '@lxjx/utils';
import { getField } from 'm78/table/common';
import { useSetState } from '@lxjx/hooks';
import { _TableColumnInside, TableColumn, TableColumnFixedEnum } from './types';

interface TableCellProps {
  /** 当前列 */
  column: _TableColumnInside;
  /** 当前记录, 为表头时可不传 */
  record?: AnyObject;
  /** 索引 */
  index: number;
  /** 是否是表头单元格 */
  isHead?: boolean;
  /** 表格节点 */
  tableElRef: React.MutableRefObject<HTMLTableElement>;
}

const _Cell = ({ column, isHead, record, index, tableElRef }: TableCellProps) => {
  const { width, maxWidth, fixed, label, fixedLeftLast, fixedRightFirst } = column;

  const elRef = useRef<HTMLTableDataCellElement>(null!);

  let child: any = label;

  if (!isHead) {
    const val = getField(record!, column.field);
    child = isTruthyOrZero(val) ? val : <div className="tc">-</div>;
  }

  useEffect(() => {
    if (column.fixed === TableColumnFixedEnum.left) {
      elRef.current.style.left = 'auto';
      const left = elRef.current.offsetLeft;
      elRef.current.style.left = `${left}px`;
    }

    if (column.fixed === TableColumnFixedEnum.right) {
      elRef.current.style.right = 'auto';
      const wrapBound = tableElRef.current.getBoundingClientRect();
      const elBound = elRef.current.getBoundingClientRect();

      const right = wrapBound.right - elBound.right;
      elRef.current.style.right = `${right}px`;
    }
  });

  return (
    <td
      ref={elRef}
      className={clsx({
        'm78-table_fixed': fixed,
      })}
    >
      <div
        className="m78-table_cell"
        style={{ maxWidth, width: !isTruthyOrZero(maxWidth) ? width : undefined }}
      >
        {child}
      </div>
      {fixedRightFirst && <div className="m78-table_fixed-shadow __left" />}
      {fixedLeftLast && <div className="m78-table_fixed-shadow __right" />}
    </td>
  );
};

_Cell.displayName = 'TableCell';

export default _Cell;
