import React, { useState } from 'react';
import { m78Config } from 'm78/config';
import { Divider } from 'm78/layout';
import { Button } from 'm78/button';

import './style.scss';
import mockTreeData from '@/docs/form/tree/mockTreeData';
import { Tree } from 'm78/tree';

const App = () => {
  const dark = m78Config.useState(state => state.darkMode);

  const [ds, setDs] = useState(() => mockTreeData(4, 3));

  return (
    <div className="p-32">
      <Button onClick={() => m78Config.setState({ darkMode: !m78Config.getState().darkMode })}>
        {dark ? 'dark' : 'light'}
      </Button>
      <Divider />

      <Tree
        draggable
        dataSource={ds}
        onDataSourceChange={setDs}
        onDragAccept={(e, ds1) => {
          console.log(e, ds1);
        }}
        rainbowIndicatorLine
        height={400}
        defaultOpenAll
      />
    </div>
  );
};

/*
 * 分割线
 * */

export default App;
