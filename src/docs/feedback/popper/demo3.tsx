import React, { useRef } from 'react';
import Popper from '@lxjx/fr/popper';

const Demo3 = () => {
  const btn = useRef<HTMLButtonElement>(null!);

  return (
    <div>
      <button type="button" ref={btn}>
        多气泡
      </button>

      <Popper target={btn} content="轻提示" />
      <Popper target={btn} content="确认执行操作?" type="confirm" direction="bottom" />
    </div>
  );
};

export default Demo3;
