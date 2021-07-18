import React from 'react';
import { isString } from '@lxjx/utils';
import { Table, TableColumns } from 'm78/table';
import { dataSource } from './dataSource';

const columns: TableColumns = [
  {
    label: '卡号',
    field: 'id',
    fixed: 'left',
  },
  {
    label: '名称',
    field: 'name',
    fixed: 'left',
  },
  {
    label: '级别',
    field: 'level',
  },
  {
    label: '攻',
    field: 'atk',
  },
  {
    label: '防',
    field: 'def',
  },
  {
    label: '卡包',
    field: 'pkg',
  },
];

const SummaryDemo = () => {
  return (
    <div>
      <Table
        valueKey="id"
        columns={columns}
        dataSource={dataSource}
        summary={({ column }) => {
          if (column.label === '卡号') return '总计';
          const sum = dataSource.reduce((prev, item: any) => {
            if (isNaN(prev) || !isString(column.field)) return prev;
            return prev + Number(item[column.field]);
          }, 0);

          return isNaN(sum) ? 'N/A' : sum;
        }}
      />
    </div>
  );
};

export default SummaryDemo;
