import React, { useState } from 'react';
import { m78Config } from 'm78/config';

import './style.scss';
import { delay } from '@lxjx/utils';
import { useFetch } from '@lxjx/hooks';
import NotifyExample from './notify/notify-example';
import { Tile } from '@/components/layout';
import { Spin } from 'm78/spin';
import { Button } from 'm78/button';

const serv = () => delay(100, [1]);

const App = () => {
  const dark = m78Config.useState(state => state.darkMode);

  const [show, setShow] = useState(true);

  const [loading, setLoading] = useState(false);

  const fh = useFetch(serv, {
    manual: true,
    onSuccess() {
      setShow(false);
    },
  });

  function handle() {
    setLoading(true);

    setTimeout(() => {
      setShow(false);
    }, 100);
  }

  function loadi() {}

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

        <Button onClick={() => setLoading(p => !p)}>click</Button>

        <Spin show={loading} />

        <div style={{ width: 300, height: 300 }} className="border psr">
          <Spin show={loading} full />
        </div>
      </div>
    </div>
  );
};

/*
 * 分割线
 * */

export default App;
