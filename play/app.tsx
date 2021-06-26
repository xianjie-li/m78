import React, { useState } from 'react';
import { m78Config } from 'm78/config';
import { Divider, Row, Spacer } from 'm78/layout';
import { Button } from 'm78/button';
import { Table, TableColumns, TableDataSourceItem, TableDivideStyleEnum } from 'm78/table';
import 'm78/table/style';
import { ListView, ListViewItem } from 'm78/list-view';
import { datetime, delay, getRandRange, isString } from '@lxjx/utils';
import { dataSource } from './dataSource';
import dataSource1 from '@/docs/form/tree/ds1';
import { dataSource2 } from './dataSource2';
import { useSetState } from '@lxjx/hooks';
import { RadioBox } from 'm78/radio-box';
import { Check } from 'm78/check';
import { SizeEnum } from 'm78/types';
import { Popper } from 'm78/popper';
import { Input } from 'm78/input';
import { Select } from 'm78/select';
import { TreeValueType } from 'm78/tree';

let count = 0;

/** 指定长度、深度、label来生成模拟的treedata */
function mockTreeData(length: number, z: number) {
  const ls: TableDataSourceItem[] = [];

  function gn(list: TableDataSourceItem = [], vp: string, cZInd = 0) {
    Array.from({ length }).forEach((_, index) => {
      const v = vp ? `${vp}-${index + 1}` : String(index + 1);
      const children: TableDataSourceItem[] = [];

      const current: TableDataSourceItem = {
        id: v,
        num: ++count,
        name: `欧尼斯特 ${v}`,
        jName: 'オネスト',
        race: '天使',
        property: '光',
        level: '4',
        atk: '1100',
        def: '1900',
        // children: Math.random() > 0.5 ? [] : undefined,
        desc:
          '自己的主要阶段可以发动。使场上的表侧表示的这张卡返回持有者的手牌。②：自己的光属性怪兽进行战斗的从伤害步骤开始时到伤害计算前，可以将这张卡从手牌送入墓地发动。那只怪兽的攻击力直到回合结束时上升进行战斗的对手怪兽的攻击力数值。',
        rare: '立体UTR.',
      };

      list.push(current);

      if (cZInd !== z) {
        current.children = children;
        gn(children, v, cZInd + 1);
      }
    });
  }

  gn(ls, '');

  count = 0;

  return ls;
}

const ds2 = mockTreeData(5, 3);

// 生成一到5条数据
const generateChildren = (pLabel = '') => {
  const length = getRandRange(2, 6);

  return Array.from({ length }).map((_, ind) => ({
    id: `${pLabel}-${ind + 1}`,
    name: `主宰者 许珀里翁 ${pLabel}-${ind + 1}`,
    jName: 'マスター・ヒュペリオン',
    race: '天使',
    property: '光',
    level: '8',
    atk: '2700',
    def: '2100',
    pkg: 'SD20',
    rare: '金字UR',
    isLeaf: Math.random() > 0.7,
  }));
};

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
];

const App = () => {
  const dark = m78Config.useState(state => state.darkMode);

  const [d, setD] = useState(ds2);

  const [toggle, setToggle] = useState(false);

  const [state, setState] = useSetState({
    divideStyle: TableDivideStyleEnum.regular,
    size: (undefined as unknown) as SizeEnum | undefined,
    stripe: true,
  });

  const [ds] = useState(() => mockTreeData(6, 3));

  const [checked, setChecked] = useState<TreeValueType[]>(['1-1-1-2']);

  return (
    <div className="p-32">
      <Button onClick={() => m78Config.setState({ darkMode: !m78Config.getState().darkMode })}>
        {dark ? 'dark' : 'light'}
      </Button>
      <Divider />
      {/* @ts-ignore */}
      <Button onClick={() => (d === ds ? setD(ds2) : setD(ds))}>change</Button>
      <Spacer height={50} />
      <Button onClick={() => setToggle(prev => !prev)}>toggle</Button>

      <Row crossAlign="center">
        <span className="mr-8">分割风格: </span>
        <RadioBox
          size="small"
          options={[
            {
              label: '常规',
              value: TableDivideStyleEnum.regular,
            },
            {
              label: '边框',
              value: TableDivideStyleEnum.border,
            },
          ]}
          value={state.divideStyle}
          onChange={divideStyle => {
            setState({ divideStyle });
          }}
        />
      </Row>

      <Row crossAlign="center">
        <span className="mr-8">尺寸: </span>
        <RadioBox
          size="small"
          options={[
            {
              label: '常规',
              value: undefined,
            },
            {
              label: '小',
              value: SizeEnum.small,
            },
            {
              label: '大',
              value: SizeEnum.large,
            },
          ]}
          value={state.size}
          onChange={size => {
            setState({ size });
          }}
        />
      </Row>

      <Row crossAlign="center">
        <span className="mr-8">条纹背景: </span>
        <Check
          size="small"
          type="switch"
          checked={state.stripe}
          onChange={check => {
            setState({
              stripe: check,
            });
          }}
        />
      </Row>

      <div className="mt-24">
        <div className="ellipsis">选中项: {checked.join(', ')}</div>
        <Table
          valueGetter={item => item.uid}
          height={400}
          columns={columns}
          dataSource={ds}
          accordion
        />
      </div>

      {toggle && (
        <Table
          multipleCheckable
          // showColumns={['id', 'name', 'num', 'relation[0].name']}
          height={500}
          // divideStyle="border"
          columns={columns}
          dataSource={d}
          onChange={e => {
            console.log(e);
          }}
          // summary={({ column }) => {
          //   if (column.label === '#') return '总计';
          //   if (column.label === '数值') {
          //     const count = d.reduce((prev, item) => {
          //       if (isNaN(prev)) return prev;
          //       return prev + item.num;
          //     }, 0);
          //
          //     return isNaN(count) ? 'N/A' : count;
          //   }
          //   return <span className="color-second fw">N/A</span>;
          // }}
          //           expand={({ rowIndex }) => {
          //             if (rowIndex > 5) return;
          //
          //             return (
          //               <div className="p-12">
          //                 <ListView size="small" style={{ fontWeight: 400 }}>
          //                   <ListViewItem title="姓名" desc="xxx" />
          //                   <ListViewItem title="年龄" desc="18" />
          //                   <ListViewItem title="数值" desc="516" />
          //                   <ListViewItem
          //                     title="职业"
          //                     desc="
          // 前端工程师"
          //                   />
          //                 </ListView>
          //               </div>
          //             );
          //           }}
          onSortChange={([key, type]) => {
            if (key === 'num') {
              setD(prev => {
                prev.sort((a, b) => {
                  return type === 'asc' ? a.num - b.num : b.num - a.num;
                });

                return [...prev];
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
