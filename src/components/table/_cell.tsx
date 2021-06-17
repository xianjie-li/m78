import React, { useEffect, useMemo, useRef } from 'react';
import clsx from 'clsx';
import { AnyObject, isFunction, isNumber, isTruthyOrZero } from '@lxjx/utils';
import { getField } from 'm78/table/common';
import { useSetState } from '@lxjx/hooks';
import { _Share, _TableColumnInside, TableCellMeta, TableColumnFixedEnum } from './types';

interface TableCellProps {
  /** 当前列 */
  column: _TableColumnInside;
  /** 当前记录, 为表头时可不传 */
  record: AnyObject;
  /** 列索引 */
  colIndex: number;
  /** 行索引 */
  rowIndex: number;
  /** 是否是表头单元格 */
  isHead?: boolean;
  /** 表格节点 */
  tableElRef: React.MutableRefObject<HTMLTableElement>;
  share: _Share;
}

const _Cell = ({
  column,
  isHead,
  record,
  share,
  colIndex,
  rowIndex,
  tableElRef,
}: TableCellProps) => {
  const { state, self, props } = share;
  const { fallback } = props;
  const {
    width,
    maxWidth,
    fixed,
    label,
    render,
    fixedLeftLast,
    fixedRightFirst,
    props: _cellProps,
    extra,
  } = column;

  const fixedMeta = state.fixedMetas[colIndex];

  const elRef = useRef<HTMLTableDataCellElement>(null!);

  const meta: TableCellMeta = { column, record, colIndex, rowIndex };

  const [rowSpan, colSpan] = useMemo(() => {
    if (isHead) return [];
    const rowSpanGetter = props.rowSpan;
    const colSpanGetter = props.colSpan;
    return [rowSpanGetter?.(meta), colSpanGetter?.(meta)];
  }, [record, column, colIndex, rowIndex]);

  const cellProps = useMemo(() => {
    if (isFunction(_cellProps)) return _cellProps(meta);
    return _cellProps;
  }, [_cellProps]);

  /* TODO: 大小改变时重置 */
  useEffect(() => {
    const isFixedLeft = column.fixed === TableColumnFixedEnum.left;
    const isFixedRight = column.fixed === TableColumnFixedEnum.right;

    if (!isFixedLeft && !isFixedRight) return;

    const currentSize = self.fixedSizeMap[colIndex];

    if (!isNumber(currentSize)) {
      if (isFixedLeft) {
        elRef.current.style.left = 'auto';
      }
      if (isFixedRight) {
        elRef.current.style.right = 'auto';
      }

      const wrapBound = tableElRef.current.getBoundingClientRect();
      const elBound = elRef.current.getBoundingClientRect();

      if (isFixedLeft) {
        self.fixedSizeMap[colIndex] = elBound.left - wrapBound.left;
      }

      if (isFixedRight) {
        self.fixedSizeMap[colIndex] = wrapBound.right - elBound.right;
      }
    }

    const v = `${self.fixedSizeMap[colIndex]}px`;

    if (isFixedLeft && elRef.current.style.left !== v) {
      elRef.current.style.left = `${self.fixedSizeMap[colIndex]}px`;
    }

    if (isFixedRight && elRef.current.style.right !== v) {
      elRef.current.style.right = `${self.fixedSizeMap[colIndex]}px`;
    }
  }, [column, record, colIndex, rowIndex]);

  /** 单元格显示内容 */
  function renderChild() {
    if (isHead) return label;
    if (render) return render(meta);

    const val = getField(record, column.field);

    if (isTruthyOrZero(val)) return val;

    if (fallback !== undefined) {
      if (isFunction(fallback)) return fallback(meta);
      return fallback;
    }

    return <div className="tc">-</div>;
  }

  /** 内容 */
  function renderCellBox() {
    let mw = props.cellMaxWidth;

    // width和maxWidth任意项有值则覆盖cellMaxWidth
    if (width) mw = maxWidth;

    return (
      <div
        className="m78-table_cell"
        style={{ maxWidth: mw, width: !isTruthyOrZero(maxWidth) ? width : undefined }}
      >
        {renderChild()}
      </div>
    );
  }

  function renderFork() {
    if (!extra || !isHead) return renderCellBox();

    return (
      <div className="m78-table_cell-wrap">
        {renderCellBox()}
        <div className="ml-4">{isFunction(extra) ? extra(meta) : extra}</div>
      </div>
    );
  }

  return (
    <td
      {...cellProps}
      ref={elRef}
      className={clsx(cellProps?.className, {
        'm78-table_fixed': fixed,
      })}
      style={{
        ...cellProps?.style,
        left: column.fixed === TableColumnFixedEnum.left ? fixedMeta?.left : undefined,
        right: column.fixed === TableColumnFixedEnum.right ? fixedMeta?.right : undefined,
        display: rowSpan === 0 || colSpan === 0 ? 'none' : undefined,
      }}
      rowSpan={rowSpan}
      colSpan={colSpan}
    >
      {renderFork()}
      {fixedRightFirst && <div className="m78-table_fixed-shadow __left" />}
      {fixedLeftLast && <div className="m78-table_fixed-shadow __right" />}
    </td>
  );
};

_Cell.displayName = 'TableCell';

export default _Cell;
