import React, { useRef } from 'react';
import Popper from 'm78/popper';

const Play = () => {
  const wrapEl = useRef(null!);

  return (
    <div style={{ paddingTop: 500 }}>
      <Popper content="消息提示文本" trigger={['click']}>
        <button type="button">按钮</button>
      </Popper>

      <div
        style={{
          position: 'relative',
          width: 300,
          height: 500,
          border: '1px solid #ccc',
          overflow: 'auto',
        }}
        ref={wrapEl}
      >
        <div
          style={{
            position: 'relative',
            width: 5000,
            height: 5000,
            border: '1px solid pink',
          }}
        >
          <span style={{ position: 'relative', top: 500, left: 500 }}>
            {/* <Popper content="消息提示文本" trigger={['click']}> */}
            {/*  <button type="button">按钮</button> */}
            {/* </Popper> */}
          </span>
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          width: 300,
          height: 5000,
          border: '1px solid #ccc',
        }}
      />
    </div>
  );
};

export default Play;
