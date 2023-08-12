import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  createTrigger,
  Trigger,
  TriggerInstance,
  TriggerType,
} from "../../src/trigger/index.js";
import { Button, Row } from "../../src/index.js";
import "./style.scss";

const TriggerExample = () => {
  const ref1 = useRef<any>(null!);
  const ref2 = useRef<any>(null!);
  const ref3 = useRef<any>(null!);
  const ref4 = useRef<any>(null!);

  const [trigger, setTrigger] = useState<TriggerInstance>();

  useEffect(() => {
    const trigger = createTrigger({
      target: [
        ref1.current,
        {
          target: ref2.current,
          active: {
            firstDelay: 80,
            lastDelay: 140,
          },
          cursor: "pointer",
        },
        ref3.current,
        {
          target: ref4.current,
          zIndex: 10,
        },
        {
          target: {
            left: 80,
            top: 600,
            width: 200,
            height: 200,
          },
          cursor: "pointer",
        },
      ],
      type: [
        TriggerType.click,
        TriggerType.focus,
        TriggerType.active,
        TriggerType.contextMenu,
        TriggerType.drag,
        TriggerType.move,
      ],
    });

    // setInterval(() => {
    //   console.log(trigger.dragging);
    // }, 100);

    trigger.event.on((e) => {
      if (e.type === "move") {
        // console.log("offset:", e.offsetX, e.offsetY);
        // console.log("delta:", e.deltaX, e.deltaY);
        // console.log("first / last:", e.first, e.last);
      } else if (e.type === "contextMenu") {
        // const span = document.createElement("span");
        // span.innerHTML = "context";
        // document.body.prepend(span);
        // console.log(e);
      } else if (e.type === "active") {
        // console.log(e);
      } else if (e.type === "drag") {
        // console.log("offset:", e.offsetX, e.offsetY);
        // console.log("delta:", e.deltaX, e.deltaY);
        // console.log("movement:", e.movementX, e.movementX);
        // console.log("first / last:", e.first, e.last);
      } else {
        // console.log(e);
      }
    });

    // setTimeout(() => {
    //   console.log("setType []");
    //   trigger.type = [];
    // }, 4000);

    setTrigger(trigger);
  }, []);

  return (
    <div style={{ padding: "40px 180px" }}>
      <div ref={ref3} style={{ display: "inline-block" }}>
        <button
          className="m78-touch-prevent"
          onContextMenu={(e) => {
            e.preventDefault();
          }}
          style={{ width: 120, height: 120 }}
        >
          <span>click 123</span>
        </button>
      </div>

      <Row>
        <div
          ref={ref1}
          className="m78-touch-prevent"
          style={{
            border: "1px solid red",
            width: 200,
            height: 200,
            margin: 80,
            touchAction: "none",
          }}
        ></div>

        <div
          ref={ref2}
          className="m78-touch-prevent"
          style={{
            border: "1px solid blue",
            width: 200,
            height: 200,
            margin: 80,
          }}
        >
          123
        </div>
      </Row>

      <input ref={ref4} type="text" />

      <div
        style={{
          border: "1px solid pink",
          width: 200,
          height: 200,
          position: "fixed",
          left: 80,
          top: 600,
        }}
      ></div>

      <Trigger
        type={[TriggerType.click, TriggerType.active, TriggerType.focus]}
        onTrigger={(e) => {
          console.log(e);
        }}
      >
        <Button>click</Button>
      </Trigger>
    </div>
  );
};

export default TriggerExample;
