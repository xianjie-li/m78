import React, { useState } from 'react';
import { Table, TableColumns } from 'm78/table';
import { mockTreeData } from './mock-tree-data';

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

const TreeBaseDemo = () => {
  const [ds] = useState(() => mockTreeData(6, 3));

  return (
    <div>
      <Table valueKey="id" height={400} columns={columns} dataSource={ds} />
    </div>
  );
};

export default TreeBaseDemo;
