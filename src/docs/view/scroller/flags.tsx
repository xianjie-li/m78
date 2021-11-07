import React from 'react';
import { Scroller } from 'm78/scroller';
import { Divider } from 'm78/layout';
import { mockData } from './util';

import sty from './style.module.scss';

const list = mockData(50);

const Flags = () => (
  <div>
    <h3>进度条</h3>

    <Scroller progressBar style={{ width: 300, height: 300, border: '1px solid #ccc' }}>
      {list.map(item => (
        <div key={item} className={sty.Item}>
          {item}
        </div>
      ))}
    </Scroller>

    <Divider margin={30} />

    <h3>内容指示器</h3>

    <Scroller scrollFlag style={{ width: 300, height: 300, border: '1px solid #ccc' }}>
      {list.map(item => (
        <div key={item} className={sty.Item}>
          {item}
        </div>
      ))}
    </Scroller>
  </div>
);

export default Flags;
