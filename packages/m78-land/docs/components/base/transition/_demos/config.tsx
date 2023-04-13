import React, { useState } from "react";

import { transitionConfig, Transition, TransitionType, Button } from "m78";
import sty from "./style.module.scss";

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
            config: transitionConfig.wobbly,
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
            config: transitionConfig.default,
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
            config: transitionConfig.gentle,
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
            config: transitionConfig.molasses,
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
            config: transitionConfig.slow,
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
            config: transitionConfig.stiff,
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
