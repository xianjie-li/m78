import React, { useEffect, useRef, useState } from "react";
import { Overlay } from "../../src/overlay/index.js";

import { Button } from "../../src/button/index.js";
import { TriggerType } from "../../src/index.js";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";

let ins: any = null;

const Play = () => {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  const node = useRef<any>();

  useEffect(() => {
    // setInterval(() => {
    //   setCount1((p) => p + 1);
    // }, 1000);
  }, []);

  function create() {
    const root = createRoot(node.current);

    flushSync(() => {
      root.render(<Component1></Component1>);
    });

    console.log(ins);

    setTimeout(() => {
      console.log(ins, 222);
    }, 100);
  }

  return (
    <div>
      <div ref={node}>node</div>
      <div>count1: {count1}</div>
      <div>count2: {count2}</div>
      <button onClick={create}>render</button>
    </div>
  );
};

function Component1() {
  ins = 1;

  return <div>13123213</div>;
}

export default Play;
