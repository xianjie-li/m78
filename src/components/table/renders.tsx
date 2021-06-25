import { isBoolean, isFunction, isNumber, isString, isTruthyOrZero } from '@lxjx/utils';
import React from 'react';
import Cell from 'm78/table/_cell';
import { Empty } from 'm78/empty';
import clsx from 'clsx';
import { CaretDownOutlined, CaretUpOutlined } from 'm78/icon';
import { If } from 'm78/fork';
import { Spin } from 'm78/spin';
import { stopPropagation } from 'm78/util';
import BodyRowItem from 'm78/table/_body-row-item';
import {
  _Context,
  _TableCellProps,
  _TableColumnInside,
  TableColumnFixedEnum,
  TableMeta,
  TableSortEnum,
  TableTreeNode,
} from './types';
import {
  getField,
  getInitTableMeta,
  handleSortClick,
  getColumnKey,
  handleTableClick,
  defaultValueGetter,
} from './functions';
import TableRender from './_table-render';

/** 主内容render */
export function render(ctx: _Context) {
  const {
    props: { size, stripe, loading, divideStyle, width, height, className, style, customScrollbar },
    states: { state, wrapElRef, tableElRef, virtualList, fmtColumns, isVirtual },
    treeState,
  } = ctx;

  return (
    <div
      className={clsx('m78-table', className, size && `__${size}`, {
        __stripe: stripe,
        [`__${divideStyle}`]: true,
        __touchLeft: state.touchLeft,
        __touchRight: state.touchRight,
      })}
      style={style}
    >
      {(loading || treeState.state.loading) && <Spin full loadingDelay={0} />}
      <div
        ref={node => {
          wrapElRef.current = node!;
          virtualList.containerProps.ref(node);
        }}
        onScroll={isVirtual ? virtualList.containerProps.onScroll : undefined}
        className={clsx('m78-table_wrap', customScrollbar && 'm78-scrollbar')}
        style={{ width, maxHeight: height }}
        onClick={() => handleTableClick(ctx)}
      >
        {fmtColumns.fixedLeft.length > 0 && (
          <TableRender
            type={TableColumnFixedEnum.left}
            containerProps={virtualList.wrapperProps}
            column={fmtColumns.fixedLeft}
            ctx={ctx}
          />
        )}
        <TableRender
          isMain
          containerProps={virtualList.wrapperProps}
          column={fmtColumns.column}
          ctx={ctx}
          innerRef={tableElRef}
        />
        {fmtColumns.fixedRight.length > 0 && (
          <TableRender
            type={TableColumnFixedEnum.right}
            containerProps={virtualList.wrapperProps}
            column={fmtColumns.fixedRight}
            ctx={ctx}
          />
        )}
      </div>
    </div>
  );
}

/** 根据记录和索引获取展开节点 */
export function renderExpandNode(ctx: _Context, record: TableTreeNode, ind: number) {
  const {
    props: { expand },
    states: { fmtColumns },
  } = ctx;

  if (!expand) return null;

  const meta = getInitTableMeta({
    rowIndex: ind,
    record,
    isBody: true,
  });

  const node = expand(meta);

  if (!isTruthyOrZero(node)) return null;

  return (
    <tr {...stopPropagation}>
      <td colSpan={fmtColumns.column.length}>
        <div className="m78-table_expand-node">{node as any}</div>
      </td>
    </tr>
  );
}

/** 渲染表格体 */
export function renderTbody(ctx: _Context, columns: _TableColumnInside[], isMainTable = false) {
  const {
    states: { virtualList, isVirtual },
    treeState: { showList },
  } = ctx;

  if (!showList?.length) {
    return (
      <tbody>
        <tr>
          <td colSpan={columns.length}>
            <Empty desc="暂无数据" />
          </td>
        </tr>
      </tbody>
    );
  }

  const baseRowProps = {
    ctx,
    isMainTable,
    columns,
    props: ctx.props,
  };

  if (isVirtual) {
    return (
      <tbody>
        {virtualList.list.map(({ data, index }) => {
          const key = ctx.props.valueGetter(data.origin);
          return (
            <BodyRowItem key={key} valueKey={key} data={data} index={index} {...baseRowProps} />
          );
        })}
      </tbody>
    );
  }

  return (
    <tbody>
      {showList.map((data, index) => {
        const key = ctx.props.valueGetter(data.origin);
        return <BodyRowItem key={key} valueKey={key} data={data} index={index} {...baseRowProps} />;
      })}
    </tbody>
  );
}

