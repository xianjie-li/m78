import React, { useEffect, useRef } from 'react';
import { m78Config } from 'm78/config';
import {
  Divider,
  MediaQuery,
  Grids,
  GridsItem,
  MediaQueryContext,
  MediaQueryMeta,
  MediaQueryListener,
} from 'm78/layout';
import { Button } from 'm78/button';

import './style.scss';

import sty from './style.module.scss';

const App = () => {
  const dark = m78Config.useState(state => state.darkMode);

  function getSize(meta: MediaQueryMeta) {
    if (meta.isSmall()) return '小';
    if (meta.isMedium()) return '中';
    if (meta.isLarge()) return '大';
  }

  function render(meta: MediaQueryMeta) {
    return (
      <div>
        <div>{meta.type}</div>
        <div>{getSize(meta)}</div>
        <div className={sty.desc}>
          <span>xs: {meta.isXS().toString()}</span>
          <span>sm: {meta.isSM().toString()}</span>
          <span>md: {meta.isMD().toString()}</span>
          <span>lg: {meta.isLG().toString()}</span>
          <span>xl: {meta.isXL().toString()}</span>
          <span>xxl: {meta.isXXL().toString()}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-32">
      <Button onClick={() => m78Config.setState({ darkMode: !m78Config.getState().darkMode })}>
        {dark ? 'dark' : 'light'}
      </Button>

      <Divider />

      <MediaQuery xs="small" md="medium" xxl="large">
        {(meta, value) => (
          <div>
            {meta.type} {value}
          </div>
        )}
      </MediaQuery>

      <div className={sty.box1}>
        <div className={sty.title}>响应窗口尺寸</div>
        <MediaQuery>{render}</MediaQuery>
      </div>

      <div className={sty.box1}>
        <div className={sty.title}>响应容器尺寸</div>
        <MediaQueryContext>
          <MediaQuery>{render}</MediaQuery>
        </MediaQueryContext>
      </div>
    </div>
  );
};

/*
 * 分割线
 * */

export default App;
