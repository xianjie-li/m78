import React from 'react';
import { Overlay } from 'm78/overlay';
import { Button } from 'm78/button';

const Mount = () => {
  return (
    <div>
      <Overlay childrenAsTarget content={<div style={{ padding: 32, fontSize: 32 }}>气泡内容</div>}>
        <Button>初次打开时渲染, 关闭时保留节点 (默认行为)</Button>
      </Overlay>

      <Overlay
        mountOnEnter
        unmountOnExit
        childrenAsTarget
        content={<div style={{ padding: 32, fontSize: 32 }}>气泡内容</div>}
      >
        <Button>组件挂载时渲染, 关闭时移除</Button>
      </Overlay>
    </div>
  );
};

export default Mount;
