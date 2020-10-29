import React from 'react';
import { Spacer } from 'm78/layout';
import Pin from 'm78/pin';

const Demo = () => (
  <div>
    <div className="tc" style={{ fontSize: 40 }}>
      向下滚动👇
    </div>

    <Spacer height={800} />

    <div style={{ position: 'relative', height: 800, fontSize: 50 }}>
      <span style={{ position: 'absolute', top: 100, left: '11.28%' }}>
        <Pin offsetTop={64}>
          <span>😂</span>
        </Pin>
      </span>
      <span style={{ position: 'absolute', top: 200, left: '25.56%' }}>
        <Pin offsetTop={64}>
          <span>🤣</span>
        </Pin>
      </span>
      <span style={{ position: 'absolute', top: 300, left: '39.84%' }}>
        <Pin offsetTop={64}>
          <span>😃</span>
        </Pin>
      </span>
      <span style={{ position: 'absolute', top: 400, left: '54.12%' }}>
        <Pin offsetTop={64}>
          <span>😅</span>
        </Pin>
      </span>
      <span style={{ position: 'absolute', top: 500, left: '68.40%' }}>
        <Pin offsetTop={64}>
          <span>😋</span>
        </Pin>
      </span>
      <span style={{ position: 'absolute', top: 600, left: '82.67%' }}>
        <Pin offsetTop={64}>
          <span>😆</span>
        </Pin>
      </span>
    </div>

    <Spacer height={800} />
  </div>
);

export default Demo;
