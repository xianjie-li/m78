import React from 'react';
import { Button } from 'm78/button';
import { isTruthyOrZero } from '@lxjx/utils';
import { TableProps } from './types';
import { getPrimaryKey, getField } from './common';

const _Table = (props: TableProps) => {
  const { dataSource = [], columns = [], primaryKey = '' } = props;

  function renderColgroup() {
    return (
      <colgroup>
        {columns.map((item, ind) => {
          const { width, maxWidth } = item;

          // 单元格的width相当于maxWidth, maxWidth设置无效,所以在设置maxWidth时，为其设置width可以限制列的最大宽度
          return <col key={ind} style={{ width: isTruthyOrZero(maxWidth) ? maxWidth : width }} />;
        })}
      </colgroup>
    );
  }

  function renderThead() {
    return (
      <thead>
        <tr>
          {columns.map((item, ind) => {
            const { width, maxWidth } = item;

            return (
              <td key={ind}>
                <div
                  className="m78-table_cell"
                  style={{ maxWidth, width: !isTruthyOrZero(maxWidth) ? width : undefined }}
                >
                  {item.label}
                </div>
              </td>
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
              {columns.map((column, ind) => {
                const val = getField(item, column.field);
                const { width, maxWidth } = column;

                return (
                  <td key={ind}>
                    <div
                      className="m78-table_cell"
                      style={{ maxWidth, width: !isTruthyOrZero(maxWidth) ? width : undefined }}
                    >
                      {isTruthyOrZero(val) ? val : <div className="tc">-</div>}
                    </div>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    );
  }

  return (
    <div className="m78-table __border __stripe m78-scrollbar">
      <table>
        {renderColgroup()}
        {renderThead()}
        {renderTbody()}
      </table>
    </div>
  );
};
export default _Table;
