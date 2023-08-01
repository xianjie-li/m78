import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { useKeyboard, KeyboardHelperModifier } from "./use-keyboard.js";

test("use-keyboard", async () => {
  const user = userEvent.setup();

  const cb1 = jest.fn();
  const cb2 = jest.fn();
  const cb3 = jest.fn();
  const cb4 = jest.fn();
  const cb5 = jest.fn();
  const cb6 = jest.fn();

  function Demo() {
    useKeyboard({
      overwrite: true,
      handle: cb1,
    });

    useKeyboard({
      handle: cb2,
    });

    useKeyboard({
      code: ["KeyV"],
      handle: cb3,
    });

    useKeyboard({
      code: ["KeyC", "KeyD"],
      handle: cb4,
    });

    useKeyboard({
      code: ["KeyC"],
      modifier: [KeyboardHelperModifier.meta],
      handle: cb5,
    });

    useKeyboard({
      code: ["KeyC"],
      modifier: [KeyboardHelperModifier.sysCmd],
      handle: cb6,
    });

    useKeyboard({
      code: ["KeyC"],
      modifier: [KeyboardHelperModifier.sysCmd],
      handle: cb6,
    });

    return null;
  }

  await waitFor(() => {
    render(<Demo />);
  });

  await user.keyboard("vcdabbb");

  expect(cb1.mock.calls.length).toBe(0); // 被cb2/3/4覆盖
  expect(cb2.mock.calls.length).toBe(7);
  expect(cb3.mock.calls.length).toBe(1);
  expect(cb4.mock.calls.length).toBe(2);

  await user.keyboard("[MetaLeft>]c/");
  await user.keyboard("[ControlLeft>]c/");

  expect(cb5.mock.calls.length).toBe(2);
  expect(cb6.mock.calls.length).toBe(2);
});
