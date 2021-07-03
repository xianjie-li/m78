import React, { useState } from 'react';
import { TreeValueType } from 'm78/tree';
import { Spacer } from 'm78/layout';
import { Table, TableColumns, TableDataSourceItem } from 'm78/table';
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
    label: '罕见度',
    field: 'rare',
  },
  {
    label: '详情',
    field: 'desc',
  },
];

const OpenDemo = () => {
  const [ds] = useState<TableDataSourceItem[]>(() => mockTreeData(2, 2));

  const [opens, setOpens] = useState<TreeValueType[]>(['1', '1-1', '1-2']);

  return (
    <div>
      <h3>默认展开</h3>
      <Table height={400} columns={columns} dataSource={ds} defaultOpens={['1', '1-1', '1-2']} />

      <Spacer height={50} />

      <h3>受控展开</h3>
      <Table
        height={400}
        columns={columns}
        dataSource={ds}
        opens={opens}
        onOpensChange={setOpens}
      />

      <Spacer height={50} />

      <h3>默认展开全部</h3>
      <Table height={400} columns={columns} dataSource={ds} defaultOpenAll />

      <Spacer height={50} />

      <h3>指定默认展开层级</h3>
      <Table height={400} columns={columns} dataSource={ds} defaultOpenZIndex={1} />
    </div>
  );
};

export default OpenDemo;
