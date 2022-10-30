import React from "react";
import { render } from "../utils";
import { usePolling } from "../../src/effect/use-polling/use-polling";
import { useToggle } from "../../src";

const start = Date.now();

function Demo() {
  const [toggle, setToggle] = useToggle(true);

  usePolling({
    trigger: async () => {
      console.log(Date.now() - start);
    },
    interval: 500,
    // growRatio: 1.1,
    // maxPollingNumber: 5,
  });

  return (
    <div>
      <button onClick={() => setToggle()}>{toggle.toString()}</button>
    </div>
  );
}

render(<Demo />);
