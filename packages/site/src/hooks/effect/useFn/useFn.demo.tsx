import React, { useState, useRef } from "react";
import { useFn } from "@m78/hooks";
import _throttle from "lodash/throttle";

const useFnDemo = () => {
  const [count, setCount] = useState(0);

  const clickHandle = useFn(() => {
    setCount(count + 1); // 获取到的是最新的count
  });

  const oldFn = useRef(clickHandle);

  /* 如果需要对函数进行操作，请使用参数2 */
  const throttleFn = useFn(
    () => {
      setCount(count + 1);
    },
    (f) => _throttle(f, 1000),
  );

  return (
    <div>
      <h3>{count}</h3>
      <div>函数地址值相等: {(clickHandle === oldFn.current).toString()}♻</div>
      <button onClick={clickHandle}>click</button>
      <button onClick={throttleFn}>throttle click</button>
    </div>
  );
};

export default useFnDemo;
