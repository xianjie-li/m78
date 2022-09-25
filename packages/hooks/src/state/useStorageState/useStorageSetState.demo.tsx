import React from "react";
import { useStorageSetState } from "../../";

const useStorageDemo = () => {
  const [state, setState] = useStorageSetState("usestorage_setState_demo", {
    name: "lxj",
    id: Math.random(),
  });

  const [state2, setState2] = useStorageSetState(
    "usestorage_setState_local_demo",
    {
      name: "lxj",
      id: Math.random(),
    },
    {
      type: "local",
    }
  );

  return (
    <div>
      <h3>{JSON.stringify(state, null, 2)}</h3>
      <p>通过sessionStorage缓存, 跟随会话失效</p>
      <button
        onClick={() => setState((prev) => ({ ...prev, id: Math.random() }))}
      >
        add
      </button>

      <hr />

      <h3>{JSON.stringify(state2, null, 2)}</h3>
      <p>通过localStorage缓存</p>
      <button
        onClick={() => setState2((prev) => ({ ...prev, id: Math.random() }))}
      >
        add
      </button>
    </div>
  );
};

export default useStorageDemo;
