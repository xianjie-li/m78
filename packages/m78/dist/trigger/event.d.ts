import { _TriggerContext } from "./types.js";
export declare function _eventImpl(ctx: _TriggerContext): {
    bind: () => void;
    unbind: () => void;
    clickHandle: (e: MouseEvent) => void;
    focusHandle: {
        focus: (e: FocusEvent) => void;
        blur: (e: FocusEvent) => void;
        focusBeforeMark: () => void;
        isInteractiveFocus: () => boolean;
        clear: () => void;
    };
    moveActiveHandle: {
        moveActive: (e: MouseEvent | TouchEvent) => void;
        clearActive: (e?: Event | undefined, filter?: ((target: import("./types.js").TriggerTarget) => boolean) | undefined) => void;
        clearMove: (e?: Event | undefined, filter?: ((target: import("./types.js").TriggerTarget) => boolean) | undefined) => void;
    };
    contextMenuHandle: {
        clear: () => void;
        contextMenu: (e: MouseEvent) => void;
        simulationStart: (e: TouchEvent) => void;
        simulationMove: () => void;
        simulationEnd: () => void;
    };
    dragHandle: {
        start: (e: MouseEvent | TouchEvent) => boolean | undefined;
        move: (e: MouseEvent | TouchEvent) => void;
        end: (e: MouseEvent | TouchEvent) => void;
        clear: () => void;
    };
};
//# sourceMappingURL=event.d.ts.map