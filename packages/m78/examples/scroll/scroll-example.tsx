import React, { useState } from "react";
import { Scroll } from "../../src/scroll/index.js";
import { Divider, Row } from "../../src/layout/index.js";
import { delay } from "@m78/utils";
import { PULL_DOWN_TRIGGER_RATIO } from "../../src/scroll/index.js";
import { animated } from "react-spring";

const ScrollExample = () => {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(1);
  return (
    <div>
      <Scroll
        direction="xy"
        style={{ height: 300, width: 300, border: "1px solid red" }}
        dragScroll
        scrollIndicator={false}
      >
        <div
          style={{
            width: 600,
            height: 600,
            background:
              "linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%),linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%),linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)",
          }}
        >
          lorem
        </div>
      </Scroll>

      <Divider>dragScroll</Divider>

      <div
        style={{
          height: 340,
          width: 340,
          border: "1px solid red",
          overflow: "auto",
        }}
      >
        <div
          style={{
            height: 1000,
            width: 1000,
            background:
              "linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%),linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%),linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)",
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis
          esse iste labore nobis perferendis quis quo similique sit.
          Consequuntur excepturi fuga in neque porro quasi, quia veniam? Autem,
          distinctio, possimus.lorem Lorem ipsum dolor sit amet, consectetur
          adipisicing elit. A aliquam asperiores blanditiis commodi debitis eum
          exercitationem, fuga impedit iste iure maxime necessitatibus nihil,
          numquam odit possimus praesentium quasi ratione unde! Lorem ipsum
          dolor sit amet, consectetur adipisicing elit. Blanditiis esse iste
          labore nobis perferendis quis quo similique sit. Consequuntur
          excepturi fuga in neque porro quasi, quia veniam? Autem, distinctio,
          possimus.lorem Lorem ipsum dolor sit amet, consectetur adipisicing
          elit. A aliquam asperiores blanditiis commodi debitis eum
          exercitationem, fuga impedit iste iure maxime necessitatibus nihil,
          numquam odit possimus praesentium quasi ratione unde! Lorem ipsum
          dolor sit amet, consectetur adipisicing elit. Blanditiis esse iste
          labore nobis perferendis quis quo similique sit. Consequuntur
          excepturi fuga in neque porro quasi, quia veniam? Autem, distinctio,
          possimus.lorem Lorem ipsum dolor sit amet, consectetur adipisicing
          elit. A aliquam asperiores blanditiis commodi debitis eum
          exercitationem, fuga impedit iste iure maxime necessitatibus nihil,
          numquam odit possimus praesentium quasi ratione unde!
        </div>
      </div>

      <Scroll direction="xy" style={{ height: 340, width: 340 }} dragScroll>
        <div
          style={{
            height: 1000,
            width: 1000,
            background:
              "linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%),linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%),linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)",
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis
          esse iste labore nobis perferendis quis quo similique sit.
          Consequuntur excepturi fuga in neque porro quasi, quia veniam? Autem,
          distinctio, possimus.lorem Lorem ipsum dolor sit amet, consectetur
          adipisicing elit. A aliquam asperiores blanditiis commodi debitis eum
          exercitationem, fuga impedit iste iure maxime necessitatibus nihil,
          numquam odit possimus praesentium quasi ratione unde! Lorem ipsum
          dolor sit amet, consectetur adipisicing elit. Blanditiis esse iste
          labore nobis perferendis quis quo similique sit. Consequuntur
          excepturi fuga in neque porro quasi, quia veniam? Autem, distinctio,
          possimus.lorem Lorem ipsum dolor sit amet, consectetur adipisicing
          elit. A aliquam asperiores blanditiis commodi debitis eum
          exercitationem, fuga impedit iste iure maxime necessitatibus nihil,
          numquam odit possimus praesentium quasi ratione unde! Lorem ipsum
          dolor sit amet, consectetur adipisicing elit. Blanditiis esse iste
          labore nobis perferendis quis quo similique sit. Consequuntur
          excepturi fuga in neque porro quasi, quia veniam? Autem, distinctio,
          possimus.lorem Lorem ipsum dolor sit amet, consectetur adipisicing
          elit. A aliquam asperiores blanditiis commodi debitis eum
          exercitationem, fuga impedit iste iure maxime necessitatibus nihil,
          numquam odit possimus praesentium quasi ratione unde!
        </div>
      </Scroll>

      <Divider>miniBar</Divider>

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

      <Scroll
        direction="y"
        style={{ height: 300, width: 200 }}
        onPullUp={async () => {
          setLoading(true);

          console.log("trigger");
          await delay(2000);

          setCount((c) => c + 1);

          setLoading(false);
        }}
      >
        {Array.from({ length: 5 * count }).map((_, i) => (
          <div key={i} className="temp-item">
            完工奇怪气温高物权法五个五个额外各位各位额五个五个热话题然后和人哈耳环饿完工奇怪气温高物权法五个五个额外各位各位额五个五个热话题然后和人哈耳环饿{" "}
            {i + 1}
          </div>
        ))}
        {loading && "加载中..."}
      </Scroll>
    </div>
  );
};

export default ScrollExample;
