import React, { useState } from 'react';

import { config, Transition, TransitionTypeEnum } from 'm78/transition';
import { Button } from 'm78/button';
import sty from './style.module.scss';

const Config = () => {
  const [show, setShow] = useState(true);

  return (
    <div>
      <div className="mb-16">
        <Button onClick={() => setShow(prev => !prev)}>{show ? 'show' : 'hide'}</Button>
      </div>

      <div className={sty.wrap}>
        <Transition
          show={show}
          springProps={{
            config: config.wobbly,
          }}
          type={TransitionTypeEnum.slideBottom}
          className={sty.box}
        >
          wobbly
        </Transition>
      </div>
      <div className={sty.wrap}>
        <Transition
          show={show}
          springProps={{
            config: config.default,
          }}
          type={TransitionTypeEnum.slideBottom}
          className={sty.box}
        >
          default
        </Transition>
      </div>

      <div className={sty.wrap}>
        <Transition
          show={show}
          springProps={{
            config: config.gentle,
          }}
          type={TransitionTypeEnum.slideBottom}
          className={sty.box}
        >
          gentle
        </Transition>
      </div>

      <div className={sty.wrap}>
        <Transition
          show={show}
          springProps={{
            config: config.molasses,
          }}
          type={TransitionTypeEnum.slideBottom}
          className={sty.box}
        >
          molasses
        </Transition>
      </div>

      <div className={sty.wrap}>
        <Transition
          show={show}
          springProps={{
            config: config.slow,
          }}
          type={TransitionTypeEnum.slideBottom}
          className={sty.box}
        >
          slow
        </Transition>
      </div>

      <div className={sty.wrap}>
        <Transition
          show={show}
          springProps={{
            config: config.stiff,
          }}
          type={TransitionTypeEnum.slideBottom}
          className={sty.box}
        >
          stiff
        </Transition>
      </div>

      <div>
        <div className={sty.wrap}>
          <Transition
            show
            springProps={{
              config: config.stiff,
              loop: { reverse: true },
            }}
            type={TransitionTypeEnum.slideBottom}
            className={sty.box}
          >
            loop
          </Transition>
        </div>
      </div>
    </div>
  );
};

export default Config;
