import React, { SyntheticEvent, useMemo, useRef, useState } from 'react';
import { m78Config } from 'm78/config';

import './style.scss';
import { Button } from 'm78/button';
import { useForm } from 'm78/form';
import { Size } from 'm78/common';
import { Bubble, BubbleType } from 'm78/bubble';
import { Overlay, OverlayInstance } from 'm78/overlay';
import { Input } from 'm78/input';
import NotifyExample from './notify/notify-example';

const App = () => {
  const dark = m78Config.useState(state => state.darkMode);

  const [show, setShow] = useState(false);

  const [mount, setMount] = useState(false);

  const insRef = useRef<OverlayInstance>(null!);

  function handleClick(e: SyntheticEvent) {
    insRef.current.updateTarget(e.currentTarget as HTMLElement);
    setShow(true);
  }

  return (
    <div className="m78 p-16">
      <button
        style={{ position: 'fixed', right: 12, top: 12 }}
        type="button"
        onClick={() => m78Config.set({ darkMode: !m78Config.get().darkMode })}
      >
        {dark ? 'dark' : 'light'}
      </button>

      <div>
        <NotifyExample />
      </div>
    </div>
  );
};

/*
 * 分割线
 * */

export default App;
