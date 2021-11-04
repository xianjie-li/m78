import React, { useState } from 'react';
import { m78Config } from 'm78/config';

import './style.scss';
import { TransitionBase } from 'm78/transition';
import { config } from 'react-spring';

const App = () => {
  const dark = m78Config.useState(state => state.darkMode);

  const [show, setShow] = useState(true);

  return (
    <div className="p-32">
      <button
        type="button"
        onClick={() => m78Config.setState({ darkMode: !m78Config.getState().darkMode })}
      >
        {dark ? 'dark' : 'light'}
      </button>

      <hr />

      <button type="button" onClick={() => setShow(p => !p)}>
        {show.toString()}
      </button>

      <TransitionBase
        // appear={false}
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
        from={{ n: 0 }}
        to={{ n: 99999 }}
        show={show}
        changeVisible={false}
      >
        {style => style.n.to(n => n.toFixed(0))}
      </TransitionBase>

      <span>123</span>
    </div>
  );
};

/*
 * 分割线
 * */

export default App;
