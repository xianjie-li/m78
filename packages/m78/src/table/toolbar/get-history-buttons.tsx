import React from "react";
import { ActionHistory } from "@m78/utils";
import { Bubble } from "../../bubble/index.js";
import { Button } from "../../button/index.js";
import { Size } from "../../common/index.js";
import { IconUndo } from "@m78/icons/icon-undo.js";
import { IconRedo } from "@m78/icons/icon-redo.js";

export function _getHistoryButtons(history: ActionHistory) {
  const prev = history.getPrev();
  const next = history.getNext();

  const redoBtn = (
    <Bubble content="撤销">
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
  );

  const undoBtn = (
    <Bubble content="重做">
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
  );

  return {
    redoBtn,
    undoBtn,
  };
}
