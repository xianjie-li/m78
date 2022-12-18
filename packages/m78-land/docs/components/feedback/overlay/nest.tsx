import React from "react";
import { Overlay } from "m78/overlay";
import { Button } from "m78/button";

import css from "./style.module.scss";
import { getRandRange } from "@m78/utils";

const Nest = () => {
  function renderSingleOverlay(zIndex: number) {
    return (
      <Overlay
        content={
          <div className={css.modal}>
            {zIndex === 3 ? "It's at end." : renderSingleOverlay(zIndex + 1)}
          </div>
        }
        alignment={[0.4 + zIndex * 0.05, 0.4 + zIndex * 0.05]}
        mask
      >
        <Button>{zIndex === 0 ? "open new" : "open nest"}</Button>
      </Overlay>
    );
  }

  return <div>{renderSingleOverlay(0)}</div>;
};

export default Nest;
