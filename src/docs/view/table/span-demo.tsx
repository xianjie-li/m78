import React from 'react';
import { Table, TableColumns } from 'm78/table';
import { dataSource } from './dataSource';

const columns: TableColumns = [
  {
    label: '卡号',
    field: 'id',
  },
  {
    label: '名称',
    field: 'name',
  },
  {
    label: '日文名',
    field: 'jName',
  },
  {
    label: '种族',
    field: 'race',
  },
  {
    label: '属性',
    field: 'property',
  },
  {
    label: '卡包',
    field: 'pkg',
  },
  {
    label: '罕见度',
    field: 'rare',
  },
];

const SpanDemo = () => {
  return (
    <div>
      <Table
        valueKey="id"
        columns={columns}
        dataSource={dataSource}
        rowSpan={({ record, column, rowIndex }) => {
          if (column.label === '名称') {
            if (record.id === '64734921') return 2;
            if (record.id === '91188343') return 0;
          }

          if (column.label === '卡包') {
            if (rowIndex === 0) return 5;
            if (rowIndex < 5) return 0;
          }
        }}
        colSpan={({ record, column, colIndex }) => {
          if (record.id === '17266660') {
            if (column.label === '日文名') return 3;
            if (colIndex > 2 && colIndex < 5) return 0;
          }

          if (record.id === '26914168') {
            if (column.label === '卡号') return columns.length;
            return 0;
          }
        }}
      />
    </div>
  );
};

export default SpanDemo;
