import React from 'react';
import { Scroller } from 'm78/scroller';
import { Direction } from 'm78/common';
import { Divider } from 'm78/layout';
import { mockData } from './util';

import sty from './style.module.scss';

const list = mockData(50);

const Demo = () => (
  <div>
    <h3>纵向滚动</h3>

    <Scroller style={{ width: 300, height: 300, border: '1px solid #ccc' }}>
      {list.map(item => (
        <div key={item} className={sty.Item}>
          {item}
        </div>
      ))}
    </Scroller>

    <Divider margin={30} />

    <h3>横向滚动</h3>

    <Scroller
      direction={Direction.horizontal}
      style={{ width: 300, height: 60, border: '1px solid #ccc', whiteSpace: 'nowrap' }}
    >
      {list.map(item => (
        <div key={item} className={sty.HItem}>
          {item}
        </div>
      ))}
    </Scroller>
  </div>
);

export default Demo;
