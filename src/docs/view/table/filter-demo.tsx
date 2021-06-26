import React, { useState } from 'react';
import { Table, TableColumns } from 'm78/table';
import { Select } from 'm78/select';
import { Popper } from 'm78/popper';
import { Row } from 'm78/layout';
import { Input } from 'm78/input';
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
    label: '日文名',
    field: 'jName',
  },
  {
    label: '种族',
    field: 'race',
    extra: ({ ctx }) => {
      return (
        <Select
          onChange={val => ctx.filterByKey('race', val)}
          options={[
            {
              label: '无',
              value: '',
            },
            {
              value: '天使',
            },
            {
              value: '恶魔',
            },
            {
              value: '炎',
            },
            {
              value: '水',
            },
            {
              value: '战士',
            },
            {
              value: '龙',
            },
          ]}
        >
          <span className="cus-p">⚙</span>
        </Select>
      );
    },
  },
  {
    label: '属性',
    field: 'property',
  },
  {
    label: '级别',
    field: 'level',
    extra: ({ ctx }) => {
      return (
        <Popper
          type="popper"
          content={
            <Row crossAlign="center">
              <span className="mr-8">星级: </span>
              <Input
                type="integer"
                size="small"
                style={{ width: 100 }}
                onChange={val => ctx.filterByKey('level', val)}
              />
            </Row>
          }
        >
          <span className="cus-p">⚙</span>
        </Popper>
      );
    },
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

const FilterDemo = () => {
  const [ds, setDs] = useState(() => [...dataSource]);

  // 根据key和值过滤数据
  function filterByKey(key: string, value?: string) {
    if (!value) {
      setDs([...dataSource]);
      return;
    }

    setDs(dataSource.filter(item => item[key as 'id'] === value));
  }

  return (
    <div>
      <Table
        // 可以在静态column配置中接收此对象，当然，你也可以将columns声明在组件作用域内
        ctx={{
          filterByKey,
        }}
        columns={columns}
        dataSource={ds}
      />
    </div>
  );
};

export default FilterDemo;
