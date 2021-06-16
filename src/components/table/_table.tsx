import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from 'm78/button';
import { isTruthyOrZero } from '@lxjx/utils';
import clsx from 'clsx';
import { useScroll, UseScrollMeta, useSelf, useSetState } from '@lxjx/hooks';
import Cell from './_cell';
import {
  _InnerSelf,
  _InnerState,
  _Share,
  _TableColumnInside,
  TableColumnFixedEnum,
  TableColumns,
  TableProps,
} from './types';
import { getPrimaryKey, getField } from './common';

const _Table = (props: TableProps) => {
  const { dataSource = [], columns = [], primaryKey = '', width, height, rowSpan } = props;

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

          // 单元格的width相当于maxWidth, maxWidth设置无效,所以在设置maxWidth时，为其设置width可以限制列的最大宽度
          return (
            <col key={ind} style={{ width: isTruthyOrZero(maxWidth) ? maxWidth : item.width }} />
          );
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
      ref={wrapElRef}
      className={clsx('m78-table __border __stripe m78-scrollbar', {
        __touchLeft: state.touchLeft,
        __touchRight: state.touchRight,
      })}
      style={{ width, maxHeight: height }}
    >
      <table ref={tableElRef}>
        {renderColgroup()}
        <thead ref={theadElRef}>{renderThead(fmtColumns)}</thead>
        {renderTbody()}
      </table>
    </div>
  );
};
export default _Table;
