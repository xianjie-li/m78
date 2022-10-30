import React, { useState } from "react";
import { usePolling } from "@m78/hooks";

const useThrottleDemo = () => {
  const [list, setList] = useState<string[]>([]);

  const p = usePolling({
    // 如果是异步任务, 使用Promise/async
    trigger: () => {
      setList((prev) => [...prev, new Date().toString()]);
    },
    interval: 500,
    growRatio: 1.1,
    maxPollingNumber: 10,
  });

  return (
    <div>
      <button
        onClick={() => {
          setList([]);
          p.reset();
        }}
      >
        重置
      </button>
      {list.map((i) => (
        <p key={i}>{i}</p>
      ))}
    </div>
  );
};

export default useThrottleDemo;
