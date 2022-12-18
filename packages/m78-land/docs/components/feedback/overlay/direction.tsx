import React from "react";
import { Overlay, OverlayDirection } from "m78/overlay";
import { UseTriggerType } from "@m78/hooks";
import { Button } from "m78/button";

const Direction = () => {
  return (
    <div>
      <div
        style={{
          position: "relative",
          width: 380,
          height: 202,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            textAlign: "center",
          }}
        >
          <Overlay
            arrow
            direction={OverlayDirection.topStart}
            triggerType={UseTriggerType.active}
            content={
              <div style={{ padding: "8px 12px", fontSize: 16 }}>topStart</div>
            }
            childrenAsTarget
          >
            <Button>topStart</Button>
          </Overlay>
          <Overlay
            arrow
            direction={OverlayDirection.top}
            triggerType={UseTriggerType.active}
            content={
              <div style={{ padding: "8px 12px", fontSize: 16 }}>top</div>
            }
            childrenAsTarget
          >
            <Button>top</Button>
          </Overlay>
          <Overlay
            arrow
            direction={OverlayDirection.topEnd}
            triggerType={UseTriggerType.active}
            content={
              <div style={{ padding: "8px 12px", fontSize: 16 }}>topEnd</div>
            }
            childrenAsTarget
          >
            <Button>topEnd</Button>
          </Overlay>
        </div>

        <div
          style={{
            position: "absolute",
            right: 0,
            top: 32,
            width: 140,
            textAlign: "right",
            lineHeight: 3.2,
          }}
        >
          <Overlay
            arrow
            direction={OverlayDirection.rightStart}
            triggerType={UseTriggerType.active}
            content={
              <div style={{ padding: "8px 12px", fontSize: 16 }}>
                rightStart
              </div>
            }
            childrenAsTarget
          >
            <Button>rightStart</Button>
          </Overlay>
          <Overlay
            arrow
            direction={OverlayDirection.right}
            triggerType={UseTriggerType.active}
            content={
              <div style={{ padding: "8px 12px", fontSize: 16 }}>right</div>
            }
            childrenAsTarget
          >
            <Button>right</Button>
          </Overlay>
          <Overlay
            arrow
            direction={OverlayDirection.rightEnd}
            triggerType={UseTriggerType.active}
            content={
              <div style={{ padding: "8px 12px", fontSize: 16 }}>rightEnd</div>
            }
            childrenAsTarget
          >
            <Button>rightEnd</Button>
          </Overlay>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            textAlign: "center",
          }}
        >
          <Overlay
            arrow
            direction={OverlayDirection.bottomStart}
            triggerType={UseTriggerType.active}
            content={
              <div style={{ padding: "8px 12px", fontSize: 16 }}>
                bottomStart
              </div>
            }
            childrenAsTarget
          >
            <Button>bottomStart</Button>
          </Overlay>
          <Overlay
            arrow
            direction={OverlayDirection.bottom}
            triggerType={UseTriggerType.active}
            content={
              <div style={{ padding: "8px 12px", fontSize: 16 }}>bottom</div>
            }
            childrenAsTarget
          >
            <Button>bottom</Button>
          </Overlay>
          <Overlay
            arrow
            direction={OverlayDirection.bottomEnd}
            triggerType={UseTriggerType.active}
            content={
              <div style={{ padding: "8px 12px", fontSize: 16 }}>bottomEnd</div>
            }
            childrenAsTarget
          >
            <Button>bottomEnd</Button>
          </Overlay>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            top: 32,
            width: 120,
            textAlign: "left",
            lineHeight: 3.2,
          }}
        >
          <Overlay
            arrow
            direction={OverlayDirection.leftStart}
            triggerType={UseTriggerType.active}
            content={
              <div style={{ padding: "8px 12px", fontSize: 16 }}>leftStart</div>
            }
            childrenAsTarget
          >
            <Button>bottomStart</Button>
          </Overlay>
          <Overlay
            arrow
            direction={OverlayDirection.left}
            triggerType={UseTriggerType.active}
            content={
              <div style={{ padding: "8px 12px", fontSize: 16 }}>left</div>
            }
            childrenAsTarget
          >
            <Button style={{ margin: 0 }}>left</Button>
          </Overlay>
          <Overlay
            arrow
            direction={OverlayDirection.leftEnd}
            triggerType={UseTriggerType.active}
            content={
              <div style={{ padding: "8px 12px", fontSize: 16 }}>leftEnd</div>
            }
            childrenAsTarget
          >
            <Button style={{ margin: 0 }}>leftEnd</Button>
          </Overlay>
        </div>
      </div>
    </div>
  );
};

export default Direction;
