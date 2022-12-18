import React, { useState } from "react";
import { Button } from "m78/button";
import { Overlay, OverlayDirection } from "m78/overlay";
import { UseTriggerType } from "@m78/hooks";

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

      <div className="mt-32">
        <p>触发类型:</p>
        <Overlay
          direction={OverlayDirection.top}
          content={<div style={{ padding: 8, fontSize: 14 }}>通过点击触发</div>}
          childrenAsTarget
        >
          <Button>click</Button>
        </Overlay>

        <Overlay
          triggerType={UseTriggerType.active}
          direction={OverlayDirection.top}
          content={
            <div style={{ padding: 8, fontSize: 14 }}>
              hover触发, 移动端按住触发
            </div>
          }
          childrenAsTarget
        >
          <Button>active</Button>
        </Overlay>

        <Overlay
          triggerType={UseTriggerType.focus}
          direction={OverlayDirection.top}
          content={
            <div style={{ padding: 8, fontSize: 14 }}>
              聚焦时出现, 失焦时关闭
            </div>
          }
          childrenAsTarget
        >
          <Button>focus</Button>
        </Overlay>

        <Overlay
          triggerType={UseTriggerType.contextMenu}
          direction={OverlayDirection.top}
          content={
            <div style={{ padding: 8, fontSize: 14 }}>右键触发, 移动端长按</div>
          }
          childrenAsTarget
        >
          <Button>contextMenu(右键)</Button>
        </Overlay>

        <Overlay
          triggerType={[UseTriggerType.click, UseTriggerType.focus]}
          direction={OverlayDirection.top}
          content={
            <div style={{ padding: 8, fontSize: 14 }}>
              点击或聚焦, 表单控件最常用的方式
            </div>
          }
          childrenAsTarget
        >
          <Button>click + focus</Button>
        </Overlay>
      </div>
    </div>
  );
};

export default OpenControl;
