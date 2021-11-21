import React, { useState } from 'react';
import { m78Config } from 'm78/config';

import './style.scss';
import { Transition, TransitionBase, TransitionTypeEnum, config } from 'm78/transition';
import { Spin } from 'm78/spin';
import { FullSizeEnum } from 'm78/types';
import { Button } from 'm78/button';
import sty from './style.module.scss';

const App = () => {
  const dark = m78Config.useState(state => state.darkMode);

  const [show, setShow] = useState(true);
  const [type, setType] = React.useState('slideRight');

  return (
    <div className="p-32">
      <button
        type="button"
        onClick={() => m78Config.setState({ darkMode: !m78Config.getState().darkMode })}
      >
        {dark ? 'dark' : 'light'}
      </button>

      <hr />

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

      <div>
        使用`TransitionBase`来简单的实现各种自定义动画, 可以通过`interpolater`prop或render
        children来进行更为强大的插值动画
      </div>
      <div className={sty.wrap}>
        <TransitionBase show={show} to={{ opacity: 1 }} from={{ opacity: 0 }} className={sty.box}>
          custom1
        </TransitionBase>
      </div>
      <div className={sty.wrap}>
        <TransitionBase
          show={show}
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
          show={show}
          to={{ transform: 'translate3d(0%, 0, 0) scale(1) rotate(0turn)' }}
          from={{ transform: 'translate3d(100%, 0, 0) scale(0) rotate(1turn)' }}
          className={sty.box}
        >
          custom2
        </TransitionBase>
      </div>

      <div>
        动画配置, 可用于配置动画表现、行为、添加动画回调钩子等,
        更多细节请参考[react-spring](https://www.react-spring.io/)
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

/*
 * 分割线
 * */

export default App;
