import React from "react";
import { useStorageState } from "../../";

const useStorageDemo = () => {
  const [state, setState] = useStorageState("usestorage_demo", 0);

  const [state2, setState2] = useStorageState("usestorage_local_demo", 0, {
    type: "local",
  });

  return (
    <div>
      <h3>{state}</h3>
      <p>通过sessionStorage缓存, 跟随会话失效</p>
      <button onClick={() => setState((prev) => prev + 1)}>add</button>

      <hr />

      <h3>{state2}</h3>
      <p>通过localStorage缓存</p>
      <button onClick={() => setState2((prev) => prev + 1)}>add</button>
    </div>
  );
};

export default useStorageDemo;
