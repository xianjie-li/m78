import React from 'react';
import Viewer, { ViewerRef } from '@lxjx/fr/viewer';
import '@lxjx/fr/viewer/style';

import '@lxjx/fr/drawer/style';

import Button from '@lxjx/fr/button';
import '@lxjx/fr/button/style';

import { getRandRange } from '@lxjx/utils';
import img1 from '@/mock/img/3.jpg';

const boxStyle: React.CSSProperties = {
  width: '240px',
  height: '240px',
  fontSize: '32px',
  textAlign: 'center',
};

const Demo = () => {
  const [disable, setDisable] = React.useState(false);
  const ref = React.useRef<ViewerRef>(null!);
  const wrap = React.useRef<HTMLDivElement>(null!);
  return (
    <div>
      <div
        ref={wrap}
        className="tc p-32"
        style={{ width: '80%', height: '80%', border: '1px solid #ccc', margin: '10vh auto' }}
      >
        <Viewer ref={ref} bound={wrap} disabled={disable}>
          <div style={boxStyle}>
            <img
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              draggable={false}
              src={img1}
              alt=""
            />
          </div>
        </Viewer>

        <div>
          <Button onClick={() => ref.current.setScale(getRandRange(0, 3))}>setScale()</Button>
          <Button onClick={() => ref.current.setRotate(getRandRange(-360, 360))}>
            setRotate()
          </Button>
          <Button onClick={() => ref.current.reset()}>reset()</Button>
          <Button onClick={() => setDisable(prev => !prev)}>disabled {disable.toString()}</Button>
        </div>
      </div>
    </div>
  );
};

export default Demo;
