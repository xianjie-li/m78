import React from "react";
import { UseTriggerType } from "@m78/hooks";
import { DragHandle, Overlay } from "m78/overlay";
import { Button } from "m78/button";

import css from "./style.module.scss";

const Drag = () => {
  return (
    <div>
      <Overlay
        triggerType={UseTriggerType.click}
        content={
          <div className={css.modal}>
            <div>
              <DragHandle>
                {(bind) => (
                  <button
                    {...bind()}
                    style={{ display: "block", width: "100%" }}
                  >
                    drag me
                  </button>
                )}
              </DragHandle>
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
