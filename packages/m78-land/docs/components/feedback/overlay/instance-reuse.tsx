import React, { useState } from "react";
import {
  Overlay,
  OverlayInstance,
  Button,
  Trigger,
  TriggerType,
  Size,
} from "m78";

// 为所有trigger传入一个唯一的key, 可以是trigger也共用同一个实例
const uniqTriggerKey = "__uniq_trigger_key__";

const InstanceReuse = () => {
  const [overlay, setOverlay] = useState<OverlayInstance | null>(null);

  const handle = overlay?.trigger;

  return (
    <div>
      {/* 用于提供实例 */}
      <Overlay
        instanceRef={setOverlay}
        offset={8}
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
        <Trigger
          type={[TriggerType.active]}
          onTrigger={handle}
          instanceKey={uniqTriggerKey}
        >
          <Button>active</Button>
        </Trigger>
        <Trigger
          type={[TriggerType.active]}
          onTrigger={handle}
          instanceKey={uniqTriggerKey}
        >
          <Button>active</Button>
        </Trigger>
        <Trigger
          type={[TriggerType.active]}
          onTrigger={handle}
          instanceKey={uniqTriggerKey}
        >
          <Button>active</Button>
        </Trigger>
        <Trigger
          type={[TriggerType.active]}
          onTrigger={handle}
          instanceKey={uniqTriggerKey}
        >
          <Button>active</Button>
        </Trigger>
        <Trigger
          type={[TriggerType.active]}
          onTrigger={handle}
          instanceKey={uniqTriggerKey}
        >
          <Button>active</Button>
        </Trigger>
        <Trigger
          type={[TriggerType.active]}
          onTrigger={handle}
          instanceKey={uniqTriggerKey}
        >
          <Button>active</Button>
        </Trigger>
      </div>

      <div className="mt-24">
        <p>
          所有触发类型都是可用的, 但不建议不同触发类型混用,
          因为很多触发类型之间是彼此互斥的
        </p>

        <Trigger
          type={[TriggerType.click]}
          onTrigger={handle}
          instanceKey={uniqTriggerKey}
        >
          <Button>click</Button>
        </Trigger>
        <Trigger
          type={[TriggerType.click]}
          onTrigger={handle}
          instanceKey={uniqTriggerKey}
        >
          <Button>click</Button>
        </Trigger>
        <Trigger
          type={[TriggerType.active]}
          onTrigger={handle}
          instanceKey={uniqTriggerKey}
        >
          <Button>active</Button>
        </Trigger>
        <Trigger
          type={[TriggerType.active]}
          onTrigger={handle}
          instanceKey={uniqTriggerKey}
        >
          <Button>active</Button>
        </Trigger>
        <Trigger
          type={[TriggerType.focus]}
          onTrigger={handle}
          instanceKey={uniqTriggerKey}
        >
          <Button>focus</Button>
        </Trigger>
        <Trigger
          type={[TriggerType.focus]}
          onTrigger={handle}
          instanceKey={uniqTriggerKey}
        >
          <Button>focus</Button>
        </Trigger>
        <Trigger
          type={[TriggerType.contextMenu]}
          onTrigger={handle}
          instanceKey={uniqTriggerKey}
        >
          <Button>contextMenu</Button>
        </Trigger>
        <Trigger
          type={[TriggerType.contextMenu]}
          onTrigger={handle}
          instanceKey={uniqTriggerKey}
        >
          <Button>contextMenu</Button>
        </Trigger>
        <Trigger
          type={[TriggerType.move]}
          onTrigger={handle}
          instanceKey={uniqTriggerKey}
        >
          <Button size={Size.large} style={{ width: 160 }}>
            move
          </Button>
        </Trigger>
        <Trigger
          type={[TriggerType.move]}
          onTrigger={handle}
          instanceKey={uniqTriggerKey}
        >
          <Button size={Size.large} style={{ width: 160 }}>
            move
          </Button>
        </Trigger>
        <Trigger
          type={[TriggerType.focus, TriggerType.click]}
          onTrigger={handle}
          instanceKey={uniqTriggerKey}
        >
          <Button>focus + click</Button>
        </Trigger>
      </div>
    </div>
  );
};

export default InstanceReuse;
