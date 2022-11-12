import React from "react";
import { render } from "../utils";
import { createSeed } from "../../src/seed";

const seed = createSeed({
  state: {
    count: 0,
  },
});

render(
  (function Demo() {
    return (
      <div>
        <div>
          <seed.State<number> selector={(state) => state.count}>
            {(count) => <span>{count}</span>}
          </seed.State>
        </div>

        <button onClick={() => seed.set({ count: seed.get().count + 1 })}>
          inc
        </button>
      </div>
    );
  })()
);
