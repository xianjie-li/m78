import React from "react";
import { Bubble, BubbleType, Button, Status, notify } from "m78";

const StatusDemo = () => {
  return (
    <div>
      <Bubble content="文本提示或ReactNode" status={Status.info}>
        <Button>tooltip</Button>
      </Bubble>

      <Bubble
        type={BubbleType.popper}
        title="popper提示"
        status={Status.success}
        content={
          <div>
            <div>气泡提示内容</div>
            <div>适合放置一些相对复杂的内容</div>
          </div>
        }
      >
        <Button>popper</Button>
      </Bubble>

      <Bubble
        type={BubbleType.confirm}
        status={Status.warning}
        content="此操作不可撤销, 是否确认?"
        onConfirm={() => {
          notify.success("删除成功");
        }}
      >
        <Button>confirm</Button>
      </Bubble>
    </div>
  );
};

export default StatusDemo;
