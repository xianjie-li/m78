var _document;
import { isFunction } from "../is.js";
import { createEvent } from "../lang.js";
import { setNamePathValue, getNamePathValue } from "../object.js";
var number = 0;
var lastTriggerNumber = 0;
/** Get touch point number */ export function getTouchesNumber() {
    return number;
}
/** Touch point number change */ export var touchesNumberChange = createEvent();
function triggerEvent() {
    if (lastTriggerNumber !== number) {
        lastTriggerNumber = number;
        touchesNumberChange.emit(number);
    }
}
if (typeof document !== "undefined" && isFunction((_document = document) === null || _document === void 0 ? void 0 : _document.addEventListener)) {
    var isBound = getNamePathValue(document, "__touchesNumberEventBind");
    if (!isBound) {
        setNamePathValue(document, "__touchesNumberEventBind", true);
        document.addEventListener("touchstart", function(e) {
            number = e.touches.length;
            triggerEvent();
            var endHandle = function() {
                number = 0;
                triggerEvent();
                e.target.removeEventListener("touchend", endHandle);
            };
            e.target.addEventListener("touchend", endHandle);
        }, true // ensure fastest trigger
        );
    }
}
