import React from "react";

import { useSetState } from "../../";

const UseSetStateDemo = () => {
  const [state, setState] = useSetState({ count: 0, other: "lxj" });

  const clickHandle = React.useCallback(() => {
    setState({ count: state.count + 1 });
    // setState(prev => ({ count: prev.count + 1 })); // 两种使用方式达到的效果几乎是一致的

    // 由于state引用始终相同，所以在setState后可以立即获取到最新的状态, 在useEffect、useCallback等闭包环境中可通过state获取到最新状态
    console.log(state);
  }, []);

  return (
    <div>
      <div>{JSON.stringify(state)}</div>
      <br />
      <button onClick={clickHandle}>add {state.count}</button>
    </div>
  );
};

export default UseSetStateDemo;
