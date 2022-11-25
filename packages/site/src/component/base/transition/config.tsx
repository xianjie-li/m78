import React, { useState } from "react";

import { config, Transition, TransitionType } from "m78/transition";
import sty from "./style.module.scss";
import { Button } from "m78/button";

const Config = () => {
  const [show, setShow] = useState(true);

  return (
    <div>
      <div className="mb-16">
        <Button onClick={() => setShow((prev) => !prev)}>
          {show ? "show" : "hide"}
        </Button>
      </div>

      <div className={sty.wrap}>
        <Transition
          open={show}
          springProps={{
            config: config.wobbly,
          }}
          type={TransitionType.slideBottom}
          className={sty.box}
        >
          wobbly
        </Transition>
      </div>
      <div className={sty.wrap}>
        <Transition
          open={show}
          springProps={{
            config: config.default,
          }}
          type={TransitionType.slideBottom}
          className={sty.box}
        >
          default
        </Transition>
      </div>

      <div className={sty.wrap}>
        <Transition
          open={show}
          springProps={{
            config: config.gentle,
          }}
          type={TransitionType.slideBottom}
          className={sty.box}
        >
          gentle
        </Transition>
      </div>

      <div className={sty.wrap}>
        <Transition
          open={show}
          springProps={{
            config: config.molasses,
          }}
          type={TransitionType.slideBottom}
          className={sty.box}
        >
          molasses
        </Transition>
      </div>

      <div className={sty.wrap}>
        <Transition
          open={show}
          springProps={{
            config: config.slow,
          }}
          type={TransitionType.slideBottom}
          className={sty.box}
        >
          slow
        </Transition>
      </div>

      <div className={sty.wrap}>
        <Transition
          open={show}
          springProps={{
            config: config.stiff,
          }}
          type={TransitionType.slideBottom}
          className={sty.box}
        >
          stiff
        </Transition>
      </div>
    </div>
  );
};

export default Config;
