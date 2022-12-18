import { useContext } from "react";
import { useDrag } from "@use-gesture/react";
import { dragContext } from "./common.js";
/** 用于Overlay子级, 绑定到需要支持拖动的节点上来实现Overlay拖动 */ export var _DragHandle = function(param) {
    var children = param.children;
    var context = useContext(dragContext);
    var bind = useDrag(context.onDrag, {
        filterTaps: true,
        rubberband: true,
        from: function() {
            return context.getXY();
        },
        bounds: function() {
            return context.getBound();
        }
    });
    return children(bind);
};
_DragHandle.displayName = "DragHandle";
