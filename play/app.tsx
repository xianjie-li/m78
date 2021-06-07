import React, { useEffect, useMemo, useState } from 'react';
import { m78Config } from 'm78/config';
import { Divider, Tile } from 'm78/layout';
import { Button } from 'm78/button';
import { Toggle } from 'm78/fork';

const App = () => {
  const dark = m78Config.useState(state => state.darkMode);

  return (
    <div className="p-32">
      <Button onClick={() => m78Config.setState({ darkMode: !m78Config.getState().darkMode })}>
        {dark ? 'dark' : 'light'}
      </Button>

      <Divider />

      <div>QQ</div>
      <Toggle when={false}>
        <div style={{ color: 'red' }}>333</div>
      </Toggle>
      <Toggle>444</Toggle>
      <Toggle when={false}>
        <div>555</div>
        <div style={{ color: 'blue' }}>666</div>
        <div>666</div>
      </Toggle>
    </div>
  );
};

/*
 * 分割线
 * */

export default App;
