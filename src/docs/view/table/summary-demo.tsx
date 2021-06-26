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
  {
    label: '罕见度',
    field: 'rare',
  },
  {
    label: '详情',
    field: 'desc',
  },
];

const SummaryDemo = () => {
  return (
    <div>
      <Table
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
