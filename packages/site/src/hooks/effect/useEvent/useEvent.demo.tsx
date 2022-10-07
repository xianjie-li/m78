import React, { useState } from "react";
import { createEvent } from "@m78/hooks";

const { useEvent, emit } = createEvent<(arg: number) => void>();

function AChild() {
  const [count, setCount] = useState(0);

  useEvent((num) => {
    setCount(num);
  });

  return <h3>{count}</h3>;
}

let count = 0;

const useThrottleDemo = () => {
  return (
    <div>
      <AChild />
      <hr />
      <AChild />
      <button onClick={() => emit(++count)}>emit++</button>
      <button onClick={() => emit(--count)}>emit--</button>
    </div>
  );
};

export default useThrottleDemo;
