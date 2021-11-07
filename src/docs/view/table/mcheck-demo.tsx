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

const McheckDemo = () => {
  const [checked, setChecked] = useState<TreeValueType[]>(['91188343', '26914168']);

  return (
    <div>
      <div className="ellipsis">选中项: {checked.join(', ')}</div>
      <Table
        valueKey="id"
        multipleCheckable
        value={checked}
        onChange={setChecked}
        columns={columns}
        dataSource={dataSource}
      />
    </div>
  );
};

export default McheckDemo;
