import React, { useEffect, useRef } from 'react';
import { Overlay, OverlayDirection, OverlayInstance } from 'm78/overlay';
import { Button } from 'm78/button';

const InstanceReuse = () => {
  const firstBtnRef = useRef<HTMLButtonElement>(null!);
  const overlayRef = useRef<OverlayInstance>(null!);

  useEffect(() => {
    overlayRef.current.updateTarget(firstBtnRef);
  }, []);

  function clickHandle(e: React.MouseEvent<any>) {
    overlayRef.current.updateTarget(e.currentTarget as HTMLElement);
  }

  return (
    <div>
      <Button innerRef={firstBtnRef} onClick={clickHandle}>
        button1
      </Button>
      <Button onClick={clickHandle}>button2</Button>
      <Button onClick={clickHandle}>button3</Button>
      <Button onClick={clickHandle}>button4</Button>

      <Overlay
        defaultShow
        instanceRef={overlayRef}
        direction={OverlayDirection.top}
        arrow
        childrenAsTarget
        lockScroll={false}
        clickAwayClosable={false}
        content={<div style={{ padding: '8px 20px' }}>气泡内容</div>}
      />
    </div>
  );
};

export default InstanceReuse;
