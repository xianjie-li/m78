import React, { useEffect, useRef, useState } from 'react';
import Scroller, { ScrollerRef } from 'm78/scroller';
import { UndoOutlined } from 'm78/icon';
import img1 from '@/mock/img/11.jpg';
import img2 from '@/mock/img/22.jpg';
import img3 from '@/mock/img/33.jpg';
import Carousel from 'm78/carousel';
import { createRandString } from '@lxjx/utils';
import { FixedSizeList, FixedSizeListProps } from 'react-window';
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
      Math.random() > 1 ? rej() : res(Array.from({ length }).map(() => createRandString()));
    }, 0);
  });
}

const Play = () => {
  const scroller = useRef<ScrollerRef>(null!);

  const sc = useRef<FixedSizeList>(null!);

  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    mockData(1000).then(res => {
      setList(res);
    });
  }, []);

  function child({ index, style }) {
    return (
      <div className={sty.Item} key={index}>
        {index}
      </div>
    );
  }

  return (
    <div>
      <Scroller style={{ width: 300, height: 400, border: '1px solid #ccc' }}>
        {list.map(item => (
          <div className={sty.Item} key={item}>
            {item}
          </div>
        ))}
      </Scroller>
      <button>click</button>
    </div>
  );
};

export default Play;
