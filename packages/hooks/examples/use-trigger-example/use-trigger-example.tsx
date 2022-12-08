import React from "react";
import {
  useSelf,
  useFormState,
  UseTriggerType,
  useTrigger,
} from "../src/index.js";

function Test1() {
  return <span>123</span>;
}

const UseTriggerExample = () => {
  const btn1 = useTrigger({
    element: <button>click</button>,
    type: [UseTriggerType.click, UseTriggerType.focus, UseTriggerType.active],
    onTrigger(e) {
      console.log(e);
    },
  });

  const self = useSelf({
    name: "lxj",
  });

  const [state, setState] = useFormState({}, "111");

  console.log(btn1);
  // console.log(btn2);

  return (
    <div>
      <div>{btn1.node} 122211</div>
    </div>
  );
};

export default UseTriggerExample;
