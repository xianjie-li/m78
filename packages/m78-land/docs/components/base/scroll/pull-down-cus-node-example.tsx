import React from "react";
import { Scroll, Lay, LayStyle } from "m78";
import { delay } from "@m78/utils";

const PullDownCusNodeExample = () => {
  return (
    <Scroll
      direction="xy"
      style={{ height: 360, width: 300 }}
      className="radius"
      // promise 结束后, 下拉状态会自动结束
      onPullDown={async () => {
        await delay(2000);
      }}
      pullDownNode={
        <div className="p-16">
          <span className="color-green fs-24">🏝️椰树牌</span>,{" "}
          <span className="color-red fs-22">
            我从<span className="color-purple fs-28">小</span>喝到
            <span className="color-blue fs-28">大</span>
          </span>
        </div>
      }
    >
      {Array.from({ length: 50 }).map((_, key) => {
        return (
          <Lay
            key={key}
            title={`列表标题${key}`}
            desc="描述描述描述描述描述描述描述描述描述描述描述描述描述"
            itemStyle={LayStyle.border}
          />
        );
      })}
    </Scroll>
  );
};

export default PullDownCusNodeExample;
