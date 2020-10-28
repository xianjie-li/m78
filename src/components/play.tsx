import React, { useRef } from 'react';
import Pin from 'm78/pin';

const Play = () => {
  const el = useRef<HTMLDivElement>();

  return (
    <div>
      <div ref={el} style={{ height: 500, overflow: 'auto', border: '1px solid red' }}>
        <div style={{ position: 'relative', height: 5000, paddingTop: 500 }}>
          <Pin target={el} />
        </div>
      </div>
      <div style={{ height: 5000 }} />
    </div>
  );
};

export default Play;
