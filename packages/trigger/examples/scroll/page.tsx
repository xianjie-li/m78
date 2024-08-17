import React, { useEffect, useRef } from "react";
import {
  _createScrollTrigger,
  type ScrollTriggerInstance,
} from "../../src/scroll/scroll.js";
import { useSelf } from "@m78/hooks";
import { STR } from "aaa";
import { a } from "aaa/a";
import { a1 } from "aaa/b.js";

const ScrollExample = () => {
  const ref = useRef<HTMLDivElement>(null);

  const self = useSelf({
    scrollTrigger: null as any as ScrollTriggerInstance,
  });

  useEffect(() => {
    self.scrollTrigger = _createScrollTrigger({
      target: ref.current!,
      // throttleTime: 1000,
      handle(e) {
        // console.log(e);
      },
    });
  }, []);

  return (
    <div>
      <div
        style={{
          height: 300,
          width: 300,
          border: "1px solid red",
          overflow: "auto",
        }}
        ref={ref}
      >
        {Array.from({ length: 500 }).map((_, ind) => (
          <p key={ind} className={`P_${ind}`}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eaque,
            aperiam officia. Alias earum voluptate non nihil accusantium animi
            soluta eligendi natus sint voluptas voluptatum illo, eos nam dolorem
            iure corrupti.
          </p>
        ))}
        {/* <div
          style={{
            width: 3000,
            height: 3000,
            background: "linear-gradient(45deg, #03A9F4, #0096888f)",
          }}
        ></div> */}
      </div>
      <button
        onClick={() => {
          console.log(self.scrollTrigger.get());
        }}
      >
        get()
      </button>
      <button
        onClick={() => {
          self.scrollTrigger.scroll({ x: 500, y: 500, immediate: true });
        }}
      >
        scroll(500, 500)
      </button>
      <button
        onClick={() => {
          self.scrollTrigger.scroll({ x: 500, y: 500 });
        }}
      >
        scroll(500, 500) animate
      </button>
      <button
        onClick={() => {
          self.scrollTrigger.scroll({ x: 1000, y: 1000, immediate: true });
        }}
      >
        scroll(1000, 1000)
      </button>
      <button
        onClick={() => {
          self.scrollTrigger.scroll({ x: 1000, y: 1000 });
        }}
      >
        scroll(1000, 1000) animate
      </button>
      <button
        onClick={() => {
          self.scrollTrigger.scroll({
            x: 300,
            y: 300,
            raise: true,
          });
        }}
      >
        scroll(100, 100, raise)
      </button>
      <button
        onClick={() => {
          self.scrollTrigger.scrollToElement(".P_50");
        }}
      >
        scrollToElement 50
      </button>
    </div>
  );
};

export default ScrollExample;
