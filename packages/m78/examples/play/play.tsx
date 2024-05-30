import { isFunction, applyMixins } from "@m78/utils";
import React from "react";

class A {
  cName = "A";

  a() {
    console.log("a");
  }

  a2() {
    console.log("a");
  }
}

class B {
  cName = "B";

  b() {
    console.log("b");
  }

  b2() {
    console.log("b");
  }
}

const Cls = applyMixins(A, B);

Object.defineProperty(Cls, "name", {
  value: "Acccc",
});

Cls.displayName = "Afqfqwf";

console.log(new Cls());

const Play = () => {
  return (
    <div>
      <button onClick={() => {}}>send</button>
    </div>
  );
};

export default Play;
