import React from 'react';
import Scroller from 'm78/scroller';
import sty from './play.module.scss';

/* TODO: 添加到utils */
/**
 * 返回一个延迟指定时间的Promise, payload为Promise的resolve值，如果其为 Error 对象，则promise在指定延迟后reject
 * */
const delay = (ms: number, payload?: any) =>
  new Promise((res, rej) => {
    setTimeout(() => (payload instanceof Error ? rej(payload) : res(payload)), ms);
  });

const Play = () => {
  return (
    <div>
      <div style={{ width: 300, height: 500 }}>
        <Scroller
          onPullDown={async () => {
            console.log('下拉刷新触发');
            await delay(1000, new Error('发生错误啦~'));
          }}
        />
      </div>
    </div>
  );
};

export default Play;
