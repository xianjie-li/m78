import React from 'react';
import { Table, TableColumns } from 'm78/table';
import { dataSource } from './dataSource';

// 配置要显示的列
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

const BaseDemo = () => {
  return (
    <div>
      <Table columns={columns} dataSource={dataSource} />
    </div>
  );
};

export default BaseDemo;
