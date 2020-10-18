import React, { useRef } from 'react';
import Scroller, { ScrollerRef } from 'm78/scroller';
import { UndoOutlined } from 'm78/icon';
import img1 from '@/mock/img/11.jpg';
import img2 from '@/mock/img/22.jpg';
import img3 from '@/mock/img/33.jpg';
import Carousel from 'm78/carousel';
import sty from './play.module.scss';
import testImg from '../mock/img/test.jpg';

/* TODO: 添加到utils */
/**
 * 返回一个延迟指定时间的Promise, payload为Promise的resolve值，如果其为 Error 对象，则promise在指定延迟后reject
 * */
const delay = (ms: number, payload?: any) =>
  new Promise((res, rej) => {
    setTimeout(() => (payload instanceof Error ? rej(payload) : res(payload)), ms);
  });

const Play = () => {
  const scroller = useRef<ScrollerRef>(null!);

  return (
    <div>
      <div style={{ width: '320px', height: '600px' }}>
        <button
          style={{ position: 'fixed', left: 0, top: 0, zIndex: 1000 }}
          onClick={() => scroller.current!.triggerPullDown()}
        >
          refresh
        </button>
        <Scroller
          ref={scroller}
          onPullDown={async () => {
            console.log('下拉刷新触发');
            await delay(2000, new Error('发生错误啦~'));
          }}
        />
      </div>
    </div>
  );
};

export default Play;
