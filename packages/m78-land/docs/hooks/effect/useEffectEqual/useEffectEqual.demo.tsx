import React, { useState } from "react";
import { useEffectEqual } from "@m78/hooks";

const useEffectWithEqualDemo = () => {
  const [state, set] = useState({ count: 0 });

  useEffectEqual(() => {
    console.log("mount");

    return () => {
      console.log("unmount");
    };
  }, [state, [1, 2], ["login", "admin"], undefined]);

  return (
    <div>
      <button onClick={() => set((prev) => ({ count: prev.count + 1 }))}>
        change deps
      </button>
      <button onClick={() => set((prev) => ({ ...prev }))}>
        change to same
      </button>
    </div>
  );
};

export default useEffectWithEqualDemo;
