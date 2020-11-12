import React, { useRef } from 'react';
import Scroller, { ScrollerRef } from 'm78/scroller';
import { Divider } from 'm78/layout';
import Button from 'm78/button';
import { mockData } from './util';

import sty from './style.module.scss';

const list = mockData(50);

const Ctrl = () => {
  const ref = useRef<ScrollerRef>(null!);

  return (
    <div>
      <h3>默认</h3>

      <Scroller ref={ref} style={{ width: 300, height: 300, border: '1px solid #ccc' }}>
        {list.map((item, index) => (
          <div key={item} className={`${sty.Item} ${sty.Item + index}`}>
            {index} - {item}
          </div>
        ))}
      </Scroller>

      <Divider margin={20} />

      <Button onClick={() => ref.current.slidePrev()}>上翻页</Button>
      <Button onClick={() => ref.current.slideNext()}>下翻页</Button>
      <Button onClick={() => ref.current.set({ y: 100 })}>滚动到100</Button>
      <Button onClick={() => ref.current.set({ y: 100, raise: true })}>当前位置 +100</Button>
      <Button onClick={() => ref.current.scrollToElement(`.${sty.Item + 30}`)}>
        滚动到第30个项
      </Button>
    </div>
  );
};

export default Ctrl;
