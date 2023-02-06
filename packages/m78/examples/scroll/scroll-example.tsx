import React from "react";
import { Scroll } from "../../src/scroll/index.js";
import { Divider, Row } from "../../src/layout/index.js";
import { delay } from "@m78/utils";
import { PULL_DOWN_TRIGGER_RATIO } from "../../src/scroll/index.js";
import { animated } from "react-spring";

const ScrollExample = () => {
  return (
    <div>
      <Scroll direction="y" style={{ height: 300, width: 200 }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="temp-item">
            完工奇怪气温高物权法五个五个额外各位各位额五个五个热话题然后和人哈耳环饿完工奇怪气温高物权法五个五个额外各位各位额五个五个热话题然后和人哈耳环饿{" "}
            {i + 1}
          </div>
        ))}
      </Scroll>

      <Divider />

      <Scroll style={{ whiteSpace: "nowrap", height: 60, width: 200 }} miniBar>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="temp-item"
            style={{ display: "inline-block", height: 60 }}
          >
            完工奇怪气温高物权法五个五个额外各位各位额五个五个热话题然后和人哈耳环饿完工奇怪气温高物权法五个五个额外各位各位额五个五个热话题然后和人哈耳环饿{" "}
            {i + 1}
          </div>
        ))}
      </Scroll>

      <Divider>下拉</Divider>
      <Row>
        <Scroll
          direction="y"
          style={{ height: 300, width: 200 }}
          scrollIndicator
          pullDownText={(sp) => (
            <animated.span>
              {sp.ratio.to((n) => {
                if (sp.running) return "刷新中...";
                return n >= PULL_DOWN_TRIGGER_RATIO ? "松开刷新" : "下拉刷新";
              })}
            </animated.span>
          )}
          onPullDown={async () => {
            await delay(1500);
          }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="temp-item">
              完工奇怪气温高物权法五个五个额外各位各位额五个五个热话题然后和人哈耳环饿完工奇怪气温高物权法五个五个额外各位各位额五个五个热话题然后和人哈耳环饿{" "}
              {i + 1}
            </div>
          ))}
        </Scroll>
        <Scroll
          direction="y"
          style={{ height: 300, width: 200 }}
          scrollIndicator
          pullDownNode={
            <div>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias
              animi blanditiis, distinctio dolores ex explicabo iure.
            </div>
          }
          onPullDown={async () => {
            await delay(1500);
          }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="temp-item">
              完工奇怪气温高物权法五个五个额外各位各位额五个五个热话题然后和人哈耳环饿完工奇怪气温高物权法五个五个额外各位各位额五个五个热话题然后和人哈耳环饿{" "}
              {i + 1}
            </div>
          ))}
        </Scroll>
      </Row>
    </div>
  );
};

export default ScrollExample;
