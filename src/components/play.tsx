import React, { useEffect, useRef, useState } from 'react';
import Scroller, { ScrollerRef } from 'm78/scroller';
import { UndoOutlined } from 'm78/icon';
import img1 from '@/mock/img/11.jpg';
import img2 from '@/mock/img/22.jpg';
import img3 from '@/mock/img/33.jpg';
import Carousel from 'm78/carousel';
import { createRandString } from '@lxjx/utils';
import { FixedSizeList, FixedSizeListProps } from 'react-window';
import Tips from 'm78/tips';
import { Divider } from 'm78/layout';
import sty from './play.module.scss';
import testImg from '../docs/view/scroller/test.jpg';

let count = 0;

const Play = () => {
  const queue = Tips.useTipsController({
    defaultItemOption: {
      width: 200,
    },
  });

  function addOne() {
    queue.push([
      {
        message: `这是第${++count}条消息`,
        nextable: true,
        // duration: 3000,
      },
      {
        message: `这是第${++count}条消息`,
        nextable: true,
        // duration: 3000,
      },
      {
        message: `这是第${++count}条消息`,
        nextable: true,
        // duration: 3000,
      },
    ]);
  }

  return (
    <div>
      <div style={{ width: 300, height: 400, border: '1px solid #ccc', position: 'relative' }}>
        <Tips controller={queue} />
      </div>

      <Divider margin={100} />

      <div>
        <button onClick={addOne}>addOne</button>
        <button onClick={queue.prev}>prev</button>
        <button onClick={queue.next}>next</button>
        <button onClick={queue.clear}>clear</button>
        <button onClick={queue.start} disabled={!queue.isPause}>
          start
        </button>
        <button onClick={queue.pause}>pause</button>
        <button
          onClick={() => {
            Tips.push({
              message: '这是一条全局消息',
              nextable: true,
              actions: [
                {
                  text: '点击一下',
                },
              ],
            });
          }}
        >
          push
        </button>
      </div>
    </div>
  );
};

export default Play;
