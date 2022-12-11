import React, { useState } from "react";
import { UseTriggerType, Trigger } from "@m78/hooks";

const Demo2 = () => {
  const [text, setText] = useState<string[]>([]);

  return (
    <div>
      <Trigger
        type={[
          UseTriggerType.click,
          UseTriggerType.focus,
          UseTriggerType.active,
        ]}
        onTrigger={(e) => {
          setText((p) => [...p, e.type]);
        }}
      >
        <button>click & focus & active</button>
      </Trigger>

      <div style={{ width: 500, wordBreak: "break-word" }}>
        {text.map((i, ind) => (
          <span key={ind} style={{ marginLeft: 12 }}>
            {i}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Demo2;
