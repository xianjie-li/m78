import React, { useState } from 'react';
import { Table, TableColumns } from 'm78/table';
import { TreeValueType } from 'm78/tree';
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

const ScheckDemo = () => {
  const [checked, setChecked] = useState<TreeValueType>('91188343');

  return (
    <div>
      <span>选中项: {checked}</span>
      <Table
        checkable
        value={checked}
        onChange={setChecked}
        columns={columns}
        dataSource={dataSource}
      />
    </div>
  );
};

export default ScheckDemo;
