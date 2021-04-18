import React from 'react';
import Fork from 'm78/fork';
import { useFetch } from '@lxjx/hooks';

import Button from 'm78/button';
import { mockData, listItemStyle } from './utils';

const ForkCustomDemo = () => {
  const meta = useFetch<number[]>(mockData, {
    timeout: Math.random() > 0.7 ? 500 : 8000, // 模拟超时状态
  });

  return (
    <div>
      <div className="mb-12">
        <Button disabled={meta.loading} onClick={meta.send}>
          {meta.loading ? '加载中' : '发起请求'}
        </Button>
      </div>
      <Fork
        hasData={meta.data?.length}
        {...meta}
        customLoading={<span>⏳ 加载中...</span>}
        customNotice={(title, message) => (
          <div>
            <h3 className="color-error">
              {title}
              <span className="mlr-12 color-second fs">{message}</span>
              <Button className="fs" onClick={meta.send} size="small" color="primary" text>
                重试
              </Button>
            </h3>
          </div>
        )}
        customEmpty={<span>😐 没有数据喔~</span>}
      >
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

export default ForkCustomDemo;
