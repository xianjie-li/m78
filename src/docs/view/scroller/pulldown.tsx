import React, { useState } from 'react';
import { Scroller } from 'm78/scroller';
import { UndoOutlined } from 'm78/icon';
import { delay } from '@lxjx/utils';
import { Divider } from 'm78/layout';
import { mockData } from './util';

import testImg from './test.jpg';

import sty from './style.module.scss';

const PullDown = () => {
  const [list, setList] = useState(() => mockData(12));

  return (
    <div>
      <h3>单独使用</h3>
      <Scroller
        style={{ width: 300, height: 400, border: '1px solid #ccc' }}
        onPullDown={async () => {
          await delay(1500);

          setList(mockData(12));

          console.log('刷新结束');
        }}
      >
        {list.map(item => (
          <div key={item} className={sty.Item}>
            {item}
          </div>
        ))}
      </Scroller>

      <Divider margin={30} />

      <h3>自定义指示器</h3>
      <Scroller
        style={{ width: 300, height: 400, border: '1px solid #ccc' }}
        pullDownIndicator={<UndoOutlined style={{ fontSize: '28px' }} />}
        onPullDown={async () => {
          await delay(1500);

          setList(mockData(12));

          console.log('刷新结束');
        }}
      >
        {list.map(item => (
          <div key={item} className={sty.Item}>
            {item}
          </div>
        ))}
      </Scroller>

      <Divider margin={30} />

      <h3>自定义下拉内容</h3>
      <Scroller
        style={{ width: 300, height: 400, border: '1px solid #ccc' }}
        pullDownNode={<img src={testImg} alt="" style={{ width: '100%', height: 118 }} />}
        threshold={118}
        onPullDown={async () => {
          await delay(10000);
        }}
        pullDownTips={false}
      >
        {list.map(item => (
          <div key={item} className={sty.Item}>
            {item}
          </div>
        ))}
      </Scroller>
    </div>
  );
};

export default PullDown;
