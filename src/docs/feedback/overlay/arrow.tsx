import React from 'react';
import { Overlay, OverlayDirectionEnum } from 'm78/overlay';
import { Button } from 'm78/button';
import sty from './arrow.module.scss';

const Arrow = () => {
  return (
    <div>
      <Overlay
        direction={OverlayDirectionEnum.top}
        arrow
        arrowSize={[70, 20]}
        content={
          <div style={{ fontSize: 18, padding: 16, width: 250, height: 140 }}>自定义箭头大小</div>
        }
        childrenAsTarget
      >
        <Button>自定义箭头大小</Button>
      </Overlay>

      <Overlay
        direction={OverlayDirectionEnum.top}
        arrow
        arrowSize={[70, 20]}
        arrowProps={{
          className: sty.customArrow,
          children: <line x1="0" y1="20" x2="70" y2="20" stroke="red" strokeWidth="2" />,
        }}
        content={
          <div style={{ fontSize: 18, padding: 16, width: 250, height: 140 }}>自定义箭头大小</div>
        }
        childrenAsTarget
      >
        <Button>自定义箭头样式</Button>
      </Overlay>
    </div>
  );
};

export default Arrow;
