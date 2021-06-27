import React, { useState } from 'react';
import { m78Config } from 'm78/config';
import { Divider } from 'm78/layout';
import { Button } from 'm78/button';
import { DND, DNDContext } from 'm78/dnd';
import clsx from 'clsx';

import './style.scss';
import { swap } from '@lxjx/utils';
import _shuffle from 'lodash/shuffle';
import { Scroller } from 'm78/scroller';

let last = 15;

const App = () => {
  const dark = m78Config.useState(state => state.darkMode);

  const [ls, setLs] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

  return (
    <div className="p-32">
      <Button onClick={() => m78Config.setState({ darkMode: !m78Config.getState().darkMode })}>
        {dark ? 'dark' : 'light'}
      </Button>
      <Divider />

      <Button
        onClick={() => {
          setLs(_shuffle(ls));
        }}
      >
        _shuffle
      </Button>

      <Button
        onClick={() => {
          last += 1;
          setLs(prev => [...prev, last]);
        }}
      >
        push
      </Button>

      <Scroller hideScrollbar style={{ height: 300, width: 100, border: '1px solid blue' }}>
        <DNDContext
          onAccept={e => {
            const t = e.target.data;
            const s = e.source.data;

            swap(ls, ls.indexOf(s), ls.indexOf(t));

            setLs([...ls]);
          }}
        >
          {ls.map(item => {
            return (
              <DND key={item} data={item} enableDrop>
                {({ innerRef, status, enables }) => (
                  <div ref={innerRef} className="m78-dnd-box-anime testBox">
                    <div
                      className={clsx('m78-dnd-box-anime_main', {
                        // 禁用、拖动到中间的状态
                        __active: status.dragOver,
                      })}
                    >
                      <div>{item}</div>
                    </div>
                  </div>
                )}
              </DND>
            );
          })}
        </DNDContext>
      </Scroller>
    </div>
  );
};

/*
 * 分割线
 * */

export default App;
