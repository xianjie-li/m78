import { _TriggerContext } from "./types.js";
export declare function _eventImpl(ctx: _TriggerContext): {
    bind: () => void;
    unbind: () => void;
    clickHandle: (e: MouseEvent) => void;
    focusHandle: {
        focus: (e: FocusEvent) => void;
        blur: (e: FocusEvent) => void;
        focusBeforeMark: () => void;
        clear: () => void;
    };
    activeHandle: {
        trigger: (e: MouseEvent | TouchEvent) => void;
        clear: (e?: TouchEvent) => void;
    };
    moveHandle: {
        trigger: (e: MouseEvent | TouchEvent) => void;
        clear: () => void;
        hasTrigger: () => boolean;
    };
    contextMenuHandle: {
        contextMenu: (e: MouseEvent | TouchEvent, isSimulation?: boolean) => void;
        simulationContextMenu: (e: TouchEvent) => void;
    };
    dragHandle: {
        move: (e: TouchEvent | MouseEvent) => void;
        end: (e: TouchEvent | MouseEvent) => void;
        clear: () => void;
        startMark: (e: MouseEvent | TouchEvent) => void;
        dragTrigger: (e: MouseEvent | TouchEvent) => void;
    };
};
//# sourceMappingURL=event.d.ts.map