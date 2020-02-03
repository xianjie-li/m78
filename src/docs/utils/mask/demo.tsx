import React, { useState } from 'react';
import Mask from '@lxjx/flicker/lib/mask';
import '@lxjx/flicker/lib/mask/style';

import Button from '@lxjx/flicker/lib/button';
import '@lxjx/flicker/lib/button/style';

import { ReactRenderApiProps } from '@lxjx/react-render-api';

interface MaskDemo extends ReactRenderApiProps {
  /* 渲染的内容 */
  children: React.ReactNode;
}

const style: React.CSSProperties = {
  position: 'fixed',
  left: '50%',
  top: '50%',
  backgroundColor: '#333',
  zIndex: 11,
  color: '#fff',
  padding: 32,
  transition: 'transform 0.3s',
};

const inStyle: React.CSSProperties = {
  transform: 'scale(1)',
};

const outStyle: React.CSSProperties = {
  transform: 'scale(0)',
};

const MaskDemo: React.FC<MaskDemo> = ({
  show,
  onClose,
  onRemove,
  children,
}) => {
  return (
    <Mask show={show} onClose={onClose} onRemove={onRemove}>
      <div style={{ ...style, ...(show ? inStyle : outStyle) }}>{children}</div>
    </Mask>
  );
};

const Demo = () => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <MaskDemo
        show={show}
        onClose={() => setShow(false)}
      >
        <div>mask content</div>
      </MaskDemo>
      <Button onClick={() => setShow(prev => !prev)}>toggle | {show.toString()}</Button>
    </div>
  );
};

export default Demo;
