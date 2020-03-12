import React, { useState } from 'react';
import { useToggle } from 'react-use';

import ShowFromMouse from '@lxjx/flicker/lib/show-from-mouse';

import Button from '@lxjx/flicker/lib/button';

const fixedStyle: React.CSSProperties = {
  position: 'fixed',
  zIndex: 100,
};

const box: React.CSSProperties = {
  width: 240,
  height: 240,
  lineHeight: '240px',
  textAlign: 'center',
  border: '4px solid #fb6161',
  boxShadow: '0 0 0 6px #61fbf6',
  borderRadius: 2,
  backgroundColor: '#fff',
  zIndex: 1001,
};

const Demo = () => {
  const [on, toggle] = useToggle(false);

  return (
    <div>
      <div>
        <Button color="blue" style={{ ...fixedStyle, left: 20, top: 20 }} type="button" onClick={() => toggle(!on)}>click</Button>
        <Button color="blue" style={{ ...fixedStyle, left: 180, top: 180 }} type="button" onClick={() => toggle(!on)}>click</Button>
        <Button color="blue" style={{ ...fixedStyle, left: '86vw', top: 20 }} type="button" onClick={() => toggle(!on)}>click</Button>
        <Button color="blue" style={{ ...fixedStyle, bottom: 20, left: '86vw' }} type="button" onClick={() => toggle(!on)}>click</Button>
      </div>
      <span className="fs-20">点击页面各处的按钮来从不同位置召唤弹出层!</span>
      <ShowFromMouse
        mask={false}
        show={on}
        onClose={() => {
          toggle(false);
        }}
      ><div style={box}>我是文字</div>
      </ShowFromMouse>
    </div>
  );
};

export default Demo;
