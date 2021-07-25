import React, { useState } from 'react';
import { m78Config } from 'm78/config';
import { Divider } from 'm78/layout';
import { Button } from 'm78/button';

import './style.scss';
import dataSource1 from '@/docs/form/tree/ds1';
import { Tree, TreeDataSourceItem } from 'm78/tree';
import { Input } from 'm78/input';

const App = () => {
  const dark = m78Config.useState(state => state.darkMode);

  const [ds] = useState<TreeDataSourceItem[]>(dataSource1);

  const [key, setKey] = useState('');

  return (
    <div className="p-32">
      <Button onClick={() => m78Config.setState({ darkMode: !m78Config.getState().darkMode })}>
        {dark ? 'dark' : 'light'}
      </Button>
      <Divider />

      <div className="t2 border p-12" style={{ width: 300 }}>
        <Input onChange={setKey} value={key} />
        <Tree
          dataSource={ds}
          actions={<Button text>text</Button>}
          icon="📘"
          twigIcon="📂"
          customIconRender={icon => <span>{icon}</span>}
          keyword={key}
        />
      </div>
    </div>
  );
};

/*
 * 分割线
 * */

export default App;
