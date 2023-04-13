import React, { useState } from "react";

import { TransitionBase, Button } from "m78";
import sty from "./style.module.scss";

const Custom = () => {
  const [show, setShow] = useState(true);

  return (
    <div>
      <div className="mb-16">
        <Button onClick={() => setShow((prev) => !prev)}>
          {show ? "show" : "hide"}
        </Button>
      </div>

      <div className={sty.wrap}>
        <TransitionBase
          open={show}
          to={{ opacity: 1 }}
          from={{ opacity: 0 }}
          className={sty.box}
        >
          custom1
        </TransitionBase>
      </div>
      <div className={sty.wrap}>
        <TransitionBase
          open={show}
          to={{ num: 1000000 }}
          from={{ num: 0 }}
          changeVisible={false}
          className={sty.box}
        >
          {({ num }) => num.to((animateNum: number) => animateNum.toFixed(2))}
        </TransitionBase>
      </div>
      <div className={sty.wrap}>
        <TransitionBase
          open={show}
          to={{ transform: "translate3d(0%, 0, 0) scale(1) rotate(0turn)" }}
          from={{ transform: "translate3d(100%, 0, 0) scale(0) rotate(1turn)" }}
          className={sty.box}
        >
          custom2
        </TransitionBase>
      </div>
    </div>
  );
};

export default Custom;
