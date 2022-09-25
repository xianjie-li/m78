import React from "react";
import { createRoot } from "react-dom/client";
import { useVirtualList } from "../../src";

import sty from "./style.module.css";

const list = Array.from({ length: 100 }).map((it, ind) => ind);

const useVirtualListDemo = () => {
  const virtual = useVirtualList({
    list,
    size: 50,
    disabled: false,
    height: 300,
  });

  return (
    <div
      style={{
        maxHeight: 300, // 滚动容器必须包含高度
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
                  backgroundColor: item.index % 2 === 0 ? "#f8f8f0" : undefined,
                }}
              >
                Row: {item.data}
              </div>
            ))
          }
        </virtual.Render>
      </div>
    </div>
  );
};

export default useVirtualListDemo;
