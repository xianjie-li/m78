import React from "react";
import { createSeed } from "../../src/seed";

const seed = createSeed({
  state: {
    count: 0,
  },
});

export function SeedExample() {
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
}
