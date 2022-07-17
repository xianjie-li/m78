import React, { SyntheticEvent, useMemo, useRef, useState } from 'react';
import { m78Config } from 'm78/config';

import './style.scss';
import { Button } from 'm78/button';
import { useForm } from 'm78/form';
import { Size } from 'm78/common';
import { Bubble, BubbleType } from 'm78/bubble';
import { Overlay, OverlayInstance } from 'm78/overlay';
import { Input } from 'm78/input';
import { Spin } from 'm78/spin';
import NotifyExample from './notify/notify-example';
import { delay } from '@lxjx/utils';
import { useFetch } from '@lxjx/hooks';
import { Select } from 'm78/select';
import { Table, TableColumn } from 'm78/table';
import { nestHeaderColumnsFormat } from 'm78/table/_functions';

const serv = () => delay(100, [1]);

const data = Array.from({ length: 5 }).map((k, ind) => ({
  key: ind,
  f1: '1',
  f2: '1',
  f3: '111111111',
  f4: '1',
  f5: '1',
  f6: '1',
  f7: '1',
  f8: '1',
}));

const columns: TableColumn[] = [
  {
    label: '列1',
  },
  {
    label: '列2',
    children: [
      {
        label: '列2-1',
      },
      {
        label: '列2-2',
        children: [
          {
            label: '列2-2-1',
          },
          {
            label: '列2-2-2',
          },
        ],
      },
    ],
  },
  {
    label: '列3',
    children: [
      {
        label: '列3-1',
      },
      {
        label: '列3-2',
      },
    ],
  },
];

console.time('aaa');
console.log(nestHeaderColumnsFormat(columns));
console.timeEnd('aaa');

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

        <Button onClick={handle}>{show.toString()}</Button>

        {show && (
          <Button loading={fh.loading} onClick={fh.send}>
            btn
          </Button>
        )}

        <Table
          // style={{ width: 300 }}
          height="400px"
          columns={[
            {
              label: '标识',
              field: 'key',
              fixed: 'left',
            },
            {
              label: '标识-list',
              children: [
                {
                  label: '标识1',
                  field: 'f1',
                },
                {
                  label: '标识2',
                  field: 'f2',
                },
                {
                  label: '标识3',
                  children: [
                    {
                      label: '标识1',
                      field: 'f1',
                    },
                    {
                      label: '标识2',
                      field: 'f2',
                    },
                    {
                      label: '标识3',
                      field: 'f3',
                      children: [
                        {
                          label: '标识1',
                          field: 'f1',
                        },
                        {
                          label: '标识2',
                          field: 'f2',
                        },
                        {
                          label: '标识3',
                          field: 'f3',
                          children: [
                            {
                              label: '标识1',
                              field: 'f1',
                            },
                            {
                              label: '标识2',
                              field: 'f2',
                            },
                            {
                              label: '标识3',
                              field: 'f3',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              label: '标识1',
              field: 'f1',
            },
            {
              label: '标识2',
              field: 'f2',
            },
            {
              label: '标识3',
              field: 'f3',
            },
            {
              label: '标识4',
              field: 'f4',
            },
            {
              label: '标识5',
              field: 'f5',
            },
            {
              label: '标识6',
              field: 'f6',
            },
            {
              label: '标识7',
              field: 'f7',
              fixed: 'right',
            },
          ]}
          valueKey="key"
          dataSource={data}
        />
      </div>
    </div>
  );
};

/*
 * 分割线
 * */

export default App;
