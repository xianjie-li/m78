import { _TriggerContext } from "../types.js";
export declare function _dragImpl(ctx: _TriggerContext): {
    start: (e: TouchEvent | MouseEvent) => boolean | undefined;
    move: (e: TouchEvent | MouseEvent) => void;
    end: (e: TouchEvent | MouseEvent) => void;
    clear: () => void;
};
//# sourceMappingURL=drag.d.ts.map