import React, { useState } from 'react';
import { m78Config } from 'm78/config';

import './style.scss';
// import { Spin } from 'm78/spin';
import { Button } from 'm78/button';
import { Overlay } from 'm78/overlay';

const App = () => {
  const dark = m78Config.useState(state => state.darkMode);

  const [render, setRender] = useState(false);

  const [show, setShow] = useState(false);

  return (
    <div className="m78 p-32">
      <button
        style={{ position: 'fixed', right: 12, top: 12 }}
        type="button"
        onClick={() => m78Config.set({ darkMode: !m78Config.get().darkMode })}
      >
        {dark ? 'dark' : 'light'}
      </button>

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

/*
 * 分割线
 * */

export default App;
