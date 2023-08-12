import React from "react";
import { OverlayDragHandle, Overlay, Button, TriggerType } from "m78";

import css from "./style.module.scss";

const Drag = () => {
  return (
    <div>
      <Overlay
        triggerType={TriggerType.click}
        content={
          <div className={css.modal}>
            <div>
              <OverlayDragHandle>
                {(bind) => (
                  <button
                    {...bind()}
                    style={{ display: "block", width: "100%" }}
                  >
                    drag me
                  </button>
                )}
              </OverlayDragHandle>
            </div>
            <div className="mt-12">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi,
              aut deserunt distinctio et, eum fuga id illo, illum in iure libero
              magni nam nobis numquam obcaecati quod saepe veritatis voluptas!
            </div>
          </div>
        }
      >
        <Button>open drag</Button>
      </Overlay>
    </div>
  );
};

export default Drag;
