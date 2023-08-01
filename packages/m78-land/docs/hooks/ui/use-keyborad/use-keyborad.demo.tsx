import React, { useState } from "react";
import { useKeyboard, KeyboardHelperModifier } from "@m78/hooks";

const useThrottleDemo = () => {
  const [info, setInfo] = useState("按下按键!");

  /** 默认触发所有按键 */
  useKeyboard({
    handle(e) {
      setInfo(JSON.stringify(e, null, 4));
    },
    overwrite: true, // 允许被覆盖
  });

  /** 进行更细粒度的配置 */
  useKeyboard({
    code: ["KeyC"],
    modifier: [KeyboardHelperModifier.sysCmd],
    handle() {
      setInfo("复制了什么东西");
    },
  });

  return (
    <div>
      <pre>{info}</pre>
    </div>
  );
};

export default useThrottleDemo;
