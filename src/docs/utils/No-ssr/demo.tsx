import React from 'react';
import NoSSR from 'm78/no-ssr';

const box: React.CSSProperties = {
  width: 200,
  height: 200,
  lineHeight: '200px',
  textAlign: 'center',
};

const Demo = () => {
  return (
    <div>
      <NoSSR
        feedback={
          <div style={{ ...box, border: '1px solid blue' }}>在服务端渲染，并在用户端首屏呈现</div>
        }
      >
        <div style={{ ...box, border: '1px solid blue' }}>仅在用户端渲染</div>
      </NoSSR>
    </div>
  );
};

export default Demo;
