import { AnyObject, isBoolean, isFunction, isNumber, isString, isTruthyOrZero } from '@lxjx/utils';
import React from 'react';
import Cell from 'm78/table/_cell';
import { Empty } from 'm78/empty';
import clsx from 'clsx';
import { Button } from 'm78/button';
import { CaretDownOutlined, CaretRightOutlined, CaretUpOutlined } from 'm78/icon';
import { If, Toggle } from 'm78/fork';
import { Spin } from 'm78/spin';
import { stopPropagation } from 'm78/util';
import { _Context, _TableCellProps, TableColumnFixedEnum, TableMeta, TableSortEnum } from './types';
import { getField, getInitTableMeta, getPrimaryKey, handleSortClick } from './functions';

/** 主内容render */
export function render(ctx: _Context) {
  const {
    props: {
      size,
      stripe,
      loading,
      divideStyle,
      width,
      height,
      className,
      style,
      dataSource,
      columns,
      primaryKey,
      rowSpan,
      colSpan,
      cellMaxWidth,
      fallback,
      summary,
      expand,
      expandIcon,
      checkFieldValid,
      defaultSort,
      sort,
      onSortChange,
      props: _,
      ...ppp
    },
    states: { state, wrapElRef, tableElRef },
  } = ctx;

  return (
    <div
      {...ppp}
      className={clsx('m78-table', className, size && `__${size}`, {
        __stripe: stripe,
        [`__${divideStyle}`]: true,
        __touchLeft: state.touchLeft,
        __touchRight: state.touchRight,
      })}
      style={style}
    >
      <Spin full show={loading} loadingDelay={0} />

      <div
        ref={wrapElRef}
        className="m78-table_wrap"
        style={{ width, maxHeight: height, opacity: state.mounted ? undefined : 0 }}
      >
        <table ref={tableElRef}>
          {renderColgroup(ctx)}
          {renderThead(ctx)}
          {renderTbody(ctx)}
          {renderTfoot(ctx)}
        </table>
      </div>
    </div>
  );
}

/** 根据记录和索引获取展开节点 */
export function renderExpandNode(ctx: _Context, record: AnyObject, ind: number) {
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
    <tr>
      <td colSpan={fmtColumns.length}>
        <div className="m78-table_expand-node">{node as any}</div>
      </td>
    </tr>
  );
}

/** 渲染表格体 */
export function renderTbody(ctx: _Context) {
  const {
    states: { fmtColumns, firstTBodyRowRef, tableElRef, expandChecker, state },
    props: { dataSource, primaryKey },
  } = ctx;

  if (!dataSource?.length) {
    return (
      <tbody>
        <tr>
          <td colSpan={fmtColumns.length}>
            <Empty desc="暂无数据" />
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {dataSource.map((item, ind) => {
        const key = item[primaryKey] || getPrimaryKey(item);

        const expandNode = renderExpandNode(ctx, item, ind);

        const isOdd = ind % 2 === 0;

        const isExpanded = expandChecker.isChecked(key);

        return (
          <React.Fragment key={key}>
            <tr
              className={clsx('m78-table_body-row', {
                __odd: isOdd,
              })}
              ref={ind === 0 ? firstTBodyRowRef : undefined}
            >
              {fmtColumns.map((column, index) => {
                return (
                  <Cell
                    key={index}
                    tableElRef={tableElRef}
                    prefix={
                      expandNode &&
                      index === 0 && (
                        <Button
                          className={clsx('m78-table_expand-icon', {
                            __open: isExpanded,
                          })}
                          size="small"
                          text
                          onClick={() => expandChecker.toggle(key)}
                        >
                          <span>
                            <CaretRightOutlined />
                          </span>
                        </Button>
                      )
                    }
                    {...getInitTableMeta({
                      column,
                      record: item,
                      colIndex: index,
                      rowIndex: ind,
                    })}
                    ctx={ctx}
                  />
                );
              })}
            </tr>
            {expandNode && <Toggle when={isExpanded}>{expandNode}</Toggle>}
          </React.Fragment>
        );
      })}
    </tbody>
  );
}

/** table col render */
export function renderColgroup(ctx: _Context) {
  const {
    props: { cellMaxWidth },
    states: { fmtColumns },
  } = ctx;

  return (
    <colgroup>
      {fmtColumns.map((item, ind) => {
        const { maxWidth } = item;

        // 默认尺寸取cellMaxWidth
        let w: number | string | undefined = cellMaxWidth;

        if (isTruthyOrZero(maxWidth)) w = maxWidth;
        if (isTruthyOrZero(item.width)) w = item.width;

        // 单元格的width相当于maxWidth, 直接设置maxWidth设置无效
        return <col key={ind} style={{ width: w }} />;
      })}
    </colgroup>
  );
}

/** table head render */
export function renderThead(ctx: _Context) {
  const {
    states: { fmtColumns, tableElRef, theadElRef },
  } = ctx;

  return (
    <thead ref={theadElRef}>
      <tr>
        {fmtColumns.map((column, index) => {
          return (
            <Cell
              key={index}
              {...getInitTableMeta({
                column,
                colIndex: index,
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
export function renderTfoot(ctx: _Context) {
  const {
    states: { fmtColumns, tableElRef },
    props,
  } = ctx;

  if (!props.summary) return null;

  return (
    <tfoot>
      <tr>
        {fmtColumns.map((column, index) => {
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

/** 渲染单元格的容器div */
export function renderCellContent(ctx: _Context, meta: TableMeta, content: React.ReactNode) {
  const { props } = ctx;

  const { width, maxWidth } = meta.column;

  let mw: string | number | undefined = props.cellMaxWidth;

  // width和maxWidth任意项有值则覆盖cellMaxWidth
  if (width) mw = maxWidth;

  const child = renderCellMain(ctx, meta, content);

  return (
    <div
      title={isString(child) || isNumber(child) ? (child as string) : undefined}
      className="m78-table_cell"
      style={{ maxWidth: mw, width: !isTruthyOrZero(maxWidth) ? width : undefined }}
    >
      {child}
    </div>
  );
}

/** 控制单元库渲染的内容 */
export function renderCellFork(ctx: _Context, meta: TableMeta, cellProps: _TableCellProps) {
  const {
    states: { sortState },
  } = ctx;
  const { isHead, column } = meta;
  const { field, key, extra, sort } = column;
  const { prefix, content } = cellProps;

  if ((isHead && (extra || sort)) || prefix) {
    const ex = isFunction(extra) ? extra(meta) : extra;
    const [sortValue] = sortState;
    const [sortKey, sortType] = sortValue || [];

    let currentKey = key;

    if (!currentKey && isString(field)) {
      currentKey = field;
    }

    return (
      <div className="m78-table_cell-wrap" onClick={() => handleSortClick(ctx, column, currentKey)}>
        {prefix}
        {renderCellContent(ctx, meta, content)}
        <If when={sort && currentKey}>
          <span
            className={clsx(
              'm78-table_sort-btn',
              sortType && sortKey === currentKey && `__${sortType}`,
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
        {ex && (
          <div className="ml-8" {...stopPropagation}>
            {isFunction(extra) ? extra(meta) : extra}
          </div>
        )}
      </div>
    );
  }

  return renderCellContent(ctx, meta, content);
}
