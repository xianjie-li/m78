import { useContext } from "react";
import { useDrag } from "@use-gesture/react";
import { dragContext } from "./common.js";
import { AnyFunction } from "@m78/utils";

interface Props {
  children: (bind: AnyFunction) => React.ReactElement;
}

/** 用于Overlay子级, 绑定到需要支持拖动的节点上来实现Overlay拖动 */
export const _DragHandle = ({ children }: Props) => {
  const context = useContext(dragContext);

  const bind = useDrag(context.onDrag, {
    filterTaps: true,
    rubberband: true,
    from: () => context.getXY(),
    bounds: () => context.getBound(),
  });

  return children(bind);
};

_DragHandle.displayName = "DragHandle";
