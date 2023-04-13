import React from "react";
import { Overlay, OverlayDirection, Button } from "m78";
import sty from "./arrow.module.scss";

const Arrow = () => {
  return (
    <div>
      <Overlay
        direction={OverlayDirection.top}
        arrow
        content={
          <div style={{ fontSize: 18, padding: 16, width: 250, height: 140 }}>
            显示默认箭头
          </div>
        }
        childrenAsTarget
      >
        <Button>默认箭头</Button>
      </Overlay>

      <Overlay
        direction={OverlayDirection.top}
        arrow
        arrowSize={[70, 20]}
        content={
          <div style={{ fontSize: 18, padding: 16, width: 250, height: 140 }}>
            自定义箭头大小
          </div>
        }
        childrenAsTarget
      >
        <Button>自定义箭头大小</Button>
      </Overlay>

      <Overlay
        direction={OverlayDirection.top}
        arrow
        arrowSize={[70, 20]}
        arrowProps={{
          className: sty.customArrow,
          children: (
            <line
              x1="0"
              y1="20"
              x2="70"
              y2="20"
              stroke="blue"
              strokeWidth="2"
            />
          ),
        }}
        content={
          <div style={{ fontSize: 18, padding: 16, width: 250, height: 140 }}>
            自定义箭头样式, 可以添加额外svg节点, 也可以通过css来控制
          </div>
        }
        childrenAsTarget
      >
        <Button>自定义箭头样式</Button>
      </Overlay>
    </div>
  );
};

export default Arrow;