/** table col render */
export function renderColgroup(ctx: _Context, columns: _TableColumnInside[], isMainTable = false) {
  const {
    props: { cellMaxWidth },
  } = ctx;

  return (
    <colgroup>
      {columns.map((item, ind) => {
        const { maxWidth } = item;

        // 默认尺寸取cellMaxWidth
        let w: number | string | undefined = isMainTable ? cellMaxWidth : undefined;

        if (isTruthyOrZero(maxWidth)) w = maxWidth;
        if (isTruthyOrZero(item.width)) w = item.width;

        // 单元格的width相当于maxWidth, 直接设置maxWidth设置无效
        return <col key={ind} style={{ width: w }} />;
      })}
    </colgroup>
  );
}

/** table head render */
export function renderThead(ctx: _Context, columns: _TableColumnInside[]) {
  const {
    states: { tableElRef, theadElRef },
  } = ctx;

  return (
    <thead ref={theadElRef}>
      <tr>
        {columns.map(column => {
          return (
            <Cell
              key={column.index}
              {...getInitTableMeta({
                column,
                colIndex: column.index,
                isHead: true,
              })}
              ctx={ctx}
              tableElRef={tableElRef}
            />
          );
        })}
      </tr>
    </thead>
  );
}

/** table foot render */
export function renderTfoot(ctx: _Context, columns: _TableColumnInside[]) {
  const {
    states: { tableElRef },
    props,
  } = ctx;

  if (!props.summary) return null;

  return (
    <tfoot>
      <tr>
        {columns.map((column, index) => {
          return (
            <Cell
              key={index}
              tableElRef={tableElRef}
              {...getInitTableMeta({
                column,
                colIndex: index,
                isFoot: true,
              })}
              ctx={ctx}
            />
          );
        })}
      </tr>
    </tfoot>
  );
}

/**
 * ################################
 * 单元格
 * ################################
 * */

/** 获取单元格无有效值时的回退内容 */
export function renderCellFallback(ctx: _Context, meta: TableMeta) {
  const fallback = ctx.props.fallback;

  if (fallback !== undefined) {
    if (isFunction(fallback)) return fallback(meta);
    return fallback;
  }

  return <div className="plr-12">-</div>;
}

/** 获取单元格显示的主要内容 */
export function renderCellMain(ctx: _Context, meta: TableMeta, content: React.ReactNode) {
  const {
    props: { summary, checkFieldValid },
  } = ctx;

  const { isFoot, isHead, column, record } = meta;

  if (isTruthyOrZero(content)) return content;

  if (isHead) return column.label;

  if (isFoot) {
    if (!isFunction(summary)) return renderCellFallback(ctx, meta);
    const s = summary(meta);
    return isTruthyOrZero(s) ? s : renderCellFallback(ctx, meta);
  }

  if (column.render) return column.render(meta);

  const val = getField(record, column.field);

  if (checkFieldValid(val)) return val;

  return renderCellFallback(ctx, meta);
}

/** 渲染单元格主要内容 */
export function renderCellCont(child: any) {
  const isStringChild = isString(child) || isNumber(child);

  return (
    <div
      title={isStringChild ? (child as string) : undefined}
      className={clsx('m78-table_cell-content', isStringChild && 'ellipsis')}
    >
      {child}
    </div>
  );
}

/** 控制单元库渲染的内容 */
export function renderCellFork(ctx: _Context, meta: TableMeta, cellProps: _TableCellProps) {
  const {
    states: { sortState },
    props,
  } = ctx;
  const { isHead, column } = meta;
  const { extra, sort, width, maxWidth } = column;
  const { prefix, content } = cellProps;

  // 宽度
  let mw: string | number | undefined = props.cellMaxWidth;

  // width和maxWidth任意项有值则覆盖cellMaxWidth
  if (width) mw = maxWidth;

  // 渲染内容
  const child = renderCellMain(ctx, meta, content);

  // 额外节点
  const ex = isFunction(extra) ? extra(meta) : extra;

  // 排序
  const [sortValue] = sortState;
  const [sortKey, sortType] = sortValue || [];

  // 当前排序的key
  const columnKey = getColumnKey(column);

  // 是否开启了sort
  const hasSort = isHead && sort && columnKey;

  return (
    <div
      className="m78-table_cell"
      onClick={hasSort ? () => handleSortClick(ctx, column, columnKey) : undefined}
      style={{ maxWidth: mw, width: !isTruthyOrZero(maxWidth) ? width : undefined }}
    >
      {prefix}
      {renderCellCont(child)}
      <If when={hasSort}>
        <span
          className={clsx(
            'm78-table_sort-btn',
            sortType && sortKey === columnKey && `__${sortType}`,
          )}
        >
          <If when={isBoolean(sort) || sort === TableSortEnum.asc}>
            <CaretUpOutlined />
          </If>
          <If when={isBoolean(sort) || sort === TableSortEnum.desc}>
            <CaretDownOutlined />
          </If>
        </span>
      </If>
      <If when={isHead && ex}>
        <div className="ml-12" {...stopPropagation}>
          {isFunction(extra) ? extra(meta) : extra}
        </div>
      </If>
    </div>
  );
}
