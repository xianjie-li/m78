import React from "react";
import { Overlay, OverlayDirection } from "m78/overlay";
import { TransitionType } from "m78/transition";
import { Button } from "m78/button";
import { config } from "react-spring";
import { UseTriggerType } from "@m78/hooks";

const Transition = () => {
  return (
    <div>
      <div>
        <Overlay
          transitionType={TransitionType.fade}
          direction={OverlayDirection.top}
          triggerType={UseTriggerType.active}
          childrenAsTarget
          content={<div style={{ padding: 32, fontSize: 32 }}>气泡内容</div>}
        >
          <Button>fade</Button>
        </Overlay>

        <Overlay
          transitionType={TransitionType.zoom}
          direction={OverlayDirection.top}
          triggerType={UseTriggerType.active}
          childrenAsTarget
          content={<div style={{ padding: 32, fontSize: 32 }}>气泡内容</div>}
        >
          <Button>zoom</Button>
        </Overlay>

        <Overlay
          transitionType={TransitionType.punch}
          direction={OverlayDirection.top}
          triggerType={UseTriggerType.active}
          childrenAsTarget
          content={<div style={{ padding: 32, fontSize: 32 }}>气泡内容</div>}
        >
          <Button>punch</Button>
        </Overlay>

        <Overlay
          transitionType={TransitionType.slideLeft}
          direction={OverlayDirection.top}
          triggerType={UseTriggerType.active}
          childrenAsTarget
          content={<div style={{ padding: 32, fontSize: 32 }}>气泡内容</div>}
        >
          <Button>slideLeft</Button>
        </Overlay>

        <Overlay
          transitionType={TransitionType.slideRight}
          direction={OverlayDirection.top}
          triggerType={UseTriggerType.active}
          childrenAsTarget
          content={<div style={{ padding: 32, fontSize: 32 }}>气泡内容</div>}
        >
          <Button>slideRight</Button>
        </Overlay>

        <Overlay
          transitionType={TransitionType.slideTop}
          direction={OverlayDirection.top}
          triggerType={UseTriggerType.active}
          childrenAsTarget
          content={<div style={{ padding: 32, fontSize: 32 }}>气泡内容</div>}
        >
          <Button>slideTop</Button>
        </Overlay>

        <Overlay
          transitionType={TransitionType.slideBottom}
          direction={OverlayDirection.top}
          triggerType={UseTriggerType.active}
          childrenAsTarget
          content={<div style={{ padding: 32, fontSize: 32 }}>气泡内容</div>}
        >
          <Button>slideBottom</Button>
        </Overlay>

        <Overlay
          transitionType={TransitionType.bounce}
          direction={OverlayDirection.top}
          triggerType={UseTriggerType.active}
          childrenAsTarget
          content={<div style={{ padding: 32, fontSize: 32 }}>气泡内容</div>}
        >
          <Button>bounce</Button>
        </Overlay>
      </div>

      <div className="mt-32">
        <Overlay
          springProps={{
            config: config.wobbly,
          }}
          transitionType={TransitionType.bounce}
          direction={OverlayDirection.top}
          triggerType={UseTriggerType.active}
          childrenAsTarget
          content={<div style={{ padding: 32, fontSize: 32 }}>气泡内容</div>}
        >
          <Button>自定义动画行为</Button>
        </Overlay>
        <Overlay
          springProps={{
            config: config.wobbly,
          }}
          transition={{
            to: { transform: "scale(1) rotate(0turn)" },
            from: {
              transform: "scale(0) rotate(1turn)",
            },
          }}
          direction={OverlayDirection.top}
          triggerType={UseTriggerType.active}
          childrenAsTarget
          content={<div style={{ padding: 32, fontSize: 32 }}>气泡内容</div>}
        >
          <Button>进一步定制</Button>
        </Overlay>
      </div>
    </div>
  );
};

export default Transition;
