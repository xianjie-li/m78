import { M78Worker } from "../../src/index.js";
import { calc, calc2, createString } from "./loader.js";

const worker = new M78Worker({
  name: "m78-worker",
  url: import.meta.url,
  workerNum: 3,
  async handleLoader() {
    const res = await import("./loader.js");

    return {
      calc: res.calc,
      calc2,
      createString,
    };
  },
});

export default worker;
