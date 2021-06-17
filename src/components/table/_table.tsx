import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from 'm78/button';
import { isTruthyOrZero } from '@lxjx/utils';
import clsx from 'clsx';
import { useScroll, UseScrollMeta, useSelf, useSetState } from '@lxjx/hooks';
import { Spin } from 'm78/spin';
import { Empty } from 'm78/empty';
import Cell from './_cell';
import {
  _InnerSelf,
  _InnerState,
  _Share,
  _TableColumnInside,
  TableColumnFixedEnum,
  TableColumns,
  TableDivideStyleEnum,
  TableProps,
} from './types';
import { getPrimaryKey, getField } from './common';

const defaultProps = {
  dataSource: [],
  columns: [],
  primaryKey: '',
  divideStyle: TableDivideStyleEnum.regular,
  stripe: true,
  loading: false,
  cellMaxWidth: '300px',
};

const _Table = (props: TableProps) => {
  const {
    dataSource,
    columns,
    primaryKey,
    width,
    height,
    divideStyle,
    stripe,
    size,
    loading,
    cellMaxWidth,
  } = props as TableProps & typeof defaultProps;

  const wrapElRef = useRef<HTMLDivElement>(null!);
  const tableElRef = useRef<HTMLTableElement>(null!);
  const theadElRef = useRef<HTMLTableSectionElement>(null!);
  /** tbody first line */
  const firstTBodyRowRef = useRef<HTMLTableRowElement>(null!);

  const [state, setState] = useSetState<_InnerState>({
    touchLeft: true,
    touchRight: true,
    fixedMetas: [],
  });

  const self = useSelf<_InnerSelf>({
    fixedSizeMap: {},
  });

  const fmtColumns = useMemo(() => {
    const colsPre: _TableColumnInside[] = [];
    const cols: _TableColumnInside[] = [];
    const colsSuf: _TableColumnInside[] = [];

    columns.forEach(col => {
      if (col.fixed === TableColumnFixedEnum.left) {
        colsPre.push(col);
        return;
      }

      if (col.fixed === TableColumnFixedEnum.right) {
        colsSuf.push(col);
        return;
      }
      cols.push(col);
    });

    if (colsPre.length) {
      colsPre[colsPre.length - 1] = { ...colsPre[colsPre.length - 1], fixedLeftLast: true };
    }

    if (colsSuf.length) {
      colsSuf[0] = { ...colsSuf[0], fixedRightFirst: true };
    }

    return [...colsPre, ...cols, ...colsSuf];
  }, [columns]);

  const scroller = useScroll({
    el: wrapElRef,
    onScroll: syncTouchStatus,
  });

  const share: _Share = {
    state,
    self,
    props,
  };

  useEffect(() => {
    syncTouchStatus(scroller.get());
  }, []);

  self.fixedSizeMap = {};

  /** 同步滚动状态到touchLeft，touchRight */
  function syncTouchStatus(meta: UseScrollMeta) {
    if (meta.touchLeft !== state.touchLeft || meta.touchRight !== state.touchRight) {
      setState({
        touchRight: meta.touchRight,
        touchLeft: meta.touchLeft,
      });
    }
  }

  function renderColgroup() {
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

  function renderThead(columnLs: _TableColumnInside[]) {
    return (
      <tr>
        {columnLs.map((column, index) => {
          return (
            <Cell
              key={index}
              share={share}
              column={column}
              record={{}}
              rowIndex={0}
              colIndex={index}
              isHead
              tableElRef={tableElRef}
            />
          );
        })}
      </tr>
    );
  }

  function renderTbody() {
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

          return (
            <tr key={key} ref={ind === 0 ? firstTBodyRowRef : undefined}>
              {fmtColumns.map((column, index) => {
                return (
                  <Cell
                    share={share}
                    key={index}
                    record={item}
                    column={column}
                    rowIndex={ind}
                    colIndex={index}
                    tableElRef={tableElRef}
                  />
                );
              })}
            </tr>
          );
        })}
      </tbody>
    );
  }

  return (
    <div
      className={clsx('m78-table', size && `__${size}`, {
        __stripe: stripe,
        [`__${divideStyle}`]: true,
        __touchLeft: state.touchLeft,
        __touchRight: state.touchRight,
      })}
    >
      <Spin full show={loading} />

      <div ref={wrapElRef} className="m78-table_wrap" style={{ width, maxHeight: height }}>
        <table ref={tableElRef}>
          {renderColgroup()}
          <thead ref={theadElRef}>{renderThead(fmtColumns)}</thead>
          {renderTbody()}
          <tfoot style={{ position: 'sticky', bottom: 0, zIndex: 9999 }}>
            <tr>
              <td>1</td>
              <td>2</td>
              <td>3</td>
              <td>4</td>
              <td>5</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

_Table.defaultProps = defaultProps;

export default _Table;
