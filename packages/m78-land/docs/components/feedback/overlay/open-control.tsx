import React, { useState } from "react";
import { Button, Overlay, OverlayDirection, TriggerType } from "m78";

const OpenControl = () => {
  const [open, setOpen] = useState(false);
  const [render, setRender] = useState(false);

  return (
    <div>
      <p>受控/非受控/children代理:</p>
      <Button onClick={() => setOpen((prev) => !prev)}>受控</Button>
      <Overlay
        open={open}
        onChange={setOpen}
        alignment={[0.5, 0.5]}
        content={<div style={{ padding: 24, fontSize: 36 }}>受控显示</div>}
        clickAwayClosable={false}
      />

      {!render && (
        <Button onClick={() => setRender(true)}>渲染非受控overlay</Button>
      )}
      {render && (
        <Overlay
          defaultOpen
          alignment={[0.5, 0.5]}
          unmountOnExit
          content={<div style={{ padding: 24, fontSize: 36 }}>非受控显示</div>}
        />
      )}

      <Overlay
        alignment={[0.5, 0.5]}
        content={
          <div style={{ padding: 24, fontSize: 36 }}>通过children代理open</div>
        }
      >
        <Button>children代理</Button>
      </Overlay>
    </div>
  );
};

export default OpenControl;
