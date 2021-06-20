import {
  AnyObject,
  decimalPrecision,
  isArray,
  isBoolean,
  isFunction,
  isNumber,
  isString,
  isTruthyOrZero,
} from '@lxjx/utils';
import { throwError } from 'm78/util';
import { SetState, UseScrollMeta } from '@lxjx/hooks';
import React from 'react';
import {
  _Context,
  _InnerState,
  _TableColumnInside,
  TableColumn,
  TableColumnFixedEnum,
  TableMeta,
  TableProps,
  TableSortEnum,
} from './types';

/**
 * ################################
 * 表格
 * ################################
 * */

/** 获取对象中的默认主键 id => key */
export function getPrimaryKey(obj: AnyObject) {
  const key = obj.id || obj.key;

  if (!isTruthyOrZero(key)) {
    throwError(
      'Get default PrimaryKey(id/key) failed, please manual set <Table primaryKey="<FieldName>" />',
      'Table',
    );
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

/** 获取一个只包含初始值的tableMeta, 可以传入指定对象覆盖默认值 */
export function getInitTableMeta(overObj?: Partial<TableMeta>): TableMeta {
  return {
    column: { label: '' }, // 表示一个不存在的列
    record: {},
    colIndex: 0,
    rowIndex: 0,
    isBody: false,
    isFoot: false,
    isHead: false,
    ctx: {},
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
export function columnsBeforeFormat({ columns }: TableProps) {
  const fixedLeft: _TableColumnInside[] = [];
  const column: _TableColumnInside[] = [];
  const fixedRight: _TableColumnInside[] = [];

  columns.forEach(col => {
    if (col.fixed === TableColumnFixedEnum.left) {
      fixedLeft.push(col);
      return;
    }

    if (col.fixed === TableColumnFixedEnum.right) {
      fixedRight.push(col);
      return;
    }
    column.push(col);
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
