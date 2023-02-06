import React, { RefObject } from "react";
import { useScroll } from "../../src/index.js";

const UseScrollExample = () => {
  const scroller = useScroll({
    onScroll: (e) => {
      console.log(e);
    },
  });

  return (
    <div>
      <div
        style={{
          height: 300,
          width: 300,
          border: "1px solid red",
          overflow: "auto",
        }}
        ref={scroller.ref as RefObject<HTMLDivElement>}
      >
        <div
          style={{
            width: 3000,
            height: 3000,
            background: "linear-gradient(90deg, #fff, pink)",
          }}
        ></div>
      </div>
    </div>
  );
};

export default UseScrollExample;
