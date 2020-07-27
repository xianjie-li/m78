import React from 'react';
import Popper from '@lxjx/fr/popper';
import Button from '@lxjx/fr/button';

const Demo2 = () => {
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
      <Popper title="一个提示框" type="popper" content={renderContent()}>
        <Button>hover</Button>
      </Popper>

      <Popper trigger="click" title="一个提示框" type="popper" content={renderContent()}>
        <Button>click</Button>
      </Popper>

      <Popper trigger="focus" title="一个提示框" type="popper" content={renderContent()}>
        <Button>focus</Button>
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

export default Demo2;
