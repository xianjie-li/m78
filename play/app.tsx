import React, { useEffect, useRef } from 'react';
import { m78Config } from 'm78/config';
import { Divider, MediaQuery, Grids, GridsItem } from 'm78/layout';
import { Button } from 'm78/button';

import './style.scss';

const App = () => {
  const dark = m78Config.useState(state => state.darkMode);

  return (
    <div className="p-32">
      <Button onClick={() => m78Config.setState({ darkMode: !m78Config.getState().darkMode })}>
        {dark ? 'dark' : 'light'}
      </Button>

      <Divider />

      <MediaQuery>
        {meta => {
          return <div>{JSON.stringify(meta)}</div>;
        }}
      </MediaQuery>

      <Grids direction="vertical" gutter={6} mainAlign="center">
        <GridsItem style={{ height: 100 }} col={3}>
          1
        </GridsItem>
        <GridsItem md={{ hidden: true }}>2</GridsItem>
        {/*<GridsItem flex="1">3</GridsItem>*/}
        <GridsItem col={3}>4</GridsItem>
      </Grids>
    </div>
  );
};

/*
 * 分割线
 * */

export default App;
