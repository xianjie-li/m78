import React, { useState } from 'react';
import { delay, getRandRange } from '@lxjx/utils';
import { Table, TableColumns } from 'm78/table';

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
];

// 生成模拟条数据
const generateChildren = (pLabel = '') => {
  if (Math.random() > 0.7) return []; // 应包含子项但为空

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
    isLeaf: Math.random() > 0.7, // 明确声明为叶子节点，该节点不可再展开
  }));
};

const TreeDynamicLoadDemo = () => {
  const [ds, setDs] = useState(() => generateChildren('1'));

  return (
    <div>
      <Table
        valueKey="id"
        height={400}
        columns={columns}
        dataSource={ds}
        onDataSourceChange={setDs as any}
        onLoad={async node => {
          // 模拟请求延迟
          await delay(400);

          return generateChildren(node.origin.id as string);
        }}
        cellMaxWidth={1000}
      />
    </div>
  );
};

export default TreeDynamicLoadDemo;
