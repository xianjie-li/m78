import React, { useState } from 'react';
import { Table, TableColumns } from 'm78/table';
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
    label: '级别',
    field: 'level',
    sort: true,
  },
  {
    label: '攻',
    field: 'atk',
    sort: 'desc',
  },
  {
    label: '防',
    field: 'def',
    sort: 'asc',
  },
  {
    label: '卡包',
    field: 'pkg',
  },
];

const SortDemo = () => {
  const [ds, setDs] = useState(() => [...dataSource]);

  return (
    <div>
      <Table
        valueKey="id"
        columns={columns}
        dataSource={ds}
        onSortChange={([key, type]) => {
          // 还原
          if (!key && !type) {
            setDs([...dataSource]);
            return;
          }

          // 排序
          setDs(prev => {
            prev.sort((a, b) => {
              const aNum = Number(a[key as 'level']);
              const bNum = Number(b[key as 'level']);
              return type === 'asc' ? aNum - bNum : bNum - aNum;
            });

            return [...prev];
          });
        }}
      />
    </div>
  );
};

export default SortDemo;
