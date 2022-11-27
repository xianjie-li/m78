import React from 'react';
import { useVirtualList } from '@m78/hooks';

import sty from './style.module.css';

const list = Array.from({ length: 300000 }).map((it, ind) => ind);

const useVirtualListDemo = () => {
  const virtual = useVirtualList({
    list,
    size: 50,
    space: 100, // 传入额外节点占用总空间即可
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
        <div
          style={{
            position: 'sticky',
            top: 0,
            border: '1px solid red',
            height: 60,
            lineHeight: '60px',
            textAlign: 'center',
            backgroundColor: '#fff',
          }}
        >
          这里放一些额外的节点
        </div>
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
                Row: {item.data}
              </div>
            ))
          }
        </virtual.Render>
        <div
          style={{
            border: '1px solid red',
            height: 60,
            lineHeight: '60px',
            textAlign: 'center',
          }}
        >
          这里放一些额外的节点
        </div>
      </div>
    </div>
  );
};

export default useVirtualListDemo;
