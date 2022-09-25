import React, { useState } from "react";
import { useSame } from "../../";

interface SameComponentProps {
  flag: string;
  show: boolean;
}

function SameComponent({ flag, show = false }: SameComponentProps) {
  const [num, setNum] = useState(() => Math.random());

  const [index, instances, id] = useSame("same_component", {
    meta: {
      flag,
      show,
      num,
    },
    enable: show,
    updateDisabled: true,
    deps: [num],
  });

  return (
    <div style={{ margin: "24px 0" }} onClick={() => setNum(Math.random())}>
      <h3>该组件位于实例第 {index} 位</h3>
      <div>
        组件共享参数: <pre>{JSON.stringify(instances, null, 2)}</pre>
      </div>
      <div>组件id: {id}</div>
    </div>
  );
}

const useSameDemo = () => {
  const [show1, set1] = useState(false);
  const [show2, set2] = useState(false);
  const [show3, set3] = useState(false);

  return (
    <div>
      <button onClick={() => set1((prev) => !prev)}>
        实例1 | {show1.toString()}
      </button>
      <button onClick={() => set2((prev) => !prev)}>
        实例2 | {show2.toString()}
      </button>
      <button onClick={() => set3((prev) => !prev)}>
        实例3 | {show3.toString()}
      </button>

      <SameComponent flag="我是第一个组件" show={show1} />
      <SameComponent flag="我是第二个组件" show={show2} />
      <SameComponent flag="我是第三个组件" show={show3} />
    </div>
  );
};

export default useSameDemo;
