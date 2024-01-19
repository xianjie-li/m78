import { RCTablePlugin } from "../plugin.js";
import { IconFiveFive } from "@m78/icons/five-five.js";
import React, { useState } from "react";
import { TABLE_NS, Translation } from "../../i18n/index.js";
import { Button } from "../../button/index.js";
import { Bubble } from "../../bubble/index.js";
import { Divider } from "../../layout/index.js";
import clsx from "clsx";
import { _injector } from "../table.js";
import { _useStateAct } from "../injector/state.act.js";
import { useFn } from "@m78/hooks";

/** 拖拽滚动相关 */
export class _DragMovePlugin extends RCTablePlugin {
  toolbarLeadingCustomer(nodes: React.ReactNode[]) {
    nodes.push(<Divider vertical />, <DragMoveBtn />);
  }
}

function DragMoveBtn() {
  const { state } = _injector.useDeps(_useStateAct);

  const [enable, setEnable] = useState(() => {
    return state.instance.isDragMoveEnable();
  });

  state.instance.event.dragMoveChange.useEvent((enable) => {
    setEnable(enable);
  });

  const change = useFn(() => {
    state.instance.setDragMoveEnable(!enable);
  });

  return (
    <Translation ns={TABLE_NS}>
      {(t) => (
        <Bubble content={t("enable drag scroll")} style={{ maxWidth: 260 }}>
          <Button squareIcon onClick={change}>
            <IconFiveFive className={clsx(enable && "color")} />
          </Button>
        </Bubble>
      )}
    </Translation>
  );
}
