import { _TriggerContext } from "../types.js";
export declare function _dragImpl(ctx: _TriggerContext): {
    move: (e: TouchEvent | MouseEvent) => void;
    end: (e: TouchEvent | MouseEvent) => void;
    clear: () => void;
    startMark: (e: MouseEvent | TouchEvent) => void;
    dragTrigger: (e: MouseEvent | TouchEvent) => void;
};
//# sourceMappingURL=drag.d.ts.map