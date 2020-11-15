import React, { useState } from 'react';
import Tree from 'm78/tree';
import { SizeEnum } from 'm78/types';
import { OptionsItem } from 'm78/tree/types';
import { getRandRange } from '@lxjx/utils';
import { RightOutlined, FileOutlined } from 'm78/icon';
import Dates from 'm78/dates/Dates';
import NoticeBar from 'm78/notice-bar';
import Input from 'm78/input';
import { useFetch } from '@lxjx/hooks';
import Fork from 'm78/fork';
import Button from 'm78/button';

function mockTreeData(length: number, z: number, label = '选项') {
  const ls: OptionsItem[] = [];

  function gn(list: OptionsItem = [], vp: string, cZInd = 0) {
    Array.from({ length }).forEach((_, index) => {
      const v = vp ? `${vp}-${index + 1}` : String(index + 1);
      const children: OptionsItem[] = [];

      const current: OptionsItem = {
        label: `${label} ${v}`,
        value: v,
        children: Math.random() > 0.5 ? [] : undefined,
      };

      list.push(current);

      if (cZInd !== z) {
        current.children = children;
        gn(children, v, cZInd + 1);
      }
    });
  }

  gn(ls, '');

  return ls;
}

const opt = mockTreeData(5, 5);

// 模拟一个成功率为50%的请求接口
const mockData = () =>
  new Promise((res, rej) => {
    setTimeout(() => {
      const rand = Math.random();
      if (rand < 0.3) {
        rej(new Error('加载异常'));
        return;
      }
      // 模拟有无数据
      const data = Array.from({ length: Math.random() > 0.5 ? 0 : 8 }).map(() => Math.random());
      res(data);
    }, 1000);
  });

const Play = () => {
  const meta = useFetch<number[]>(mockData, {
    timeout: Math.random() > 0.7 ? 500 : 8000, // 模拟超时状态
  });

  console.log(meta);

  return (
    <div>
      <button onClick={meta.send}>send</button>
      <div style={{ width: 600, height: 600, border: '1px solid red', position: 'relative' }}>
        <Fork
          hasData={meta.data?.length}
          {...meta}
          customLoading={<span>⏳ 加载中...</span>}
          customNotice={(title, message) => (
            <div>
              <h3 className="color-error">
                {title}
                <span className="mlr-12 color-second fs-14">{message}</span>
                <Button className="fs-14" onClick={meta.send} size="small" color="primary" link>
                  重试
                </Button>
              </h3>
            </div>
          )}
          customEmpty={<span>😐 没有数据喔~</span>}
          // style={{ position: 'fixed', right: 20, top: 20, width: 400, zIndex: 9999 }}
        >
          {() => (
            <ul>
              {meta.data?.map(item => (
                <li key={item}>rand num: {item}</li>
              ))}
            </ul>
          )}
        </Fork>
      </div>

      <Tree
        size={SizeEnum.large}
        multipleCheckable
        defaultValue={['1-1-1-1-1-1']}
        rainbowIndicatorLine
        onChange={(a, b) => {
          console.log('change', a, b);
        }}
        dataSource={opt}
        height={400}
        toolbar
      />
    </div>
  );
};

export default Play;
