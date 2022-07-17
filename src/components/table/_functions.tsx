import { AnyObject, createRandString, isArray, isBoolean, isFunction, isString } from '@lxjx/utils';
import { throwError, Size } from 'm78/common';
import { SetState, UseScrollMeta } from '@lxjx/hooks';
import React from 'react';
import { stringifyArrayField } from './_common';
import {
  _Context,
  _InnerState,
  _TableColumnInside,
  TableColumn,
  TableColumnFixed,
  TableMeta,
  TableProps,
  TableSort,
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
export function getSizeNumber(size?: Size) {
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
 * - 生成表头组渲染信息
 * */
export function columnsBeforeFormat({ columns, showColumns }: TableProps) {
  const fixedLeft: TableColumn[] = [];
  const column: TableColumn[] = [];
  const fixedRight: TableColumn[] = [];

  columns.forEach(col => {
    // 过滤不显示的列
    if (showColumns?.length) {
      const key = getColumnKey(col);
      if (key && !showColumns.includes(key)) {
        return;
      }
    }

    if (col.fixed === TableColumnFixed.left) {
      fixedLeft.push(col);
      return;
    }

    if (col.fixed === TableColumnFixed.right) {
      fixedRight.push(col);
      return;
    }

    column.push(col);
  });

  const nestLeft = nestHeaderColumnsFormat(fixedLeft);
  const nest = nestHeaderColumnsFormat(column, nestLeft.indexStart);
  const nestRight = nestHeaderColumnsFormat(fixedRight, nest.indexStart);
  const max = Math.max(nest.max, nestLeft.max, nestRight.max);

  const leftDiff = max - nestLeft.max;
  const diff = max - nest.max;
  const rightDiff = max - nestLeft.max;

  // 高度不足最大高度时进行填充
  if (leftDiff > 0) nestLeft.headAOA.push(...Array.from({ length: leftDiff }).map(() => []));
  if (diff > 0) nest.headAOA.push(...Array.from({ length: diff }).map(() => []));
  if (rightDiff > 0) nestRight.headAOA.push(...Array.from({ length: rightDiff }).map(() => []));

  return {
    headLeftAOA: nestLeft.headAOA,
    headRightAOA: nestRight.headAOA,
    headAOA: nest.headAOA,
    fixedLeft: nestLeft.actualColumn,
    fixedRight: nestRight.actualColumn,
    column: nest.actualColumn,
    max,
  };
}

export function nestHeaderColumnsFormat(column: TableColumn[], indexStart = 0) {
  const newList: TableColumn[] = [...column];
  const aoa: _TableColumnInside[][] = [];
  const actualColumn: _TableColumnInside[] = [];

  let maxZIndex = 0;

  // 总层级 / 当前层级 / 下方总共有多少列 / 多少层

  function handle(list: TableColumn[], index: number, parents: _TableColumnInside[]) {
    // 总行数+1
    parents.forEach(i => (i._rowSum += 1));

    list.forEach((i, ind) => {
      const item = {
        ...i,
        _zIndex: index,
        _rowSum: 0,
        _colSum: 0,
        columnHeadKey: createRandString(),
        index: -1, // 组合列index设置为-1
      };

      if (maxZIndex < index) maxZIndex = index;

      list[ind] = item;

      if (item.children && item.children.length) {
        item.children = [...item.children];

        handle(item.children, index + 1, [...parents, item]);
      } else {
        // 到底时总列数+1
        parents.forEach(it => (it._colSum += 1));
        item.index = indexStart;
        indexStart += 1;
        actualColumn.push(item);
      }

      if (!aoa[index]) aoa[index] = [];

      aoa[index].push(item);
    });
  }

  handle(newList, 0, []);

  return {
    /** 实际的表格列 */
    actualColumn,
    /** 头二位数组 */
    headAOA: aoa,
    /** 更新后的索引计数 */
    indexStart,
    /** 最大row数 */
    max: maxZIndex + 1,
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

  console.log(key);

  if (!key) {
    throwError('Column identity key was not get', 'Table');
  }

  const [sortValue, setSort] = sortState;
  const [sortKey, sortType] = sortValue || [];

  let nextType = TableSort.asc;

  // 排序类型为boolean值，取反，上一个排序key与当前key不符时设置默认值
  if (isBoolean(column.sort)) {
    if (sortKey === key) {
      if (sortType === TableSort.asc) nextType = TableSort.desc;
      else nextType = TableSort.asc;
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
