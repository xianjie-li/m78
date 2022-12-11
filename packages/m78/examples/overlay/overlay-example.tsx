import React, { useState } from "react";
import { Button } from "../../src/button";
import { Overlay, OverlayInstance } from "../../src/overlay/index.js";
import { Trigger, UseTriggerType } from "@m78/hooks";

const OverlayExample = () => {
  const [overlay, setOverlay] = useState<OverlayInstance | null>(null);

  return (
    <div>
      <div
        style={{ overflow: "auto", width: 300, height: 300 }}
        className="border"
      >
        <div style={{ padding: 600 }}>
          <Overlay content={<div className="p-24">内容内容</div>}>
            <Button>click</Button>
          </Overlay>
          <Overlay
            content={<div className="p-24 bg-cyan">内容内容</div>}
            childrenAsTarget
            open
            direction="bottom"
            transitionType="fade"
          >
            <Button>click</Button>
          </Overlay>
        </div>
      </div>

      <Overlay
        instanceRef={(ref) => {
          setOverlay(ref);
        }}
        content={<span className="p-12">hello overlay</span>}
        direction="top"
        autoFocus={false}
      />

      <div className="mt-12">
        <Trigger type={[UseTriggerType.click]} onTrigger={overlay?.trigger}>
          <Button>click</Button>
        </Trigger>
        <Trigger type={[UseTriggerType.active]} onTrigger={overlay?.trigger}>
          <Button>active</Button>
        </Trigger>
        <Trigger type={[UseTriggerType.active]} onTrigger={overlay?.trigger}>
          <Button>active</Button>
        </Trigger>
        <Trigger type={[UseTriggerType.focus]} onTrigger={overlay?.trigger}>
          <Button>focus</Button>
        </Trigger>

        {/*<Trigger*/}
        {/*  type={[UseTriggerType.focus, UseTriggerType.click]}*/}
        {/*  onTrigger={triggerHandle}*/}
        {/*>*/}
        {/*  <Button>focus + click</Button>*/}
        {/*</Trigger>*/}

        <Trigger
          type={[UseTriggerType.contextMenu]}
          onTrigger={overlay?.trigger}
        >
          <Button>contextMenu</Button>
        </Trigger>

        {/*<Trigger*/}
        {/*  type={[UseTriggerType.focus]}*/}
        {/*  onTrigger={(e) => {*/}
        {/*    console.log(e);*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Button>test</Button>*/}
        {/*</Trigger>*/}
      </div>

      <div className="mt-12">
        <Overlay
          triggerType={UseTriggerType.focus}
          childrenAsTarget
          direction="bottom"
          content={<div className="p-24">内容内容</div>}
        >
          <Button>click</Button>
        </Overlay>
        <Overlay
          triggerType={UseTriggerType.active}
          childrenAsTarget
          direction="bottom"
          content={<div className="p-24">内容内容</div>}
        >
          <Button>click</Button>
        </Overlay>
      </div>
    </div>
  );
};

export default OverlayExample;
