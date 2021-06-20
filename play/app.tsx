import React, { useState } from 'react';
import { m78Config } from 'm78/config';
import { Divider, Spacer } from 'm78/layout';
import { Button } from 'm78/button';
import { Table, TableColumns } from 'm78/table';
import 'm78/table/style';
import { ListView, ListViewItem } from 'm78/list-view';
import { datetime } from '@lxjx/utils';
import { formatDate } from 'm78/dates/utils';

const columns: TableColumns = [
  {
    label: '#',
    field: 'id',
    width: 100,
    fixed: 'left',
  },
  {
    label: '虚拟列',
    render: ({ rowIndex }) => <span>row {rowIndex}</span>,
    fixed: 'left',
  },
  {
    label: '姓名',
    field: 'name',
    maxWidth: 200,
  },
  {
    label: '数值',
    field: 'num',
    sort: true,
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
    fixed: 'right',
  },
  {
    label: '描述',
    field: 'desc',
    // width: 100,
    fixed: 'right',
  },
  {
    label: '技能1',
    field: 'skill',
    fixed: 'right',
    render: () => {
      return (
        <>
          <Button size="small">操作</Button>
          <Button size="small">操作</Button>
        </>
      );
    },
  },
  {
    label: '技能2',
    field: 'skill',
    extra: <span>⚙</span>,
  },
  {
    label: '技能3',
    field: 'skill',
  },
  {
    label: '技能4',
    field: 'skill',
  },
  {
    label: '技能5',
    field: 'skill',
    width: 50,
  },
  {
    label: '技能6',
    field: 'skill',
  },
  {
    label: '技能7',
    field: 'skill',
  },
  {
    label: '技能8',
    field: 'skill',
  },
  {
    label: '技能9',
    field: 'skill',
  },
  {
    label: '技能10',
    field: 'skill',
  },
  {
    label: '技能11',
    field: 'skill',
  },
  {
    label: '技能12',
    field: 'skill',
  },
  {
    label: '技能13',
    field: 'skill',
  },
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

const ds2 = Array.from({ length: 200 }).map((i, ind) => {
  const date = new Date('1994-07-14');

  date.setDate(date.getDate() - ind);

  return {
    id: ind + 10001,
    name: `李显杰${ind}${1 + 10001}`,
    num: ind,
    birthday: datetime(date, 'YYYY-MM-DD'),
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

  const [toggle, setToggle] = useState(true);

  return (
    <div className="p-32">
      <Button onClick={() => m78Config.setState({ darkMode: !m78Config.getState().darkMode })}>
        {dark ? 'dark' : 'light'}
      </Button>

      <Divider />

      <Button onClick={() => (d === ds ? setD(ds2) : setD(ds))}>change</Button>

      <Spacer height={50} />

      <Button onClick={() => setToggle(prev => !prev)}>toggle</Button>

      {toggle && (
        <Table
          height={400}
          divideStyle="border"
          columns={columns}
          dataSource={d}
          // summary={({ column }) => {
          //   if (column.label === '#') return '总计';
          //   if (column.label === '数值') {
          // {/*    const count = d.reduce((prev, item) => {*/}
          //       if (isNaN(prev)) return prev;
          //       return prev + item.num;
          //     }, 0);
          //
          //     return isNaN(count) ? 'N/A' : count;
          //   }
          //   return <span className="color-second fw">N/A</span>;
          // }}
          expand={({ rowIndex }) => {
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
          onSortChange={([key, type]) => {
            if (key === 'num') {
              setD(prev => {
                prev.sort((a, b) => {
                  return type === 'asc' ? a.num - b.num : b.num - a.num;
                });

                return prev;
              });
            }

            // if (key === 'birthday') {
            //   setD(prev => {
            //     prev.sort((a, b) => {
            //       return type === 'asc'
            //         ? new Date(a.birthday) - new Date(b.birthday)
            //         : new Date(b.birthday) - new Date(a.birthday);
            //     });
            //
            //     return prev;
            //   });
            // }
          }}
        />
      )}

      <Spacer />

      {/*      <Table*/}
      {/*        height={400}*/}
      {/*        columns={columns}*/}
      {/*        dataSource={d}*/}
      {/*        summary={({ column }) => {*/}
      {/*          if (column.label === '#') return '总计';*/}
      {/*          if (column.label === '数值') {*/}
      {/*            const count = d.reduce((prev, item) => {*/}
      {/*              if (isNaN(prev)) return prev;*/}
      {/*              return prev + item.num;*/}
      {/*            }, 0);*/}

      {/*            return isNaN(count) ? 'N/A' : count;*/}
      {/*          }*/}
      {/*          return 'N/A';*/}
      {/*        }}*/}
      {/*        expand={({ rowIndex }) => {*/}
      {/*          if (rowIndex > 5) return;*/}

      {/*          return (*/}
      {/*            <div className="p-12">*/}
      {/*              <ListView size="small" style={{ fontWeight: 400 }}>*/}
      {/*                <ListViewItem title="姓名" desc="xxx" />*/}
      {/*                <ListViewItem title="年龄" desc="18" />*/}
      {/*                <ListViewItem title="数值" desc="516" />*/}
      {/*                <ListViewItem*/}
      {/*                  title="职业"*/}
      {/*                  desc="*/}
      {/*前端工程师"*/}
      {/*                />*/}
      {/*              </ListView>*/}
      {/*            </div>*/}
      {/*          );*/}
      {/*        }}*/}
      {/*      />*/}

      <Spacer height={1000} />
    </div>
  );
};

/*
 * 分割线
 * */

export default App;
