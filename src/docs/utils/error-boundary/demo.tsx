import React from 'react';
import { ErrorBoundary } from 'm78/error-boundary';
import { Divider } from 'm78/layout';

function SomeError() {
  let a: any;

  console.log(a.b);

  return null;
}

const Demo = () => {
  return (
    <div>
      <h3>简单样式</h3>
      <ErrorBoundary>
        <SomeError />
      </ErrorBoundary>

      <Divider margin={100} />

      <h3>完整样式</h3>
      <ErrorBoundary type="full">
        <SomeError />
      </ErrorBoundary>

      <Divider margin={100} />

      <h3>显示堆栈信息</h3>
      <ErrorBoundary type="full" stack>
        <SomeError />
      </ErrorBoundary>
    </div>
  );
};

export default Demo;
