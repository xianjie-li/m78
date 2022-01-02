import React, { useRef, useState } from 'react';

import { Button } from 'm78/button';
import { TupleNumber } from '@lxjx/utils';
import { Overlay } from 'm78/overlay';

import sty from './style.module.scss';

const Positioning = () => {
  const [xy, setXY] = useState<TupleNumber>([300, 300]);

  const [alignment, setAlignment] = useState<TupleNumber>([0.5, 0.5]);

  const [target, setTarget] = useState<any>({ left: 200, top: 200 });

  const ref = useRef<HTMLButtonElement>(null!);

  return (
    <div>
      <Overlay
        xy={xy}
        content={
          <div className={sty.modal}>
            <Button onClick={() => setXY([0, 0])}>[0, 0]</Button>
            <Button onClick={() => setXY([200, 200])}>[200, 200]</Button>
            <Button onClick={() => setXY([400, 300])}>[400, 300]</Button>
          </div>
        }
      >
        <Button id="overlayDemoId1">xy定位</Button>
      </Overlay>

      <Overlay
        alignment={alignment}
        content={
          <div className={sty.modal}>
            <Button onClick={() => setAlignment([0, 0])}>[0, 0]</Button>
            <Button onClick={() => setAlignment([0.5, 0.5])}>[0.5, 0.5]</Button>
            <Button onClick={() => setAlignment([1, 1])}>[1, 1]</Button>
            <Button onClick={() => setAlignment([1, 0])}>[1, 0]</Button>
          </div>
        }
      >
        <Button innerRef={ref}>alignment</Button>
      </Overlay>

      <Overlay
        target={target}
        content={
          <div className={sty.modal}>
            <Button onClick={() => setTarget(document.getElementById('overlayDemoId1'))}>
              dom
            </Button>
            <Button onClick={() => setTarget(ref)}>ref</Button>
            <Button onClick={() => setTarget({ left: 300, top: 240 })}>bound</Button>
          </div>
        }
      >
        <Button>定位</Button>
      </Overlay>
    </div>
  );
};

export default Positioning;
