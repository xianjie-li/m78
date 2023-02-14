import React from "react";
import { DND } from "../../src/dnd/index.js";
import { DNDRenderProps } from "../../src/dnd/types.js";
import { Row } from "../../src/layout/index.js";

import css from "./style.module.scss";

const DNDDetailShowBox = ({
  status,
  enables,
  children,
}: Omit<DNDRenderProps, "ref" | "handleRef">) => {
  return (
    <div
      style={{
        width: 300,
        height: 300,
        border: "1px solid red",
        fontSize: 12,
      }}
    >
      <Row>
        <div>
          <div>regular: {status.regular.toString()}</div>
          <div>dragging: {status.dragging.toString()}</div>
          <div>over: {status.over.toString()}</div>
          <div>top: {status.top.toString()}</div>
          <div>right: {status.right.toString()}</div>
          <div>bottom: {status.bottom.toString()}</div>
          <div>left: {status.left.toString()}</div>
          <div>center: {status.center.toString()}</div>
        </div>
        <div>
          <div>enable: {enables.enable.toString()}</div>
          <div>all: {enables.all.toString()}</div>
          <div>top: {enables.top.toString()}</div>
          <div>right: {enables.right.toString()}</div>
          <div>bottom: {enables.bottom.toString()}</div>
          <div>left: {enables.left.toString()}</div>
          <div>center: {enables.center.toString()}</div>
        </div>
        {children}
      </Row>
    </div>
  );
};

const DndExample = () => {
  // const ref = useMeasureNotify<HTMLDivElement>({
  //   onChange(bound) {
  //     console.log(bound);
  //   },
  // });

  return (
    <div>
      <div>123123</div>
      <DND data="box1" enableDrag>
        {({ status, ref }) => (
          <div className={css.box} ref={ref}>
            {status.dragging && "✊🏻"}
            {status.regular && "drag"}
          </div>
        )}
      </DND>

      <DND
        data="a"
        enableDrag
        enableDrop
        onDrag={(e) => {
          // console.log("onDrag", e);
        }}
        onMove={(e) => {
          // console.log("onMove", e);
        }}
        onDrop={(e) => {
          // console.log("onDrop", e);
        }}
        // feedback={() => {
        //   const e = document.createElement("div");
        //   e.className = "fs-32";
        //   e.appendChild(document.createTextNode("🏠"));
        //   return e;
        // }}
        feedbackStyle={{
          background: "red",
        }}
      >
        {({ ref, handleRef, ...other }) => (
          <div ref={ref} className="box">
            <DNDDetailShowBox {...other} />
          </div>
        )}
      </DND>

      <DND
        data="b"
        enableDrop={{ center: true, left: true, bottom: true }}
        enableDrag
        onSourceEnter={(e) => {
          // console.log("onSourceEnter", e);
        }}
        onSourceMove={(e) => {
          // console.log("onSourceMove", e);
        }}
        onSourceLeave={(e) => {
          // console.log("onSourceLeave", e);
        }}
        onSourceAccept={(e) => {
          // console.log("onSourceAccept", e);
        }}
      >
        {({ ref, handleRef, ...other }) => (
          <div ref={ref} className="box">
            <DNDDetailShowBox {...other}>
              <DND data="c" enableDrop enableDrag>
                {({ ref: ref2, handleRef: hr2, ...other2 }) => (
                  <div ref={ref2} className="box">
                    <DNDDetailShowBox {...other2} />
                  </div>
                )}
              </DND>
            </DNDDetailShowBox>
          </div>
        )}
      </DND>

      <div style={{ height: 2000 }}></div>
    </div>
  );
};

export default DndExample;
