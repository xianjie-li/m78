import React, { useEffect, useMemo, useRef } from 'react';
import { AnyObject, isTruthyOrZero } from '@lxjx/utils';
import clsx from 'clsx';
import { useCheck, useScroll, UseScrollMeta, useSelf, useSetState } from '@lxjx/hooks';
import { Spin } from 'm78/spin';
import { Empty } from 'm78/empty';
import { CaretRightOutlined } from 'm78/icon';
import { Button } from 'm78/button';
import { Toggle } from 'm78/fork';
import Cell from './_cell';
import {
  _InnerSelf,
  _InnerState,
  _Share,
  _TableColumnInside,
  TableColumnFixedEnum,
  TableDivideStyleEnum,
  TableProps,
} from './types';
import { getInitTableMeta, getPrimaryKey } from './common';

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
    expand,
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

  const expandChecker = useCheck({});

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
                record={{}}
                rowIndex={0}
                colIndex={index}
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

          const expandNode = getExpandNode(item, ind);

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
                      share={share}
                      key={index}
                      record={item}
                      column={column}
                      rowIndex={ind}
                      colIndex={index}
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

  function getExpandNode(record: AnyObject, ind: number) {
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

  function renderTfoot() {
    if (!props.summary) return null;

    return (
      <tfoot style={{ position: 'sticky', bottom: 0, zIndex: 9999 }}>
        <tr>
          {fmtColumns.map((column, index) => {
            return (
              <Cell
                key={index}
                share={share}
                column={column}
                record={{}}
                rowIndex={0}
                colIndex={index}
                isFoot
                tableElRef={tableElRef}
              />
            );
          })}
        </tr>
      </tfoot>
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
          {renderThead()}
          {renderTbody()}
          {renderTfoot()}
        </table>
      </div>
    </div>
  );
};

_Table.defaultProps = defaultProps;

export default _Table;
