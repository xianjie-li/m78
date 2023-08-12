import { _TriggerContext, TriggerTarget } from "../types.js";
export declare function _moveActiveImpl(ctx: _TriggerContext): {
    moveActive: (e: MouseEvent | TouchEvent) => void;
    clearActive: (e?: Event, filter?: ((target: TriggerTarget) => boolean) | undefined) => void;
    clearMove: (e?: Event, filter?: ((target: TriggerTarget) => boolean) | undefined) => void;
};
//# sourceMappingURL=move-active.d.ts.map