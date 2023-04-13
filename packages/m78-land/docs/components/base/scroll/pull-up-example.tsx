import React, { useState } from "react";
import { delay } from "@m78/utils";
import { Lay, LayStyle, Scroll } from "m78";

const PullUpExample = () => {
  // 加载中
  const [loading, setLoading] = useState(false);
  // 页数
  const [count, setCount] = useState(1);
  // 没有数据
  const [noData, setNoData] = useState(false);

  return (
    <Scroll
      direction="y"
      style={{ height: 360, width: 300 }}
      onPullUp={async () => {
        if (noData) return;

        setLoading(true);

        await delay(800);

        if (count >= 6) {
          setNoData(true);
        } else {
          setCount((c) => c + 1);
        }

        setLoading(false);
      }}
    >
      {Array.from({ length: 5 * count }).map((_, key) => (
        <Lay
          key={key}
          title={`列表标题${key}`}
          desc="描述描述描述描述描述描述描述描述描述描述描述描述描述"
          itemStyle={LayStyle.border}
        />
      ))}
      <div className="color-second p-16 tc">
        {loading && "加载中..."}
        {noData && "已经到底了..."}
      </div>
    </Scroll>
  );
};

export default PullUpExample;
