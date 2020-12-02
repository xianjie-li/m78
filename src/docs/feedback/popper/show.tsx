import React, { useState } from 'react';
import Popper from 'm78/popper';

const Show = () => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <Popper content="这是提示文本">
        <button type="button">组件内部控制</button>
      </Popper>

      <Popper content="这是提示文本" defaultShow>
        <button type="button">设置默认值</button>
      </Popper>

      <Popper content="这是提示文本" show={show} onChange={_show => setShow(_show)}>
        <button type="button">组件内部控制</button>
      </Popper>
    </div>
  );
};

export default Show;
