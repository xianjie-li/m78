import React, { useState } from "react";
import { useThrottle } from "@m78/hooks";

const useThrottleDemo = () => {
  const [count, setCount] = useState(0);

  const handle = useThrottle(() => {
    console.log(count);
    setCount((prev) => prev + 1);
  }, 1500);

  return (
    <div>
      <h3>{count}</h3>
      <button onClick={handle}>change</button>
      <button onClick={handle.cancel}>cancle</button>
    </div>
  );
};

export default useThrottleDemo;
