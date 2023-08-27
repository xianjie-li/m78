import React from "react";
import { Overlay, Button } from "m78";

import css from "./style.module.scss";

const Nest = () => {
  function renderSingleOverlay(zIndex: number) {
    return (
      <Overlay
        content={
          <div className={css.modal}>
            {zIndex === 3 ? "It's at end." : renderSingleOverlay(zIndex + 1)}
            <div className="mt-16">click outside or press ESC to close</div>
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
