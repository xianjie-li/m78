import React, { useEffect, useRef, useState } from "react";

import { Button } from "../../src/button/index.js";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { IconAllApplication } from "@m78/icons/all-application.js";
import { IconBookmark } from "@m78/icons/bookmark.js";
import { IconSaveOne } from "@m78/icons/save-one.js";
import { IconFileDate } from "@m78/icons/file-date.js";
import { IconLike } from "@m78/icons/like.js";
import { IconMailOpen } from "@m78/icons/mail-open.js";
import { updateDefaultConfig } from "@m78/icons/runtime/index.js";
import { lazy } from "react";

const AllIcon = lazy(
  () => import("@m78/icons/runtime/all.js")
) as any as React.Component;

import("@m78/icons/runtime/map.js").then((iconMap: any) => {});

import "./temp.css";
import { IconWoman } from "@m78/icons/woman.js";
import { IconSnowman } from "@m78/icons/snowman.js";

import {
  Divider,
  Illustration502,
  IllustrationEmpty1,
  IllustrationEmpty2,
  IllustrationEmpty3,
  IllustrationEmpty4,
  IllustrationGeneral1,
  IllustrationGeneral2,
  IllustrationOffline,
  IllustrationProgress,
  IllustrationSuccess1,
  IllustrationSuccess2,
  Result,
} from "../../src/index.js";
import { Illustration404 } from "../../src/index.js";

let ins: any = null;

const Play = () => {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  const node = useRef<any>();

  useEffect(() => {
    // setInterval(() => {
    //   setCount1((p) => p + 1);
    // }, 1000);
  }, []);

  function create() {
    const root = createRoot(node.current);

    flushSync(() => {
      root.render(<Component1></Component1>);
    });

    console.log(ins);

    setTimeout(() => {
      console.log(ins, 222);
    }, 100);
  }

  return (
    <div>
      <div>
        <IconAllApplication
          theme="multi-color"
          size="40"
          fill={["red", "blue", "purple", "pink"]}
        />
        <IconWoman />
        <IconSnowman />
        <IconBookmark
          theme="multi-color"
          size="40"
          fill={["red", "orange", "yellow", "green"]}
        />
        <IconBookmark
          theme="multi-color"
          size={80}
          fill={["red", "blue", "purple", "pink"]}
        />
        <IconSaveOne
          theme="multi-color"
          size="40"
          fill={["red", "blue", "purple", "pink"]}
        />
        <IconFileDate
          theme="multi-color"
          size="40"
          fill={["red", "blue", "purple", "pink"]}
        />
        <Button
          onClick={() => {
            updateDefaultConfig((conf) => {
              conf.theme = "multi-color";
              conf.size = "5em";
            });
          }}
        >
          change1
        </Button>
        <Button
          onClick={() => {
            updateDefaultConfig((conf) => {
              conf.theme = "outline";
              conf.size = "1.2em";
            });
          }}
        >
          change2
        </Button>
      </div>

      <div>
        <Button>
          <IconFileDate />
          点击111
        </Button>
        <Button>
          点击
          <IconFileDate
            theme="outline"
            style={{ marginLeft: 2, marginRight: 2 }}
          />
          点击
        </Button>
        <Button>
          点击
          <IconMailOpen
            theme="outline"
            size="1.2em"
            style={{ marginLeft: 2, marginRight: 2 }}
          />
          点击
        </Button>
        <Button>
          点击
          <IconFileDate size="1.3em" />
        </Button>

        <Button>
          点击
          <IconLike theme="filled" size="1.2em" style={{ marginLeft: 2 }} />
        </Button>
        <Button color="red">
          点击
          <IconLike theme="filled" size="1.2em" style={{ marginLeft: 2 }} />
        </Button>
        <Button color="primary">
          点击
          <IconLike theme="outline" size="1.2em" style={{ marginLeft: 2 }} />
        </Button>
      </div>
      <div ref={node}>node</div>
      <div>count1: {count1}</div>
      <div>count2: {count2}</div>
      <button onClick={create}>render</button>

      <Divider />

      {/*<Illustration404 />*/}

      <Result
        title="您访问的内容不存在~"
        desc="您访问的内容不存在, 请确认"
        icon={<Illustration404 />}
      />
      <Result
        title="服务器发生错误了~"
        desc="服务器发生错误了, 请稍后重试"
        icon={<Illustration502 />}
      />
      <Result
        title="暂时没有内容~"
        desc="当前区域暂时没有内容, 请过段时间再来访问"
        icon={<IllustrationEmpty1 />}
      />
      <Result
        title="暂时没有内容~"
        desc="当前区域暂时没有内容, 请过段时间再来访问"
        icon={<IllustrationEmpty2 />}
      />
      <Result
        title="暂时没有内容~"
        desc="当前区域暂时没有内容, 请过段时间再来访问"
        icon={<IllustrationEmpty3 />}
      />
      <Result
        title="暂时没有内容~"
        desc="当前区域暂时没有内容, 请过段时间再来访问"
        icon={<IllustrationEmpty4 />}
      />
      <Result
        title="没有新的消息~"
        desc="没有新的消息, 请过段时间再来访问"
        icon={<IllustrationGeneral1 />}
      />
      <Result
        title="您当前没有权限访问~"
        desc="没有访问权限, 去其他地方看看吧"
        icon={<IllustrationGeneral2 />}
      />
      <Result
        title="您已离线~"
        desc="当前没有网络连接, 请检查"
        icon={<IllustrationOffline />}
      />
      <Result
        title="操作进行中"
        desc="操作尚未完成, 请过段时间再来查看"
        icon={<IllustrationProgress />}
      />
      <Result
        title="操作完成"
        desc="您的进度已保存"
        icon={<IllustrationSuccess1 />}
      />
      <Result
        title="操作完成"
        desc="干的不错, 请保持"
        icon={<IllustrationSuccess2 />}
      />
    </div>
  );
};

function Component1() {
  ins = 1;

  return <div>13123213</div>;
}

export default Play;
