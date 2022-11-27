import React, { useState } from "react";
import { useDebounce } from "@m78/hooks";

const useThrottleDemo = () => {
  const [val, setVal] = useState("");

  const handle = useDebounce((el: HTMLInputElement) => {
    setVal(el.value);
  }, 1000);

  return (
    <div>
      <h3>{val}</h3>
      <div>输入一秒后同步状态</div>
      <input type="text" onChange={({ target }) => handle(target)} />
      <button onClick={handle.cancel}>cancle</button>
    </div>
  );
};

export default useThrottleDemo;
