import React, { useState } from "react";
import { useKeyboard, UseKeyboardModifier } from "@m78/hooks";

const useThrottleDemo = () => {
  const [info, setInfo] = useState("按下按键!");

  /** 默认触发所有按键 */
  useKeyboard({
    onTrigger(e) {
      setInfo(JSON.stringify(e, null, 4));
    },
  });

  /** 进行更细粒度的配置 */
  useKeyboard({
    code: ["KeyC"],
    modifier: [UseKeyboardModifier.sysCmd],
    onTrigger() {
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
