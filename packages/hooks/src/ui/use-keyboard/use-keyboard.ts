import { useEffect, useRef } from "react";
import {
  createKeyboardHelper,
  KeyboardHelper,
  KeyboardHelperOption,
} from "@m78/utils";

export { KeyboardHelperTriggerType, KeyboardHelperModifier } from "@m78/utils";

export type {
  KeyboardHelperCallback,
  KeyboardHelperOption,
  KeyboardHelperEvent,
  KeyboardHelper,
} from "@m78/utils";

/** subscribe keyboard event */
export function useKeyboard(option: KeyboardHelperOption) {
  const helper = useRef<KeyboardHelper | null>(null);

  if (helper.current) {
    helper.current.update(option);
  }

  useEffect(() => {
    helper.current = createKeyboardHelper(option);

    return () => {
      helper.current?.destroy();
    };
  }, []);
}
