import React, { useState } from 'react';
import { useVirtualList, VirtualList } from '@m78/hooks';

import sty from './style.module.css';

const list = Array.from({ length: 300000 }).map((it, ind) => ind);

function Item(item: VirtualList<number>[0]) {
  const [toggle, setToggle] = useState(false);

  return (
    <div
      onClick={() => setToggle((prev) => !prev)}
      className={sty.item}
      style={{
        height: item.size,
        backgroundColor: item.index % 2 === 0 ? '#f8f8f0' : undefined,
      }}
    >
      <span style={{ marginRight: 12 }}>Row: {item.data}</span>
      {toggle ? (
        <span style={{ color: 'green' }}>active</span>
      ) : (
        <span style={{ color: 'red' }}>inactive</span>
      )}
    </div>
  );
}

const useVirtualListDemo = () => {
  const virtual = useVirtualList({
    list,
    keepAlive: (item) => item === 2 || item === 6 || item === 299999,
    size: 50,
    overscan: 5, // 超过可能被keepAlive的项
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
            state.list.map((item) => <Item {...item} key={item.key} />)
          }
        </virtual.Render>
      </div>
    </div>
  );
};

export default useVirtualListDemo;
