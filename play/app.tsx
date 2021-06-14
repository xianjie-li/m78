import React, { useEffect, useMemo, useState } from 'react';
import { m78Config } from 'm78/config';
import { Divider, Spacer, Tile } from 'm78/layout';
import { Button } from 'm78/button';
import { Toggle } from 'm78/fork';
import { Table } from 'm78/table';

const App = () => {
  const dark = m78Config.useState(state => state.darkMode);

  return (
    <div className="p-32">
      <Button onClick={() => m78Config.setState({ darkMode: !m78Config.getState().darkMode })}>
        {dark ? 'dark' : 'light'}
      </Button>

      <Divider />

      <Spacer height={50} />

      <Table />

      <Spacer height={1000} />
    </div>
  );
};

/*
 * 分割线
 * */

export default App;
