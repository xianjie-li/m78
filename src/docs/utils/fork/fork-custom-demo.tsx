import React from 'react';
import Fork from 'm78/fork';
import { useFetch } from '@lxjx/hooks';

import { mockData, listItemStyle } from './utils';

const ForkDemo = () => {
  const meta = useFetch<number[]>(mockData, {
    timeout: Math.random() > 0.7 ? 500 : 8000, // 模拟超时状态
  });

  return (
    <div>
      <div className="mb-12">
        <button type="button" disabled={meta.loading} onClick={meta.send}>
          {meta.loading ? '加载中' : '发起请求'}
        </button>
      </div>
      <Fork hasData={meta.data && meta.data.length} {...meta}>
        {() => (
          <ul>
            {meta.data!.map(item => (
              <li key={item} style={listItemStyle}>
                rand num: {item}
              </li>
            ))}
          </ul>
        )}
      </Fork>
    </div>
  );
};

export default ForkDemo;
