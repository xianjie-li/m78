import React from 'react';
import { useVirtualList } from '@m78/hooks';

import sty from './style.module.css';

const list = Array.from({ length: 300000 }).map((it, ind) => ind);

const useVirtualListDemo = () => {
  const virtual = useVirtualList({
    list,
    size: 50,
  });

  return (
    <div
      style={{
        height: 300, // 滚动容器必须包含高度
        width: 400,
      }}
      className={sty.container}
      ref={virtual.containerRef}
    >
      <div className={sty.wrap} ref={virtual.wrapRef}>
        <virtual.Render>
          {(state) =>
            state.list.map((item) => (
              <div
                key={item.key}
                className={sty.item}
                style={{
                  height: item.size,
                  backgroundColor: item.index % 2 === 0 ? '#f8f8f0' : undefined,
                }}
              >
                {state.scrolling ? (
                  <span>loading</span>
                ) : (
                  <span>Row: {item.data}</span>
                )}
              </div>
            ))
          }
        </virtual.Render>
      </div>
    </div>
  );
};

export default useVirtualListDemo;
