import { RenderApiComponentInstance } from "@m78/render-api";
import React, { useEffect, useRef } from "react";

import Wine, { WineDragPosition, WineState } from "../../src";
import "../../src/style.css";
import { WineInstance } from "src/types";

function Test() {
  useEffect(() => {
    console.log("render");

    return () => console.log("unrender");
  }, []);

  return (
    <div>
      <div>
        <span>⚙️</span>
        <span>🍸</span>
      </div>
      <div style={{ padding: 20, fontSize: 24 }}>
        <h2>My Window!</h2>
        <div>🤞🤞🤞🤞 {Math.random()}</div>

        <button>close</button>
      </div>
    </div>
  );
}

const limitBound = {
  left: 200,
  top: 200,
  right: 100,
  bottom: 100,
};

export const Play = () => {
  useEffect(() => {
    Wine.events.change.on(() => {
      console.log(111);
    });
  }, []);

  const ref = useRef<RenderApiComponentInstance<WineState, WineInstance>>();

  function renderHandle() {
    const task = Wine.render({
      content: <Test />,
      alignment: [0.5, 0.5],
      header: (
        <span>
          <span style={{ fontSize: 20 }}>🔥</span>25215215
        </span>
      ),
      limitBound: limitBound,
    });

    ref.current = task;
    console.log(task);
  }

  return (
    <div>
      <div
        style={{
          position: "fixed",
          left: 200,
          top: 200,
          right: 100,
          bottom: 100,
          border: "1px solid red",
        }}
      />
      {/* <Wine.RenderBoxTarget /> */}
      <button onClick={renderHandle}>render</button>
      {Object.keys(WineDragPosition)
        .slice(0, 8)
        .map((k) => (
          <button
            key={k}
            onClick={() =>
              ref.current!.current.setPresetPosition(
                Number(k) as any as WineDragPosition
              )
            }
          >
            {WineDragPosition[k as any]}
          </button>
        ))}

      <button
        onClick={() => {
          Object.assign(limitBound, {
            left: 10,
            top: 10,
            right: 0,
            bottom: 0,
          });
        }}
      >
        change limit ref
      </button>
    </div>
  );
};
