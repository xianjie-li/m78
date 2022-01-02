import React from 'react';
import { Overlay, OverlayDirectionEnum } from 'm78/overlay';
import { Button } from 'm78/button';

const Features = () => {
  return (
    <div>
      <Overlay
        mask
        clickAwayClosable
        direction={OverlayDirectionEnum.top}
        content={<div style={{ padding: 8, fontSize: 14 }}>mask + 点击内容区域外为触发关闭</div>}
        childrenAsTarget
      >
        <Button>mask + clickAway</Button>
      </Overlay>

      <Overlay
        lockScroll
        direction={OverlayDirectionEnum.top}
        content={<div style={{ padding: 8, fontSize: 14 }}>滚动条被锁住了</div>}
        childrenAsTarget
      >
        <Button>lock scroll</Button>
      </Overlay>

      <Overlay
        offset={12}
        direction={OverlayDirectionEnum.top}
        content={<div style={{ padding: 8, fontSize: 14 }}>设置了定位偏移</div>}
        childrenAsTarget
      >
        <Button>offset</Button>
      </Overlay>
    </div>
  );
};

export default Features;
