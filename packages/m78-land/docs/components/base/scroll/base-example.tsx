import React from "react";
import { Scroll } from "m78/scroll";

const BaseExample = () => {
  return (
    <Scroll
      direction="xy"
      style={{ height: 300, width: 300 }}
      className="border radius"
    >
      <div
        style={{
          width: 600,
          height: 600,
          opacity: 0.5,
          background:
            "linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%),linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%),linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)",
        }}
      ></div>
    </Scroll>
  );
};

export default BaseExample;
