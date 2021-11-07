import { AnyObject, isArray, isBoolean, isFunction, isString } from '@lxjx/utils';
import { throwError } from 'm78/util';
import { SetState, UseScrollMeta } from '@lxjx/hooks';
import React from 'react';
import { SizeEnum } from 'm78/types';
import { stringifyArrayField } from './_common';
import {
  _Context,
  _InnerState,
  _TableColumnInside,
  TableColumn,
  TableColumnFixedEnum,
  TableMeta,
  TableProps,
  TableSortEnum,
} from './_types';

/**
 * ################################
 * 表格
 * ################################
 * */

/** 根据列配置获取其key，取值顺序为 column.key > column.field(如果是字符类型) > undefined */
export function getColumnKey(column: TableColumn) {
  let key = column.key;

  if (!key && isString(column.field)) {
    key = column.field;
  }

  if (!key && isArray(column.field)) {
    const k = stringifyArrayField(column.field);
    if (k) key = k;
  }
  return key;
}

/** 获取对象中的指定字段，字段支持传入键数组，支持索引 */
export function getField(obj: AnyObject, field?: string | string[]) {
  if (isString(field)) {
    return obj?.[field];
  }

  if (isArray(field) && field.length) {
    return field.reduce((p, i) => {
      return p?.[i];
    }, obj);
  }
}

/** 获取尺寸 */
export function getSizeNumber(size?: SizeEnum) {
  const sizeMap = {
    small: 32,
    large: 48,
    def: 42,
  };
  return sizeMap[size!] || sizeMap.def;
}

/** 获取一个只包含初始值的tableMeta, 可以传入指定对象覆盖默认值 */
export function getInitTableMeta(ctx: _Context, overObj?: Partial<TableMeta>): TableMeta {
  return {
    column: {} as any, // 表示一个不存在的列
    record: {} as any,
    treeNode: {} as any,
    colIndex: 0,
    rowIndex: 0,
    isBody: false,
    isFoot: false,
    isHead: false,
    ctx: ctx.props.ctx,
    ...overObj,
  };
}

/** 同步滚动状态到touchLeft，touchRight状态 */
export function syncTouchStatus(
  state: _InnerState,
  setState: SetState<_InnerState>,
  meta: UseScrollMeta,
) {
  if (meta.touchLeft !== state.touchLeft || meta.touchRight !== state.touchRight) {
    setState({
      touchRight: meta.touchRight,
      touchLeft: meta.touchLeft,
    });
  }
}

/**
 * 接收props.columns并进行预处理
 * - 转换为_TableColumnInside
 * - 处理fixed列
 * */
export function columnsBeforeFormat({ columns, showColumns }: TableProps) {
  const fixedLeft: _TableColumnInside[] = [];
  const column: _TableColumnInside[] = [];
  const fixedRight: _TableColumnInside[] = [];

  columns.forEach((col, index) => {
    // 过滤不显示的列
    if (showColumns?.length) {
      const key = getColumnKey(col);
      if (key && !showColumns.includes(key)) {
        return;
      }
    }

    if (col.fixed === TableColumnFixedEnum.left) {
      fixedLeft.push({ ...col, index });
      return;
    }

    if (col.fixed === TableColumnFixedEnum.right) {
      fixedRight.push({ ...col, index });
      return;
    }
    column.push({ ...col, index });
  });

  return {
    fixedLeft,
    column,
    fixedRight,
  };
}

/**
 * ################################
 * 单元格
 * ################################
 * */

/** 获取要为单元格设置的props */
export function getCellProps(ctx: _Context, meta: TableMeta) {
  const {
    props: { props: _cellProps },
  } = ctx;
  const _colProps = meta.column.props;

  const sty: any = {};
  if (isFunction(_cellProps)) Object.assign(sty, _cellProps(meta));
  else if (_cellProps) Object.assign(sty, _cellProps);

  if (isFunction(_colProps)) Object.assign(sty, _colProps(meta));
  else if (_colProps) Object.assign(sty, _colProps);

  return sty;
}

/** 获取单元格的合并数 */
export function getCellSpan(ctx: _Context, meta: TableMeta) {
  if (meta.isHead) return [];
  const rowSpanGetter = ctx.props.rowSpan;
  const colSpanGetter = ctx.props.colSpan;
  // 页脚不需要行合并
  return [meta.isFoot ? undefined : rowSpanGetter?.(meta), colSpanGetter?.(meta)];
}

/** 点击列进行排序的处理函数 */
export function handleSortClick(ctx: _Context, column: TableColumn, key?: string) {
  const {
    states: { sortState },
  } = ctx;

  if (!key) {
    throwError('Column identity key was not get', 'Table');
  }

  const [sortValue, setSort] = sortState;
  const [sortKey, sortType] = sortValue || [];

  let nextType = TableSortEnum.asc;

  // 排序类型为boolean值，取反，上一个排序key与当前key不符时设置默认值
  if (isBoolean(column.sort)) {
    if (sortKey === key) {
      if (sortType === TableSortEnum.asc) nextType = TableSortEnum.desc;
      else nextType = TableSortEnum.asc;
    }
    setSort([key, nextType]);
  }

  // 排序类型为指定类型，在无和该类型间切换
  if (isString(column.sort)) {
    setSort(sortType && key === sortKey ? [] : [key, column.sort]);
  }
}

/** 处理行交互事件并派发通知 */
export function handleRowHover(
  ctx: _Context,
  rowInd: number,
  e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
) {
  const ev = ctx.states.updateBgEvent;

  if (e.type === 'mouseenter') {
    ev.emit(rowInd, true);
  }

  if (e.type === 'mouseleave') {
    ev.emit(rowInd, false);
  }
}
