import React, { useEffect, useRef } from 'react';
import { Overlay, OverlayDirectionEnum } from 'm78/overlay';
import { Button } from 'm78/button';

const PreventOverflow = () => {
  const contRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    contRef.current.scrollLeft = 2894;
    contRef.current.scrollTop = 2788;
  }, []);

  return (
    <div
      ref={contRef}
      style={{
        border: '1px solid red',
        width: 300,
        height: 400,
        overflow: 'auto',
        borderRadius: '6px',
      }}
    >
      <Overlay
        show
        direction={OverlayDirectionEnum.top}
        arrow
        childrenAsTarget
        lockScroll={false}
        clickAwayClosable={false}
        content={<div style={{ padding: '12px 24px' }}>气泡内容</div>}
      >
        <Button style={{ margin: 3000 }}>target</Button>
      </Overlay>
    </div>
  );
};

export default PreventOverflow;
