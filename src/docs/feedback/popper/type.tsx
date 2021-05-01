import React from 'react';
import { Popper } from 'm78/popper';
import { Button } from 'm78/button';

const type = () => {
  function renderContent() {
    return (
      <div>
        <div>一段文本内容一段文本内容</div>
        <div>一段文本内容一段文本内容</div>
        <div>一段文本</div>
      </div>
    );
  }

  return (
    <div>
      <Popper content="轻提示">
        <Button>tooltip</Button>
      </Popper>

      <Popper title="一个提示框" type="popper" content={renderContent()}>
        <Button>popper</Button>
      </Popper>

      <Popper
        title="操作确认"
        type="confirm"
        content="不可撤销，是否确认?"
        onConfirm={() => console.log('确认操作')}
      >
        <Button>confirm</Button>
      </Popper>
    </div>
  );
};

export default type;
