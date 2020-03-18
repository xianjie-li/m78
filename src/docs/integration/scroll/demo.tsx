import React from 'react';
import Scroll, { ScrollRef } from '@lxjx/fr/lib/scroll';
import Button from '@lxjx/fr/lib/button';

const itemStyle: React.CSSProperties = {
  height: 50,
  lineHeight: '50px',
  textAlign: 'center',
  border: '1px solid #eee',
};

function getData(success = true, delay = 800) {
  return new Promise<number>((resolve, reject) => {
    setTimeout(() => {
      success ? resolve(5) : reject();
    }, delay);
  });
}

const Demo = () => {
  const [toggle1, set1] = React.useState(true);
  const [toggle3, set3] = React.useState(true);
  const [data, set2] = React.useState(0);
  const scrollRef = React.useRef<ScrollRef>(null!);

  return (
    <div>
      <Scroll
        ref={scrollRef}
        style={{ height: 400, border: '1px solid #eee' }}
        pullDown={toggle1}
        onPullDown={async (pullDownFinish) => {
          console.log('下拉刷新触发');

          await getData(true);

          pullDownFinish(true);

          set2(30);
        }}
        pullUp={toggle3}
        onPullUp={async (pullUpFinish) => {
          await getData(true);
          const num = Math.random() > 0.8 ? 0 : 30;
          const err = Math.random() > 0.9;
          pullUpFinish(num, err);
          !err && set2(prev => prev + num);
        }}
        onScroll={(meta) => {
          console.log(meta);
        }}
        // throttleTime={500}
        hasData={data > 0}
      >
        {Array.from({ length: data }).map((item, key) => (
          <div style={itemStyle} key={key} className={`item el-${key}`}>{key}</div>
        ))}
      </Scroll>
      <div className="mt-16">
        <Button onClick={() => set1(prev => !prev)}>下拉刷新 {toggle1.toString()}</Button>
        <Button onClick={() => scrollRef.current.triggerPullDown()}>手动触发下拉刷新</Button>
        <Button onClick={() => set3(prev => !prev)}>上拉加载 {toggle3.toString()}</Button>
      </div>
      <div className="mt-16">
        <Button onClick={() => scrollRef.current.scrollTo(200)}>滚动到200</Button>
        <Button onClick={() => scrollRef.current.scrollBy(-50)}>当前滚动位置减50</Button>
        <Button onClick={() => scrollRef.current.scrollBy(50)}>当前滚动位置加50</Button>
      </div>
      <div className="mt-16">
        <Button onClick={() => scrollRef.current.scrollToElement('.el-1')}>滚动到元素1</Button>
        <Button onClick={() => scrollRef.current.scrollToElement('.el-5')}>滚动到元素5</Button>
        <Button onClick={() => scrollRef.current.scrollToElement('.el-25')}>滚动到元素25</Button>
      </div>
    </div>
  );
};

export default Demo;
