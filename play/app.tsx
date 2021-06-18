import React, { useState } from 'react';
import { m78Config } from 'm78/config';
import { Divider, Spacer, Tile } from 'm78/layout';
import { Button } from 'm78/button';
import { Table, TableColumns } from 'm78/table';
import 'm78/table/style';
import { ListView, ListViewItem } from 'm78/list-view';

const columns: TableColumns = [
  {
    label: '#',
    field: 'id',
    width: 150,
    fixed: 'left',
  },
  {
    label: '姓名',
    field: 'name',
    maxWidth: 300,
  },
  {
    label: '数值',
    field: 'num',
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
    // width: 100,
    fixed: 'right',
  },
  // {
  //   label: '技能1',
  //   field: 'skill',
  //   fixed: 'right',
  //   render: () => {
  //     return (
  //       <>
  //         <Button size="small">操作</Button>
  //         <Button size="small">操作</Button>
  //       </>
  //     );
  //   },
  // },
  // {
  //   label: '技能2',
  //   field: 'skill',
  //   extra: <span>⚙</span>,
  // },
  // {
  //   label: '技能3',
  //   field: 'skill',
  // },
  // {
  //   label: '技能4',
  //   field: 'skill',
  // },
  // {
  //   label: '技能5',
  //   field: 'skill',
  //   width: 50,
  // },
  // {
  //   label: '技能6',
  //   field: 'skill',
  // },
  // {
  //   label: '技能7',
  //   field: 'skill',
  // },
  // {
  //   label: '技能8',
  //   field: 'skill',
  // },
  // {
  //   label: '技能9',
  //   field: 'skill',
  // },
  // {
  //   label: '技能10',
  //   field: 'skill',
  // },
  // {
  //   label: '技能11',
  //   field: 'skill',
  // },
  // {
  //   label: '技能12',
  //   field: 'skill',
  // },
  // {
  //   label: '技能13',
  //   field: 'skill',
  // },
];

const ds = Array.from({ length: 20 }).map((i, ind) => {
  return {
    id: ind + 1,
    name: `李显杰${ind}${1}`,
    birthday: '1994-07-14',
    num: ind,
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

const ds2 = Array.from({ length: 100 }).map((i, ind) => {
  return {
    id: ind + 10001,
    name: `李显杰${ind}${1 + 10001}`,
    num: ind,
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

  const [d, setD] = useState(ds2);

  return (
    <div className="p-32">
      <Button onClick={() => m78Config.setState({ darkMode: !m78Config.getState().darkMode })}>
        {dark ? 'dark' : 'light'}
      </Button>

      <Divider />

      <Button onClick={() => (d === ds ? setD(ds2) : setD(ds))}>change</Button>

      <Spacer height={50} />

      <Table
        // height={500}
        divideStyle="border"
        columns={columns}
        dataSource={d}
        summary={({ column }) => {
          if (column.label === '#') return '总计';
          if (column.label === '数值') {
            const count = d.reduce((prev, item) => {
              if (isNaN(prev)) return prev;
              return prev + item.num;
            }, 0);

            return isNaN(count) ? 'N/A' : count;
          }
          return 'N/A';
        }}
        expand={({ record, rowIndex }) => {
          if (rowIndex > 5) return;

          return (
            <div className="p-12">
              <ListView size="small" style={{ fontWeight: 400 }}>
                <ListViewItem title="姓名" desc="xxx" />
                <ListViewItem title="年龄" desc="18" />
                <ListViewItem title="数值" desc="516" />
                <ListViewItem
                  title="职业"
                  desc="
前端工程师"
                />
              </ListView>
            </div>
          );
        }}
      />

      <Spacer height={1000} />
    </div>
  );
};

/*
 * 分割线
 * */

export default App;
