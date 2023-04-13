import React, { useState } from "react";
import { Trigger, UseTriggerType } from "@m78/hooks";
import { Overlay, OverlayInstance, Button } from "m78";

const InstanceReuse = () => {
  const [overlay, setOverlay] = useState<OverlayInstance | null>(null);

  const handle = overlay?.trigger;

  return (
    <div>
      {/* 用于提供实例 */}
      <Overlay
        instanceRef={setOverlay}
        content={
          <span style={{ display: "inline-block", padding: "8px 12px" }}>
            hello overlay
          </span>
        }
        direction="top"
        transitionType="fade"
        autoFocus={false}
      />

      <div>
        <Trigger type={[UseTriggerType.active]} onTrigger={handle}>
          <Button>active</Button>
        </Trigger>
        <Trigger type={[UseTriggerType.active]} onTrigger={handle}>
          <Button>active</Button>
        </Trigger>
        <Trigger type={[UseTriggerType.active]} onTrigger={handle}>
          <Button>active</Button>
        </Trigger>
        <Trigger type={[UseTriggerType.active]} onTrigger={handle}>
          <Button>active</Button>
        </Trigger>
        <Trigger type={[UseTriggerType.active]} onTrigger={handle}>
          <Button>active</Button>
        </Trigger>
        <Trigger type={[UseTriggerType.active]} onTrigger={handle}>
          <Button>active</Button>
        </Trigger>
      </div>

      <div className="mt-24">
        <p>
          所有触发类型都是可用的, 但不建议不同触发类型混用,
          因为很多触发类型之间是彼此互斥的
        </p>

        <Trigger type={[UseTriggerType.click]} onTrigger={handle}>
          <Button>click</Button>
        </Trigger>
        <Trigger type={[UseTriggerType.click]} onTrigger={handle}>
          <Button>click</Button>
        </Trigger>
        <Trigger type={[UseTriggerType.active]} onTrigger={handle}>
          <Button>active</Button>
        </Trigger>
        <Trigger type={[UseTriggerType.active]} onTrigger={handle}>
          <Button>active</Button>
        </Trigger>
        <Trigger type={[UseTriggerType.focus]} onTrigger={handle}>
          <Button>focus</Button>
        </Trigger>
        <Trigger type={[UseTriggerType.focus]} onTrigger={handle}>
          <Button>focus</Button>
        </Trigger>
        <Trigger type={[UseTriggerType.contextMenu]} onTrigger={handle}>
          <Button>contextMenu</Button>
        </Trigger>
        <Trigger type={[UseTriggerType.contextMenu]} onTrigger={handle}>
          <Button>contextMenu</Button>
        </Trigger>
        <Trigger
          type={[UseTriggerType.focus, UseTriggerType.click]}
          onTrigger={handle}
        >
          <Button>focus + click</Button>
        </Trigger>
      </div>
    </div>
  );
};

export default InstanceReuse;
