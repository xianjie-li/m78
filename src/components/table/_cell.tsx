import React, { useEffect, useMemo, useRef } from 'react';
import clsx from 'clsx';
import { AnyObject, decimalPrecision, isFunction, isNumber, isTruthyOrZero } from '@lxjx/utils';
import { getField } from 'm78/table/common';
import { useSetState } from '@lxjx/hooks';
import { CaretRightOutlined } from 'm78/icon';
import { _Share, _TableColumnInside, TableMeta, TableColumnFixedEnum } from './types';

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
  /** 是否是表尾单元格 */
  isFoot?: boolean;
  /** 表格节点 */
  tableElRef: React.MutableRefObject<HTMLTableElement>;
  /** 共享数据 */
  share: _Share;
  /** 自行指定单元格内容 */
  content?: React.ReactNode;
  /** 单元格前置节点 */
  prefix?: React.ReactNode;
}

const _Cell = ({
  column,
  isHead = false,
  isFoot = false,
  record,
  share,
  colIndex,
  rowIndex,
  tableElRef,
  content,
  prefix,
}: TableCellProps) => {
  const { state, self, props } = share;
  const { fallback, summary } = props;
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

  const isBody = !isFoot && !isHead;

  const meta: TableMeta = { column, record, colIndex, rowIndex, isFoot, isHead, isBody };

  const [rowSpan, colSpan] = useMemo(() => {
    if (isHead) return [];
    const rowSpanGetter = props.rowSpan;
    const colSpanGetter = props.colSpan;
    // 页脚不需要行合并
    return [isFoot ? undefined : rowSpanGetter?.(meta), colSpanGetter?.(meta)];
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
        self.fixedSizeMap[colIndex] = decimalPrecision(elBound.left - wrapBound.left, 2);
      }

      if (isFixedRight) {
        self.fixedSizeMap[colIndex] = decimalPrecision(wrapBound.right - elBound.right, 2);
      }
    }

    const v = `${self.fixedSizeMap[colIndex]}px`;

    if (isFixedLeft && elRef.current.style.left !== v) {
      elRef.current.style.left = `${self.fixedSizeMap[colIndex]}px`;
    }

    if (isFixedRight && elRef.current.style.right !== v) {
      elRef.current.style.right = `${self.fixedSizeMap[colIndex]}px`;
    }
  }, [record, column, colIndex, rowIndex]);

  /** 单元格显示内容 */
  function renderChild() {
    if (isTruthyOrZero(content)) return content;

    if (isHead) return label;

    if (isFoot) {
      if (!isFunction(summary)) return getFallback();
      const s = summary(meta);
      return isTruthyOrZero(s) ? s : getFallback();
    }

    if (render) return render(meta);

    const val = getField(record, column.field);

    if (isTruthyOrZero(val)) return val;

    return getFallback();
  }

  function getFallback() {
    if (fallback !== undefined) {
      if (isFunction(fallback)) return fallback(meta);
      return fallback;
    }

    return <div className="plr-12">-</div>;
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
    if ((isHead && extra) || prefix) {
      const ex = isFunction(extra) ? extra(meta) : extra;

      return (
        <div className="m78-table_cell-wrap">
          {prefix}
          {renderCellBox()}
          {ex && <div className="ml-4">{isFunction(extra) ? extra(meta) : extra}</div>}
        </div>
      );
    }

    return renderCellBox();
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

export default React.memo(_Cell);
