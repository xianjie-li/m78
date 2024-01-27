import React from "react";

import worker from "./worker.js";

export const Page = () => {
  return (
    <div>
      <h1>hello</h1>

      <button
        onClick={() => {
          worker.init().then((res) => {
            console.log("init finish");
          });
        }}
      >
        invoke init
      </button>

      <button
        onClick={() => {
          worker.invoke("calc", 1, 2).then((res) => {
            console.log(res);
          });
        }}
      >
        invoke calc
      </button>

      <button
        onClick={() => {
          worker.invoke("calc2", 1, 2).then((res) => {
            console.log(res);
          });
        }}
      >
        invoke async calc
      </button>

      <button
        onClick={() => {
          worker.invoke("createString").then((res) => {
            console.log(res);
          });
        }}
      >
        invoke createString
      </button>
      <button
        onClick={() => {
          console.log(worker);
        }}
      >
        log worker
      </button>
    </div>
  );
};
