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
    maxWidth: 50,
    fixed: 'left',
  },
  {
    label: '姓名',
    field: 'name',
    maxWidth: 300,
  },
  {
    label: '出生日期',
    field: 'birthday',
    fixed: 'left',
  },
  {
    label: '职业',
    field: ['user', 'name'],
  },
  {
    label: '亲属名',
    field: ['relation', '0', 'name'],
    fixed: 'right',
  },
  {
    label: '描述',
    field: 'desc',
    width: 100,
    fixed: 'right',
  },
  {
    label: '技能',
    field: 'skill',
    fixed: 'right',
  },
  {
    label: '技能',
    field: 'skill',
  },
  {
    label: '技能',
    field: 'skill',
  },
  {
    label: '技能',
    field: 'skill',
  },
  {
    label: '技能',
    field: 'skill',
  },
  {
    label: '技能',
    field: 'skill',
  },
  {
    label: '技能',
    field: 'skill',
  },
  {
    label: '技能',
    field: 'skill',
  },
  {
    label: '技能',
    field: 'skill',
  },
  {
    label: '技能',
    field: 'skill',
  },
  {
    label: '技能',
    field: 'skill',
  },
  {
    label: '技能',
    field: 'skill',
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

const ds2 = Array.from({ length: 20 }).map((i, ind) => {
  return {
    id: ind + 10001,
    name: `李显杰${ind}${1 + 10001}`,
    birthday: '1994-07-14',
    user: {
      name: '前端工程师',
    },
    // relation: [
    //   {
    //     name: '梁龙弟',
    //   },
    // ],
    desc:
      '这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一这是一',
    // desc: '这是一',
    skill: '编程、绘画、旅游',
  };
});

const App = () => {
  const dark = m78Config.useState(state => state.darkMode);

  const [d, setD] = useState(ds);

  return (
    <div className="p-32">
      <Button onClick={() => m78Config.setState({ darkMode: !m78Config.getState().darkMode })}>
        {dark ? 'dark' : 'light'}
      </Button>

      <Divider />

      <Button onClick={() => (d === ds ? setD(ds2) : setD(ds))}>change</Button>

      <Spacer height={50} />

      <Table columns={columns} dataSource={d} primaryKey="name" />

      <Spacer height={1000} />
    </div>
  );
};

/*
 * 分割线
 * */

export default App;
