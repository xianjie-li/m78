import React from "react";
import { render } from "../utils";
import { useKeyboard } from "../../src";

function Demo() {
  useKeyboard({
    onTrigger(e) {
      console.log(1, e);
    },
  });

  useKeyboard({
    onTrigger(e) {
      console.log(2, e);
    },
  });

  return <div>123213111</div>;
}

render(<Demo />);
