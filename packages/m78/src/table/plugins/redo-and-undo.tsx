import { RCTablePlugin } from "../plugin.js";
import { _injector } from "../table.js";
import { _useStateAct } from "../injector/state.act.js";
import { TABLE_NS, Translation } from "../../i18n/index.js";
import { Bubble } from "../../bubble/index.js";
import { Button } from "../../button/index.js";
import { Size } from "../../common/index.js";
import { IconUndo } from "@m78/icons/icon-undo.js";
import React from "react";
import { IconRedo } from "@m78/icons/icon-redo.js";
import { Divider } from "../../layout/index.js";

export class _RedoAndUndoPlugin extends RCTablePlugin {
  toolbarLeadingCustomer(nodes: React.ReactNode[]) {
    nodes.push(<Divider vertical />, <RedoBtn />, <UndoBtn />);
  }
}

function RedoBtn() {
  const stateDep = _injector.useDeps(_useStateAct);

  const table = stateDep.state.instance;

  if (!table) return null;

  const history = table.history;

  return (
    <Translation ns={TABLE_NS}>
      {(t) => (
        <Bubble content={t("redo")}>
          <span>
            <Button
              disabled={!history.getPrev()}
              size={Size.small}
              squareIcon
              onClick={() => history.undo()}
            >
              <IconUndo className="color-second" />
            </Button>
          </span>
        </Bubble>
      )}
    </Translation>
  );
}

function UndoBtn() {
  const stateDep = _injector.useDeps(_useStateAct);

  const table = stateDep.state.instance;

  if (!table) return null;

  const history = table.history;

  return (
    <Translation ns={TABLE_NS}>
      {(t) => (
        <Bubble content={t("undo")}>
          <span className="ml-12">
            <Button
              disabled={!history.getNext()}
              size={Size.small}
              squareIcon
              onClick={() => history.redo()}
            >
              <IconRedo className="color-second" />
            </Button>
          </span>
        </Bubble>
      )}
    </Translation>
  );
}
