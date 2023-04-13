import React, { useRef, useState } from "react";
import { getRandRange, TupleNumber } from "@m78/utils";
import { Button, Overlay } from "m78";

import sty from "./style.module.scss";

const Positioning = () => {
  const [xy, setXY] = useState<TupleNumber>([300, 300]);

  const [alignment, setAlignment] = useState<TupleNumber>([0.5, 0.5]);

  const [target, setTarget] = useState<any>({
    left: 200,
    top: 200,
    width: 100,
    height: 100,
  });

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
            <Button
              onClick={() =>
                setTarget(document.getElementById("overlayDemoId1"))
              }
            >
              dom
            </Button>
            <Button onClick={() => setTarget(ref)}>ref</Button>
            <Button
              onClick={() =>
                setTarget({
                  left: getRandRange(0, window.innerWidth - 50),
                  top: getRandRange(0, window.innerHeight - 50),
                  width: 50,
                  height: 50,
                })
              }
            >
              随机的虚拟位置
            </Button>
          </div>
        }
      >
        <Button>定位</Button>
      </Overlay>
    </div>
  );
};

export default Positioning;
