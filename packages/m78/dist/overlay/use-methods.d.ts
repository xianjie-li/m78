import { BoundSize, TupleNumber } from "@m78/utils";
import { _ClampBound, _OverlayContext, OverlayTarget, OverlayUpdateType } from "./types.js";
import { Handler } from "@use-gesture/core/types";
import { TriggerEvent } from "@m78/trigger";
export declare function _useMethods(ctx: _OverlayContext): {
    getBoundWithXY: (xy: TupleNumber) => BoundSize;
    getBoundWithAlignment: (alignment: TupleNumber) => BoundSize;
    getBoundWithTarget: (target: OverlayTarget) => [BoundSize, HTMLElement | null];
    getBound: (type?: OverlayUpdateType) => [BoundSize | null, OverlayUpdateType | null, HTMLElement | null];
    activeContent: () => void;
    unActiveContent: () => void;
    updateChildrenEl: () => void;
    isArrowEnable: () => boolean | undefined;
    updateXY: (xy: TupleNumber, immediate?: boolean) => void;
    updateAlignment: (alignment: TupleNumber, immediate?: boolean) => void;
    updateTarget: (target: OverlayTarget, immediate?: boolean) => void;
    update: (immediate?: boolean) => void;
    throttleUpdate: () => void;
    debounceUpdate: () => void;
    onTriggerMultiple: (e: TriggerEvent) => void;
    onDragHandle: Handler<"drag", MouseEvent | PointerEvent | KeyboardEvent | TouchEvent>;
    getDragInitXY: () => TupleNumber;
    getDragBound: () => _ClampBound;
};
export type _Methods = ReturnType<typeof _useMethods>;
//# sourceMappingURL=use-methods.d.ts.map