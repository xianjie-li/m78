import React, { useEffect, useRef } from "react";
import { Overlay, OverlayDirection, Button } from "m78";

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
        width: 300,
        height: 400,
        overflow: "auto",
      }}
      className="border radius"
    >
      <Overlay
        open
        direction={OverlayDirection.top}
        arrow
        childrenAsTarget
        lockScroll={false}
        clickAwayClosable={false}
        escapeClosable={false}
        content={<div style={{ padding: "12px 24px" }}>气泡内容</div>}
      >
        <Button style={{ margin: 3000 }}>target</Button>
      </Overlay>
    </div>
  );
};

export default PreventOverflow;
