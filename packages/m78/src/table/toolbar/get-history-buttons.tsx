import React from "react";
import { ActionHistory } from "@m78/utils";
import { Bubble } from "../../bubble/index.js";
import { Button } from "../../button/index.js";
import { Size } from "../../common/index.js";
import { IconUndo } from "@m78/icons/icon-undo.js";
import { IconRedo } from "@m78/icons/icon-redo.js";
import { TABLE_NS, Translation } from "../../i18n/index.js";

export function _getHistoryButtons(history: ActionHistory) {
  const prev = history.getPrev();
  const next = history.getNext();

  const redoBtn = (
    <Translation ns={TABLE_NS}>
      {(t) => (
        <Bubble content={t("redo")}>
          <span>
            <Button
              disabled={!prev}
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

  const undoBtn = (
    <Translation ns={TABLE_NS}>
      {(t) => (
        <Bubble content={t("undo")}>
          <span className="ml-12">
            <Button
              disabled={!next}
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

  return {
    redoBtn,
    undoBtn,
  };
}
