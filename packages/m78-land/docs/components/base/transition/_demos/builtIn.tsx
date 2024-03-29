import React, { useState } from "react";

import { Transition, TransitionType, Button } from "m78";
import sty from "./style.module.scss";

const BuiltIn = () => {
  const [show, setShow] = useState(true);

  return (
    <div>
      <div className="mb-16">
        <Button onClick={() => setShow((prev) => !prev)}>
          {show ? "show" : "hide"}
        </Button>
      </div>

      <div className={sty.wrap}>
        <Transition open={show} type={TransitionType.fade} className={sty.box}>
          fade
        </Transition>
      </div>
      <div className={sty.wrap}>
        <Transition open={show} type={TransitionType.zoom} className={sty.box}>
          zoom
        </Transition>
      </div>
      <div className={sty.wrap}>
        <Transition open={show} type={TransitionType.punch} className={sty.box}>
          punch
        </Transition>
      </div>
      <div className={sty.wrap}>
        <Transition
          open={show}
          type={TransitionType.slideLeft}
          className={sty.box}
        >
          slideLeft
        </Transition>
      </div>
      <div className={sty.wrap}>
        <Transition
          open={show}
          type={TransitionType.slideRight}
          className={sty.box}
        >
          slideRight
        </Transition>
      </div>
      <div className={sty.wrap}>
        <Transition
          open={show}
          type={TransitionType.slideTop}
          className={sty.box}
        >
          slideTop
        </Transition>
      </div>
      <div className={sty.wrap}>
        <Transition
          open={show}
          type={TransitionType.slideBottom}
          className={sty.box}
        >
          slideBottom
        </Transition>
      </div>
      <div className={sty.wrap}>
        <Transition
          open={show}
          type={TransitionType.bounce}
          className={sty.box}
        >
          bounce
        </Transition>
      </div>
    </div>
  );
};

export default BuiltIn;
