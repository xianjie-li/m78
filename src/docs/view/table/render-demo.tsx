import React from 'react';
import { Table, TableColumns } from 'm78/table';
import { Button } from 'm78/button';
import dataSource from './dataSource2';

const colors = ['#ffbaba', '#baf5ff', '#bacfff', '#d8baff', '#ffbad7'];

const columns: TableColumns = [
  {
    label: '#',
    render: ({ rowIndex }) => <span>{rowIndex + 1}</span>,
  },
  {
    label: '名称',
    field: 'name',
  },
  /* 如果是数组，使用 ['field', '0'] 的形式进行取值 */
  {
    label: '种族',
    field: ['meta', 'race'],
  },
  {
    label: '属性',
    field: ['meta', 'property'],
  },
  {
    label: '卡包',
    render: ({ record }) => {
      return record.pkg?.map((item: any, ind: number) => (
        <span
          key={item}
          style={{
            backgroundColor: colors[ind % colors.length],
            borderRadius: 4,
            padding: '2px 4px',
            fontSize: 12,
            marginRight: 4,
          }}
        >
          {item}
        </span>
      ));
    },
  },
  {
    label: '操作',
    render: ({ record }) => {
      return (
        <div>
          <Button size="small" color="primary">
            收藏
          </Button>
          <Button size="small" color="blue" onClick={() => alert(record.id)}>
            修改
          </Button>
          <Button size="small" color="red" onClick={() => alert(record.id)}>
            删除
          </Button>
        </div>
      );
    },
  },
];

const RenderDemo = () => {
  return (
    <div>
      <Table valueKey="id" columns={columns} dataSource={dataSource} />
    </div>
  );
};

export default RenderDemo;
