import React, { useState } from 'react';

import { Transition, TransitionTypeEnum } from 'm78/transition';
import { Button } from 'm78/button';
import sty from './style.module.scss';

const BuiltIn = () => {
  const [show, setShow] = useState(true);

  return (
    <div>
      <div className="mb-16">
        <Button onClick={() => setShow(prev => !prev)}>{show ? 'show' : 'hide'}</Button>
      </div>

      <div className={sty.wrap}>
        <Transition show={show} type={TransitionTypeEnum.fade} className={sty.box}>
          fade
        </Transition>
      </div>
      <div className={sty.wrap}>
        <Transition show={show} type={TransitionTypeEnum.zoom} className={sty.box}>
          zoom
        </Transition>
      </div>
      <div className={sty.wrap}>
        <Transition show={show} type={TransitionTypeEnum.punch} className={sty.box}>
          punch
        </Transition>
      </div>
      <div className={sty.wrap}>
        <Transition show={show} type={TransitionTypeEnum.slideLeft} className={sty.box}>
          slideLeft
        </Transition>
      </div>
      <div className={sty.wrap}>
        <Transition show={show} type={TransitionTypeEnum.slideRight} className={sty.box}>
          slideRight
        </Transition>
      </div>
      <div className={sty.wrap}>
        <Transition show={show} type={TransitionTypeEnum.slideTop} className={sty.box}>
          slideTop
        </Transition>
      </div>
      <div className={sty.wrap}>
        <Transition show={show} type={TransitionTypeEnum.slideBottom} className={sty.box}>
          slideBottom
        </Transition>
      </div>
      <div className={sty.wrap}>
        <Transition show={show} type={TransitionTypeEnum.bounce} className={sty.box}>
          bounce
        </Transition>
      </div>
    </div>
  );
};

export default BuiltIn;
