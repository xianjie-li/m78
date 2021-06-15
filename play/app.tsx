import React, { useEffect, useMemo, useState } from 'react';
import { m78Config } from 'm78/config';
import { Divider, Spacer, Tile } from 'm78/layout';
import { Button } from 'm78/button';
import { Toggle } from 'm78/fork';
import { Table, TableColumns } from 'm78/table';

const columns: TableColumns = [
  {
    label: '#',
    field: 'id',
    width: 200,
  },
  {
    label: '姓名',
    field: 'name',
    maxWidth: 300,
  },
  {
    label: '出生日期',
    field: 'birthday',
  },
  {
    label: '职业',
    field: ['user', 'name'],
  },
  {
    label: '亲属名',
    field: ['relation', '0', 'name'],
  },
  {
    label: '描述',
    field: 'desc',
    maxWidth: 300,
  },
  {
    label: '技能',
    field: 'skill',
  },
];

const ds = Array.from({ length: 20 }).map((i, ind) => {
  return {
    id: ind + 1,
    name: `李显杰${ind}${1}`,
    birthday: '1994-07-14',
    user: {
      name: '全栈工程师',
    },
    // relation: [
    //   {
    //     name: '梁龙弟',
    //   },
    // ],
    desc:
      '这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一',
    // desc: '这是一',
    skill: '编程、绘画',
  };
});

const App = () => {
  const dark = m78Config.useState(state => state.darkMode);

  return (
    <div className="p-32">
      <Button onClick={() => m78Config.setState({ darkMode: !m78Config.getState().darkMode })}>
        {dark ? 'dark' : 'light'}
      </Button>

      <Divider />

      <Spacer height={50} />

      <Table columns={columns} dataSource={ds} primaryKey="name" />

      <Spacer height={1000} />
    </div>
  );
};

/*
 * 分割线
 * */

export default App;
