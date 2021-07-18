import React, { useState } from 'react';
import { Table, TableColumns } from 'm78/table';
import { dataSource } from './dataSource';
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

const FilterDemo = () => {
  const [ds, setDs] = useState(() => mockTreeData(8, 3));

  return (
    <div>
      <Table
        draggable
        height={400}
        valueKey="id"
        columns={columns}
        dataSource={ds}
        onDataSourceChange={setDs}
      />
    </div>
  );
};

export default FilterDemo;
