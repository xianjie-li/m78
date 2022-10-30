import React, { useState, useCallback } from "react";
import { useRefState } from "@m78/hooks";

const useRefStateDemo = () => {
  const [count, setCount] = useState(0);
  const refState = useRefState({
    count,
  });

  const log = useCallback(() => {
    console.log(count);
    console.log(refState.count);
  }, []);

  return (
    <div>
      <h3>useRefState</h3>
      <button onClick={() => setCount((prev) => prev + 1)}>
        change {count}
      </button>
      <button onClick={log}>log</button>
    </div>
  );
};

export default useRefStateDemo;
