import React from "react";
import { DND } from "m78/dnd";
import { Row } from "m78/layout";

import css from "./style.module.scss";

const BaseExample = () => {
  return (
    <div>
      <Row>
        <DND data="box1" enableDrag>
          {({ status, enables, ref }) => (
            <div
              className={css.box}
              ref={ref}
              style={{ opacity: enables.enable ? undefined : "0.4" }}
            >
              {status.dragging && "✊🏻"}
              {status.regular && "drag1"}
            </div>
          )}
        </DND>
        <DND data="box2" enableDrag>
          {({ status, enables, ref }) => (
            <div
              className={css.box}
              ref={ref}
              style={{ opacity: enables.enable ? undefined : "0.4" }}
            >
              {status.dragging && "✊🏻"}
              {status.regular && "drag2"}
            </div>
          )}
        </DND>
      </Row>

      <Row className="mt-32">
        <div>
          <DND data="box3" enableDrop={false}>
            {({ status, enables, ref }) => (
              <div
                className={css.box}
                ref={ref}
                style={{ opacity: enables.enable ? undefined : "0.4" }}
              >
                {status.regular && "drop1"}
              </div>
            )}
          </DND>
          <div className="color-second mt-8">禁止任何放置</div>
        </div>
        <div>
          <DND
            data="box4"
            enableDrop={{ top: true, bottom: true, center: true }}
          >
            {({ status, ref, enables }) => {
              return (
                <div
                  className={css.box}
                  ref={ref}
                  style={{ opacity: enables.enable ? undefined : "0.4" }}
                >
                  {status.center && "😜"}
                  {status.top && "👆"}
                  {status.bottom && "👇"}
                  {status.regular && "drop2"}
                </div>
              );
            }}
          </DND>
          <div className="color-second mt-8">允许放置上/中/下</div>
        </div>
        <div>
          <DND data="box5" enableDrop={(e) => e.source.data !== "box2"}>
            {({ status, ref, enables }) => (
              <div
                className={css.box}
                ref={ref}
                style={{ opacity: enables.enable ? undefined : "0.4" }}
              >
                {status.center && "😜"}
                {status.left && "👈"}
                {status.right && "👉"}
                {status.top && "👆"}
                {status.bottom && "👇"}
                {status.regular && "drop3"}
              </div>
            )}
          </DND>
          <div className="color-second mt-8">不允许drag2放置</div>
        </div>
      </Row>
    </div>
  );
};

export default BaseExample;
