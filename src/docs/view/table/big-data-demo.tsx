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
    width: 70,
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
];

const BigDataDemo = () => {
  return (
    <div>
      <Table
        valueKey="id"
        height={400}
        columns={columns}
        dataSource={mockDs}
        customScrollbar={false}
      />
    </div>
  );
};

export default BigDataDemo;
