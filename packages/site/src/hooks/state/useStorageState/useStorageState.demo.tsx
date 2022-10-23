import React from "react";
import { useStorageState } from "@m78/hooks";

const useStorageDemo = () => {
  const [state, setState] = useStorageState("session_demo", 0);

  const [state2, setState2] = useStorageState("local_demo", 0, {
    type: "local",
  });

  return (
    <div>
      <h3>{state}</h3>
      <p>通过sessionStorage缓存</p>
      <button onClick={() => setState((prev) => prev + 1)}>add</button>

      <hr />

      <h3>{state2}</h3>
      <p>通过localStorage缓存</p>
      <button onClick={() => setState2((prev) => prev + 1)}>add</button>
    </div>
  );
};

export default useStorageDemo;
