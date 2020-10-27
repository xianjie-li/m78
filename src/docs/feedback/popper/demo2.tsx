import React from 'react';
import Popper from 'm78/popper';
import Button from 'm78/button';

const Demo2 = () => {
  return (
    <div>
      <Popper content="鼠标移入显示(默认)">
        <Button>hover</Button>
      </Popper>

      <Popper trigger="click" content="点击显示">
        <Button>click</Button>
      </Popper>

      <Popper trigger="focus" content="聚焦时显示">
        <Button>focus(尝试通过tab取得焦点)</Button>
      </Popper>

      <Popper trigger={['focus', 'hover']} content="聚焦和hover时显示">
        <Button>focus + hover</Button>
      </Popper>
    </div>
  );
};

export default Demo2;
