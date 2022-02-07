import React from 'react';
import { Button } from 'm78/button';
import { Bubble, BubbleTypeEnum } from 'm78/bubble';
import { message } from 'm78/message';

const Demo = () => {
  return (
    <div>
      <Bubble content="一段简单的文本提示, 也可以是任意ReactNode">
        <Button>tooltip</Button>
      </Bubble>

      <Bubble
        title="Popper提示"
        type={BubbleTypeEnum.popper}
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
        type={BubbleTypeEnum.confirm}
        content="此操作不可撤, 是否确认?"
        onConfirm={() => {
          message.tips({
            content: '成功删除了"学习资料"',
          });
        }}
      >
        <Button>confirm</Button>
      </Bubble>
    </div>
  );
};

export default Demo;
