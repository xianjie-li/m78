import React, { useState } from 'react';
import { m78Config } from 'm78/config';

import './style.scss';
import { Transition, TransitionBase } from 'm78/transition';
import { config } from 'react-spring';
import { Spin } from 'm78/spin';
import { FullSizeEnum } from 'm78/types';

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

      <Spin size={FullSizeEnum.small} />
      <Spin />
      <Spin size={FullSizeEnum.large} />
      <Spin size={FullSizeEnum.big} />

      <div>
        <button type="button" onClick={() => setShow(p => !p)}>
          toggle
        </button>
        <button type="button" onClick={() => setType('slideRight')}>
          slide
        </button>
        <button type="button" onClick={() => setType('zoom')}>
          zoom
        </button>
      </div>
      <Transition
        show={show}
        type={type as any}
        reset
        className="aaBox"
        onStart={() => {
          console.log('start');
        }}
      >
        {show.toString()}
      </Transition>

      <button type="button" onClick={() => setShow(p => !p)}>
        {show.toString()}
      </button>

      <TransitionBase
        appear={false}
        className="aaBox"
        from={{ opacity: 0, x: 0 }}
        to={{ opacity: 1, x: 100 }}
        show={show}
        springProps={{
          config: config.wobbly,
        }}
      >
        14241241
      </TransitionBase>

      <TransitionBase
        // appear={false}
        className="aaBox"
        from={{ n: 0 }}
        to={{ n: 99999 }}
        show={show}
        changeVisible={false}
      >
        {style => style.n.to((n: number) => n.toFixed(0))}
      </TransitionBase>

      <span>123</span>

      <Transition show={show} type="fade" className="aaBox">
        fade
      </Transition>
      <Transition show={show} type="zoom" className="aaBox">
        zoom
      </Transition>
      <Transition show={show} type="punch" className="aaBox">
        punch
      </Transition>
      <Transition show={show} type="bounce" className="aaBox">
        bounce
      </Transition>
      <Transition show={show} type="slideLeft" className="aaBox">
        slideLeft
      </Transition>
      <Transition show={show} type="slideRight" className="aaBox">
        slideRight
      </Transition>
      <Transition show={show} type="slideTop" className="aaBox">
        slideTop
      </Transition>
      <Transition show={show} type="slideBottom" className="aaBox">
        slideBottom
      </Transition>
    </div>
  );
};

/*
 * 分割线
 * */

export default App;
