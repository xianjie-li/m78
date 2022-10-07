import React, { useEffect, useState } from "react";
import { useUpdateEffect } from "@m78/hooks";

const UseUpdateEffectDemo = () => {
  const [count, setCount] = useState(0);
  const [msg, setMsg] = useState<string[]>([]);

  useEffect(() => {
    setMsg((prev) => [...prev, "useEffect trigger"]);
  }, [count]);

  useUpdateEffect(() => {
    setMsg((prev) => [...prev, "useUpdateEffect trigger"]);
  }, [count]);

  return (
    <div>
      <button onClick={() => setCount((prev) => prev + 1)}>
        trigger render
      </button>
      {msg.map((m, index) => (
        <div key={index}>
          {index + 1}: {m}
        </div>
      ))}
    </div>
  );
};

export default UseUpdateEffectDemo;
