import React from 'react';
import Tree from 'm78/tree';
import { OptionsItem } from 'm78/tree/types';
import Modal from 'm78/modal';
import ErrorBoundary from 'm78/error-boundary';
import { Divider } from 'm78/layout';

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

function SomeError() {
  const a: any;

  console.log(a.b);

  return null;
}

const Play = () => {
  return (
    <div>
      <h3>简单样式</h3>
      <ErrorBoundary
        customLoadingNode="加载中..."
        customer={({ error, reload, reset }) => (
          <div style={{ border: '1px solid #eee', borderRadius: 4, padding: 12 }}>
            <h3>{error?.message}</h3>
            <pre
              style={{
                padding: 12,
                background: '#efefef',
                maxHeight: 200,
                overflow: 'auto',
                color: 'red',
              }}
            >
              {error?.stack}
            </pre>
            <div>
              <button type="button" onClick={reload}>
                刷新页面
              </button>
              <button type="button" onClick={reset}>
                重载组件
              </button>
            </div>
          </div>
        )}
      >
        <SomeError />
      </ErrorBoundary>

      <Tree
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
