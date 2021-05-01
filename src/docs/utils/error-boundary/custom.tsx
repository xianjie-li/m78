import React from 'react';
import { ErrorBoundary } from 'm78/error-boundary';
import { Button } from 'm78/button';

function SomeError() {
  let a: any;

  console.log(a.b);

  return null;
}

const CustomDemo = () => {
  return (
    <div>
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
              <Button type="button" onClick={reload}>
                刷新页面
              </Button>
              <Button type="button" onClick={reset}>
                重载组件
              </Button>
            </div>
          </div>
        )}
      >
        <SomeError />
      </ErrorBoundary>
    </div>
  );
};

export default CustomDemo;
