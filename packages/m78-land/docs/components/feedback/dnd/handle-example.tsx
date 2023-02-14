import React from "react";
import { DND } from "m78/dnd";

import css from "./style.module.scss";

const HandleExample = () => {
  return (
    <DND data="customHandle" enableDrag>
      {(props) => (
        <div ref={props.ref} className={css.box}>
          <div
            ref={props.handleRef}
            className="border p-8 fs-12"
            style={{ touchAction: "none", userSelect: "none" }}
          >
            drag handle
          </div>
        </div>
      )}
    </DND>
  );
};

export default HandleExample;
