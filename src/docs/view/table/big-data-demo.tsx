import React from 'react';
import { Table, TableColumns } from 'm78/table';
import { dataSource } from './dataSource';

// 模拟99999条数据
const mockDs = Array.from({ length: 99999 }).map((item, ind) => {
  const cItem = dataSource[ind % dataSource.length];
  return { ...cItem, id: String(Math.random()).slice(2) };
});

const columns: TableColumns = [
  {
    label: '#',
    render: ({ rowIndex }) => <span>{rowIndex + 1}</span>,
  },
  {
    label: '卡号',
    field: 'id',
    width: 200,
  },
  {
    label: '名称',
    field: 'name',
    width: 200,
  },
  {
    label: '日文名',
    field: 'jName',
    width: 200,
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

const BigDataDemo = () => {
  return (
    <div>
      <Table height={400} columns={columns} dataSource={mockDs} customScrollbar={false} />
    </div>
  );
};

export default BigDataDemo;
