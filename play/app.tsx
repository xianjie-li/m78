import React, { useState } from 'react';
import { m78Config } from 'm78/config';
import { Divider } from 'm78/layout';
import { Button } from 'm78/button';

import './style.scss';
import { mockTreeData } from '@/docs/view/table/mock-tree-data';
import { Table, TableColumns } from 'm78/table';

// 配置要显示的列
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
];

const App = () => {
  const dark = m78Config.useState(state => state.darkMode);

  const [ds, setDs] = useState(() => mockTreeData(8, 3));

  return (
    <div className="p-32">
      <Button onClick={() => m78Config.setState({ darkMode: !m78Config.getState().darkMode })}>
        {dark ? 'dark' : 'light'}
      </Button>
      <Divider />

      <div className="t2">
        <Table
          draggable
          height={400}
          valueKey="id"
          columns={columns}
          dataSource={ds}
          onDataSourceChange={dd => {
            console.log(222, dd);
            setDs(dd);
          }}
        />
      </div>
    </div>
  );
};

/*
 * 分割线
 * */

export default App;
