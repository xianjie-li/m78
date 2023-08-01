import React from "react";
import { useKeyboard } from "../../src";
import { KeyboardHelperModifier } from "../../src/ui/use-keyboard/use-keyboard.js";

export function UseKeyboardExample() {
  useKeyboard({
    handle(e) {
      console.log(1, e);
    },
    enable: (e) => {
      return e.code === "KeyC";
    },
    // overwrite: true,
  });

  useKeyboard({
    code: "KeyC",
    modifier: KeyboardHelperModifier.sysCmd,
    handle(e) {
      console.log(2, e);
    },
  });

  return <div>123213111</div>;
}
