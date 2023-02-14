import React, { useState } from "react";
import { DND, DNDPartialEvent, DNDFullEvent } from "m78/dnd";

import css from "./style.module.scss";

const BaseExample = () => {
  const [text, setText] = useState("尝试拖动盒子到相邻盒子的不同位置🤏");

  const onDrag = (e: DNDPartialEvent<string>) => {
    setText(`开始拖动: ${e.source.data}`);
  };
  const onDrop = (e: DNDPartialEvent<string>) => {
    if (!e.target) {
      setText(`取消了拖动`);
    }
  };
  const onSourceEnter = (e: DNDFullEvent<string>) => {
    setText(`进入${e.target.data}`);
  };
  const onSourceLeave = (e: DNDPartialEvent<string>) => {
    setText("离开");
  };
  const onSourceAccept = (e: DNDFullEvent<string>) => {
    let position = "";

    if (e.status.left) position = "左";
    if (e.status.right) position = "右";
    if (e.status.top) position = "上";
    if (e.status.bottom) position = "下";
    if (e.status.center) position = "中间";

    setText(`从${e.source.data}拖动到${e.target.data}, 位置是: ${position}`);
  };

  return (
    <div>
      <DND data="box1" enableDrag onDrag={onDrag} onDrop={onDrop}>
        {({ status, enables, ref }) => (
          <div
            className={css.box}
            ref={ref}
            style={{ opacity: enables.enable ? undefined : "0.4" }}
          >
            {status.dragging && "✊🏻"}
            {status.regular && "drag"}
          </div>
        )}
      </DND>
      <DND
        data="box2"
        enableDrop
        onSourceEnter={onSourceEnter}
        onSourceLeave={onSourceLeave}
        onSourceAccept={onSourceAccept}
      >
        {({ status, ref }) => (
          <div className={css.box} ref={ref}>
            {status.center && "😜"}
            {status.left && "👈"}
            {status.right && "👉"}
            {status.top && "👆"}
            {status.bottom && "👇"}
            {status.regular && "drop"}
          </div>
        )}
      </DND>

      <div className="fs-md mt-24">{text}</div>
    </div>
  );
};

export default BaseExample;
