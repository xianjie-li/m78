import React from "react";
import { curveRun } from "../../src/cubic-bezier.js";

export const Page = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  return (
    <div>
      <h1>hello</h1>

      <div
        ref={ref}
        style={{
          position: "fixed",
          left: 300,
          top: 300,
          border: "1px solid red",
          width: 150,
          height: 150,
        }}
      ></div>

      <button
        onClick={() => {
          const distance = 400;
          ref.current!.style.transform = "translate(0, 0)";
          curveRun({
            duration: 1000,
            // curve: [0.23, 1, 0.32, 1],
            onChange: (v) => {
              ref.current!.style.transform = `translate(${
                distance * v
              }px, 0px)`;
            },
            onEnd() {
              console.log("end");
            },
          });
        }}
      >
        run
      </button>
    </div>
  );
};
