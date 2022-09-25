import React, { useState } from "react";
import { usePrev } from "../../";

const UsePrevDemo = () => {
  const [count, setCount] = useState(0);

  const prev = usePrev(count);

  return (
    <div>
      <div>
        <button onClick={() => setCount((p) => p + 1)}>add</button>
      </div>

      <hr />

      <div>当前值: {count}</div>
      <div>前一个值: {prev}</div>
    </div>
  );
};

export default UsePrevDemo;
