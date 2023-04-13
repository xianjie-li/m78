import React from "react";
import { Overlay, OverlayDirection, Button } from "m78";

const Features = () => {
  return (
    <div>
      <Overlay
        mask
        clickAwayClosable
        direction={OverlayDirection.top}
        content={
          <div style={{ padding: 8, fontSize: 14 }}>
            mask + 点击内容区域外触发关闭
          </div>
        }
        childrenAsTarget
      >
        <Button>mask + clickAway</Button>
      </Overlay>

      <Overlay
        lockScroll
        direction={OverlayDirection.top}
        content={<div style={{ padding: 8, fontSize: 14 }}>滚动条被锁住了</div>}
        childrenAsTarget
      >
        <Button>lock scroll</Button>
      </Overlay>

      <Overlay
        offset={12}
        direction={OverlayDirection.top}
        content={<div style={{ padding: 8, fontSize: 14 }}>设置了定位偏移</div>}
        childrenAsTarget
      >
        <Button>offset</Button>
      </Overlay>
    </div>
  );
};

export default Features;
