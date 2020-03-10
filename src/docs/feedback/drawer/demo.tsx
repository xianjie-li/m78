import React from 'react';
import Drawer from '@lxjx/flicker/lib/drawer';
import '@lxjx/flicker/lib/drawer/style';

import Button from '@lxjx/flicker/lib/button';
import '@lxjx/flicker/lib/button/style';

const Demo = () => {
  const [state, set] = React.useState({
    show: false,
    direction: 'left',
  });

  const [show1, set1] = React.useState(false);
  const [show2, set2] = React.useState(false);
  const [show3, set3] = React.useState(false);

  const [fullScreenShow, setFullScreen] = React.useState(false);
  const [insideShow, setInsideShow] = React.useState(false);

  function close() {
    set(prev => ({
      direction: prev.direction,
      show: false,
    }));
    setFullScreen(false);
    setInsideShow(false);
  }

  return (
    <div style={{
      width: '100%',
      height: 300,
      border: '1px solid #ccc',
      position: 'relative',
      overflow: 'hidden',
      padding: 16,
    }}
    >
      {/* 方向 */}
      <Drawer
        direction={state.direction as any}
        show={state.show}
        onClose={close}
      >
        <div>
          {Array.from({ length: 6 }).map((v, k) => (
            <p key={k}>content {k + 1} Lorem ipsum dolor sit amet</p>
          ))}
        </div>
      </Drawer>

      {/* 全屏模式 */}
      <Drawer
        fullScreen
        direction="bottom"
        show={fullScreenShow}
        onClose={close}
      >
        <div>
          {Array.from({ length: 6 }).map((v, k) => (
            <p key={k}>content {k + 1} Lorem ipsum dolor sit amet</p>
          ))}
        </div>
      </Drawer>

      {/* 容器模式 */}
      <Drawer
        inside
        direction="right"
        show={insideShow}
        onClose={close}
      >
        <div>
          {Array.from({ length: 6 }).map((v, k) => (
            <p key={k}>content {k + 1} Lorem ipsum dolor sit amet</p>
          ))}
        </div>
      </Drawer>

      {/* 多层 */}
      <Drawer
        direction="right"
        show={show1}
        onClose={() => set1(false)}
      >
        <div>
          <Button onClick={() => set2(true)}>第二层</Button>
          {Array.from({ length: 6 }).map((v, k) => (
            <p key={k}>content {k + 1} Lorem ipsum dolor sit amet</p>
          ))}
        </div>
      </Drawer>
      <Drawer
        direction="right"
        show={show2}
        onClose={() => set2(false)}
      >
        <div>
          <Button onClick={() => set3(true)}>第三层</Button>
          {Array.from({ length: 6 }).map((v, k) => (
            <p key={k}>content {k + 1} Lorem ipsum dolor sit amet</p>
          ))}
        </div>
      </Drawer>
      <Drawer
        direction="right"
        show={show3}
        onClose={() => set3(false)}
      >
        <div>
          {Array.from({ length: 6 }).map((v, k) => (
            <p key={k}>content {k + 1} Lorem ipsum dolor sit amet</p>
          ))}
        </div>
      </Drawer>
      <Button onClick={() => set(prev => ({ ...prev, direction: 'left', show: !prev.show }))}>left</Button>
      <Button onClick={() => set(prev => ({ ...prev, direction: 'top', show: !prev.show }))}>top</Button>
      <Button onClick={() => set(prev => ({ ...prev, direction: 'right', show: !prev.show }))}>right</Button>
      <Button onClick={() => set(prev => ({ ...prev, direction: 'bottom', show: !prev.show }))}>bottom</Button>

      <div className="mt-16">
        <Button onClick={() => setFullScreen(prev => !prev)}>全屏</Button>
        <Button onClick={() => setInsideShow(prev => !prev)}>容器模式</Button>
        <Button onClick={() => set1(true)}>多层Drawer</Button>
      </div>
    </div>
  );
};

export default Demo;
