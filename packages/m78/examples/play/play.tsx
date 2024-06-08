import React, { useEffect, useRef } from "react";
import { TriggerType, trigger } from "../../src";

const Play = () => {
  const btn1 = useRef(null!);
  const btn2 = useRef(null!);
  const btn3 = useRef(null!);
  const box4 = useRef(null!);

  useEffect(() => {
    trigger.on({
      target: btn1.current,
      type: [TriggerType.click, TriggerType.focus],
      handler: (e) => {
        // console.log(e.type, e);
      },
    });

    trigger.on({
      target: btn2.current,
      type: [TriggerType.active, TriggerType.contextMenu],
      handler: (e) => {
        // console.log(e.type, e);
      },
    });

    trigger.on({
      target: btn3.current,
      type: [TriggerType.move],
      handler: (e) => {
        // console.log(e.type, e);
      },
    });

    trigger.on({
      target: box4.current,
      type: [TriggerType.drag, TriggerType.active],
      handler: (e) => {
        // console.log(e.type, e);
      },
    });
  }, []);

  return (
    <div>
      <div style={{ padding: 24 }}>
        <button ref={btn1} onClick={() => {}}>
          按钮1
        </button>
      </div>
      <div style={{ padding: 24 }}>
        <button
          ref={btn2}
          onClick={() => {}}
          style={{ width: 120, height: 80 }}
        >
          按钮1
        </button>
      </div>
      <div style={{ padding: 50, touchAction: "none" }}>
        <button
          ref={btn3}
          onClick={() => {}}
          style={{ width: 120, height: 80 }}
        >
          按钮1
        </button>
      </div>
      <div style={{ padding: 50 }}>
        <div
          ref={box4}
          onClick={() => {}}
          style={{ width: 120, height: 120, border: "1px solid red" }}
        >
          box4
        </div>
      </div>
      <div style={{ height: 3000 }}></div>
    </div>
  );
};

export default Play;
