import React, { useState } from 'react';
import { Button } from 'm78/button';
import { Overlay, OverlayDirectionEnum } from 'm78/overlay';
import { UseTriggerTypeEnum } from 'm78/hooks';

const ShowControl = () => {
  const [show, setShow] = useState(false);
  const [render, setRender] = useState(false);

  return (
    <div>
      <Button onClick={() => setShow(prev => !prev)}>受控</Button>
      <Overlay
        show={show}
        onChange={setShow}
        alignment={[0.5, 0.5]}
        content={<div style={{ padding: 24, fontSize: 36 }}>受控显示</div>}
      />

      <Button onClick={() => setRender(true)}>渲染非受控overlay</Button>
      {render && (
        <Overlay
          defaultShow
          alignment={[0.5, 0.5]}
          unmountOnExit
          content={<div style={{ padding: 24, fontSize: 36 }}>非受控显示</div>}
        />
      )}

      <Overlay
        alignment={[0.5, 0.5]}
        content={<div style={{ padding: 24, fontSize: 36 }}>通过children代理show</div>}
      >
        <Button>children代理</Button>
      </Overlay>

      <div className="mt-32">
        <Overlay
          direction={OverlayDirectionEnum.top}
          content={<div style={{ padding: 8, fontSize: 14 }}>通过点击触发</div>}
          childrenAsTarget
        >
          <Button>click</Button>
        </Overlay>

        <Overlay
          triggerType={UseTriggerTypeEnum.active}
          direction={OverlayDirectionEnum.top}
          content={<div style={{ padding: 8, fontSize: 14 }}>hover触发, 移动端按住触发</div>}
          childrenAsTarget
        >
          <Button>active</Button>
        </Overlay>

        <Overlay
          triggerType={UseTriggerTypeEnum.focus}
          direction={OverlayDirectionEnum.top}
          content={<div style={{ padding: 8, fontSize: 14 }}>通过children代理show</div>}
          childrenAsTarget
        >
          <Button>focus</Button>
        </Overlay>
      </div>
    </div>
  );
};

export default ShowControl;
