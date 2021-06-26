import React from 'react';
import { Table, TableColumns } from 'm78/table';
import { Button } from 'm78/button';
import dataSource from './dataSource2';

const columns: TableColumns = [
  {
    label: '#',
    render: ({ rowIndex }) => <span>{rowIndex + 1}</span>,
  },
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
    field: ['meta', 'race'],
  },
  {
    label: '属性',
    field: ['meta', 'property'],
  },
  {
    label: '级别',
    field: ['meta', 'level'],
  },
  {
    label: '卡包',
    render: ({ record }) => {
      return record.pkg?.map((item: any) => <span key={item}>【{item}】</span>);
    },
  },
  {
    label: '操作',
    render: ({ record }) => {
      return (
        <div>
          <Button size="small" text color="blue">
            收藏
          </Button>
          <Button size="small" text color="blue" onClick={() => alert(record.id)}>
            修改
          </Button>
        </div>
      );
    },
  },
];

const RenderDemo = () => {
  return (
    <div>
      <Table columns={columns} dataSource={dataSource} />
    </div>
  );
};

export default RenderDemo;
