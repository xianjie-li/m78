import React from 'react';
import Button from 'm78/button';
import m78Config from 'm78/config';
import { Divider } from 'm78/layout';
import Tree, { OptionsItem } from 'm78/tree';

const ds: OptionsItem[] = [
  {
    label: '节点1',
    children: [
      {
        label: '节点1-1',
      },
      {
        label: '节点1-2',
      },
      {
        label: '节点1-3',
      },
      {
        label: '节点1-4',
      },
    ],
  },
  {
    label: '节点2',
  },
  {
    label: '节点3',
  },
  {
    label: '节点4',
  },
];

const App = () => {
  const dark = m78Config.useState(state => state.darkMode);

  return (
    <div className="p-32">
      <Button onClick={() => m78Config.setState({ darkMode: !m78Config.getState().darkMode })}>
        {dark ? 'dark' : 'light'}
      </Button>

      <Divider />

      <Tree dataSource={ds} />
    </div>
  );
};

export default App;
