import React, { useState } from 'react';
import { m78Config } from 'm78/config';

import './style.scss';
import { delay } from '@lxjx/utils';
import { useFetch } from '@lxjx/hooks';
import NotifyExample from './notify/notify-example';
import { Tile } from '@/components/layout';

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

        <div style={{ width: 400 }}>
          <Tile leading="呵" title="标题" desc="描述区域描述区域" trailing="你好" />
          <Tile leading="😅" title="标题" desc="描述区域描述区域" trailing="🤣" />
        </div>
      </div>
    </div>
  );
};

/*
 * 分割线
 * */

export default App;
