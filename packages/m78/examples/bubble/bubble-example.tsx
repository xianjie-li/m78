import React from "react";
import { Button } from "../../src/index.js";
import { Bubble, BubbleType } from "../../src/bubble/index.js";
import { IconLike } from "@m78/icons/like.js";

const IconAlbum = IconLike;

const BubbleExample = () => {
  return (
    <div style={{ padding: 100 }}>
      <Bubble content="一段简单的文本提示, 也可以是任意ReactNode" status="info">
        <Button>tooltip</Button>
      </Bubble>

      <Bubble
        content="一段简单的文本提示, 也可以是任意ReactNode"
        icon={<IconAlbum />}
      >
        <Button>tooltip</Button>
      </Bubble>

      <Bubble content="呵呵" status="warning">
        <Button>tooltip</Button>
      </Bubble>

      <Bubble
        title="Popper提示"
        type={BubbleType.popper}
        status="error"
        content={
          <div>
            <div>气内容</div>
            <div>适合放置放</div>
          </div>
        }
      >
        <Button>popper</Button>
      </Bubble>

      <Bubble
        type={BubbleType.confirm}
        content="此操作不可撤, 是否确认?"
        status="warning"
        onConfirm={() => {
          console.log("确认");
        }}
      >
        <Button>confirm</Button>
      </Bubble>

      <Bubble
        title="这是标题"
        type={BubbleType.confirm}
        content="此操作不可撤, 是否确认?"
        status="error"
        onConfirm={() => {
          console.log("确认");
        }}
      >
        <Button>confirm</Button>
      </Bubble>
    </div>
  );
};

export default BubbleExample;
