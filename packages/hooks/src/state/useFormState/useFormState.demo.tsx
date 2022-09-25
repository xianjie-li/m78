import React, { useState } from "react";
import { useFormState, FormLike } from "../../";

const Input: React.FC<FormLike<string>> = (props) => {
  const [state, setState] = useFormState(props, "");

  return (
    <input
      type="text"
      value={state}
      onChange={({ target }) => {
        setState(target.value);
      }}
    />
  );
};

const useFormStateDemo = () => {
  const [state, set] = useState("111");
  const [state2, set2] = useState("222");
  return (
    <div>
      <h3>受控: {state}</h3>
      <Input value={state} onChange={(value) => set(value)} />

      <h3>半受控: {state2}</h3>
      <Input defaultValue={state2} onChange={(value) => set2(value)} />

      <h3>非受控</h3>
      <Input defaultValue="333" onChange={(value) => console.log(value)} />
    </div>
  );
};

export default useFormStateDemo;
