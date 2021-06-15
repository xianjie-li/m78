import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from 'm78/button';
import { isTruthyOrZero } from '@lxjx/utils';
import clsx from 'clsx';
import { useScroll, UseScrollMeta } from '@lxjx/hooks';
import Cell from './_cell';
import { _TableColumnInside, TableColumnFixedEnum, TableColumns, TableProps } from './types';
import { getPrimaryKey, getField } from './common';

const _Table = (props: TableProps) => {
  const { dataSource = [], columns = [], primaryKey = '' } = props;

  const wrapElRef = useRef<HTMLDivElement>(null!);
  const tableElRef = useRef<HTMLTableElement>(null!);
  const theadElRef = useRef<HTMLTableSectionElement>(null!);

  const [state, setState] = useState({
    touchLeft: true,
    touchRight: true,
  });

  const fmtColumns = useMemo(() => {
    const colsPre: _TableColumnInside[] = [];
    const cols: _TableColumnInside[] = [];
    const colsSuf: _TableColumnInside[] = [];

    columns.forEach(col => {
      const clone = { ...col };

      if (col.fixed === TableColumnFixedEnum.left) {
        colsPre.push(clone);
        return;
      }

      if (col.fixed === TableColumnFixedEnum.right) {
        colsSuf.push(clone);
        return;
      }
      cols.push(clone);
    });

    if (colsPre.length) {
      colsPre[colsPre.length - 1].fixedLeftLast = true;
    }

    if (colsSuf.length) {
      colsSuf[0].fixedRightFirst = true;
    }

    return [...colsPre, ...cols, ...colsSuf];
  }, [columns]);

  const scroller = useScroll({
    el: wrapElRef,
    onScroll: syncTouchStatus,
  });

  useEffect(() => {
    syncTouchStatus(scroller.get());
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
              <Cell key={index} column={column} index={index} isHead tableElRef={tableElRef} />
            );
          })}
        </tr>
      </thead>
    );
  }

  function renderTbody() {
    return (
      <tbody>
        {dataSource.map(item => {
          const key = item[primaryKey] || getPrimaryKey(item);

          return (
            <tr key={key}>
              {fmtColumns.map((column, index) => {
                return (
                  <Cell
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
      className={clsx('m78-table __regular __stripe m78-scrollbar', {
        __touchLeft: state.touchLeft,
        __touchRight: state.touchRight,
      })}
      style={{ height: 400 }}
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
