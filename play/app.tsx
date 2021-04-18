import React, { useEffect, useState } from 'react';
import Button from 'm78/button';
import Scroller from 'm78/scroller';
import { DirectionEnum } from 'm78/types';

const App = () => {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const [size, setS] = useState(300);

  return (
    <div className="p-32">
      <Button onClick={() => setDark(prev => !prev)}>{dark ? 'dark' : 'light'}</Button>
      <Button onClick={() => setS(prev => (prev === 300 ? 100 : 300))}>setSize {size}</Button>

      <Scroller
        scrollFlag
        style={{ width: 300, height: size, border: '1px solid #ccc' }}
        hideScrollbar
      >
        {Array.from({ length: 15 }).map((_, ind) => (
          <div key={ind} className="p-16 border">
            文本文本
          </div>
        ))}
      </Scroller>

      <Scroller
        style={{
          width: size,
          height: 50,
          border: '1px solid #ccc',
          whiteSpace: 'nowrap',
        }}
        className="mt-32"
        hideScrollbar
        scrollFlag
        direction={DirectionEnum.horizontal}
      >
        {Array.from({ length: 22 }).map((_, ind) => (
          <span
            key={ind}
            className="p-16 border"
            style={{ display: 'inline-block', height: '100%' }}
          >
            文本文本
          </span>
        ))}
      </Scroller>
    </div>
  );
};

export default App;
