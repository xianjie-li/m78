import React from "react";
import { usePrev } from "../src/index.js";

const Play = () => {
  const [count, setCount] = React.useState(0);

  const prev = usePrev(count);

  return (
    <div>
      <div>count: {count}</div>
      <div>prev: {prev}</div>
      <button onClick={() => setCount((prev) => prev + 1)}>click</button>
    </div>
  );
};

export default Play;
