import React, { useRef } from 'react';
import Popper from 'm78/popper';
import Button from 'm78/button';

const Demo3 = () => {
  const btn = useRef<HTMLButtonElement>(null!);

  return (
    <div>
      <Button innerRef={btn}>多气泡</Button>

      <Popper target={btn} content="轻提示" />
      <Popper target={btn} content="确认执行操作?" type="confirm" direction="bottom" />
    </div>
  );
};

export default Demo3;
