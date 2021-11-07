import React from 'react';
import { Scroller } from 'm78/scroller';
import { Divider } from 'm78/layout';
import { mockData } from './util';

import sty from './style.module.scss';

const list = mockData(50);

const Bar = () => (
  <div>
    <h3>默认</h3>

    <Scroller style={{ width: 300, height: 300, border: '1px solid #ccc' }}>
      {list.map(item => (
        <div key={item} className={sty.Item}>
          {item}
        </div>
      ))}
    </Scroller>

    <Divider margin={30} />

    <h3>只在活动时显示</h3>

    <Scroller hoverWebkitScrollBar style={{ width: 300, height: 300, border: '1px solid #ccc' }}>
      {list.map(item => (
        <div key={item} className={sty.Item}>
          {item}
        </div>
      ))}
    </Scroller>

    <Divider margin={30} />

    <h3>关闭定制</h3>

    <Scroller webkitScrollBar={false} style={{ width: 300, height: 300, border: '1px solid #ccc' }}>
      {list.map(item => (
        <div key={item} className={sty.Item}>
          {item}
        </div>
      ))}
    </Scroller>

    <Divider margin={30} />

    <h3>隐藏滚动条(仍然可滚动)</h3>

    <Scroller hideScrollbar style={{ width: 300, height: 300, border: '1px solid #ccc' }}>
      {list.map(item => (
        <div key={item} className={sty.Item}>
          {item}
        </div>
      ))}
    </Scroller>
  </div>
);

export default Bar;
