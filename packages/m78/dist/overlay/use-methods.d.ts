import { BoundSize, TupleNumber } from "@m78/utils";
import { UseTriggerEvent } from "@m78/hooks";
import { _ClampBound, _Context, OverlayTarget, OverlayUpdateType } from "./types.js";
import { Handler } from "@use-gesture/core/types";
export declare function _useMethods(ctx: _Context): {
    getBoundWithXY: (xy: TupleNumber) => BoundSize;
    getBoundWithAlignment: (alignment: TupleNumber) => BoundSize;
    getBoundWithTarget: (target: OverlayTarget) => BoundSize;
    getBound: (type?: OverlayUpdateType) => [BoundSize | null, OverlayUpdateType | null];
    activeContent: () => void;
    unActiveContent: () => void;
    updateChildrenEl: () => void;
    isArrowEnable: () => boolean | undefined;
    updateXY: (xy: TupleNumber, immediate?: boolean | undefined) => void;
    updateAlignment: (alignment: TupleNumber, immediate?: boolean | undefined) => void;
    updateTarget: (target: OverlayTarget, immediate?: boolean | undefined) => void;
    update: (immediate?: boolean | undefined) => void;
    throttleUpdate: () => void;
    debounceUpdate: () => void;
    onTriggerMultiple: (e: UseTriggerEvent) => void;
    onDragHandle: Handler<"drag", MouseEvent | KeyboardEvent | TouchEvent | PointerEvent>;
    getDragInitXY: () => TupleNumber;
    getDragBound: () => _ClampBound;
};
export declare type _Methods = ReturnType<typeof _useMethods>;
//# sourceMappingURL=use-methods.d.ts.map