import { isFunction } from "../is.js";
import { createEvent } from "../lang.js";
import { setNamePathValue, getNamePathValue } from "../object.js";

let number = 0;
let lastTriggerNumber = 0;

/** Get touch point number */
export function getTouchesNumber() {
  return number;
}

/** Touch point number change */
export const touchesNumberChange = createEvent();

function triggerEvent() {
  if (lastTriggerNumber !== number) {
    lastTriggerNumber = number;
    touchesNumberChange.emit(number);
  }
}

if (typeof document !== "undefined" && isFunction(document?.addEventListener)) {
  const isBound = getNamePathValue(document, "__touchesNumberEventBind");

  if (!isBound) {
    setNamePathValue(document, "__touchesNumberEventBind", true);

    document.addEventListener(
      "touchstart",
      (e) => {
        number = e.touches.length;

        triggerEvent();

        const endHandle = () => {
          number = 0;
          triggerEvent();

          e.target!.removeEventListener("touchend", endHandle);
        };

        e.target!.addEventListener("touchend", endHandle);
      },
      true // ensure fastest trigger
    );
  }
}
