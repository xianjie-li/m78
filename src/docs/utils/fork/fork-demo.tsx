import React from 'react';
import Fork from 'm78/fork';
import { useFetch } from '@lxjx/hooks';

// 模拟一个成功率为50%的请求接口
const mockData = () =>
  new Promise((res, rej) => {
    setTimeout(() => {
      const rand = Math.random();

      if (rand < 0.5) {
        rej(new Error('加载异常'));
        return;
      }

      // 模拟有无数据
      const data = Array.from({ length: Math.random() > 0.5 ? 0 : 8 }).map(() => Math.random());

      res(data);
    }, 1000);
  });

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
              <li key={item}>rand num: {item}</li>
            ))}
          </ul>
        )}
      </Fork>
    </div>
  );
};

export default ForkDemo;
