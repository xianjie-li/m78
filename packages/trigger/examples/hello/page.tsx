import React, { useEffect, useMemo, useRef } from "react";
import { TriggerType, trigger } from "../../src/index.js";
import { Trigger } from "../../src/react/trigger.js";
import { rafCaller } from "@m78/animate-tools";

const Page = () => {
  const btn1 = useRef(null!);
  const btn2 = useRef(null!);
  const btn3 = useRef(null!);
  const box4 = useRef(null!);

  const raf = useMemo(() => rafCaller(), []);

  useEffect(() => {
    trigger.on({
      target: btn1.current,
      type: [TriggerType.click, TriggerType.focus],
      handler: (e) => {
        console.log(e.type, e);
      },
    });

    trigger.on({
      target: btn2.current,
      type: [TriggerType.active, TriggerType.contextMenu],
      handler: (e) => {
        console.log(e.type, e);
      },
    });

    trigger.on({
      target: btn3.current,
      type: [TriggerType.move],
      handler: (e) => {
        console.log(e.type, e);
      },
    });

    trigger.on({
      target: box4.current,
      type: [TriggerType.drag, TriggerType.active],
      handler: (e) => {
        console.log(e.type, e);
      },
    });
  }, []);

  return (
    <div>
      <div style={{ padding: 24 }}>
        <button ref={btn1}>
          按钮1
          <span>123123</span>
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
      <div style={{ padding: 50, touchAction: "none" }}>
        <Trigger
          type={[TriggerType.drag, TriggerType.active]}
          onTrigger={(e) => {
            console.log(e.type, e);
          }}
        >
          <button
            onClick={() => {}}
            style={{ width: 120, height: 80, cursor: "inherit" }}
          >
            按钮5
          </button>
        </Trigger>
      </div>
      <Trigger
        type={[TriggerType.drag]}
        dragBound={{
          left: 0,
          top: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }}
        onTrigger={(e) => {
          raf(() => {
            // console.log(e.type, e.distanceX, e.distanceY);
            const node = e.target.target as HTMLElement;

            // node.style.transform = `translate(${e.distanceX}px, ${e.distanceY}px)`;

            node.style.transform = `translate(${e.movementX}px, ${e.movementY}px)`;

            if (e.last) {
              console.log("end");
              node.style.transform = "";
            }
          });
        }}
      >
        <button
          onClick={() => {}}
          style={{
            width: 120,
            height: 80,
            cursor: "inherit",
            position: "fixed",
            left: 400,
            top: 200,
          }}
        >
          drag
        </button>
      </Trigger>
      <div style={{ height: 3000 }}></div>
    </div>
  );
};

export default Page;
