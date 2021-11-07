import React, { useState } from 'react';
import { Mask } from 'm78/mask';
import 'm78/mask/style';

import { Button } from 'm78/button';
import 'm78/button/style';

import { ReactRenderApiProps } from '@lxjx/react-render-api';

interface MaskDemo extends ReactRenderApiProps {
  /* 渲染的内容 */
  children: React.ReactNode;
}

const box: React.CSSProperties = {
  position: 'fixed',
  left: '50%',
  top: '50%',
  width: 240,
  height: 240,
  margin: '-120px 0 0 -120px',
  lineHeight: '240px',
  textAlign: 'center',
  border: '4px solid #fb6161',
  boxShadow: '0 0 0 6px #61fbf6',
  borderRadius: 2,
  backgroundColor: '#fff',
  transition: 'transform 0.3s',
  zIndex: 1001,
};

const inStyle: React.CSSProperties = {
  transform: 'scale(1)',
};

const outStyle: React.CSSProperties = {
  transform: 'scale(0)',
};

const MaskDemo: React.FC<MaskDemo> = ({ children, ...props }) => (
  <Mask {...props}>
    <div style={{ ...box, ...(props.show ? inStyle : outStyle) }}>{children}</div>
  </Mask>
);

const Demo = () => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <MaskDemo show={show} onClose={() => setShow(false)}>
        <div>mask content</div>
      </MaskDemo>
      <Button onClick={() => setShow(prev => !prev)}>toggle | {show.toString()}</Button>
    </div>
  );
};

export default Demo;
