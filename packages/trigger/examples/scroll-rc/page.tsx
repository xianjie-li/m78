import React from "react";
import { useScroll } from "../../src/react/use-scroll.js";

const ScrollExample = () => {
  const instance = useScroll<HTMLDivElement>({
    onScroll(meta) {
      console.log(meta, 11);
    },
  });

  return (
    <div>
      <div
        style={{
          height: 300,
          width: 300,
          border: "1px solid red",
          overflow: "auto",
        }}
        ref={instance.ref}
      >
        {Array.from({ length: 500 }).map((_, ind) => (
          <p key={ind} className={`P_${ind}`}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eaque,
            aperiam officia. Alias earum voluptate non nihil accusantium animi
            soluta eligendi natus sint voluptas voluptatum illo, eos nam dolorem
            iure corrupti.
          </p>
        ))}
      </div>
      <button
        onClick={() => {
          console.log(instance.get());
        }}
      >
        get()
      </button>
      <button
        onClick={() => {
          instance.scroll({ x: 500, y: 500, immediate: true });
        }}
      >
        scroll(500, 500)
      </button>
      <button
        onClick={() => {
          instance.scroll({ x: 500, y: 500 });
        }}
      >
        scroll(500, 500) animate
      </button>
      <button
        onClick={() => {
          instance.scroll({ x: 1000, y: 1000, immediate: true });
        }}
      >
        scroll(1000, 1000)
      </button>
      <button
        onClick={() => {
          instance.scroll({ x: 1000, y: 1000 });
        }}
      >
        scroll(1000, 1000) animate
      </button>
      <button
        onClick={() => {
          instance.scroll({
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
          instance.scrollToElement(".P_50");
        }}
      >
        scrollToElement 50
      </button>
    </div>
  );
};

export default ScrollExample;