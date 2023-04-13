import React from "react";
import { PULL_DOWN_TRIGGER_RATIO, Scroll, Lay, LayStyle } from "m78";
import { delay } from "@m78/utils";
import { animated } from "react-spring";

const PullDownExample = () => {
  return (
    <Scroll
      direction="xy"
      style={{ height: 360, width: 300 }}
      className="radius"
      // promise 结束后, 刷新状态会自动结束
      onPullDown={async () => {
        await delay(1500);
      }}
      // 可选, 添加提示文本
      pullDownText={(sp) => (
        <animated.span>
          {sp.ratio.to((n) => {
            if (sp.running) return "刷新中...";
            return n >= PULL_DOWN_TRIGGER_RATIO ? "松开刷新" : "下拉刷新";
          })}
        </animated.span>
      )}
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

export default PullDownExample;
