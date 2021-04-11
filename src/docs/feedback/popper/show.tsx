import React, { useState } from 'react';
import Popper from 'm78/popper';
import Button from 'm78/button';

const Show = () => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <Popper content="这是提示文本">
        <Button>组件内部控制</Button>
      </Popper>

      <Popper content="这是提示文本" defaultShow>
        <Button>设置默认值</Button>
      </Popper>

      <Popper content="这是提示文本" show={show} onChange={_show => setShow(_show)}>
        <Button>组件内部控制</Button>
      </Popper>
    </div>
  );
};

export default Show;
