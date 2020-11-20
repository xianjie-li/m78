import React from 'react';
import Pin from 'm78/pin';
import { Spacer } from 'm78/layout';

const barStyle: React.CSSProperties = {
  height: 44,
  lineHeight: '44px',
  textAlign: 'center',
  fontSize: 24,
  backgroundColor: '#fff',
  width: 320,
};

const Demo2 = () => {
  return (
    <div>
      <div style={{ height: 500, width: 320, overflow: 'auto' }}>
        <div
          style={{
            height: 5000,
            overflow: 'auto',
            border: '1px solid #eee',
            background: 'linear-gradient(45deg, #aae7f1, pink)',
          }}
        >
          <Pin disableBottom style={barStyle}>
            章节一
          </Pin>

          <Spacer height={500} />

          <Pin disableBottom style={barStyle}>
            章节二
          </Pin>

          <Spacer height={500} />

          <Pin disableBottom style={barStyle}>
            章节三
          </Pin>

          <Spacer height={500} />

          <Pin disableBottom style={barStyle}>
            章节四
          </Pin>

          <Spacer height={500} />

          <Pin disableBottom style={barStyle}>
            章节五
          </Pin>

          <Spacer height={500} />

          <Pin disableBottom style={barStyle}>
            章节六
          </Pin>

          <Spacer height={500} />

          <Pin disableBottom style={barStyle}>
            章节七
          </Pin>

          <Spacer height={500} />

          <Pin disableBottom style={barStyle}>
            章节八
          </Pin>
        </div>
      </div>
    </div>
  );
};

export default Demo2;
