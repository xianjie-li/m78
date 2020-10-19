import React, { useRef, useState } from 'react';
import Scroller, { ScrollerRef } from 'm78/scroller';
import { UndoOutlined } from 'm78/icon';
import img1 from '@/mock/img/11.jpg';
import img2 from '@/mock/img/22.jpg';
import img3 from '@/mock/img/33.jpg';
import Carousel from 'm78/carousel';
import { createRandString } from '@lxjx/utils';
import sty from './play.module.scss';
import testImg from '../mock/img/test.jpg';

/* TODO: 添加到utils */
/**
 * 返回一个延迟指定时间的Promise, payload为Promise的resolve值，如果其为 Error 对象，则promise在指定延迟后reject
 * */
function delay<T = any>(ms: number, payload?: T) {
  return new Promise<T extends Error ? void : T>((res, rej) => {
    setTimeout(() => (payload instanceof Error ? rej(payload) : res(payload as any)), ms);
  });
}

function mockData(length = 12) {
  return new Promise<string[]>((res, rej) => {
    setTimeout(() => {
      Math.random() > 0.7 ? rej() : res(Array.from({ length }).map(() => createRandString()));
    }, 1000);
  });
}

const Play = () => {
  const scroller = useRef<ScrollerRef>(null!);

  const [list, setList] = useState<string[]>([]);

  console.log(list);

  return (
    <div>
      <div style={{ width: '320px', height: '400px', border: '1px solid #eee' }}>
        <button
          style={{ position: 'fixed', left: 0, top: 0, zIndex: 1000 }}
          onClick={() => scroller.current!.triggerPullDown()}
        >
          refresh
        </button>
        <Scroller
          ref={scroller}
          hasData={list.length > 0}
          onPullDown={async () => {
            console.log('下拉刷新触发');

            const _list = await mockData(10);

            setList(_list);
          }}
          onPullUp={async ({ isRefresh }) => {
            console.log('上拉加载触发:', isRefresh ? '刷新' : '加载');

            const _list = await mockData(Math.random() > 0.7 ? 0 : 10);

            setList(prev => [...prev, ..._list]);

            return _list.length;
          }}
        >
          {list.map(item => (
            <div key={item} className={sty.Item}>
              {item}
            </div>
          ))}
        </Scroller>
      </div>
    </div>
  );
};

export default Play;
