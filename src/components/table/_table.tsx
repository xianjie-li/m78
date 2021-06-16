import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from 'm78/button';
import { isTruthyOrZero } from '@lxjx/utils';
import clsx from 'clsx';
import { useScroll, UseScrollMeta, useSetState } from '@lxjx/hooks';
import Cell from './_cell';
import {
  _InnerState,
  _Share,
  _TableColumnInside,
  TableColumnFixedEnum,
  TableColumns,
  TableProps,
} from './types';
import { getPrimaryKey, getField } from './common';

const _Table = (props: TableProps) => {
  const { dataSource = [], columns = [], primaryKey = '' } = props;

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
  };

  useEffect(() => {
    syncTouchStatus(scroller.get());
  }, []);

  useEffect(() => {
    const el = firstTBodyRowRef.current;
    if (!el) return;

    const tds = el.querySelectorAll(':scope>td');

    if (!tds.length) return;

    const ls: any = [];

    const wrapBound = tableElRef.current.getBoundingClientRect();

    tds.forEach(item => {
      const elBound = item.getBoundingClientRect();

      ls.push({
        left: elBound.left - wrapBound.left,
        right: wrapBound.right - elBound.right,
      });
    });

    setState({
      fixedMetas: ls,
    });
  }, []);

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
          const { width, maxWidth } = item;

          // 单元格的width相当于maxWidth, maxWidth设置无效,所以在设置maxWidth时，为其设置width可以限制列的最大宽度
          return <col key={ind} style={{ width: isTruthyOrZero(maxWidth) ? maxWidth : width }} />;
        })}
      </colgroup>
    );
  }

  function renderThead() {
    return (
      <thead ref={theadElRef}>
        <tr>
          {fmtColumns.map((column, index) => {
            return (
              <Cell
                key={index}
                share={share}
                column={column}
                index={index}
                isHead
                tableElRef={tableElRef}
              />
            );
          })}
        </tr>
      </thead>
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
                    index={index}
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
      // style={{ height: 400 }}
    >
      <table ref={tableElRef}>
        {renderColgroup()}
        {renderThead()}
        {renderTbody()}
      </table>
    </div>
  );
};
export default _Table;
