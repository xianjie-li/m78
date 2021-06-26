import React from 'react';
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

const CellPropsDemo = () => {
  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        props={({ column, record, rowIndex, isBody, isHead }) => {
          // 指定单元格格
          if ((record.id === '64734921' || record.id === '17266660') && column.field === 'id') {
            return {
              style: {
                backgroundColor: '#ffacd2',
                fontSize: 22,
              },
              // 可以传入其他任意dom prop
              onClick: () => {
                alert('点击单元格');
              },
            };
          }

          // 只设置表头
          if (isHead && column.field === 'name') {
            return {
              style: {
                color: '#3d97e3',
              },
            };
          }

          // 指定列
          if (column.field === 'pkg') {
            return {
              style: {
                backgroundColor: '#ffdddd',
              },
            };
          }

          if (column.field === 'rare') {
            return {
              style: {
                backgroundColor: '#daf5e7',
              },
            };
          }

          // 指定行
          if (isBody && rowIndex % 2 === 0) {
            return {
              style: {
                backgroundColor: '#dbf1f7',
              },
            };
          }
        }}
      />
    </div>
  );
};

export default CellPropsDemo;
