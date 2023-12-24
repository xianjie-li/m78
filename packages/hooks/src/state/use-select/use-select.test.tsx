import { render, screen } from "@testing-library/react";
import React, { useEffect } from "react";
import { useSelect } from "./use-select.js";

test("useSelect", async () => {
  const list = [1, 2, 3, 4, 5];

  const fn = jest.fn(() => {});

  function Test() {
    const select = useSelect({
      list,
    });

    useEffect(() => {
      select.setAllSelected([1, 3, 5]);
    }, []);

    fn();

    return <div>{select.getState().selected.join("-")}</div>;
  }

  render(<Test />);

  await screen.findByText("1-3-5");

  expect(fn.mock.calls.length).toBe(2);
});
