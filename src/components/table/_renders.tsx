import { isBoolean, isFunction, isNumber, isString, isTruthyOrZero } from '@lxjx/utils';
import React from 'react';
import { Empty } from 'm78/empty';
import clsx from 'clsx';
import { CaretDownOutlined, CaretUpOutlined } from 'm78/icon';
import { If } from 'm78/fork';
import { Spin } from 'm78/spin';
import { stopPropagation, Size } from 'm78/common';
import { Check } from 'm78/check';
import { DNDContext } from 'm78/dnd';
import Cell from './_cell';
import BodyRowItem from './_body-row-item';
import {
  _Context,
  _TableCellProps,
  _TableColumnInside,
  TableColumnFixed,
  TableMeta,
  TableSort,
} from './_types';
import { getField, getInitTableMeta, handleSortClick, getColumnKey } from './_functions';
import TableRender from './_table-render';

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
      customScrollbar,
      draggable,
    },
    states: { state, wrapElRef, tableElRef, fmtColumns },
    treeState,
    isVirtual,
  } = ctx;

  const virtualList = treeState.virtualList;

  // 滚动包裹容器的样式
  const wrapStyle: React.CSSProperties = {
    width,
  };

  // 虚拟滚动时，如果高度不为有效number则设置为固定height，用于优化虚拟滚动
  let heightKey = 'maxHeight';
  if (isVirtual && (!height || !isNumber(height))) {
    heightKey = 'height';
  }
  wrapStyle[heightKey as 'height'] = height;

  /**
   * m78-table - 包裹节点
   * m78-table_wrap - 滚动节点
   * m78-table_cont - 容器节点
   * */

  const childRender = () => {
    return (
      <div
        className={clsx('m78 m78-table', className, size && `__${size}`, {
          __stripe: stripe,
          [`__${divideStyle}`]: true,
          __touchLeft: state.touchLeft,
          __touchRight: state.touchRight,
        })}
        style={style}
      >
        {(loading || treeState.state.loading) && <Spin full />}
        <div
          ref={node => {
            wrapElRef.current = node!;
            (virtualList.containerRef as any).current = node!;
          }}
          className={clsx('m78-table_wrap', customScrollbar && 'm78-scrollbar')}
          style={wrapStyle}
        >
          <div className="m78-table_cont" ref={virtualList.wrapRef}>
            {fmtColumns.fixedLeft.length > 0 && (
              <TableRender type={TableColumnFixed.left} column={fmtColumns.fixedLeft} ctx={ctx} />
            )}
            <TableRender isMain column={fmtColumns.column} ctx={ctx} innerRef={tableElRef} />
            {fmtColumns.fixedRight.length > 0 && (
              <TableRender type={TableColumnFixed.right} column={fmtColumns.fixedRight} ctx={ctx} />
            )}
          </div>
        </div>
      </div>
    );
  };

  if (draggable) {
    return <DNDContext onAccept={treeState.handleDrag}>{childRender()}</DNDContext>;
  }

  return childRender();
}

/** 渲染表格体 */
export function renderTbody(ctx: _Context, columns: _TableColumnInside[], isMainTable = false) {
  const {
    treeState: { showList, virtualList },
    isVirtual,
  } = ctx;

  if (!showList?.length) {
    return (
      <tbody>
        <tr>
          <td colSpan={columns.length}>
            <Empty desc="暂无数据" style={{ padding: '60px 12px' }} />
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
        <virtualList.Render>
          {({ list }) =>
            list.map(item => (
              <BodyRowItem
                key={item.key}
                valueKey={item.key}
                data={item.data as any}
                index={item.index}
                {...baseRowProps}
              />
            ))
          }
        </virtualList.Render>
      </tbody>
    );
  }

  return (
    <tbody>
      {showList.map((data, index) => {
        return (
          <BodyRowItem
            key={data.value}
            valueKey={data.value}
            data={data}
            index={index}
            {...baseRowProps}
          />
        );
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
    treeState,
    states: { tableElRef },
  } = ctx;

  const valChecker = treeState.valChecker;

  function renderPrefix(ind: number) {
    if (ind !== 0) return null;

    if (treeState.isMCheck) {
      return (
        <Check
          size={Size.small}
          type="checkbox"
          partial={valChecker.partialChecked}
          checked={valChecker.allChecked}
          onChange={checked => {
            checked ? valChecker.checkAll() : valChecker.unCheckAll();
          }}
        />
      );
    }
  }

  return (
    <thead>
      <tr>
        {columns.map(column => {
          return (
            <Cell
              key={column.index}
              {...getInitTableMeta(ctx, {
                column,
                colIndex: column.index,
                isHead: true,
              })}
              ctx={ctx}
              tableElRef={tableElRef}
              prefixInline={renderPrefix(column.index)}
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
              {...getInitTableMeta(ctx, {
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
export function renderCellCont(child: any, cellProps: _TableCellProps) {
  const isStringChild = isString(child) || isNumber(child);

  return (
    <div
      title={isStringChild ? (child as string) : undefined}
      className={clsx('m78-table_cell-content', isStringChild && 'ellipsis')}
    >
      {cellProps.prefixInline}
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
      {renderCellCont(child, cellProps)}
      <If when={hasSort}>
        <span
          className={clsx(
            'm78-table_sort-btn',
            sortType && sortKey === columnKey && `__${sortType}`,
          )}
        >
          <If when={isBoolean(sort) || sort === TableSort.asc}>
            <CaretUpOutlined />
          </If>
          <If when={isBoolean(sort) || sort === TableSort.desc}>
            <CaretDownOutlined />
          </If>
        </span>
      </If>
      <If when={isHead && ex}>
        <div className="ml-12" {...stopPropagation}>
          {ex}
        </div>
      </If>
    </div>
  );
}
