import React from "react";
import { createSeed } from "./index";
import { render, waitFor } from "@testing-library/react";

/** State 基于 useState 所以前者正常运行即可 */
test("rc seed", async () => {
  const seed = createSeed({
    state: {
      name: "m78 project",
      count: 0,
    },
  });

  const rChild = jest.fn((state) => <span>{state}</span>);

  const res = render(
    <seed.State selector={(state) => state.count}>{rChild}</seed.State>
  );

  await res.findByText("0");

  await waitFor(() => {
    seed.set({
      count: seed.get().count + 1,
    });
  });

  await res.findByText("1");

  expect(rChild.mock.calls.length).toBe(2);
});
